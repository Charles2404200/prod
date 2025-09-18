module.exports = {
  testEnvironment: 'node',

  clearMocks: true,

  setupFilesAfterEnv: ['./test/setup.js'],
  

  testMatch: ['**/test/**/*.js'],

  testPathIgnorePatterns: [
    '/node_modules/',
    './test/setup.js',
    './test/setup.env.js',
    './test/_mongo.memory.setup.js'
  ],

  verbose: false
};