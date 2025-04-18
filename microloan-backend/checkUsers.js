require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users
    const users = await User.find({}).select('-password');
    console.log('Users in database:');
    console.log(JSON.stringify(users, null, 2));

    mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error checking users:', error);
    process.exit(1);
  }
};

checkUsers(); 