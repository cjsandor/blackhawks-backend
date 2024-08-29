// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const createDefaultUser = require('./createDefaultUser');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  exposedHeaders: ['Authorization']
}));
app.use(express.json());

// Route definitions
app.use('/api/auth', require('./routes/auth'));
app.use('/api/games', auth, require('./routes/games'));
app.use('/api/schedule', auth, require('./routes/schedule'));

// Root route for /api
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Root route for /
app.get('/', (req, res) => {
  res.send('Welcome to the Blackhawks Backend API');
});

const PORT = process.env.PORT || 5000;

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// Debug route to check Authorization header
app.get('/api/debug-auth', (req, res) => {
  const authHeader = req.header('Authorization');
  console.log('Debug route - Authorization header:', authHeader);
  res.json({ authHeader });
});

// Server startup function
async function startServer() {
  try {
    // Database connection and synchronization
    await sequelize.authenticate();
    console.log('Connected to the database.');

    await sequelize.sync();
    console.log('Database synchronized.');

    // Create default user
    await createDefaultUser();

    // Start the server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

// Initialize the server
startServer();