const Product = require('../models/Product');

async function listProducts(query) {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    isFeatured,
    isNewArrival,
    isOnSale,
    sort = 'newest',
  } = query;

  const filter = { status: 'active' };

  if (search) {
    filter.$text = { $search: search };
  }

  if (category) {
    filter.category = category;
  }

  if (isFeatured === 'true') filter.isFeatured = true;
  if (isNewArrival === 'true') filter.isNewArrival = true;
  if (isOnSale === 'true') filter.isOnSale = true;

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { ratingAverage: -1 };

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 12;
  const skip = (pageNum - 1) * limitNum;

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
  };
}

async function getProductBySlug(slug) {
  return Product.findOne({ slug, status: 'active' }).populate('category', 'name slug');
}

async function createProduct(payload) {
  const Category = require('../models/Category');
  
  // Find category by name if provided as string
  if (payload.category && typeof payload.category === 'string' && payload.category.trim() !== '') {
    const category = await Category.findOne({ name: payload.category });
    if (!category) {
      const err = new Error('Category not found');
      err.statusCode = 400;
      throw err;
    }
    payload.category = category._id;
  } else {
    // Remove category field if empty
    delete payload.category;
  }

  const existing = await Product.findOne({ slug: payload.slug });
  if (existing) {
    const err = new Error('Product slug already exists');
    err.statusCode = 400;
    throw err;
  }
  return Product.create(payload);
}

async function updateProduct(id, payload) {
  const Category = require('../models/Category');

  // Find category by name if provided as string
  if (payload.category && typeof payload.category === 'string' && payload.category.trim() !== '') {
    const category = await Category.findOne({ name: payload.category });
    if (category) {
      payload.category = category._id;
    }
  }

  const product = await Product.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
}


async function deleteProduct(id) {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
}


module.exports = {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};

