const express = require('express');
const { getPublicHomepageSettings } = require('../controllers/settings.controller');

const router = express.Router();

/**
 * @route GET /api/v1/settings/homepage
 * @desc Get public homepage CMS settings (Hero, sections)
 */
router.get('/homepage', getPublicHomepageSettings);

module.exports = router;
