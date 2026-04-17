// backend/src/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const wishlistRoutes = require('./wishlist.routes');
const adminRoutes = require('./admin.routes');
const reviewRoutes = require('./review.routes');
const settingsRoutes = require('./settings.routes');
const uploadRoutes = require('./uploadRoutes');
const inquiryRoutes = require('./inquiry.routes');
const pageRoutes = require('./page.routes');
const contactRoutes = require('./contact.routes');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/admin', adminRoutes);
router.use('/reviews', reviewRoutes);
router.use('/settings', settingsRoutes);
router.use('/uploads', uploadRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/pages', pageRoutes);
router.use('/contacts', contactRoutes);


module.exports = router;