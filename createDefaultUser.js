const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createDefaultUser() {
  try {
    // Check if the default user already exists
    const existingUser = await User.findOne({ where: { username: 'admin' } });

    if (!existingUser) {
      // Create the default user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const newUser = await User.create({
        username: 'admin',
        password: hashedPassword,
        isAdmin: true
      });
      console.log('Default admin user created successfully:', newUser.toJSON());
    } else {
      console.log('Default admin user already exists:', existingUser.toJSON());
    }
  } catch (error) {
    console.error('Unable to create default user:', error);
  }
}

module.exports = createDefaultUser;