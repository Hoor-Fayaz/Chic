const mongoose = require('mongoose');

const sizeStockSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      trim: true,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      // required: true, // temporarily optional
      index: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    discountPercent: {
      type: Number,
      min: 0,
      max: 100,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // allow nulls but unique if present
    },
    fabric: {
      type: String,
      trim: true,
    },
    fit: {
      type: String,
      trim: true,
    },
    composition: {
      type: String,
      trim: true,
    },
    sizeChart: {
      type: String,
      trim: true,
    },
    sizes: [
      {
        type: String,
        trim: true,
      },
    ],
    colors: [
      {
        type: String,
        trim: true,
      },
    ],

    sizeStock: [sizeStockSchema],
    images: [imageSchema],

    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
      index: true,
    },
    isOnSale: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
      index: true,
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text',
  fabric: 'text',
  composition: 'text',
  colors: 'text'
});

module.exports = mongoose.model('Product', productSchema);

