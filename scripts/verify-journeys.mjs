// Phase 13: E2E user journeys + PWA runtime checks against the production preview build.
import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.env.BASE_URL || 'http://localhost:4173';
const results = [];
const ok = (name, pass, note = '') => results.push({ name, pass, note });

const browser = await chromium.launch();

// ---------- PWA checks (regular context) ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const manifestOk = await page.evaluate(async () => {
    const link = document.querySelector('link[rel="manifest"]');
    if (!link) return false;
    const res = await fetch(link.href);
    const m = await res.json();
    return !!(m.name && Array.isArray(m.icons) && m.icons.length > 0);
  });
  ok('PWA: manifest linked & valid', manifestOk);

  const swRegistered = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return 'no-sw-api';
    try {
      const reg = await navigator.serviceWorker.ready.then((r) => r.active?.scriptURL ?? null).catch(() => null);
      if (reg) return reg;
      const regs = await navigator.serviceWorker.getRegistrations();
      return regs.length ? regs[0].active?.scriptURL ?? regs[0].scope : null;
    } catch { return 'error'; }
  });
  const swRes = await page.request.get(`${BASE}/sw.js`);
  ok('PWA: sw.js served (200)', swRes.status() === 200, `status=${swRes.status()}`);
  ok('PWA: service worker registers', typeof swRegistered === 'string' && swRegistered.includes('sw.js'), String(swRegistered));

  // Logout must not leave stale user data in context state (SPA memory only — no persistence by design)
  await page.goto(`${BASE}/customer/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="tel"]', '600000010');
  await page.getByText('Envoyer le code').click();
  await page.fill('input[type="text"].tracking-widest', '123456');
  await page.getByText('Vérifier').click();
  await page.waitForURL(/\/customer\//);
  const lsKeys = await page.evaluate(() => Object.keys(localStorage).filter((k) => /user|token|session/i.test(k)));
  ok('PWA/security: no sensitive auth data persisted in localStorage', lsKeys.length === 0, lsKeys.join(','));
  await page.close(); await ctx.close();
}

// ---------- Journey helpers ----------
async function newCtx() {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  return { ctx, page };
}

// CUSTOMER: dashboard → request a mechanic → offers/booking flow → messages
{
  const { ctx, page } = await newCtx();
  await page.goto(`${BASE}/customer/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="tel"]', '600000010');
  await page.getByText('Envoyer le code').click();
  await page.fill('input[type="text"].tracking-widest', '123456');
  await page.getByText('Vérifier').click();
  await page.waitForURL(/\/customer\/(home|profile-setup)/);
  ok('Journey/Customer: login lands on portal', true, page.url());
  if (page.url().includes('profile-setup')) await page.goto(`${BASE}/customer/home`, { waitUntil: 'networkidle' });

  await page.goto(`${BASE}/customer/new-request`, { waitUntil: 'networkidle' });
  const reqVisible = await page.getByText(/demande|problème|véhicule/i).first().isVisible();
  ok('Journey/Customer: new-request page renders', reqVisible);

  await page.goto(`${BASE}/customer/offers`, { waitUntil: 'networkidle' });
  ok('Journey/Customer: offers page renders', (await page.locator('body').innerText()).length > 50);

  await page.goto(`${BASE}/customer/tracking`, { waitUntil: 'networkidle' });
  ok('Journey/Customer: tracking page renders', (await page.locator('body').innerText()).length > 50);

  await page.goto(`${BASE}/customer/messages`, { waitUntil: 'networkidle' });
  ok('Journey/Customer: messages page renders', (await page.locator('body').innerText()).length > 50);

  await page.goto(`${BASE}/customer/shop`, { waitUntil: 'networkidle' });
  ok('Journey/Customer: shop page renders', (await page.locator('body').innerText()).length > 50);

  await page.goto(`${BASE}/customer/history`, { waitUntil: 'networkidle' });
  ok('Journey/Customer: history page renders', (await page.locator('body').innerText()).length > 50);

  // Sidebar shell present?
  const sidebar = await page.locator('aside, nav').count();
  ok('Journey/Customer: shared PortalSidebar shell present', sidebar >= 1, `nav/aside count=${sidebar}`);
  await ctx.close();
}

// MECHANIC: dashboard → incoming request detail → job actions
{
  const { ctx, page } = await newCtx();
  await page.goto(`${BASE}/mechanic/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="tel"]', '600000001');
  await page.getByText('Envoyer le code').click();
  await page.fill('input[type="text"].tracking-widest', '123456');
  await page.getByText('Vérifier').click();
  await page.waitForURL(/\/mechanic\/(dashboard|home|profile-setup)/);
  ok('Journey/Mechanic: login lands on portal', true, page.url());
  await page.goto(`${BASE}/mechanic/request/r1`, { waitUntil: 'networkidle' });
  const acceptBtn = page.getByText(/Accepter/i).first();
  ok('Journey/Mechanic: request detail with accept action renders', await acceptBtn.isVisible());
  await acceptBtn.click();
  await page.waitForURL(/\/mechanic\/home/, { timeout: 5000 }).catch(() => {});
  ok('Journey/Mechanic: accept navigates to dashboard', /mechanic\/(home|active-job|dashboard)/.test(page.url()), page.url());
  await page.goto(`${BASE}/mechanic/earnings`, { waitUntil: 'networkidle' });
  ok('Journey/Mechanic: earnings page renders', (await page.locator('body').innerText()).length > 50);
  await ctx.close();
}

// SELLER: dashboard → products → new product → orders
{
  const { ctx, page } = await newCtx();
  await page.goto(`${BASE}/seller/login`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Se connecter/i }).first().click();
  await page.waitForURL(/\/seller\/dashboard/);
  ok('Journey/Seller: login lands on dashboard', true);
  await page.goto(`${BASE}/seller/products`, { waitUntil: 'networkidle' });
  ok('Journey/Seller: products list renders', (await page.locator('body').innerText()).length > 50);
  await page.goto(`${BASE}/seller/products/new`, { waitUntil: 'networkidle' });
  ok('Journey/Seller: new-product form renders', (await page.locator('body').innerText()).length > 50);
  await page.goto(`${BASE}/seller/orders`, { waitUntil: 'networkidle' });
  const firstOrder = page.locator('a[href*="/seller/orders/"]').first();
  if (await firstOrder.count()) {
    await firstOrder.click();
    await page.waitForURL(/\/seller\/orders\//, { timeout: 5000 }).catch(() => {});
    ok('Journey/Seller: order detail opens via click', /\/seller\/orders\/.+/.test(page.url()), page.url());
  } else {
    await page.goto(`${BASE}/seller/orders/o1`, { waitUntil: 'networkidle' });
    ok('Journey/Seller: order detail renders (direct nav)', (await page.locator('body').innerText()).length > 30);
  }
  await ctx.close();
}

// TUNER: dashboard → requests → project detail → portfolio
{
  const { ctx, page } = await newCtx();
  await page.goto(`${BASE}/tuner/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="tel"]', '0600000077');
  await page.fill('input[type="password"]', 'demo');
  await page.getByRole('button', { name: /Se connecter/i }).first().click();
  await page.waitForURL(/\/tuner\/dashboard/);
  ok('Journey/Tuner: login lands on dashboard', true);
  await page.goto(`${BASE}/tuner/requests`, { waitUntil: 'networkidle' });
  ok('Journey/Tuner: requests page renders', (await page.locator('body').innerText()).length > 50);
  await page.goto(`${BASE}/tuner/projects`, { waitUntil: 'networkidle' });
  const projLink = page.locator('a[href*="/tuner/projects/"]').first();
  if (await projLink.count()) {
    await projLink.click();
    await page.waitForURL(/\/tuner\/projects\//, { timeout: 5000 }).catch(() => {});
    ok('Journey/Tuner: project detail opens via click', /\/tuner\/projects\/.+/.test(page.url()), page.url());
  } else {
    await page.goto(`${BASE}/tuner/projects/p1`, { waitUntil: 'networkidle' });
    ok('Journey/Tuner: project detail renders (direct nav)', (await page.locator('body').innerText()).length > 30);
  }
  await page.goto(`${BASE}/tuner/portfolio`, { waitUntil: 'networkidle' });
  ok('Journey/Tuner: portfolio renders', (await page.locator('body').innerText()).length > 50);
  await ctx.close();
}

// ADMIN: dashboard → users → verification decision UI
{
  const { ctx, page } = await newCtx();
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Connexion Admin/i }).first().click();
  await page.waitForURL(/\/admin\/dashboard/);
  ok('Journey/Admin: login lands on console', true);
  await page.goto(`${BASE}/admin/users`, { waitUntil: 'networkidle' });
  ok('Journey/Admin: users page renders', (await page.locator('body').innerText()).length > 50);
  await page.goto(`${BASE}/admin/verification`, { waitUntil: 'networkidle' });
  const decisionBtns = await page.getByRole('button', { name: /Approuver|Valider|Rejeter|Refuser/i }).count();
  ok('Journey/Admin: verification queue exposes decision actions', decisionBtns > 0, `buttons=${decisionBtns}`);
  await ctx.close();
}

// PERMISSIONS: cross-role direct navigation is redirected
{
  const { ctx, page } = await newCtx();
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Connexion Admin/i }).first().click();
  await page.waitForURL(/\/admin\/dashboard/);
  await page.goto(`${BASE}/customer/home`, { waitUntil: 'networkidle' });
  ok('Permissions: admin blocked from customer route (redirect home)', page.url() === BASE + '/' || page.url().endsWith('/'), page.url());
  await ctx.close();
}

// BACK/FORWARD + refresh on nested route
{
  const { ctx, page } = await newCtx();
  await page.goto(`${BASE}/seller/login`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Se connecter/i }).first().click();
  await page.waitForURL(/\/seller\/dashboard/);
  await page.goto(`${BASE}/seller/analytics`, { waitUntil: 'networkidle' });
  await page.goBack(); await page.waitForTimeout(400);
  const backOk = page.url().includes('/seller/dashboard');
  await page.goForward(); await page.waitForTimeout(400);
  const fwdOk = page.url().includes('/seller/analytics');
  ok('Navigation: back/forward works on nested routes', backOk && fwdOk, `${backOk}/${fwdOk}`);
  await page.reload({ waitUntil: 'networkidle' });
  ok('Navigation: refresh on nested SPA route does not break', (await page.locator('body').innerText()).length > 50);
  await ctx.close();
}

await browser.close();
fs.writeFileSync('scripts/journeys-results.json', JSON.stringify(results, null, 2));
const fails = results.filter((r) => !r.pass);
console.log(`Journeys/PWA: ${results.length - fails.length}/${results.length} passed`);
for (const f of fails) console.log('FAIL:', f.name, '|', f.note);
