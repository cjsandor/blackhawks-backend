const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const { literal } = require('sequelize');

// Creating a new game
router.post('/', async (req, res) => {
  try {
    const newGame = await Game.create({
      date: req.body.date,
      time: req.body.time,
      opponent: req.body.opponent
    });
    res.json(newGame);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Updating game attendance
router.put('/:id/attendance', async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    
    const { person, isAttending } = req.body;
    console.log(`Updating attendance for game ${game.id}, person: ${person}, isAttending: ${isAttending}`);
    
    let attendance = game.attendance || {};
    console.log('Current attendance:', attendance);
    
    if (isAttending) {
      await game.update({
        attendance: literal(`jsonb_set(COALESCE(attendance, '{}'), '{${person}}', 'true')`)
      });
    } else {
      await game.update({
        attendance: literal(`attendance - '${person}'`)
      });
    }
    
    const updatedGame = await Game.findByPk(req.params.id);
    console.log('Game after update:', updatedGame.toJSON());
    
    res.json(updatedGame);
  } catch (err) {
    console.error('Error updating attendance:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;