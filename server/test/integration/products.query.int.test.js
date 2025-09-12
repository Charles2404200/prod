/**
 * Mongo Integration: Product Query
 *
 * Seeds two products and verifies listing/sorting behavior
 * similar to a basic "/products" view.
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Product = require('../../models/product');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, { dbName: 'rmit_store_test' });
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
});

test('seed 2 products → list sorted by name', async () => {
  const seed = [
    { name: 'RMIT Tee', price: 299000, quantity: 50 },
    { name: 'RMIT Bottle', price: 159000, quantity: 100 },
  ];
  await Product.insertMany(seed);

  const list = await Product.find({}).sort({ name: 1 }).lean();
  expect(list.length).toBe(2);
  expect(list.map(p => p.name)).toEqual(['RMIT Bottle', 'RMIT Tee']);
});
