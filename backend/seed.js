const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./src/models/Product');
const Category = require('./src/models/Category');

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
      { name: 'Outerwear', slug: 'outerwear', description: 'Jackets and coats' },
      { name: 'Activewear', slug: 'activewear', description: 'Sports and fitness wear' },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create comprehensive product list
    const products = await Product.create([
      // Featured Products
      {
        name: 'Elegant Black Dress',
        slug: 'elegant-black-dress',
        description: 'A timeless elegant black dress perfect for any occasion',
        category: categories[0]._id,
        price: 5999,
        discountPrice: 4999,
        images: [{ url: 'https://images.unsplash.com/photo-1595777707802-92d37c7e98d9?w=500', alt: 'Elegant Black Dress', isPrimary: true }],
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
        images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'White Casual Top', isPrimary: true }],
        status: 'active',
        isFeatured: true,
      },
      {
        name: 'Summer Floral Dress',
        slug: 'summer-floral-dress',
        description: 'Beautiful summer dress with floral patterns',
        category: categories[0]._id,
        price: 4499,
        images: [{ url: 'https://images.unsplash.com/photo-1505252585461-04db1921b011?w=500', alt: 'Summer Floral Dress', isPrimary: true }],
        status: 'active',
        isFeatured: true,
      },
      {
        name: 'Rose Gold Blazer',
        slug: 'rose-gold-blazer',
        description: 'Sophisticated rose gold blazer for professional look',
        category: categories[4]._id,
        price: 7999,
        discountPrice: 6499,
        images: [{ url: 'https://images.unsplash.com/photo-1539533057440-7cc1f7af2a8f?w=500', alt: 'Rose Gold Blazer', isPrimary: true }],
        status: 'active',
        isFeatured: true,
      },
      // New Arrivals
      {
        name: 'Blue Denim Jeans',
        slug: 'blue-denim-jeans',
        description: 'Classic blue denim jeans with perfect fit',
        category: categories[2]._id,
        price: 3499,
        discountPrice: 2799,
        images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500', alt: 'Blue Denim Jeans', isPrimary: true }],
        status: 'active',
        isNewArrival: true,
      },
      {
        name: 'Leather Handbag',
        slug: 'leather-handbag',
        description: 'Premium leather handbag for daily use',
        category: categories[3]._id,
        price: 6999,
        discountPrice: 5499,
        images: [{ url: 'https://images.unsplash.com/photo-1584917865105-8a0ff1a270f5?w=500', alt: 'Leather Handbag', isPrimary: true }],
        status: 'active',
        isNewArrival: true,
      },
      {
        name: 'Yoga Leggings',
        slug: 'yoga-leggings',
        description: 'Comfortable and stylish yoga leggings',
        category: categories[5]._id,
        price: 2999,
        discountPrice: 2399,
        images: [{ url: 'https://images.unsplash.com/photo-1506629082632-401017062e57?w=500', alt: 'Yoga Leggings', isPrimary: true }],
        status: 'active',
        isNewArrival: true,
      },
      {
        name: 'Designer Sunglasses',
        slug: 'designer-sunglasses',
        description: 'UV protection designer sunglasses',
        category: categories[3]._id,
        price: 4999,
        images: [{ url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', alt: 'Designer Sunglasses', isPrimary: true }],
        status: 'active',
        isNewArrival: true,
      },
      // Regular Products
      {
        name: 'Silk Scarf',
        slug: 'silk-scarf',
        description: 'Luxurious silk scarf with beautiful patterns',
        category: categories[3]._id,
        price: 2999,
        discountPrice: 2499,
        images: [{ url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', alt: 'Silk Scarf', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Striped T-Shirt',
        slug: 'striped-t-shirt',
        description: 'Classic striped t-shirt for casual wear',
        category: categories[1]._id,
        price: 1499,
        images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Striped T-Shirt', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Black Cargo Pants',
        slug: 'black-cargo-pants',
        description: 'Trendy black cargo pants with multiple pockets',
        category: categories[2]._id,
        price: 3999,
        discountPrice: 3199,
        images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500', alt: 'Black Cargo Pants', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Matching Crop Top',
        slug: 'matching-crop-top',
        description: 'Stylish crop top perfect with high-waisted bottoms',
        category: categories[1]._id,
        price: 1799,
        images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Crop Top', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Winter Coat',
        slug: 'winter-coat',
        description: 'Warm and stylish winter coat',
        category: categories[4]._id,
        price: 8999,
        discountPrice: 7299,
        images: [{ url: 'https://images.unsplash.com/photo-1539533057440-7cc1f7af2a8f?w=500', alt: 'Winter Coat', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Sports Bra',
        slug: 'sports-bra',
        description: 'High-support sports bra for active lifestyle',
        category: categories[5]._id,
        price: 2499,
        images: [{ url: 'https://images.unsplash.com/photo-1506629082632-401017062e57?w=500', alt: 'Sports Bra', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Gold Necklace',
        slug: 'gold-necklace',
        description: 'Elegant gold necklace with pendant',
        category: categories[3]._id,
        price: 5499,
        discountPrice: 4699,
        images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500', alt: 'Gold Necklace', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Denim Jacket',
        slug: 'denim-jacket',
        description: 'Classic denim jacket for all seasons',
        category: categories[4]._id,
        price: 4499,
        discountPrice: 3799,
        images: [{ url: 'https://images.unsplash.com/photo-1539533057440-7cc1f7af2a8f?w=500', alt: 'Denim Jacket', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'Comfortable running shoes with great support',
        category: categories[5]._id,
        price: 5999,
        discountPrice: 4799,
        images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', alt: 'Running Shoes', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Printed Maxi Dress',
        slug: 'printed-maxi-dress',
        description: 'Long maxi dress with vibrant prints',
        category: categories[0]._id,
        price: 6499,
        discountPrice: 5199,
        images: [{ url: 'https://images.unsplash.com/photo-1595777707802-92d37c7e98d9?w=500', alt: 'Printed Maxi Dress', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Oversized Sweater',
        slug: 'oversized-sweater',
        description: 'Cozy oversized sweater for cold weather',
        category: categories[1]._id,
        price: 3299,
        discountPrice: 2699,
        images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Oversized Sweater', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'High-Waisted Shorts',
        slug: 'high-waisted-shorts',
        description: 'Trendy high-waisted shorts for summer',
        category: categories[2]._id,
        price: 2299,
        images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500', alt: 'High-Waisted Shorts', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Pearl Earrings',
        slug: 'pearl-earrings',
        description: 'Timeless pearl earrings for elegant look',
        category: categories[3]._id,
        price: 3999,
        discountPrice: 3199,
        images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500', alt: 'Pearl Earrings', isPrimary: true }],
        status: 'active',
      },
      {
        name: 'Leather Belt',
        slug: 'leather-belt',
        description: 'Premium leather belt with metal buckle',
        category: categories[3]._id,
        price: 2199,
        images: [{ url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', alt: 'Leather Belt', isPrimary: true }],
        status: 'active',
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
