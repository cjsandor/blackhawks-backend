const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const { body, validationResult } = require('express-validator');
const sequelize = require('../config/database');

// Creating a new game
router.post('/', [
  // Validate input data
  body('date').isISO8601().toDate(),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('opponent').isString().notEmpty()
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Create new game in the database
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
router.put('/:id/attendance', [
  // Validate input data
  body('person').isString().notEmpty(),
  body('status').isIn(['Attending', 'Not Attending', 'Claimed'])
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Start a database transaction
  const transaction = await sequelize.transaction();

  try {
    // Find the game by ID within the transaction
    const game = await Game.findByPk(req.params.id, { transaction });
    if (!game) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Game not found' });
    }
    
    const { person, status } = req.body;
    
    // Update the attendance object
    let attendance = JSON.parse(JSON.stringify(game.attendance)) || {};
    attendance[person] = status;
    
    // Update the game with new attendance data
    await game.update({ attendance }, { transaction });
    
    // Commit the transaction
    await transaction.commit();
    
    // Fetch the updated game and send it as response
    const updatedGame = await Game.findByPk(req.params.id);
    res.json(updatedGame);
  } catch (err) {
    // Rollback the transaction in case of error
    await transaction.rollback();
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;