// Optional QA harness: requires Playwright in the runner, not in product deps.
// Fetch replay validates TLS in Node and preserves response bodies/hydration.
const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');

const expectedCanonical = process.env.QA_CANONICAL || 'https://hilocofrade.es/hermandades/el-baratillo';
const expectedHistory = Number(process.env.QA_HISTORY || '15');
const expectedSources = Number(process.env.QA_SOURCES || '18');
const expectedCompositions = process.env.QA_COMPOSITIONS || '39';
const controlPath = process.env.QA_CONTROL_PATH || '/hermandades/hermandad-del-gran-poder-sevilla';
const controlCanonical = process.env.QA_CONTROL_CANONICAL || 'https://hilocofrade.es/hermandades/hermandad-del-gran-poder-sevilla';

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
    assert.equal(metrics.history, expectedHistory);
    assert.equal(metrics.sources, expectedSources);
    assert.match(metrics.compositions, new RegExp(`^${expectedCompositions} `));
    assert.match(metrics.robots, /^index,\s*follow$/);
    assert.equal(metrics.canonical, expectedCanonical);
    assert.deepEqual(metrics.duplicateIds, []);
    await page.screenshot({ path: `${out}/pilot-${width}.png` });
    if (process.env.QA_MUSIC_FLOW === '1') {
      const music = page.locator('#musica');
      const heritage = page.locator('#patrimonio-musical');
      assert.equal(await music.locator('#acompanamiento-musical a[class*="__item"]').count(), 3);
      assert.equal(await music.locator('#acompanamiento-musical a[class*="__item"]').first().evaluate(e => getComputedStyle(e).borderRadius), '0px');
      assert.equal(await music.locator('#acompanamiento-musical [class*="__groups"]').evaluate(e => getComputedStyle(e).boxShadow), 'none');
      assert.equal(await heritage.locator('[class*="__groups"]').evaluate(e => getComputedStyle(e).boxShadow), 'none');
      assert.equal(await heritage.locator('details').first().evaluate(e => e.open), true);
      for (const image of await music.locator('#acompanamiento-musical img').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(e => e.decode());
      }
      await music.scrollIntoViewIfNeeded();
      if ([390, 1366].includes(width)) await music.screenshot({ path: `${out}/music-${width}.png` });
      const style = heritage.locator('details details').first();
      await style.locator(':scope > summary').focus();
      await page.keyboard.press('Enter');
      assert.equal(await style.evaluate(e => e.open), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0);
      assert.equal(await heritage.locator('article').count(), 39);
      if ([390, 1366].includes(width)) {
        await style.locator('article').first().scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${out}/catalog-${width}.png` });
      }
      await style.locator(':scope > summary').focus();
      await page.keyboard.press('Enter');
      assert.equal(await style.evaluate(e => e.open), false);
    }
    if (process.env.QA_CONTENT_AUDIT === '1') {
      const official = page.locator('main section p[class*="__official"]');
      assert.match(await official.innerText(), /Antigua y Fervorosa Hermandad/);
      assert.equal(await official.isVisible(), true);
      const dressers = page.locator('#resumen details').filter({ has: page.locator('summary', { hasText: 'Vestidor actual · 1' }) });
      await dressers.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.equal(await dressers.getByText('José Antonio Grande de León', { exact: true }).count(), 1);
      assert.equal(await dressers.locator('a[href^="/imagenes/"]').count(), 2);
      assert.equal((await dressers.innerText()).includes('Desde Vigente'), false);
      await dressers.screenshot({ path: `${out}/dressers-${width}.png` });
      await dressers.locator('summary').click();
      const seat = page.locator('#resumen details').filter({ has: page.locator('summary', { hasText: 'Sede y horarios' }) });
      await seat.locator('summary').click();
      assert.equal((await seat.innerText()).includes('Salida habitual'), false);
      await seat.locator('summary').click();
      const habit = page.locator('details').filter({ has: page.locator('#tunica') });
      await habit.locator(':scope > summary').click();
      assert.equal(await page.locator('#tunica').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(255, 255, 255)');
      assert.equal(await page.locator('#tunica .habit-card').count(), 2);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0);
      assert.equal(await page.locator('#tunica h2').evaluate(e => getComputedStyle(e).color), 'rgb(35, 39, 44)');
      assert.equal(await page.locator('#tunica dd').first().evaluate(e => getComputedStyle(e).color), 'rgb(35, 39, 44)');
      for (const image of await page.locator('#tunica img').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(e => e.decode());
      }
      await page.locator('#tunica h2').scrollIntoViewIfNeeded();
      await page.locator('#tunica h2').click();
      await page.locator('#tunica').screenshot({ path: `${out}/habit-${width}.png` });
      await habit.locator(':scope > summary').click();
      const archive = page.locator('#archivo-salidas');
      await archive.locator(':scope > summary').click();
      assert.equal((await archive.innerText()).includes('Próximas extraordinarias'), false);
      await archive.locator(':scope > summary').click();
    }
    await page.getByRole('link', { name: 'Historia', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('[aria-current="location"]')?.textContent === 'Historia');
    const timeline = page.locator('#historia details');
    if (await timeline.count()) {
      await timeline.locator('summary').click();
      assert.equal(await timeline.evaluate(e => e.open), true);
      await timeline.locator('summary').click();
    } else {
      assert.ok(metrics.history <= 5);
    }
    const outingLink = page.getByRole('link', { name: 'Consultar salida →', exact: true });
    if (await outingLink.count()) {
      await outingLink.click();
      await page.waitForFunction(() => document.querySelector('#salidas').closest('details').open);
      const archive = page.locator('#archivo-salidas > summary');
      if (await archive.count()) await archive.click();
    }
    rows.push(metrics);
    console.log('PASS', width);
  }
  const sources = page.locator('#fuentes details');
  await sources.locator('summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await sources.evaluate(e => e.open), true);
  await page.keyboard.press('Enter');
  await page.goto(new URL(controlPath, url).href, { waitUntil: 'networkidle', timeout: 120000 });
  const control = await page.evaluate(() => ({
    reading: document.querySelector('.brotherhood-page').className.includes('BrotherhoodReadingLayout'),
    h1: document.querySelectorAll('h1').length,
    canonical: document.querySelector('link[rel="canonical"]').href,
    robots: document.querySelector('meta[name="robots"]').content,
  }));
  assert.equal(control.reading, false);
  assert.equal(control.h1, 1);
  assert.equal(control.canonical, controlCanonical);
  assert.match(control.robots, /^index,\s*follow$/);
  assert.deepEqual(errors, []);
  fs.writeFileSync(`${out}/matrix.json`, JSON.stringify({ method: 'Chromium HTTPS-response replay with verified Node TLS', rows, control, keyboardSources: true, errors }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
