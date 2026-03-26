const express = require('express');
const {
  getCartHandler,
  addToCartHandler,
  updateCartItemHandler,
  removeCartItemHandler,
  clearCartHandler,
} = require('../controllers/cart.controller');

const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// All cart routes require login
router.use(protect);

router.get('/', getCartHandler);
router.post('/', addToCartHandler);
router.patch('/:index', updateCartItemHandler);
router.delete('/:index', removeCartItemHandler);
router.delete('/', clearCartHandler);

module.exports = router;