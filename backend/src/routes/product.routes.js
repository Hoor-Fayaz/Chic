const express = require('express');
const {
  getProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} = require('../controllers/product.controller');

const { protect, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public listing & detail
router.get('/', getProducts);
router.get('/:slug', getProduct);

// Admin CRUD
router.post('/', protect, requireAdmin, createProductHandler);
router.patch('/:id', protect, requireAdmin, updateProductHandler);
router.delete('/:id', protect, requireAdmin, deleteProductHandler);

module.exports = router;
