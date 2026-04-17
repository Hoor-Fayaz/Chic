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
    minPrice,
    maxPrice,
    sizes,
    fabrics,
  } = query;

  const filter = { status: 'active' };

  if (search) {
    const searchTerm = search.toLowerCase().trim();
    
    // Check for "new arrivals" special search
    if (searchTerm === 'new arrivals' || searchTerm === 'new arrival') {
      filter.isNewArrival = true;
    } else {
      // Find categories that match the search term
      const Category = require('../models/Category');
      const categories = await Category.find({
        $or: [
          { name: new RegExp(search, 'i') },
          { slug: new RegExp(search, 'i') }
        ]
      }).select('_id');

      const catIds = categories.map(c => c._id);
      
      // Use pure regex search for partial matching across multiple fields
      // This is more robust for boutiques and avoids MongoDB $text index conflicts
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { fabric: { $regex: search, $options: 'i' } },
        { composition: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];

      if (catIds.length > 0) {
        filter.$or.push({ category: { $in: catIds } });
      }
    }
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (sizes) {
    const sizeArr = Array.isArray(sizes) ? sizes : String(sizes).split(',');
    filter.sizes = { $in: sizeArr };
  }

  if (fabrics) {
    const fabricArr = Array.isArray(fabrics) ? fabrics : String(fabrics).split(',');
    filter.fabric = { $in: fabricArr };
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

  const [items, total, uniqueFabrics] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(filter),
    Product.distinct('fabric', { status: 'active', fabric: { $ne: null, $ne: '' } })
  ]);

  return {
    items,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    availableFabrics: uniqueFabrics || [],
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

