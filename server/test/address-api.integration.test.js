
// prod/server/test/integration/address.int.test.js

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");

// Import models and router
const Address = require("../models/address");
const User = require("../models/user");
const addressRouter = require("../routes/api/address");
const authMiddleware = require("../middleware/auth");

// Memory-Mongo DB setup
const {
  connectMemoryMongo,
  disconnectMemoryMongo,
} = require("./_mongo.memory.setup");

// Mock middleware
jest.mock("../middleware/auth", () => jest.fn());

// Setup Express app
const app = express();
app.use(express.json());
app.use("/api/address", addressRouter);

describe("Address API - User Address Management Integration Test", () => {
  let testUser;

  

  beforeEach(async () => {

    // Create and save a test user
    testUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email: "test@example.com",
    });
    await testUser.save();

    // Mock the authenticated user for all requests in this suite
    authMiddleware.mockImplementation((req, res, next) => {
      req.user = testUser;
      next();
    });
  });

  test("should allow an authenticated user to add a new address", async () => {
    const addressData = {
      address: "123 RMIT Street",
      city: "Ho Chi Minh City",
      state: "SGS",
      country: "Vietnam",
      zipCode: "700000",
      isDefault: true,
    };

    const response = await request(app)
      .post("/api/address/add")
      .send(addressData);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Address has been added successfully!");

    // Verify the address was saved and linked to the user
    const address = await Address.findOne({ user: testUser._id });
    expect(address).not.toBeNull();
    expect(address.city).toBe("Ho Chi Minh City");
  });

  test("should fetch all addresses for the authenticated user", async () => {
    // Create a sample address for the user
    await Address.create({
      user: testUser._id,
      address: "456 Le Loi Street",
      city: "Hanoi",
      country: "Vietnam",
    });

    const response = await request(app).get("/api/address");

    expect(response.statusCode).toBe(200);
    expect(response.body.addresses).toBeDefined();
    expect(response.body.addresses).toHaveLength(1);
    expect(response.body.addresses[0].city).toBe("Hanoi");
  });

  test("should return an empty array when the user has no addresses", async () => {
    const response = await request(app).get("/api/address");

    expect(response.statusCode).toBe(200);
    expect(response.body.addresses).toEqual([]);
  });
});
