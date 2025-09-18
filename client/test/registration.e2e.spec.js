// client/test/e2e/register-via-menu-join-now.spec.js
// Goal: From the homepage (no direct /register), open the “Welcome!” menu,
// click “Sign Up”, then verify the Register form shows:
// - Your Email
// - First Name
// - Last Name
// - Create Password
// - Join Now button


const { test, expect } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
test.setTimeout(60_000);

// Click the first candidate locator that becomes visible.
async function clickFirstVisible(page, candidates, timeout = 2500) {
  for (const mk of candidates) {
    const loc = typeof mk === 'function' ? mk() : page.locator(mk);
    try {
      await loc.first().waitFor({ state: 'visible', timeout });
      await loc.first().click();
      return true;
    } catch {} 
  }
  return false;
}

test('Home → Welcome! → Sign Up → sees Your Email, First Name, Last Name, Create Password, Join Now (no /register)', async ({ page }) => {
  // 1) Open home (without hitting /register directly)
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  // 2) Open the “Welcome!” menu if needed
  await clickFirstVisible(page, [
    () => page.getByRole('button', { name: /welcome!?/i }),
    () => page.getByRole('link',   { name: /welcome!?/i }),
    '[data-testid="nav-welcome"]',
    () => page.getByRole('button', { name: /menu|hamburger|more/i }),
    () => page.getByLabel(/menu/i),
    () => page.getByText(/welcome!/i),
  ], 2500);

  // 3) Click “Sign Up” via UI (avoid direct /register)
  const clickedSignup = await clickFirstVisible(page, [
    () => page.getByRole('button', { name: /sign ?up|register|create (an )?account/i }),
    () => page.getByRole('link',   { name: /sign ?up|register|create (an )?account/i }),
    '[data-testid="nav-register"]',
    'a[href*="signup"], a[href*="sign-up"], a[href*="register"], a[href*="create-account"]',
    'button:has-text("Sign up")',
    'a:has-text("Sign up")',
  ], 5000);
  expect(clickedSignup, 'Could not click “Sign Up” from the UI (avoid direct /register).').toBeTruthy();

  // 4) Work only inside <main> to avoid footer duplicates
  const main = page.getByRole('main');
  await expect(main).toBeVisible();

  await main
    .getByRole('heading', { name: /create your account/i })
    .waitFor({ state: 'visible', timeout: 8000 })
    .catch(() => {});

  // 5) Verify required fields by placeholder (matches your snapshot)
  const email     = main.getByPlaceholder(/enter your email address/i);
  const firstName = main.getByPlaceholder(/enter your first name/i);
  const lastName  = main.getByPlaceholder(/enter your last name/i);
  const password  = main.getByPlaceholder(/choose a password/i);

  await expect(email,     'Missing “Your Email” (placeholder: Enter Your Email Address).').toBeVisible();
  await expect(firstName, 'Missing “First Name” (placeholder: Enter Your First Name).').toBeVisible();
  await expect(lastName,  'Missing “Last Name” (placeholder: Enter Your Last Name).').toBeVisible();
  await expect(password,  'Missing “Create Password” (placeholder: Choose a Password).').toBeVisible();

  // 6) Verify the “Join Now” button (in <main>, not the footer)
  const joinNow = main.getByRole('button', { name: /^\s*join now\s*$/i });
  await expect(joinNow, 'Missing “Join Now” button.').toBeVisible();

});
