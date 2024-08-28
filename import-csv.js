const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function importCSV() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('blackhawks'); // replace with your database name
    const collection = database.collection('games'); // replace with your collection name

    const results = [];

    fs.createReadStream('blackhawks.csv') // replace with your CSV file name
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(`CSV file successfully processed. ${results.length} records found.`);

        // Convert date strings to Date objects and ensure correct data types
        const formattedResults = results.map(game => ({
          ...game,
          date: new Date(game.date),
          attendance: {},  // Initialize empty attendance object
        }));

        const result = await collection.insertMany(formattedResults);
        console.log(`${result.insertedCount} documents were inserted`);
        client.close();
      });
  } catch (err) {
    console.error('Error:', err);
    client.close();
  }
}

importCSV();