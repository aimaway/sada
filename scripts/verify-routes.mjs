// Phase 10/11/12 runtime verification: renders the production build in headless Chromium,
// logs in through each role's real UI flow, visits every route from scripts/routes.json,
// checks console errors + horizontal overflow, and captures desktop/mobile screenshots.
import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.env.BASE_URL || 'http://localhost:4173';
const routes = JSON.parse(fs.readFileSync('scripts/routes.json', 'utf8'));

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

async function login(page, role) {
  if (role === 'customer') {
    await page.goto(`${BASE}/customer/login`, { waitUntil: 'networkidle' });
    await page.fill('input[type="tel"]', '600000010');
    await page.getByText('Envoyer le code').click();
    await page.fill('input[type="text"].tracking-widest', '123456');
    await page.getByText('Vérifier').click();
    await page.waitForURL(/\/customer\//, { timeout: 8000 });
  } else if (role === 'mechanic') {
    await page.goto(`${BASE}/mechanic/login`, { waitUntil: 'networkidle' });
    await page.fill('input[type="tel"]', '600000001');
    await page.getByText('Envoyer le code').click();
    await page.fill('input[type="text"].tracking-widest', '123456');
    await page.getByText('Vérifier').click();
    await page.waitForURL(/\/mechanic\//, { timeout: 8000 });
  } else if (role === 'seller') {
    await page.goto(`${BASE}/seller/login`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Se connecter/i }).first().click();
    await page.waitForURL(/\/seller\//, { timeout: 8000 });
  } else if (role === 'tuner') {
    await page.goto(`${BASE}/tuner/login`, { waitUntil: 'networkidle' });
    await page.fill('input[type="tel"]', '0600000077');
    await page.fill('input[type="password"]', 'demo1234');
    await page.getByRole('button', { name: /Se connecter/i }).first().click();
    await page.waitForURL(/\/tuner\//, { timeout: 8000 });
  } else if (role === 'admin') {
    await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /Connexion Admin/i }).first().click();
    await page.waitForURL(/\/admin\//, { timeout: 8000 });
  }
}

function concretePath(p) {
  return p
    .replace(':id', 'r1')
    .replace(':slug', 'demo-slug')
    .replace(':token', 'demo-token');
}

const results = [];
const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  let currentRole = null;

  for (const r of routes) {
    if (r.redirect) continue; // <Navigate/> redirects — verified once via target
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    try {
      if (r.role !== 'public' && r.role !== currentRole) {
        await login(page, r.role);
        currentRole = r.role;
      } else if (r.role === 'public') {
        currentRole = null;
      }
      const path = concretePath(r.path);
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(700); // allow animations/hydration
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const bodyLen = await page.evaluate(() => document.body.innerText.trim().length);
      const crashed = bodyLen < 30 || errors.some((e) => /Minified React error|Uncaught/.test(e));
      const shot = `shots/${vp.name}-${path.replace(/[^a-z0-9]+/gi, '_')}.png`;
      await page.screenshot({ path: shot });
      results.push({ vp: vp.name, path: r.path, role: r.role, shell: r.shell, overflowPx: overflow, ok: !crashed && overflow <= 2, consoleErrors: errors.slice(0, 3), screenshot: shot });
    } catch (e) {
      results.push({ vp: vp.name, path: r.path, role: r.role, shell: r.shell, ok: false, error: String(e).slice(0, 160) });
    } finally {
      await page.close();
    }
  }
  await ctx.close();
}

await browser.close();
fs.writeFileSync('scripts/verify-results.json', JSON.stringify(results, null, 2));
const fails = results.filter((x) => !x.ok);
console.log(`Checked ${results.length} route x viewport combos. PASS: ${results.length - fails.length}, FAIL: ${fails.length}`);
for (const f of fails) console.log('FAIL', f.vp, f.path, f.error || `overflow=${f.overflowPx}px err=${(f.consoleErrors || []).join('|').slice(0, 120)}`);
