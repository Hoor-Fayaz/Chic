const Category = require('../models/Category');

async function listCategories() {
  return Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
}

async function getCategoryBySlug(slug) {
  return Category.findOne({ slug, isActive: true });
}

async function createCategory(payload) {
  const existing = await Category.findOne({ slug: payload.slug });
  if (existing) {
    const err = new Error('Category slug already exists');
    err.statusCode = 400;
    throw err;
  }
  return Category.create(payload);
}

async function updateCategory(id, payload) {
  const category = await Category.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return category;
}

async function deleteCategory(id) {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return category;
}


module.exports = {
  listCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};

