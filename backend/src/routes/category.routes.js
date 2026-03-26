const express = require('express');
const {
  getAllCategories,
  getCategory,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} = require('../controllers/category.controller');

const { protect, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public
router.get('/', getAllCategories);
router.get('/:slug', getCategory);

// Admin
router.post('/', protect, requireAdmin, createCategoryHandler);
router.patch('/:id', protect, requireAdmin, updateCategoryHandler);
router.delete('/:id', protect, requireAdmin, deleteCategoryHandler);

module.exports = router;