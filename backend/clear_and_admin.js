const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const User = require('./src/models/User');
const { hashPassword } = require('./src/utils/password');

async function cleanAndSeedAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB!');

    // 1. Wipe out seeded categories and products
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🧹 Cleared all seeded products and categories successfully!');

    // 2. Ensure Admin User exists
    const adminEmail = 'admin@chic.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists:', adminEmail);
    } else {
      const passwordHash = await hashPassword('admin123');
      const admin = await User.create({
        name: 'Admin User',
        email: adminEmail,
        passwordHash,
        role: 'admin',
      });
      console.log('👤 Admin user created successfully! Email:', admin.email);
    }

    console.log('🎉 Done! Your database is now completely clean and ready for your client.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning and seeding admin:', error);
    process.exit(1);
  }
}

cleanAndSeedAdmin();
