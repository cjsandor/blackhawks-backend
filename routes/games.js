// File: blackhawks-backend/routes/games.js

const express = require('express');
const router = express.Router();
const { Game, Attendance, User } = require('../models/associations');
const { body, validationResult } = require('express-validator');
const sequelize = require('../config/database');
const auth = require('../middleware/auth');

// Creating a new game
router.post('/', auth, [ 
  body('date').isISO8601().toDate(),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('opponent').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
router.put('/:id/attendance', auth, [
  body('person').isString(),
  body('status').isIn(['Attending', 'Not Attending'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { person, status } = req.body;
    
    // Find the user by name
    const user = await User.findOne({ where: { name: person } });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    const [attendance, created] = await Attendance.findOrCreate({
      where: { game_id: id, user_id: user.id },
      defaults: { status },
      transaction
    });

    if (!created) {
      await attendance.update({ status }, { transaction });
    }
    
    await transaction.commit();
    
    const updatedAttendance = await Attendance.findAll({
      where: { game_id: id },
      include: [{ model: User, attributes: ['name'] }]
    });

    const formattedAttendance = updatedAttendance.reduce((acc, att) => {
      acc[att.User.name] = att.status;
      return acc;
    }, {});

    res.json({ attendance: formattedAttendance });
  } catch (err) {
    await transaction.rollback();
    console.error('Error updating attendance:', err);
    res.status(500).json({ message: 'An error occurred while updating attendance' });
  }
});

module.exports = router;