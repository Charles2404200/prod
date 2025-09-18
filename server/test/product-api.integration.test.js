const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Product = require('../models/product');

let mongo;

test('seed 2 products → list sorted by name', async () => {
  const seed = [
    { name: 'RMIT Tee', price: 299000, quantity: 50 },
    { name: 'RMIT Bottle', price: 159000, quantity: 100 },
  ];
  await Product.create(seed);

  const list = await Product.find({}).sort({ name: 1 }).lean();
  expect(list.length).toBe(2);
  expect(list.map(p => p.name)).toEqual(['RMIT Bottle', 'RMIT Tee']);
});
