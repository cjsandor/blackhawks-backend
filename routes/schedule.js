const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const games = await Game.findAll({
      order: [['date', 'ASC']]
    });
    
    const scheduleData = games.map(game => ({
      id: game.id,
      date: game.date.toISOString(), // Send the full ISO string
      time: game.time,
      opponent: game.opponent,
      attendance: game.attendance || {}
    }));

    res.json(scheduleData);
  } catch (error) {
    console.error('Error fetching schedule data:', error);
    res.status(500).json({ message: 'Error fetching schedule data' });
  }
});

module.exports = router;