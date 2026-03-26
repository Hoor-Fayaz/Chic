const { success } = require('../utils/apiResponse');
const { getHomepageSettings } = require('../services/admin.service');

/**
 * Public controller to fetch homepage settings (Hero slides, promotional content)
 */
async function getPublicHomepageSettings(req, res, next) {
    try {
        const settings = await getHomepageSettings();
        return success(res, settings, 'Homepage settings retrieved');
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getPublicHomepageSettings
};
