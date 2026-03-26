const express = require('express');
const { getWishlist, toggleWishlist } = require('../controllers/wishlist.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Base URL: /api/v1/wishlist
router.get('/', protect, getWishlist);
router.post('/toggle', protect, toggleWishlist);

module.exports = router;