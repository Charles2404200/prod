// jest.config.js
module.exports = {
  testEnvironment: "node", // test backend Node.js
  collectCoverage: true,   // bật coverage mặc định
  collectCoverageFrom: [
    "routes/**/*.js",
    "models/**/*.js",
    "utils/**/*.js",
    "!**/node_modules/**"
  ],
  coverageReporters: ["text", "lcov"], // text in console + HTML trong coverage/lcov-report
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
};
