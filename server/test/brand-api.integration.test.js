// prod/server/test/integration/brand.admin.int.test.js

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");

// Import models and router
const Brand = require("../models/brand");
const brandRouter = require("../routes/api/brand");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

// Memory-Mongo DB setup
const {
  connectMemoryMongo,
  disconnectMemoryMongo,
} = require("./_mongo.memory.setup");

jest.mock("../middleware/auth", () => jest.fn());
jest.mock("../middleware/role", () => ({
  check: jest.fn(() => (req, res, next) => next()),
  ROLES: { Admin: "ADMIN" }, 
}));

// Setup Express app
const app = express();
app.use(express.json());
app.use("/api/brand", brandRouter);

describe("Brand API - Admin Integration Test", () => {
  let adminUser;

  beforeEach(async () => {

    authMiddleware.mockImplementation((req, res, next) => {
      req.user = { _id: new mongoose.Types.ObjectId(), role: "ADMIN" };
      next();
    });
  });

  test("should allow an admin to add a new brand", async () => {
    const response = await request(app).post("/api/brand/add").send({
      name: "New Brand",
      description: "A new brand description",
      isActive: true,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Brand has been added successfully!");

    const brand = await Brand.findOne({ name: "New Brand" });
    expect(brand).not.toBeNull();
  });

  test("should allow an admin to delete a brand", async () => {
    const brand = await Brand.create({
      name: "Brand to Delete",
      description: "desc",
    });

    const response = await request(app).delete(
      `/api/brand/delete/${brand._id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

    const deletedBrand = await Brand.findById(brand._id);
    expect(deletedBrand).toBeNull();
  });
});
