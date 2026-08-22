const Product = require('../models/Product');

async function listProducts(query) {
  const {
    page = 1,
    limit = 1000,
    search,
    category,
    isFeatured,
    isNewArrival,
    isOnSale,
    sort = 'newest',
    currency = 'PKR',
    minPrice,
    maxPrice,
    sizes,
    fabrics,
    colors,
    status,
  } = query;

  const mongoose = require('mongoose');
  const Category = require('../models/Category');

  const filter = {};
  if (status === 'all') {
    // Show all products regardless of active/archived status
  } else if (status) {
    filter.status = status;
  } else {
    filter.status = 'active';
  }

  const andConditions = [];

  if (search) {
    const searchTerm = search.toLowerCase().trim();
    
    // Check for "new arrivals" special search
    if (searchTerm === 'new arrivals' || searchTerm === 'new arrival') {
      filter.isNewArrival = true;
    } else {
      // Find categories that match the search term
      const categories = await Category.find({
        $or: [
          { name: new RegExp(search, 'i') },
          { slug: new RegExp(search, 'i') }
        ]
      }).select('_id');

      const catIds = categories.map(c => c._id);
      
      const searchOr = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { fabric: { $regex: search, $options: 'i' } },
        { composition: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];

      if (catIds.length > 0) {
        searchOr.push({ category: { $in: catIds } });
        searchOr.push({ subCategory: { $in: catIds } });
      }

      andConditions.push({ $or: searchOr });
    }
  }

  if (category) {
    let targetCatIds = [];

    if (mongoose.Types.ObjectId.isValid(category)) {
      const childCategories = await Category.find({ parent: category }).select('_id');
      targetCatIds = [category, ...childCategories.map(c => c._id)];
    } else {
      const cleanCat = String(category).trim();
      const singularCat = cleanCat.replace(/s$/i, '');
      const matchedCats = await Category.find({
        $or: [
          { slug: new RegExp(`^${cleanCat}$`, 'i') },
          { name: new RegExp(`^${cleanCat}$`, 'i') },
          { slug: new RegExp(`^${singularCat}`, 'i') },
          { name: new RegExp(`^${singularCat}`, 'i') },
          { slug: new RegExp(cleanCat, 'i') },
          { name: new RegExp(cleanCat, 'i') }
        ]
      }).select('_id');

      const catIds = matchedCats.map(c => c._id);
      if (catIds.length > 0) {
        const childCats = await Category.find({ parent: { $in: catIds } }).select('_id');
        targetCatIds = [...catIds, ...childCats.map(c => c._id)];
      }
    }

    if (targetCatIds.length > 0) {
      andConditions.push({
        $or: [
          { category: { $in: targetCatIds } },
          { subCategory: { $in: targetCatIds } }
        ]
      });
    } else if (!mongoose.Types.ObjectId.isValid(category)) {
      // Fallback matching against product name/tags/fabric/description
      andConditions.push({
        $or: [
          { name: { $regex: category, $options: 'i' } },
          { tags: { $regex: category, $options: 'i' } },
          { fabric: { $regex: category, $options: 'i' } },
          { description: { $regex: category, $options: 'i' } }
        ]
      });
    }
  }

  const priceField = currency?.toUpperCase() === 'USD' ? 'priceUSD' : 'price';

  if (minPrice || maxPrice) {
    filter[priceField] = {};
    if (minPrice) filter[priceField].$gte = Number(minPrice);
    if (maxPrice) filter[priceField].$lte = Number(maxPrice);
  }

  if (sizes) {
    const sizeArr = Array.isArray(sizes) ? sizes : String(sizes).split(',');
    filter.sizes = { $in: sizeArr };
  }

  if (fabrics) {
    const fabricArr = Array.isArray(fabrics) ? fabrics : String(fabrics).split(',');
    filter.fabric = { $in: fabricArr };
  }

  if (colors) {
    const colorArr = Array.isArray(colors) ? colors : String(colors).split(',');
    filter.colors = { $in: colorArr };
  }

  if (isFeatured === 'true') filter.isFeatured = true;
  if (isNewArrival === 'true') filter.isNewArrival = true;
  if (isOnSale === 'true') filter.isOnSale = true;

  if (andConditions.length > 0) {
    filter.$and = andConditions;
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { [priceField]: 1 };
  if (sort === 'price_desc') sortOption = { [priceField]: -1 };
  if (sort === 'rating') sortOption = { ratingAverage: -1 };

  const pageNum = Number(page) || 1;
  const parsedLimit = Number(limit);
  const limitNum = parsedLimit === 0 || limit === 'all' || limit === '0' ? 10000 : (parsedLimit || 1000);
  const skip = (pageNum - 1) * limitNum;

  const distinctStatusFilter = filter.status ? { status: filter.status } : {};

  const [items, total, uniqueFabrics, uniqueSizes, uniqueColors] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(filter),
    Product.distinct('fabric', { ...distinctStatusFilter, fabric: { $ne: null, $ne: '' } }),
    Product.distinct('sizes', distinctStatusFilter),
    Product.distinct('colors', distinctStatusFilter)
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    availableFabrics: uniqueFabrics || [],
    availableSizes: uniqueSizes || [],
    availableColors: uniqueColors || [],
  };
}

async function getProductBySlug(slug) {
  return Product.findOne({ slug, status: 'active' }).populate('category', 'name slug');
}

async function createProduct(payload) {
  const Category = require('../models/Category');
  
  // Find category by name or ID if provided as string
  if (payload.category && typeof payload.category === 'string' && payload.category.trim() !== '') {
    const mongoose = require('mongoose');
    let category;
    
    if (mongoose.Types.ObjectId.isValid(payload.category)) {
      category = await Category.findById(payload.category);
    }
    
    if (!category) {
      category = await Category.findOne({ name: payload.category });
    }

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

  // Find category by name or ID if provided as string
  if (payload.category && typeof payload.category === 'string' && payload.category.trim() !== '') {
    const mongoose = require('mongoose');
    let category;

    if (mongoose.Types.ObjectId.isValid(payload.category)) {
      category = await Category.findById(payload.category);
    }

    if (!category) {
      category = await Category.findOne({ name: payload.category });
    }

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

