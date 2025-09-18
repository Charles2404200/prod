// client/test/e2e/login-via-menu.spec.js
// Goal: From the homepage (no direct /login), open the “Welcome!” menu,
// click “Login / Sign in”, then verify we can see:
// - Email field
// - Password field
// - Sign in button
//
// Notes:
// - We avoid typing /login directly because of the current nginx issue.
// - The selectors are resilient and will also search inside common auth iframes
//   (e.g., Auth0/Clerk/Supabase) if your login is embedded there.

const { test, expect } = require('@playwright/test');

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
test.setTimeout(45_000);

// Click the first candidate locator that becomes visible.
async function clickFirstVisible(page, candidates, timeout = 2500) {
  for (const mk of candidates) {
    const loc = typeof mk === 'function' ? mk() : page.locator(mk);
    try {
      await loc.first().waitFor({ state: 'visible', timeout });
      await loc.first().click();
      return true;
    } catch (_) {}
  }
  return false;
}

function emailLocators(scope) {
  return [
    () => scope.getByLabel(/your email|email|e-?mail|địa chỉ email/i),
    'input[type="email"]',
    'input[autocomplete="email"]',
    'input[name*="email" i]',
    'input[placeholder*="email" i]',
    'input[name*="username" i]',
  ];
}

function passwordLocators(scope) {
  return [
    () => scope.getByLabel(/password|mật khẩu/i),
    'input[type="password"]',
    'input[autocomplete="current-password"]',
    'input[name*="password" i]',
    'input[placeholder*="password" i]',
  ];
}

function signInLocators(scope) {
  return [
    () => scope.getByRole('button', { name: /sign ?in|log ?in|đăng ?nhập/i }),
    'button[type="submit"]',
    'input[type="submit"][value*="Sign" i]',
    'button:has-text("Sign in")',
    'button:has-text("Log in")',
    'button:has-text("Đăng nhập")',
  ];
}

async function findFirstVisible(scope, selectors, timeout = 2500) {
  for (const mk of selectors) {
    const loc = typeof mk === 'function' ? mk(scope) : scope.locator(mk);
    try {
      await loc.first().waitFor({ state: 'visible', timeout });
      return loc.first();
    } catch (_) {}
  }
  return null;
}

async function findInAllFrames(page, builder) {
  const fromMain = await builder(page);
  if (fromMain) return { loc: fromMain, frame: page.mainFrame() };

  for (const f of page.frames()) {
    if (f === page.mainFrame()) continue;
    try {
      const res = await builder(f);
      if (res) return { loc: res, frame: f };
    } catch (_) {}
  }
  return { loc: null, frame: null };
}

test('Home → open “Welcome!” menu → click Login → see Email + Password + Sign in (no direct /login)', async ({ page }) => {
  // 1) Go to home (do not navigate directly to /login)
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  // 2) Open the “Welcome!” menu (if your UI requires it)
  await clickFirstVisible(page, [
    () => page.getByRole('button', { name: /welcome!?/i }),
    () => page.getByRole('link',   { name: /welcome!?/i }),
    '[data-testid="nav-welcome"]',
    // if the navbar uses a hamburger menu:
    () => page.getByRole('button', { name: /menu|hamburger|more/i }),
    () => page.getByLabel(/menu/i),
    () => page.getByText(/welcome!/i),
  ], 2000);

  // 3) Click "Login" via the UI (avoid /login direct)
  const clickedLogin = await clickFirstVisible(page, [
    () => page.getByRole('button', { name: /log ?in|sign ?in/i }),
    () => page.getByRole('link',   { name: /log ?in|sign ?in/i }),
    '[data-testid="nav-login"]',
    'a[href*="login"]',
    'button:has-text("Login")',
    'button:has-text("Sign in")',
    'a:has-text("Login")',
    'a:has-text("Sign in")',
  ], 4000);
  expect(clickedLogin, 'Could not click “Login” from the UI (avoid direct /login).').toBeTruthy();

  // 4) If there’s an “Email” tab/option, click it to reveal the email+password form
  await clickFirstVisible(page, [
    () => page.getByRole('tab', { name: /email/i }),
    () => page.getByRole('button', { name: /email/i }),
    () => page.getByText(/continue with email|use email/i),
    'button:has-text("Email")',
    'a:has-text("Email")',
  ], 1500);

  // 5) Find Email field (search main frame first, then iframes)
  const { loc: emailInput } = await findInAllFrames(page, async (scope) => {
    return await findFirstVisible(scope, emailLocators(scope), 3500);
  });
  if (!emailInput) {
    // Capture a screenshot to help debugging if the email field is not found
    await page.screenshot({ path: 'test-results/login-missing-email.png', fullPage: true }).catch(() => {});
  }
  expect(
    emailInput,
    'Email field not found (tried label, placeholder, type, name, and iframe contexts).'
  ).not.toBeNull();

  // 6) Find Password field
  const { loc: passwordInput } = await findInAllFrames(page, async (scope) => {
    return await findFirstVisible(scope, passwordLocators(scope), 3500);
  });
  expect(passwordInput, 'Password field not found.').not.toBeNull();

  // 7) Find “Sign in” button
  const { loc: signInBtn } = await findInAllFrames(page, async (scope) => {
    return await findFirstVisible(scope, signInLocators(scope), 3500);
  });
  expect(signInBtn, '“Sign in” button not found.').not.toBeNull();
});
