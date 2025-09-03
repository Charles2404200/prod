// Load environment variables from a .env file into process.env
require("dotenv").config();

// Import required modules
const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const helmet = require("helmet");
const client = require("prom-client");

// Import custom modules
const keys = require("./config/keys");
const routes = require("./routes");
const socket = require("./socket");
const setupDB = require("./utils/db");

// Destructure port from keys configuration
const { port } = keys;

// Initialize the Express application
const app = express();

// Middleware to parse URL-encoded data and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to enhance security by setting various HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for compatibility reasons
    frameguard: true, // Enable frameguard to prevent clickjacking
  })
);

// Middleware to enable Cross-Origin Resource Sharing
app.use(cors());

// Setup the database connection
setupDB();

// Configure Passport.js for authentication
require("./config/passport")(app);

// Use the defined routes for handling requests
app.use(routes);

// Create Registry to register metrics
const register = new client.Registry();

register.setDefaultLabels({
  app: "rmit-ecommerce-backend",
});
client.collectDefaultMetrics({ register });

// Ceate a histogram
const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [50, 100, 200, 300, 400, 500],
});

// Register histogram
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware to follow response time
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({ route: req.path, code: res.statusCode, method: req.method });
  });
  next();
});

// Define endpoint /metrics for Prometheus can be scrape
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// Start the server and listen on the specified port
const server = app.listen(port, '0.0.0.0', () => {
  console.log(
    `${chalk.green('✓')} ${chalk.blue(
      `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
    )}`
  );
});

// Initialize WebSocket server
socket(server);
