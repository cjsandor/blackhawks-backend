const User = require('./User');
const Game = require('./Game');
const Attendance = require('./Attendance');

// User associations
User.hasMany(Attendance, { foreignKey: 'user_id' });

// Game associations
Game.hasMany(Attendance, { foreignKey: 'game_id', as: 'Attendances' });

// Attendance associations
Attendance.belongsTo(Game, { foreignKey: 'game_id' });
Attendance.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { User, Game, Attendance };