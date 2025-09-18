// Ensure JWT secret exists for passport-jwt during integration tests
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
// Optional: token lifetime used by your login route (only if your code reads this)
process.env.JWT_EXPIRES = process.env.JWT_EXPIRES || "1h";

// If your code reads other envs in config (tweak as needed)
process.env.NODE_ENV = process.env.NODE_ENV || "test";
