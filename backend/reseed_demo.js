const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const dns = require('dns');

// Force DNS resolution to use Google's servers for SRV record lookups if they fail
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('⚠️ Could not set custom DNS servers, using system defaults.');
}

dotenv.config();

const categories = [
  {
    name: 'Sarees',
    slug: 'sarees',
    description: 'Elegant Pakistani silk and chiffon sarees with intricate embroidery.',
    image: '/images/banners/saree_banner.png',
    isActive: true,
    sortOrder: 1
  },
  {
    name: 'Frocks',
    slug: 'frocks',
    description: 'Traditional Pakistani Anarkali and Peplum frocks for festive occasions.',
    image: '/images/banners/frock_banner.png',
    isActive: true,
    sortOrder: 2
  },
  {
    name: 'Unstitched Collection',
    slug: 'unstitched-collection',
    description: 'Luxury unstitched lawn and chiffon fabrics for custom tailoring.',
    image: '/images/banners/unstitched_banner.png',
    isActive: true,
    sortOrder: 3
  }
];

const products = [
  // SAREES
  {
    name: 'Midnight Silk Saree',
    slug: 'midnight-silk-saree',
    description: 'A stunning midnight blue silk saree with silver zari work and a matching luxury blouse piece. Perfect for formal evening events.',
    categoryName: 'Sarees',
    price: 18500,
    fabric: 'Silk',
    isNewArrival: true,
    isFeatured: true,
    images: [{ url: '/images/banners/saree_banner.png', isPrimary: true }]
  },
  {
    name: 'Crimson Chiffon Saree',
    slug: 'crimson-chiffon-saree',
    description: 'Elegant crimson red chiffon saree with delicate floral embroidery and a hand-worked border.',
    categoryName: 'Sarees',
    price: 12500,
    fabric: 'Chiffon',
    isNewArrival: true,
    images: [{ url: '/images/banners/saree_banner.png', isPrimary: true }]
  },
  {
    name: 'Pastel Mint Saree',
    slug: 'pastel-mint-saree',
    description: 'Refreshing pastel mint organza saree with pearl embellishments. Lightweight and ethereal.',
    categoryName: 'Sarees',
    price: 15000,
    fabric: 'Organza',
    isNewArrival: true,
    images: [{ url: '/images/banners/saree_banner.png', isPrimary: true }]
  },
  {
    name: 'Black Velvet Saree',
    slug: 'black-velvet-saree',
    description: 'Royal black velvet saree with heavy gold kora dabka work. A collector\'s item for the winter festive season.',
    categoryName: 'Sarees',
    price: 28000,
    fabric: 'Velvet',
    isNewArrival: true,
    images: [{ url: '/images/banners/saree_banner.png', isPrimary: true }]
  },
  {
    name: 'Zari Banarasi Saree',
    slug: 'zari-banarasi-saree',
    description: 'Traditional Banarasi silk saree with authentic zari weaving and regal patterns.',
    categoryName: 'Sarees',
    price: 32000,
    fabric: 'Banarasi Silk',
    isNewArrival: true,
    images: [{ url: '/images/banners/saree_banner.png', isPrimary: true }]
  },

  // FROCKS
  {
    name: 'Golden Anarkali Frock',
    slug: 'golden-anarkali-frock',
    description: 'Full-length golden Anarkali frock with heavy zari work on the bodice and a voluminous flare.',
    categoryName: 'Frocks',
    price: 24500,
    fabric: 'Net/Organza',
    isNewArrival: true,
    isFeatured: true,
    images: [{ url: '/images/banners/frock_banner.png', isPrimary: true }]
  },
  {
    name: 'Emerald Peplum Set',
    slug: 'emerald-peplum-set',
    description: 'Emerald green short peplum top with intricate mirror work, paired with sleek tulip pants.',
    categoryName: 'Frocks',
    price: 15500,
    fabric: 'Silk',
    isNewArrival: true,
    images: [{ url: '/images/banners/frock_banner.png', isPrimary: true }]
  },
  {
    name: 'Ivory Angrakha Frock',
    slug: 'ivory-angrakha-frock',
    description: 'Classic ivory Angrakha style frock with gota patti work and a colorful crushed silk dupatta.',
    categoryName: 'Frocks',
    price: 19000,
    fabric: 'Chiffon',
    isNewArrival: true,
    images: [{ url: '/images/banners/frock_banner.png', isPrimary: true }]
  },
  {
    name: 'Maroon Pishwas',
    slug: 'maroon-pishwas',
    description: 'Traditional maroon Pishwas with a massive flare and antique gold embroidery on the kallis.',
    categoryName: 'Frocks',
    price: 22000,
    fabric: 'Masuri',
    isNewArrival: true,
    images: [{ url: '/images/banners/frock_banner.png', isPrimary: true }]
  },
  {
    name: 'Navy Blue Maxi Frock',
    slug: 'navy-blue-maxi-frock',
    description: 'Modern navy blue maxi frock with a contemporary cut and minimal crystal work.',
    categoryName: 'Frocks',
    price: 13500,
    fabric: 'Raw Silk',
    isNewArrival: true,
    images: [{ url: '/images/banners/frock_banner.png', isPrimary: true }]
  },

  // UNSTITCHED
  {
    name: 'Luxury Lawn 3-Piece',
    slug: 'luxury-lawn-3-piece',
    description: 'Digital printed luxury lawn shirt, dyed cambric trousers, and a printed silk dupatta.',
    categoryName: 'Unstitched Collection',
    price: 6500,
    fabric: 'Lawn',
    isNewArrival: true,
    isFeatured: true,
    images: [{ url: '/images/banners/unstitched_banner.png', isPrimary: true }]
  },
  {
    name: 'Festive Chiffon Suit',
    slug: 'festive-chiffon-suit',
    description: 'Heavy embroidered chiffon shirt 3-piece suit with hand-worked neckline and sequin border.',
    categoryName: 'Unstitched Collection',
    price: 13500,
    fabric: 'Chiffon',
    isNewArrival: true,
    images: [{ url: '/images/banners/unstitched_banner.png', isPrimary: true }]
  },
  {
    name: 'Cotton Karandi Collection',
    slug: 'cotton-karandi-collection',
    description: 'Warm cotton karandi unstitched suit with cross-stitch embroidery and a wool shawl.',
    categoryName: 'Unstitched Collection',
    price: 8500,
    fabric: 'Cotton Karandi',
    isNewArrival: true,
    images: [{ url: '/images/banners/unstitched_banner.png', isPrimary: true }]
  },
  {
    name: 'Jacquard Gold Collection',
    slug: 'jacquard-gold-collection',
    description: 'Self-textured jacquard shirt with gold tilla embroidery and a net dupatta.',
    categoryName: 'Unstitched Collection',
    price: 11000,
    fabric: 'Jacquard',
    isNewArrival: true,
    images: [{ url: '/images/banners/unstitched_banner.png', isPrimary: true }]
  },
  {
    name: 'Classic White Lawn',
    slug: 'classic-white-lawn',
    description: 'Pure white lawn unstitched suit with schiffli embroidery and a monochrome print dupatta.',
    categoryName: 'Unstitched Collection',
    price: 5500,
    fabric: 'Lawn',
    isNewArrival: true,
    images: [{ url: '/images/banners/unstitched_banner.png', isPrimary: true }]
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI not found in .env');

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    // Wipe existing data
    console.log('🗑️ Cleaning up existing database...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('✨ Existing Categories and Products deleted');

    // Create Categories
    console.log('📦 Creating new categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} Categories created`);

    // Prepare Products with Category IDs
    console.log('👗 Seeding products...');
    const finalProducts = products.map(p => {
      const cat = createdCategories.find(c => c.name === p.categoryName);
      if (!cat) throw new Error(`Category ${p.categoryName} not found`);
      const { categoryName, ...productData } = p;
      return { 
        ...productData, 
        category: cat._id,
        status: 'active'
      };
    });

    const result = await Product.insertMany(finalProducts);
    console.log(`✅ ${result.length} Products seeded successfully in PKR`);

    console.log('\n🚀 ALL DONE! The demo site is now ready for the client.');
    console.log('Categories: Sarees, Frocks, Unstitched Collection');
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR SEEDING DATA:', error);
    process.exit(1);
  }
}

seed();
