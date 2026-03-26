const { success } = require('../utils/apiResponse');
const {
  listOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,
} = require('../services/order.service');

async function getOrders(req, res, next) {
  try {
    const result = await listOrders(req.query);
    return success(res, result);
  } catch (err) {
    return next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    return success(res, { order });
  } catch (err) {
    return next(err);
  }
}

async function updateOrderStatusHandler(req, res, next) {
  try {
    const { status } = req.body;
    const order = await updateOrderStatus(req.params.id, status);
    return success(res, { order }, 'Order status updated');
  } catch (err) {
    return next(err);
  }
}

async function getMyOrdersHandler(req, res, next) {
  try {
    const result = await listOrders({ ...req.query, user: req.user._id });
    return success(res, result);
  } catch (err) {
    return next(err);
  }
}

async function createOrderHandler(req, res, next) {
  try {
    const order = await createOrder(req.user._id, req.body);
    return success(res, { order }, 'Order placed successfully', 201);
  } catch (err) {
    return next(err);
  }
}

async function createStripeIntentHandler(req, res, next) {
  try {
    const { amount } = req.body; // In PKR
    if (!amount) return res.status(400).json({ success: false, message: 'Amount is required' });
    
    const { createPaymentIntent } = require('../services/order.service');
    const paymentIntent = await createPaymentIntent(req.user._id, amount);
    
    return success(res, { 
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY 
    });
  } catch (err) {
    return next(err);
  }
}

async function handleStripeWebhook(req, res, next) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Note: This requires the raw body. app.js must be configured correctly.
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const Order = require('../models/Order');
    
    // Find order related to this payment intent
    // We can either find by metadata or we could have stored it if we created order first
    // For now, let's assume we find by stripePaymentIntentId
    const order = await Order.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { paymentStatus: 'paid', status: 'processing' },
      { new: true }
    );
    
    console.log(`💰 Payment succeeded for Order: ${order?._id}`);
  }

  res.json({ received: true });
}

async function trackOrderPublicHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { email } = req.query; // Using query for GET
    
    if (!id || !email) {
      return res.status(400).json({ success: false, message: 'Order ID and Email are required' });
    }

    const Order = require('../models/Order');
    const order = await Order.findOne({ _id: id })
      .select('status paymentStatus shippingAddress.fullName items subtotal total trackingNumber createdAt updatedAt');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Secure check: Since it's public, we must verify the email matches the snapshotted address
    // We'll also check the user email if linked
    // For now, let's assume we store email in notes or we can fetch the user's email if needed.
    // Actually, I'll update the Order model to snapshot email if I forgot earlier. 
    // Let's check User's email for now.
    await order.populate('user', 'email');
    
    if (order.user?.email.toLowerCase() !== email.toLowerCase()) {
       return res.status(401).json({ success: false, message: 'Unauthorized. Email does not match.' });
    }

    return success(res, { order }, 'Tracking status retrieved');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getOrders,
  getOrder,
  updateOrderStatus: updateOrderStatusHandler,
  getMyOrders: getMyOrdersHandler,
  createOrder: createOrderHandler,
  createStripeIntent: createStripeIntentHandler,
  handleStripeWebhook,
  trackOrder: trackOrderPublicHandler,
};