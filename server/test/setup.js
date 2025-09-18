// prod/server/test/setup.js

const dotenv = require('dotenv');
dotenv.config({ path: './.env.test' });
jest.setTimeout(20000);

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Import tất cả các model bạn có
const Address = require('../models/address');
const Brand = require('../models/brand');
const Cart = require('../models/cart');
const Category = require('../models/category');
const Contact = require('../models/contact');
const Merchant = require('../models/merchant');
const Order = require('../models/order');
const Product = require('../models/product');
const Review = require('../models/review');
const User = require('../models/user');
const Wishlist = require('../models/wishlist');

let mongo;

/**
 * Kết nối đến DB trong bộ nhớ trước khi chạy tất cả các test.
 */
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

/**
 * Dọn dẹp tất cả dữ liệu test trước mỗi một test case.
 */
beforeEach(async () => {
  const collections = mongoose.connection.collections;

  // Duyệt qua tất cả collection và xóa sạch dữ liệu
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

/**
 * Đóng kết nối DB sau khi tất cả test đã hoàn thành.
 */
afterAll(async () => {
  if (mongo) {
    await mongoose.connection.close();
    await mongo.stop();
  }
});