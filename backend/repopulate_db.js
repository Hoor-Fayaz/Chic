const mongoose = require('mongoose');
require('dotenv').config();

const { connectDB } = require('./src/config/db');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const IMG = require('./src/constants/demoImages');

async function repopulate() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();

    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoriesData = [
      { name: 'Sarees', slug: 'sarees', description: 'Elegant Pakistani silk and chiffon sarees', image: IMG.sareeBanner },
      { name: 'Frocks', slug: 'frocks', description: 'Anarkali, pishwas & festive frocks', image: IMG.frockBanner },
      { name: 'Unstitched', slug: 'unstitched', description: 'Premium lawn & chiffon unstitched suits', image: IMG.unstitched },
    ];

    const categories = await Category.insertMany(categoriesData);
    const sareeId = categories.find((c) => c.slug === 'sarees')._id;
    const frockId = categories.find((c) => c.slug === 'frocks')._id;
    const unstitchedId = categories.find((c) => c.slug === 'unstitched')._id;

    const productsData = [
      {
        name: 'Noor-ul-Ain Silk Saree',
        slug: 'noor-ul-ain-silk-saree',
        description: 'Royal blue silk saree with gold zari — modeled for bridal & festive wear.',
        category: sareeId,
        price: 18500,
        originalPrice: 22000,
        discountPercent: 16,
        stock: 45,
        sku: 'JC-SR-001',
        fabric: 'Banarasi Silk',
        sizes: ['Free Size'],
        colors: ['Royal Blue', 'Gold'],
        sizeStock: [{ size: 'Free Size', quantity: 45 }],
        images: [{ url: IMG.saree, alt: 'Noor-ul-Ain Saree', isPrimary: true }],
        isFeatured: true,
        status: 'active',
      },
      {
        name: 'Gul-e-Rana Chiffon Saree',
        slug: 'gul-e-rana-chiffon-saree',
        description: 'Emerald chiffon saree with traditional gold embroidery.',
        category: sareeId,
        price: 14500,
        stock: 30,
        sku: 'JC-SR-002',
        fabric: 'Chiffon',
        sizes: ['Free Size'],
        colors: ['Emerald Green'],
        sizeStock: [{ size: 'Free Size', quantity: 30 }],
        images: [{ url: IMG.sareeBanner, alt: 'Gul-e-Rana Saree', isPrimary: true }],
        isNewArrival: true,
        status: 'active',
      },
      {
        name: 'Zeb-un-Nisa Velvet Pishwas',
        slug: 'zeb-un-nisa-velvet-pishwas',
        description: 'Maroon velvet pishwas frock with gold zardozi bodice.',
        category: frockId,
        price: 24500,
        originalPrice: 28000,
        discountPercent: 12,
        stock: 20,
        sku: 'JC-FR-001',
        fabric: 'Velvet',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Maroon', 'Gold'],
        sizeStock: [
          { size: 'S', quantity: 5 },
          { size: 'M', quantity: 5 },
          { size: 'L', quantity: 5 },
          { size: 'XL', quantity: 5 },
        ],
        images: [{ url: IMG.frock, alt: 'Zeb-un-Nisa Pishwas', isPrimary: true }],
        isFeatured: true,
        status: 'active',
      },
      {
        name: 'Dil-Aara Angrakha Frock',
        slug: 'dil-aara-floral-angrakha',
        description: 'Emerald Anarkali frock with mirror work & gota kinari.',
        category: frockId,
        price: 7800,
        stock: 40,
        sku: 'JC-FR-002',
        fabric: 'Organza',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Emerald Green'],
        sizeStock: [
          { size: 'XS', quantity: 8 },
          { size: 'S', quantity: 8 },
          { size: 'M', quantity: 8 },
          { size: 'L', quantity: 8 },
          { size: 'XL', quantity: 8 },
        ],
        images: [{ url: IMG.frockBanner, alt: 'Dil-Aara Angrakha', isPrimary: true }],
        isNewArrival: true,
        status: 'active',
      },
      {
        name: 'Mah-e-Nau Unstitched 3pc',
        slug: 'mah-e-nau-unstitched-3pc',
        description: 'Lavender embroidered lawn 3-piece unstitched suit.',
        category: unstitchedId,
        price: 6500,
        stock: 120,
        sku: 'JC-UN-001',
        fabric: 'Lawn',
        sizes: ['Unstitched'],
        colors: ['Lavender'],
        sizeStock: [{ size: 'Unstitched', quantity: 120 }],
        images: [{ url: IMG.unstitched, alt: 'Mah-e-Nau 3pc', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Shahzadi Organza Formal',
        slug: 'shahzadi-organza-formal',
        description: 'Luxury organza unstitched formal with Resham & Tilla work.',
        category: unstitchedId,
        price: 11500,
        stock: 25,
        sku: 'JC-UN-002',
        fabric: 'Organza',
        sizes: ['Unstitched'],
        colors: ['Champagne'],
        sizeStock: [{ size: 'Unstitched', quantity: 25 }],
        images: [{ url: IMG.unstitchedBanner, alt: 'Shahzadi Organza', isPrimary: true }],
        isFeatured: true,
        status: 'active',
      },
    ];

    await Product.insertMany(productsData);
    console.log('✅ Database repopulated with Pakistani model images');
    process.exit(0);
  } catch (error) {
    console.error('❌ Repopulation failed:', error);
    process.exit(1);
  }
}

repopulate();
