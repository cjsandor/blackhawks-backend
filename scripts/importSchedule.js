require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const sequelize = require('../config/database');
const Game = require('../models/Game');

async function importSchedule() {
  const csvFilePath = path.resolve(__dirname, '../blackhawks.csv');

  try {
    console.log('Attempting to connect to the database...');
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');

    console.log('Synchronizing database schema...');
    await sequelize.sync();
    console.log('Database schema synchronized.');

    console.log(`Checking for CSV file at: ${csvFilePath}`);
    if (!fs.existsSync(csvFilePath)) {
      throw new Error('CSV file not found. Please ensure the file exists in the correct location.');
    }

    console.log('CSV file found. Starting schedule data import...');

    const games = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(parse({ columns: true, skip_empty_lines: true }))
        .on('data', (row) => {
          games.push({
            date: new Date(row.date),
            time: row.time,
            opponent: row.opponent
          });
        })
        .on('end', () => resolve())
        .on('error', (error) => reject(error));
    });

    console.log(`Parsed ${games.length} games from CSV. Attempting to import...`);

    const transaction = await sequelize.transaction();
    try {
      for (let game of games) {
        await Game.create(game, { transaction });
        console.log(`Imported game: ${game.date.toISOString().split('T')[0]} - ${game.opponent}`);
      }
      await transaction.commit();
      console.log(`${games.length} games imported successfully.`);
    } catch (error) {
      await transaction.rollback();
      console.error('Error during game import:', error);
      throw error;
    }

    console.log('Schedule import completed successfully.');
  } catch (error) {
    console.error('Error during import process:', error);
  } finally {
    await sequelize.close();
    process.exit();
  }
}

importSchedule();