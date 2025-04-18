const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const defaultUsers = [
  {
    name: 'Admin User',
    email: 'admin@microloan.com',
    password: 'Admin@123', // Default password for admin
    role: 'admin',
    permissions: {
      canManageUsers: true,
      canManageBorrowers: true,
      canManageLoans: true
    }
  },
  {
    name: 'Loan Officer',
    email: 'officer@microloan.com',
    password: 'Officer@123', // Default password for loan officer
    role: 'loan_officer',
    permissions: {
      canManageUsers: false,
      canManageBorrowers: true,
      canManageLoans: true
    }
  },
  {
    name: 'Test Client',
    email: 'client@microloan.com',
    password: 'Client@123', // Default password for client
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
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords and create users
    for (const user of defaultUsers) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await User.create(user);
      console.log(`Created ${user.role} user: ${user.email}`);
    }

    console.log('Default users created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers(); 