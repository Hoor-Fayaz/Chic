const Order = require('../models/Order');

async function listOrders(query) {
  const { page = 1, limit = 10, status, user } = query;

  const filter = {};
  if (status) filter.status = status;
  if (user) filter.user = user;

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
}

async function getOrderById(id) {
  return Order.findById(id).populate('user', 'name email').populate('items.product', 'name slug');
}

async function getMyOrders(userId, query = {}) {
  const { page = 1, limit = 10 } = query;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments({ user: userId }),
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
}

async function createOrder(userId, orderData) {
  const Cart = require('../models/Cart');
  const Product = require('../models/Product');

  const {
    items,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingFee = 0,
    tax = 0,
    fbrFee = 0,
    total,
    notes,
  } = orderData;

  // 1. Create order
  const order = await Order.create({
    user: userId,
    items,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingFee,
    tax,
    fbrFee,
    total,
    notes,
  });

  // 2. Clear user cart
  await Cart.findOneAndUpdate({ user: userId }, { items: [] });

  // 3. Update product stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }

  return order;
}

async function updateOrderStatus(id, status) {
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  return order;
}

async function createPaymentIntent(userId, totalAmount) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  // Stripe expects amount in the smallest currency unit (e.g., cents for USD, or actual PKR amount if supported)
  // For simplicity and standard practice, we assume PKR and convert to "cents equivalent" or just unit if zero-decimal
  // Actually, Stripe supports PKR as a non-decimal currency or 2-decimal depending on configuration.
  // We will treat it as 2-decimal for safety (multiply by 100).
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100),
    currency: 'pkr',
    metadata: { 
      userId: userId.toString(),
      type: 'checkout_order'
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

module.exports = {
  listOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  createOrder,
  createPaymentIntent,
};