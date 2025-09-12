// jest.config.js (client)
module.exports = {
  testEnvironment: "jsdom", // 👈 cần có DOM cho React
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // file đã có sẵn
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(test).[jt]s?(x)"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}", // gom coverage trong src
    "!**/node_modules/**",
  ],
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
};
