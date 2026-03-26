const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, trim: true },
  subtitle: { type: String, trim: true },
  link: { type: String, default: '/shop' }
}, { _id: true });

const settingsSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true, 
    default: 'homepage_cms' 
  },
  section1: {
    subtitle: { type: String, default: 'New Season • SS\'26' },
    title: { type: String, default: 'Effortless style for every day.' },
    description: { type: String, default: 'Discover elevated essentials, statement pieces, and timeless silhouettes.' },
    slides: [{
        imageUrl: { type: String, required: true },
        link: { type: String, default: '/shop' }
    }]
  },
  section2: {
    slides: [{
        imageUrl: { type: String, required: true },
        title: { type: String },
        link: { type: String, default: '/shop' }
    }]
  },
  section3: {
    title: { type: String, default: 'Featured Collections' },
    items: [{
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        imageUrl: { type: String },
        label: { type: String }
    }]
  },
  promoBanner: {
    text: { type: String, default: 'New Season • SS\'26' },
    isActive: { type: Boolean, default: true }
  },
  footerAbout: { type: String },
  contactEmail: { type: String },
  checkout: {
    shippingLimit: { type: Number, default: 5000 },
    shippingDefault: { type: Number, default: 250 },
    taxPercentage: { type: Number, default: 15 },
    fbrFee: { type: Number, default: 1 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
