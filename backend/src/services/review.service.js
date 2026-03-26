const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Update the average rating and count for a product
 */
async function updateProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        ratingAverage: { $avg: '$rating' },
        ratingCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: Math.round(stats[0].ratingAverage * 10) / 10,
      ratingCount: stats[0].ratingCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: 0,
      ratingCount: 0,
    });
  }
}

async function createReview(userId, productId, payload) {
  // 1. Check if user already reviewed this product
  const existing = await Review.findOne({ user: userId, product: productId });
  if (existing) {
    const err = new Error('You have already reviewed this product');
    err.statusCode = 400;
    throw err;
  }

  // 2. Optional: Check if user purchased the product
  const hasPurchased = await Order.findOne({
    user: userId,
    'items.product': productId,
    status: 'delivered',
  });

  // Note: We'll allow reviews even if not purchased for now to make testing easier,
  // but we could mark them as "Verified Purchase" if hasPurchased is true.
  
  const review = await Review.create({
    user: userId,
    product: productId,
    rating: payload.rating,
    comment: payload.comment,
    title: payload.title,
    isApproved: true, // Auto-approve for now
  });

  // 3. Update product rating stats
  await updateProductRating(productId);

  return review;
}

async function getProductReviews(productId, query = {}) {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ product: productId, isApproved: true })
    .populate('user', 'firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments({ product: productId, isApproved: true });

  return {
    items: reviews,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
}

async function deleteReview(userId, reviewId, isAdmin = false) {
  const filter = { _id: reviewId };
  if (!isAdmin) filter.user = userId;

  const review = await Review.findOne(filter);
  if (!review) {
    const err = new Error('Review not found or unauthorized');
    err.statusCode = 404;
    throw err;
  }

  const productId = review.product;
  await Review.findByIdAndDelete(reviewId);

  // Update product stats
  await updateProductRating(productId);

  return { success: true };
}

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
  updateProductRating,
};
