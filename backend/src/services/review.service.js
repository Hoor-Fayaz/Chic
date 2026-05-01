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
  const { rating, comment, title, guestName, guestEmail } = payload;

  if (userId) {
    // Logged-in user: check for duplicate
    const existing = await Review.findOne({ user: userId, product: productId });
    if (existing) {
      const err = new Error('You have already reviewed this product');
      err.statusCode = 400;
      throw err;
    }
  } else {
    // Guest: require name and email
    if (!guestName || !guestEmail) {
      const err = new Error('Please provide your name and email to submit a review');
      err.statusCode = 400;
      throw err;
    }
    // Check if same guest email already reviewed this product
    const existing = await Review.findOne({ guestEmail, product: productId });
    if (existing) {
      const err = new Error('A review from this email already exists for this product');
      err.statusCode = 400;
      throw err;
    }
  }

  const reviewData = {
    product: productId,
    rating,
    comment,
    title,
    isApproved: true,
  };

  if (userId) {
    reviewData.user = userId;
  } else {
    reviewData.guestName = guestName;
    reviewData.guestEmail = guestEmail;
  }

  const review = await Review.create(reviewData);

  // Update product rating stats
  await updateProductRating(productId);

  return review;
}

async function getProductReviews(productId, query = {}) {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ product: productId, isApproved: true })
    .populate('user', 'name')
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

async function getAllReviews(query = {}) {
  const { page = 1, limit = 20 } = query;
  const skip = (page - 1) * limit;

  const reviews = await Review.find()
    .populate('user', 'name')
    .populate('product', 'name images sku')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments();

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
  getAllReviews,
  deleteReview,
  updateProductRating,
};
