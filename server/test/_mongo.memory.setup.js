// server/server/test/integration/_mongo.memory.setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

async function connectMemoryMongo() {
  mongod = await MongoMemoryServer.create({
    instance: { dbName: 'rmit_store_test' },
  });

  const uri = mongod.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 5,         // thay cho maxPoolSize
    // useCreateIndex: true, // (nếu project còn dùng ensureIndex; tùy bản mongoose)
  });
}

async function disconnectMemoryMongo() {
  try {
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      const db = mongoose.connection.db;
      // Chỉ drop nếu KHÔNG phải admin
      if (db && db.databaseName && db.databaseName !== 'admin') {
        await db.dropDatabase();
      }
      await mongoose.disconnect();
    }
  } finally {
    if (mongod) {
      await mongod.stop();
    }
  }
}

module.exports = { connectMemoryMongo, disconnectMemoryMongo };
