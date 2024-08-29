const fs = require('fs');
const csv = require('csv-parser');
const Game = require('./models/Game');
const sequelize = require('./config/database');

async function importCSV() {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database.');

    // Add this line to sync the model with the database
    await Game.sync({ force: true });
    console.log('Game model synced with database.');

    const results = [];

    fs.createReadStream('blackhawks.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log('CSV file successfully processed');

        for (const row of results) {
          await Game.create({
            date: new Date(row.date),
            time: row.time,
            opponent: row.opponent,
            attendance: {}  // Initialize as an empty object
          });
        }

        console.log(`${results.length} games were inserted into the database`);
        process.exit(0);
      });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

importCSV();