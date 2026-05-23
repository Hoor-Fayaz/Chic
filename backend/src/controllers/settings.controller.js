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
        console.error('Fallback triggered for public settings:', err.message);
        // Return minimal default settings so frontend doesn't crash
        const fallbackSettings = {
            contactPhone: '923098730221',
            instagramUrl: 'https://www.instagram.com/jannah_chic',
            heroSlides: [],
            announcementBar: 'Welcome to Jannah Chic'
        };
        return success(res, fallbackSettings, 'Default settings retrieved (Fallback)');
    }
}

module.exports = {
    getPublicHomepageSettings
};
