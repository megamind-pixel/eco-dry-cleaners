const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const users = await User.find({}, 'email name role');
    if (users.length > 0) {
      console.log('Existing users found:');
      users.forEach(u => console.log(`- ${u.email} (${u.role})`));
    } else {
      console.log('No users found in database.');
      
      // Create a test user
      const testUser = new User({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        phone: '1234567890',
        role: 'admin'
      });
      await testUser.save();
      console.log('Created test user: admin@test.com / password123');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();
