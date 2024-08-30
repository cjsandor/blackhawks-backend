// File: blackhawks-backend/config/database.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('Database configuration:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Database: ${process.env.DB_NAME}`);
console.log(`User: ${process.env.DB_USER}`);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: console.log, // Enable logging for debugging
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // You might want to set this to true in production
    }
  }
});

module.exports = sequelize;