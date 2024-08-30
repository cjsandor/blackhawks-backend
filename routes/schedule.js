const express = require('express');
const router = express.Router();
const { Game, Attendance, User } = require('../models/associations');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const games = await Game.findAll({
      order: [['date', 'ASC']],
      include: [{
        model: Attendance,
        as: 'Attendances',
        include: [{
          model: User,
          attributes: ['name']
        }]
      }]
    });
    
    const scheduleData = games.map(game => {
      const gameDate = game.date instanceof Date ? game.date : new Date(game.date);
      
      const attendance = game.Attendances.reduce((acc, att) => {
        acc[att.User.name] = att.status;
        return acc;
      }, {});

      return {
        id: game.id,
        date: gameDate.toISOString().split('T')[0],
        time: game.time,
        opponent: game.opponent,
        attendance: attendance
      };
    });

    res.json(scheduleData);
  } catch (error) {
    console.error('Error fetching schedule data:', error);
    res.status(500).json({ message: 'Error fetching schedule data' });
  }
});

module.exports = router;