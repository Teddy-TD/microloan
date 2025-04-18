require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const defaultUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    permissions: {
      canManageUsers: true,
      canManageBorrowers: true,
      canManageLoans: true
    }
  },
  {
    name: 'Loan Officer',
    email: 'officer@example.com',
    password: 'officer123',
    role: 'loan_officer',
    permissions: {
      canManageUsers: false,
      canManageBorrowers: true,
      canManageLoans: true
    }
  },
  {
    name: 'Client User',
    email: 'client@example.com',
    password: 'client123',
    role: 'client',
    permissions: {
      canManageUsers: false,
      canManageBorrowers: false,
      canManageLoans: false
    }
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('✅ Cleared existing users');

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      defaultUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    await User.insertMany(hashedUsers);
    console.log('✅ Default users created successfully');

    mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers(); 