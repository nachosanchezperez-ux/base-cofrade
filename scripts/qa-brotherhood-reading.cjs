// Optional QA harness: requires Playwright in the runner, not in product deps.
// Fetch replay validates TLS in Node and preserves response bodies/hydration.
const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const url = process.env.QA_URL;
  if (!url) throw new Error('Set QA_URL to the public pilot URL (including preview share parameter if protected).');
  const out = process.env.QA_OUTPUT || '/tmp/hilo-reading-qa';
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.QA_CHROMIUM,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--no-zygote', '--single-process', '--disable-gpu'],
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
  const cache = new Map();
  let authCookie = '';
  await context.route('**/*', async (route) => {
    const request = route.request();
    if (request.method() !== 'GET') return route.abort();
    const key = request.url() + '|' + (request.headers().rsc || '');
    try {
      let response = cache.get(key);
      if (!response) {
        const headers = { ...request.headers() };
        delete headers.host;
        delete headers['accept-encoding'];
        let fetchUrl = request.url();
        let fetched;
        for (let hop = 0; hop < 6; hop++) {
          if (authCookie && fetchUrl.includes('vercel.app')) headers.cookie = authCookie;
          fetched = await fetch(fetchUrl, { headers, redirect: 'manual', signal: AbortSignal.timeout(60000) });
          const cookies = fetched.headers.getSetCookie();
          if (cookies.length && fetchUrl.includes('vercel.app')) authCookie = cookies.map(c => c.split(';')[0]).join('; ');
          const location = fetched.headers.get('location');
          if (fetched.status >= 300 && fetched.status < 400 && location) {
            fetchUrl = new URL(location, fetchUrl).href;
          } else break;
        }
        const headersOut = Object.fromEntries(fetched.headers);
        for (const name of ['content-encoding', 'content-length', 'transfer-encoding', 'set-cookie']) delete headersOut[name];
        response = { status: fetched.status, headers: headersOut, body: Buffer.from(await fetched.arrayBuffer()) };
        cache.set(key, response);
        if (request.isNavigationRequest()) fs.writeFileSync(`${out}/${new URL(fetchUrl).pathname.split('/').pop()}.html`, response.body);
      }
      await route.fulfill(response);
    } catch (error) {
      console.error('Fetch failed:', new URL(request.url()).pathname, error.message);
      await route.abort();
    }
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  assert.equal(response.status(), 200);
  try { await page.getByRole('button', { name: 'Rechazar', exact: true }).click({ timeout: 1000 }); } catch {}
  await page.evaluate(() => document.fonts.ready);
  const rows = [];
  for (const width of [390, 430, 768, 1024, 1366, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      total: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth - innerWidth,
      hero: Math.round(document.querySelector('main section').getBoundingClientRect().height),
      titulares: Math.round(document.querySelector('#titulares').getBoundingClientRect().top + scrollY),
      historia: Math.round(document.querySelector('#historia').getBoundingClientRect().top + scrollY),
      h1: document.querySelectorAll('h1').length,
      reading: document.querySelector('.brotherhood-page').className.includes('BrotherhoodReadingLayout'),
      canonical: document.querySelector('link[rel="canonical"]').href,
      robots: document.querySelector('meta[name="robots"]').content,
      menu: [...document.querySelectorAll('[aria-label="Secciones de la ficha"] a')].map(a => a.textContent),
      history: document.querySelectorAll('#historia .history-timeline article').length,
      sources: document.querySelectorAll('#fuentes .source-row').length,
      compositions: document.querySelector('[aria-label$="composiciones documentadas"]').getAttribute('aria-label'),
      schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)['@type']),
      duplicateIds: [...document.querySelectorAll('main [id]')].map(e => e.id).filter((id, i, all) => all.indexOf(id) !== i),
    }));
    assert.equal(metrics.reading, true);
    assert.equal(metrics.overflow, 0);
    assert.equal(metrics.h1, 1);
    assert.equal(metrics.menu.length, 6);
    assert.equal(metrics.history, 15);
    assert.equal(metrics.sources, 18);
    assert.match(metrics.compositions, /^39 /);
    assert.match(metrics.robots, /^index,\s*follow$/);
    assert.equal(metrics.canonical, 'https://hilocofrade.es/hermandades/el-baratillo');
    assert.deepEqual(metrics.duplicateIds, []);
    await page.screenshot({ path: `${out}/pilot-${width}.png` });
    await page.getByRole('link', { name: 'Historia', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('[aria-current="location"]')?.textContent === 'Historia');
    const timeline = page.locator('#historia details');
    await timeline.locator('summary').click();
    assert.equal(await timeline.evaluate(e => e.open), true);
    await timeline.locator('summary').click();
    await page.getByRole('link', { name: 'Consultar salida →', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('#salidas').closest('details').open);
    await page.locator('#archivo-salidas > summary').click();
    rows.push(metrics);
    console.log('PASS', width);
  }
  const sources = page.locator('#fuentes details');
  await sources.locator('summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await sources.evaluate(e => e.open), true);
  await page.keyboard.press('Enter');
  await page.goto(new URL('/hermandades/san-esteban', url).href, { waitUntil: 'networkidle', timeout: 120000 });
  const control = await page.evaluate(() => ({
    reading: document.querySelector('.brotherhood-page').className.includes('BrotherhoodReadingLayout'),
    h1: document.querySelectorAll('h1').length,
    canonical: document.querySelector('link[rel="canonical"]').href,
    robots: document.querySelector('meta[name="robots"]').content,
  }));
  assert.equal(control.reading, false);
  assert.equal(control.h1, 1);
  assert.equal(control.canonical, 'https://hilocofrade.es/hermandades/san-esteban');
  assert.match(control.robots, /^index,\s*follow$/);
  assert.deepEqual(errors, []);
  fs.writeFileSync(`${out}/matrix.json`, JSON.stringify({ method: 'Chromium HTTPS-response replay with verified Node TLS', rows, control, keyboardSources: true, errors }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
