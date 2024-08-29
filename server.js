const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const createDefaultUser = require('./createDefaultUser');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', require('./routes/games'));
app.use('/api/schedule', require('./routes/schedule'));

// Add a root route for /api
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Add a root route for /
app.get('/', (req, res) => {
  res.send('Welcome to the Blackhawks Backend API');
});

const PORT = process.env.PORT || 5000;

// Sync database, create default user, and start server
app.use(require('./middleware/errorHandler'));

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database.');

    await sequelize.sync();
    console.log('Database synchronized.');

    await createDefaultUser();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();