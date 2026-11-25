const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const config = require('./config');

let memoryServer = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Connected to Primary Database: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Primary connection failed (${err.message}). Starting persistent embedded MongoDB...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const dbDir = path.join(__dirname, '../../.mongodb-data');
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbPath: dbDir,
          storageEngine: 'wiredTiger'
        }
      });
      const memUri = memoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB] Connected to Persistent Embedded Database: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error('[MongoDB] Fatal database connection error:', memErr);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
