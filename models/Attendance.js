const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Game = require('./Game');

const Attendance = sequelize.define('Attendance', {
  isAttending: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

User.belongsToMany(Game, { through: Attendance });
Game.belongsToMany(User, { through: Attendance });

module.module.exports = Attendance;