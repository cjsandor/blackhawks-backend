const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Main route to get all games
// This route is protected by authentication middleware
router.get('/', auth, async (req, res) => {
  try {
    // Fetch all games from the database
    // Order them by date (ascending) and then by time (ascending)
    // Only select specific attributes to optimize the query
    const games = await Game.findAll({
      order: [['date', 'ASC'], ['time', 'ASC']],
      attributes: ['id', 'date', 'time', 'opponent', 'attendance']
    });
    
    // Transform the raw game data into a more suitable format for the client
    // This includes converting the date to ISO string format and ensuring attendance is always an object
    const scheduleData = games.map(game => ({
      id: game.id,
      date: game.date.toISOString(),
      time: game.time,
      opponent: game.opponent,
      attendance: game.attendance || {}
    }));

    // Send the formatted schedule data as a JSON response
    res.json(scheduleData);
  } catch (error) {
    // Error handling: log the error and send a 500 status code with an error message
    console.error('Error fetching schedule data:', error);
    res.status(500).json({ message: 'Error fetching schedule data' });
  }
});

module.exports = router;