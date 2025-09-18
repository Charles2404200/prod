// prod/client/playwright.config.js

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // ✅ CHỈ DẪN QUAN TRỌNG
  // Chỉ tìm các file test kết thúc bằng .spec.js
  testMatch: /.*\.spec\.js/,

  // Các cấu hình khác của Playwright có thể thêm vào đây
  use: {
    headless: false, // Chạy với giao diện đồ họa để dễ theo dõi
    // ... các tùy chọn khác
  },
});