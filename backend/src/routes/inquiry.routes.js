const express = require('express');
const { logInquiry, getInquiryStatsHandler } = require('../controllers/inquiry.controller');
const { protect, requireAdmin, optionalProtect } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route POST /api/v1/inquiries
 * @desc Log a new WhatsApp inquiry (Public or User)
 */
router.post('/', optionalProtect, logInquiry);

/**
 * @route GET /api/v1/inquiries/stats
 * @desc Admin: Get inquiry metrics
 */
router.get('/stats', protect, requireAdmin, getInquiryStatsHandler);

module.exports = router;
