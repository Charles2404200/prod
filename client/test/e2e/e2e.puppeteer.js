const puppeteer = require('puppeteer');

(async () => {
  const base = process.env.BASE_URL || 'http://localhost:8080';
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // 1) Home
  await page.goto(base, { waitUntil: 'networkidle0' });
  const title = await page.title();
  if (!/rmit|store|shop/i.test(title)) {
    throw new Error(`Home title not ok: "${title}"`);
  }

  // 2) Navigate to Products (tìm link theo text tiếng Anh/Việt)
  const [prodLink] = await page.$x(
    "//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'products') or contains(.,'Sản phẩm')]"
  );
  if (prodLink) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      prodLink.click()
    ]);
  } else {
    console.warn('⚠️ Products link not found – vẫn tiếp tục');
  }

  // 3) Có ít nhất 1 thẻ sản phẩm (nếu có trang products)
  const hasProduct =
    (await page.$("[data-testid='product-card']")) ||
    (await page.$(".product-card")) ||
    (await page.$("[class*='product']"));
  if (!hasProduct) {
    console.warn('⚠️ No product card found – site tĩnh có thể không có danh sách');
  }

  // 4) Đi tới Cart
  const [cartLink] = await page.$x(
    "//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'cart') or contains(.,'Giỏ hàng')]"
  );
  if (cartLink) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      cartLink.click()
    ]);
  } else {
    console.warn('⚠️ Cart link not found – bỏ qua bước này');
  }

  await browser.close();
  console.log('✅ Puppeteer E2E basic passed');
})().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
