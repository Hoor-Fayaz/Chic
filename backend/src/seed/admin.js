const mongoose = require('mongoose');
const User = require('../models/User');
const { hashPassword } = require('../utils/password');
const { loadEnv } = require('../config/env');
const { connectDB } = require('../config/db');

loadEnv();

async function seedAdmin() {
  try {
    await connectDB();
    
    const existingAdmin = await User.findOne({ email: 'admin@chic.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const passwordHash = await hashPassword('admin123');
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@chic.com',
      passwordHash,
      role: 'admin',
    });

    console.log('Admin user created:', admin.email);
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedAdmin();