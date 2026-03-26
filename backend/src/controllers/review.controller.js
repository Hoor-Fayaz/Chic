const { success } = require('../utils/apiResponse');
const {
  createReview,
  getProductReviews,
  deleteReview,
} = require('../services/review.service');

async function createReviewHandler(req, res, next) {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const review = await createReview(userId, productId, req.body);
    return success(res, { review }, 'Review submitted successfully', 201);
  } catch (err) {
    return next(err);
  }
}

async function getProductReviewsHandler(req, res, next) {
  try {
    const { productId } = req.params;
    const reviews = await getProductReviews(productId, req.query);
    return success(res, reviews);
  } catch (err) {
    return next(err);
  }
}

async function deleteReviewHandler(req, res, next) {
  try {
    const userId = req.user._id;
    const { reviewId } = req.params;
    const isAdmin = req.user.role === 'admin';
    await deleteReview(userId, reviewId, isAdmin);
    return success(res, null, 'Review deleted');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createReviewHandler,
  getProductReviewsHandler,
  deleteReviewHandler,
};
