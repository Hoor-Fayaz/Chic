const express = require('express');
const {
  createReviewHandler,
  getProductReviewsHandler,
  deleteReviewHandler,
} = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get reviews for a product (Public)
router.get('/product/:productId', getProductReviewsHandler);

// Create a review (Protected)
router.post('/product/:productId', protect, createReviewHandler);

// Delete a review (Protected)
router.delete('/:reviewId', protect, deleteReviewHandler);

module.exports = router;
