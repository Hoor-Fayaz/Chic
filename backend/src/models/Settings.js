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
  // Global brand & contact settings
  contactPhone: { type: String, default: '923098730221' },
  contactEmail: { type: String, default: 'support@jannah.com' },
  legalEmail: { type: String, default: 'legal@jannah.com' },
  privacyEmail: { type: String, default: 'privacy@jannah.com' },
  talentEmail: { type: String, default: 'talent@jannah.com' },
  storeAddress: { type: String, default: 'DHA Phase 6, Pakistan' },
  instagramUrl: { type: String, default: 'https://www.instagram.com/jannah_chic?igsh=MW56bG9lNzJudWRrMg==' },
  checkout: {
    shippingLimit: { type: Number, default: 5000 },
    shippingDefault: { type: Number, default: 250 },
    taxPercentage: { type: Number, default: 15 },
    fbrFee: { type: Number, default: 1 }
  },
  shippingRates: [{
    region: { type: String, required: true },
    courier: { type: String },
    time: { type: String }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
