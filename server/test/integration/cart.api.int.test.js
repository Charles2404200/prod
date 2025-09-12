// prod/server/test/integration/cart.api.int.test.js

const mongoose = require("mongoose");
const Product = require("../../models/product");

describe("Product Model Integration Test", () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URI_TEST) {
      throw new Error("MONGO_URI_TEST is not defined in your .env.test file");
    }
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create and save a product successfully", async () => {
    const productData = {
      name: "RMIT Test Hoodie",
      sku: "RMIT-TEST-HD-01",
      slug: "rmit-test-hoodie",
      quantity: 50,
      price: 100,
    };
    const validProduct = new Product(productData);
    const savedProduct = await validProduct.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe(productData.name);
    expect(savedProduct.price).toBe(productData.price);
  });

  it("should find a product by its name", async () => {
    const productData = {
      name: "RMIT Unique Cap",
      sku: "RMIT-UNIQUE-CAP-01",
      slug: "rmit-unique-cap",
      quantity: 25,
      price: 30,
    };
    const validProduct = new Product(productData);
    await validProduct.save();

    const foundProduct = await Product.findOne({ name: "RMIT Unique Cap" });

    expect(foundProduct).toBeDefined();
    expect(foundProduct.name).toBe(productData.name);
  });
});
