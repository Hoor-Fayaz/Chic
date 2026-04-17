const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './backend/.env') });

const Product = require('./backend/src/models/Product');
const Category = require('./backend/src/models/Category');

async function seedData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB!');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create categories
    const categories = await Category.create([
      { name: 'Dresses', slug: 'dresses', description: 'Elegant dresses collection' },
      { name: 'Tops', slug: 'tops', description: 'Stylish tops' },
      { name: 'Bottoms', slug: 'bottoms', description: 'Comfortable bottoms' },
      { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories' },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create sample products
    const products = await Product.create([
      {
        name: 'Elegant Black Dress',
        slug: 'elegant-black-dress',
        description: 'A timeless elegant black dress perfect for any occasion',
        category: categories[0]._id,
        price: 5999,
        discountPrice: 4999,
        images: ['https://images.unsplash.com/photo-1595777707802-92d37c7e98d9?w=500'],
        status: 'active',
        isFeatured: true,
      },
      {
        name: 'White Casual Top',
        slug: 'white-casual-top',
        description: 'Comfortable white casual top for everyday wear',
        category: categories[1]._id,
        price: 1999,
        discountPrice: 1499,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
        status: 'active',
        isFeatured: true,
      },
      {
        name: 'Blue Denim Jeans',
        slug: 'blue-denim-jeans',
        description: 'Classic blue denim jeans with perfect fit',
        category: categories[2]._id,
        price: 3499,
        discountPrice: 2799,
        images: ['https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500'],
        status: 'active',
        isNewArrival: true,
      },
      {
        name: 'Silk Scarf',
        slug: 'silk-scarf',
        description: 'Luxurious silk scarf with beautiful patterns',
        category: categories[3]._id,
        price: 2999,
        discountPrice: 2499,
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500'],
        status: 'active',
      },
      {
        name: 'Summer Floral Dress',
        slug: 'summer-floral-dress',
        description: 'Beautiful summer dress with floral patterns',
        category: categories[0]._id,
        price: 4499,
        images: ['https://images.unsplash.com/photo-1505252585461-04db1921b011?w=500'],
        status: 'active',
        isFeatured: true,
      },
      {
        name: 'Leather Handbag',
        slug: 'leather-handbag',
        description: 'Premium leather handbag for daily use',
        category: categories[3]._id,
        price: 6999,
        discountPrice: 5499,
        images: ['https://images.unsplash.com/photo-1584917865105-8a0ff1a270f5?w=500'],
        status: 'active',
        isNewArrival: true,
      },
    ]);
    console.log(`✅ Created ${products.length} products`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedData();
