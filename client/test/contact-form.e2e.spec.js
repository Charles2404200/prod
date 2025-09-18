// client/test/e2e/contact-get-in-touch.spec.js
// From home (no direct /contact), click “Get in Touch”, verify
// Name, Email, Message, Submit exist, then trigger validation and assert:
//  - "Email format is invalid."
//  - "Message must be at least 10 characters."
//
// We prevent the real submit and requestSubmit() to surface client-side errors.

const { test, expect } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
test.setTimeout(60_000);

async function clickFirstVisible(page, candidates, timeout = 2500) {
  for (const mk of candidates) {
    const loc = typeof mk === 'function' ? mk() : page.locator(mk);
    try {
      await loc.first().waitFor({ state: 'visible', timeout });
      await loc.first().scrollIntoViewIfNeeded();
      await loc.first().click();
      return true;
    } catch {}
  }
  return false;
}

async function findFirstVisible(scope, candidates, timeout = 3000) {
  for (const mk of candidates) {
    const loc = typeof mk === 'function' ? mk(scope) : scope.locator(mk);
    try {
      await loc.first().waitFor({ state: 'visible', timeout });
      return loc.first();
    } catch {}
  }
  return null;
}

test('Home → “Get in Touch” → fields + validation (no direct /contact)', async ({ page }) => {
  // 1) Open home (avoid /contact)
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  // 2) Click “Get in Touch” via UI
  const clicked = await clickFirstVisible(page, [
    () => page.getByRole('navigation').getByRole('link', { name: /get in touch/i }),
    () => page.getByRole('link', { name: /get in touch/i }),
    () => page.getByRole('contentinfo').getByRole('link', { name: /get in touch/i }),
    'a:has-text("Get in Touch")',
  ], 5000);
  expect(clicked, 'Could not click the “Get in Touch” link from the UI.').toBeTruthy();

  // 3) Work inside <main> to avoid footer newsletter fields
  const main = page.getByRole('main');
  await expect(main).toBeVisible();

  // Optional: if your contact page has a heading
  await main.getByRole('heading', { name: /(get in touch|contact)/i })
    .waitFor({ state: 'visible', timeout: 4000 })
    .catch(() => {});

  // 4) Find fields
  const nameField = await findFirstVisible(main, [
    (s) => s.getByLabel(/^\s*(name|your name)\s*$/i),
    (s) => s.getByPlaceholder(/name/i),
    'input[name="name"]',
    'input[name*="name" i]',
    'input[type="text"]',
  ]);
  expect(nameField, 'Missing Name field.').not.toBeNull();

  const emailField = await findFirstVisible(main, [
    (s) => s.getByLabel(/^\s*(email|your email)\s*$/i),
    (s) => s.getByPlaceholder(/email/i),
    'input[type="email"]',
    'input[autocomplete="email"]',
    'input[name="email"]',
    'input[name*="email" i]',
  ]);
  expect(emailField, 'Missing Email field.').not.toBeNull();

  const messageField = await findFirstVisible(main, [
    (s) => s.getByLabel(/^\s*(message|your message)\s*$/i),
    (s) => s.getByPlaceholder(/message/i),
    'textarea[name="message"]',
    'textarea',
    '[role="textbox"][name*="message" i]',
  ]);
  expect(messageField, 'Missing Message field.').not.toBeNull();

  const submitBtn = await findFirstVisible(main, [
    (s) => s.getByRole('button', { name: /submit|send|gửi/i }),
    'button[type="submit"]',
    'input[type="submit"]',
  ]);
  expect(submitBtn, 'Missing Submit button.').not.toBeNull();

  // 5) Fill invalid values (do NOT actually submit to server)
  await emailField.fill('not-an-email');
  await messageField.fill('hi'); // < 10 chars

  const formsInMain = main.locator('form');
  await formsInMain.evaluateAll(forms =>
    forms.forEach(f => f.addEventListener('submit', e => e.preventDefault(), { once: true }))
  );


  let targetForm = await formsInMain.elementHandle();
  try {
    // Try to find the closest form ancestor for the email field
    const emailHandle = await emailField.elementHandle();
    const closer = await emailHandle.evaluateHandle(el => el.closest('form'));
    if (closer) targetForm = closer;
  } catch {}

  if (targetForm) {
    await targetForm.evaluate(f => f.requestSubmit());
  } else {
    await submitBtn.click();
  }

  // 6) Assert validation messages inside <main>
  // Use small flexibility on punctuation/case
  await expect(
    main.getByText(/email format is invalid\.?/i)
  ).toBeVisible();

  await expect(
    main.getByText(/message must be at least 10 characters\.?/i)
  ).toBeVisible();

});
