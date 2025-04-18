const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for seeding...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Default users for development
const defaultUsers = [
  {
    name: 'Admin User',
    email: 'admin@microloan.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Loan Officer',
    email: 'officer@microloan.com',
    password: 'officer123',
    role: 'loan_officer'
  },
  {
    name: 'Client User',
    email: 'client@microloan.com',
    password: 'client123',
    role: 'client'
  }
];

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Hash passwords and create users
    const users = await Promise.all(
      defaultUsers.map(async user => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        return {
          ...user,
          password: hashedPassword
        };
      })
    );
    
    await User.insertMany(users);
    console.log('Default users seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
