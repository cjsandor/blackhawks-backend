// File: blackhawks-backend/models/Game.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    get() {
      return new Date(this.getDataValue('date'));
    }
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  opponent: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'games',
  timestamps: false
});


module.exports = Game;