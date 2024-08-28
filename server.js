const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

const mongoose = require('mongoose');
require('./models/User');
require('./models/Game');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
const gamesRouter = require('./routes/games');
app.use('/api/games', gamesRouter);
app.use('/api/schedule', require('./routes/schedule')); 

// Add a root route for /api
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));