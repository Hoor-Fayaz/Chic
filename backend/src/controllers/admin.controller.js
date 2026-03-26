const { success } = require('../utils/apiResponse');
const { getDashboardStats, getSalesHistory, getHomepageSettings, updateHomepageSettings } = require('../services/admin.service');

/**
 * Handle dashboard metrics aggregation
 */
async function getStatsHandler(req, res, next) {
  try {
    const stats = await getDashboardStats();
    return success(res, stats, 'Admin stats retrieved');
  } catch (err) {
    next(err);
  }
}

/**
 * Handle sales history for charts
 */
async function getSalesHistoryHandler(req, res, next) {
    try {
        const days = parseInt(req.query.days) || 7;
        const sales = await getSalesHistory(days);
        return success(res, { sales }, 'Sales history retrieved');
    } catch (err) {
        next(err);
    }
}

/**
 * Handle fetching homepage settings
 */
async function getSettingsHandler(req, res, next) {
    try {
        const settings = await getHomepageSettings();
        return success(res, settings, 'CMS settings retrieved');
    } catch (err) {
        next(err);
    }
}

/**
 * Handle updating homepage settings
 */
async function updateSettingsHandler(req, res, next) {
    try {
        const settings = await updateHomepageSettings(req.body);
        return success(res, settings, 'CMS settings updated');
    } catch (err) {
        next(err);
    }
}

module.exports = {
  getStatsHandler,
  getSalesHistoryHandler,
  getSettingsHandler,
  updateSettingsHandler
};
