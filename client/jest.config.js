// client/jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],

  collectCoverage: true,
  collectCoverageFrom: [
    "app/components/Common/Button/index.js",
    "app/components/Common/CarouselSlider/utils.js",
    "app/containers/Cart/reducer.js",

    "!**/*.test.js",
    "!**/e2e/**",
    "!**/node_modules/**"
  ],
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    global: { statements: 70, branches: 60, functions: 70, lines: 70 },
  },

  testMatch: ["<rootDir>/test/**/*.test.{js,jsx}"],
};
