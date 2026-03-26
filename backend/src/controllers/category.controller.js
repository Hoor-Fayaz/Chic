const { success } = require('../utils/apiResponse');
const {
  listCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../services/category.service');

async function getAllCategories(req, res, next) {
  try {
    const categories = await listCategories();
    return success(res, {
      items: categories,
      total: categories.length,
      page: 1,
      limit: categories.length,
      totalPages: 1,
    });
  } catch (err) {
    return next(err);
  }
}

async function getCategory(req, res, next) {
  try {
    const { slug } = req.params;
    const category = await getCategoryBySlug(slug);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return success(res, { category });
  } catch (err) {
    return next(err);
  }
}

async function createCategoryHandler(req, res, next) {
  try {
    const category = await createCategory(req.body);
    return success(res, { category }, 'Category created', 201);
  } catch (err) {
    return next(err);
  }
}

async function updateCategoryHandler(req, res, next) {
  try {
    const category = await updateCategory(req.params.id, req.body);
    return success(res, { category }, 'Category updated');
  } catch (err) {
    return next(err);
  }
}

async function deleteCategoryHandler(req, res, next) {
  try {
    const category = await deleteCategory(req.params.id);
    return success(res, { category }, 'Category deleted');
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAllCategories,
  getCategory,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
};

