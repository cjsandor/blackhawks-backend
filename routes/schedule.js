const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ date: 1 });
    
    const scheduleData = games.map(game => ({
      id: game._id,
      date: game.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      time: game.time,
      opponent: game.opponent,
      attendance: Object.fromEntries(game.attendance)
    }));

    res.json(scheduleData);
  } catch (error) {
    console.error('Error fetching schedule data:', error);
    res.status(500).json({ message: 'Error fetching schedule data' });
  }
});

module.exports = router;