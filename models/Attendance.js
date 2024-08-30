// File: blackhawks-backend/models/Attendance.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Game = require('./Game');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  game_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Game,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  claimed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'attendance',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['game_id', 'user_id']
    }
  ]
});



module.exports = Attendance;