const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Game = sequelize.define('Game', {
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  opponent: {
    type: DataTypes.STRING,
    allowNull: false
  },
  attendance: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  }
});

module.exports = Game;