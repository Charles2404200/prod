// prod/server/jest.config.js
module.exports = {
  // Môi trường test là Node.js
  testEnvironment: 'node',

  // Tự động xóa các mock sau mỗi bài test
  clearMocks: true,

  // Tải các biến môi trường TRƯỚC khi chạy bất kỳ mã nào khác.
  // Đây là chìa khóa để sửa lỗi.
  setupFiles: ['./test/setup.env.js'],
  
  // Chạy tệp setup sau khi môi trường đã được thiết lập
  setupFilesAfterEnv: ['./test/setup.env.js'],
  setupFilesAfterEnv: ['./test/_mongo.memory.setup.js'],

  // Mẫu để tìm tất cả các tệp test
  testMatch: ['**/test/**/*.js'],

  // Loại trừ các tệp không phải là test
  testPathIgnorePatterns: [
    '/node_modules/',
    './test/setup.js',
    './test/setup.env.js',
    './test/_mongo.memory.setup.js'
  ],

  verbose: false
};