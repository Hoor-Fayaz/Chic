const { success } = require('../utils/apiResponse');
const { createInquiry, getInquiryStats } = require('../services/inquiry.service');

/**
 * Handle logging of a new WhatsApp click inquiry
 */
async function logInquiry(req, res, next) {
  try {
    const data = {
      ...req.body,
      userId: req.user?._id || null
    };

    const inquiry = await createInquiry(data);
    return success(res, inquiry, 'Inquiry logged successfully');
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Get inquiry overview
 */
async function getInquiryStatsHandler(req, res, next) {
    try {
        const stats = await getInquiryStats();
        return success(res, stats, 'Inquiry stats retrieved');
    } catch (err) {
        next(err);
    }
}

module.exports = {
  logInquiry,
  getInquiryStatsHandler
};
