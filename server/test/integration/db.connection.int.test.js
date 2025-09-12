/**
 * Mongo Integration: Product Model
 *
 * Uses mongodb-memory-server + real Mongoose model to verify
 * basic CRUD and slug plugin behavior.
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

test('create + findOne → works', async () => {
  const p = await Product.create({ name: 'RMIT Hoodie', price: 799000 });
  expect(p.name).toBe('RMIT Hoodie');

  const found = await Product.findOne({ _id: p._id });
  expect(found).not.toBeNull();
  expect(found.price).toBe(799000);
});

test('slug plugin → generates slug from name', async () => {
  const p = await Product.create({ name: 'RMIT Cap Limited', price: 199000 });
  expect(p.slug).toBeDefined();
  expect(typeof p.slug).toBe('string');
  expect(p.slug).toContain('rmit-cap-limited');
});
