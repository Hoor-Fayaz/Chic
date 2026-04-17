const express = require('express');
const passport = require('passport');
const { register, login, me, logout, changePassword, oauthSuccess } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, me);
router.post('/password', protect, changePassword);

// --- OAuth Routes ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), oauthSuccess);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: '/login' }), oauthSuccess);

module.exports = router;
