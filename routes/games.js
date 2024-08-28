const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Game = require('../models/Game');

// Example: Creating a new game
router.post('/games', async (req, res) => {
  try {
    const newGame = new Game({
      date: req.body.date,
      time: req.body.time,
      opponent: req.body.opponent
    });
    const game = await newGame.save();
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Example: Updating game attendance
router.put('/games/:id/attendance', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    
    game.attendance.set(req.body.userId, req.body.attending);
    await game.save();
    
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;