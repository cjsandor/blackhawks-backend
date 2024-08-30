const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createDefaultUsers() {
  try {
    const ticketHolders = ['Charlie', 'Russell', 'Sam', 'Colin'];
    const defaultPassword = 'password123';

    for (const name of ticketHolders) {
      const existingUser = await User.findOne({ where: { name } });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        const newUser = await User.create({
          name,
          email: `${name.toLowerCase()}@example.com`,
          password_hash: hashedPassword
        });
        console.log(`Default user ${name} created successfully:`, newUser.toJSON());
      } else {
        console.log(`User ${name} already exists:`, existingUser.toJSON());
      }
    }
  } catch (error) {
    console.error('Unable to create default users:', error);
  }
}

module.exports = createDefaultUsers;