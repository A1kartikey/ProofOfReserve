const fs = require('fs');
const fastcsv = require('fast-csv');
const { MongoClient } = require('mongodb');

async function insertBatch(collection, batch) {
  return collection.insertMany(batch);
}

async function insertCSVData(csvFilePath, dbName, collectionName) {
  const client = new MongoClient('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const csvReadStream = fs.createReadStream(csvFilePath);
    const csvStream = fastcsv.parseStream(csvReadStream, { headers: true });

    const batchSize = 1000; // Adjust batch size based on your needs
    let batch = [];
    const insertionPromises = [];

    csvStream.on('data', (row) => {
      batch.push(row);

      if (batch.length >= batchSize) {
        insertionPromises.push(insertBatch(collection, batch.slice()));
        batch = [];
      }
    });

    csvStream.on('end', async () => {
      if (batch.length > 0) {
        insertionPromises.push(insertBatch(collection, batch.slice()));
      }

      // Wait for all batch insertions to complete
      await Promise.all(insertionPromises);

      console.log('CSV data inserted into MongoDB.');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
  }
}

const csvFilePath = 'path/to/your/csvfile.csv';
const dbName = 'yourDatabaseName';
const collectionName = 'yourCollectionName';

insertCSVData(csvFilePath, dbName, collectionName);
//-------------------

const fs = require('fs');
const csvParser = require('csv-parser');
const { MongoClient } = require('mongodb');

async function insertCSVData(csvFilePath, dbName, collectionName) {
  const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const csvReadStream = fs.createReadStream(csvFilePath);
    csvReadStream.pipe(csvParser())
      .on('data', async (row) => {
        // Insert each row into the MongoDB collection
        await collection.insertOne(row);
      })
      .on('end', () => {
        console.log('CSV data inserted into MongoDB.');
      });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
  }
}

const csvFilePath = 'path/to/your/csvfile.csv';
const dbName = 'yourDatabaseName';
const collectionName = 'yourCollectionName';

insertCSVData(csvFilePath, dbName, collectionName);
