const express = require('express');
const { getStatsHandler, getSalesHistoryHandler, getSettingsHandler, updateSettingsHandler } = require('../controllers/admin.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// All admin routes are protected
router.use(protect);
router.use(requireAdmin);

/**
 * @route GET /api/v1/admin/stats
 * @desc Get boutique overview metrics
 */
router.get('/stats', getStatsHandler);

/**
 * @route GET /api/v1/admin/sales-chart
 * @desc Get time-series sales data
 */
router.get('/sales-chart', getSalesHistoryHandler);

/**
 * @route GET /api/v1/admin/settings
 * @desc Get boutique CMS settings
 */
router.get('/settings', getSettingsHandler);

/**
 * @route PATCH /api/v1/admin/settings
 * @desc Update boutique CMS settings
 */
router.patch('/settings', updateSettingsHandler);

/**
 * @route GET /api/v1/admin/reviews
 * @desc Get all reviews across the platform
 */
router.get('/reviews', require('../controllers/review.controller').getAllReviewsHandler);

module.exports = router;
