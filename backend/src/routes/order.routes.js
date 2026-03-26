const express = require('express');
const router = express.Router();

const {
  getOrders,
  getOrder,
  updateOrderStatus,
  createOrder,
  getMyOrders,
  createStripeIntent,
  handleStripeWebhook,
  trackOrder,
} = require('../controllers/order.controller');

const { protect, requireAdmin } = require('../middlewares/auth.middleware');

// Public tracking
router.get('/track/:id', trackOrder);

// Stripe Payment
router.post('/stripe/intent', protect, createStripeIntent);
router.post('/stripe/webhook', handleStripeWebhook); // Sign logic in controller

// User routes
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

// Admin only
router.get('/', protect, requireAdmin, getOrders);
router.get('/:id', protect, requireAdmin, getOrder);
router.patch('/:id/status', protect, requireAdmin, updateOrderStatus);

module.exports = router;