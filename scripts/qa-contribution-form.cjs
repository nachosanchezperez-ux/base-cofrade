// Optional browser QA against the real local build. Requires Playwright in
// the runner and QA_CHROMIUM; neither is added to product dependencies.
// Receipt is forced closed and privileged credentials are cleared.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { createServer } = require('node:net');
const { once } = require('node:events');
const { chromium } = require('playwright');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  assert.ok(process.env.QA_CHROMIUM, 'Set QA_CHROMIUM to the installed browser executable');
  const out = process.env.QA_OUTPUT || '/tmp/hilo-contribution-qa';
  fs.mkdirSync(out, { recursive: true });
  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const origin = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    env: { ...process.env, VERCEL_ENV: 'preview', PUBLIC_CONTRIBUTIONS_ENABLED: 'false', CONTRIBUTION_RETENTION_ENABLED: 'false',
      SUPABASE_SECRET_KEY: '', SUPABASE_SERVICE_ROLE_KEY: '', CONTRIBUTION_FORM_SECRET: '', TURNSTILE_SECRET_KEY: '', NEXT_PUBLIC_TURNSTILE_SITE_KEY: '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.resume(); child.stderr.resume();
  let exited = false;
  const completion = new Promise(resolve => {
    child.once('error', () => { exited = true; resolve(); });
    child.once('exit', () => { exited = true; resolve(); });
  });
  let browser;
  try {
    let ready = false;
    const deadline = Date.now() + 25_000;
    while (!exited && Date.now() < deadline) {
      try { const r = await fetch(`${origin}/api/cron/contributions-retention`, { signal: AbortSignal.timeout(2000) }); await r.arrayBuffer(); ready = true; break; }
      catch { await delay(100); }
    }
    assert.ok(ready, 'Compiled server ready');
    browser = await chromium.launch({ executablePath: process.env.QA_CHROMIUM, headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--no-zygote', '--single-process', '--disable-gpu', '--disable-software-rasterizer', '--disable-webgl', '--use-gl=disabled', '--disable-features=IsolateOrigins,site-per-process,AudioServiceOutOfProcess'] });
    const context = await browser.newContext({ viewport: { width: 390, height: 900 }, locale: 'es-ES' });
    const external = new Set();
    await context.route('**/*', route => {
      if (new URL(route.request().url()).origin === origin) return route.continue();
      external.add(new URL(route.request().url()).hostname);
      return route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(`${origin}/colabora`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    try { await page.getByRole('button', { name: 'Rechazar', exact: true }).click({ timeout: 1000 }); } catch {}
    await page.evaluate(() => document.fonts.ready);
    assert.match(await page.locator('meta[name="robots"]').getAttribute('content'), /^noindex/);
    const submit = page.locator('form button[type="submit"]');
    assert.equal(await submit.isDisabled(), true);
    const field = name => page.locator(`form [name="${name}"]`);
    const choose = kind => page.locator(`input[name="contribution_kind"][value="${kind}"]`).check();
    const kinds = ['correction', 'agenda', 'music', 'media', 'suggestion'];
    const rows = [];
    await field('title').fill('Prueba local de conservación del texto');
    await field('description').fill('Descripción sintética para revisar el formulario cerrado sin registrar aportaciones reales.');
    for (const width of [320, 390, 430, 768, 1024, 1366, 1600]) {
      await page.setViewportSize({ width, height: 900 });
      for (const kind of kinds) {
        await choose(kind);
        assert.equal(await field('title').inputValue(), 'Prueba local de conservación del texto');
        assert.equal(await field('contribution_type').inputValue(), ({ correction: 'correction', agenda: 'new_record', music: 'new_record', media: 'media', suggestion: 'suggestion' })[kind]);
        assert.equal(await field('page_url').evaluate(e => e.required), kind === 'correction');
        assert.equal(await field('event_date').count(), kind === 'agenda' ? 1 : 0);
        assert.equal(await field('music_topic').count(), kind === 'music' ? 1 : 0);
        const metrics = await page.evaluate(() => {
          const controls = [...document.querySelectorAll('form input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]),form textarea,form select')]
            .filter(e => e.name !== 'website');
          return { overflow: document.documentElement.scrollWidth - innerWidth,
            escapedControls: controls.filter(e => { const r = e.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1; }).map(e => e.name),
            minControlFont: Math.min(...controls.map(e => parseFloat(getComputedStyle(e).fontSize))),
            minControlHeight: Math.min(...controls.map(e => e.getBoundingClientRect().height)),
            h1: document.querySelectorAll('h1').length };
        });
        assert.equal(metrics.overflow, 0, `${width}/${kind} no horizontal overflow`);
        assert.deepEqual(metrics.escapedControls, [], `${width}/${kind} contained controls`);
        assert.ok(metrics.minControlFont >= 16, `${width}/${kind} legible controls`);
        assert.ok(metrics.minControlHeight >= 44, `${width}/${kind} control target height`);
        assert.equal(metrics.h1, 1);
        rows.push({ width, kind, ...metrics });
        if ([320, 390, 768, 1366, 1600].includes(width) && ['correction', 'agenda', 'music'].includes(kind)) {
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          await page.screenshot({ path: path.join(out, `${kind}-${width}.png`), fullPage: true });
        }
      }
      console.log('PASS responsive', width);
    }
    await page.setViewportSize({ width: 390, height: 900 });
    await choose('suggestion');
    await field('contribution_kind').last().focus();
    await page.keyboard.press('ArrowUp');
    assert.equal(await page.locator('input[name="contribution_kind"][value="media"]').isChecked(), true);
    assert.equal(await page.evaluate(() => document.activeElement.value), 'media');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.name), 'title');
    await choose('agenda');
    await field('related_entity').fill('Entidad sintética de QA');
    await field('event_date').fill('2026-10-04');
    await field('event_place').fill('Lugar de prueba');
    await field('event_locality').fill('Municipio de prueba');
    await choose('music');
    await field('music_topic').selectOption('discography');
    await field('music_year').fill('2026');
    await choose('agenda');
    assert.equal(await field('event_place').inputValue(), 'Lugar de prueba');
    await choose('music');
    assert.equal(await field('music_topic').inputValue(), 'discography');
    await choose('suggestion');
    const files = field('attachments');
    const fileFeedback = page.locator('label:has(input[name="attachments"]) [role="status"]');
    assert.equal(await fileFeedback.getAttribute('aria-live'), 'polite');
    assert.equal(await fileFeedback.getAttribute('aria-atomic'), 'true');
    const small = { name: 'fixture.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.7\nsynthetic client-only fixture') };
    await files.setInputFiles([small, small, small, small]);
    assert.equal(await files.evaluate(e => e.files.length), 0);
    assert.ok(await page.getByText('Selecciona como máximo tres archivos.', { exact: true }).isVisible());
    await files.setInputFiles({ name: 'fixture.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') });
    assert.equal(await files.evaluate(e => e.files.length), 0);
    assert.ok(await page.getByText('Solo se admiten archivos JPG, PNG, WebP o PDF.', { exact: true }).isVisible());
    await files.setInputFiles({ name: 'large.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(8 * 1024 * 1024 + 1) });
    assert.equal(await files.evaluate(e => e.files.length), 0);
    assert.ok(await page.getByText('Cada archivo puede ocupar como máximo 8 MB.', { exact: true }).isVisible());
    await files.setInputFiles([1, 2].map(i => ({ name: `${i}.pdf`, mimeType: 'application/pdf', buffer: Buffer.alloc(6 * 1024 * 1024) })));
    assert.equal(await files.evaluate(e => e.files.length), 0);
    assert.ok(await page.getByText('Los archivos pueden ocupar como máximo 10 MB en total.', { exact: true }).isVisible());
    await files.setInputFiles({ name: 'fixture.png', mimeType: 'image/png', buffer: Buffer.from('synthetic client-only fixture') });
    assert.equal(await field('photo_credit').evaluate(e => e.required), true);
    assert.equal(await field('rights_confirmed').evaluate(e => e.required), true);
    await field('photo_credit').fill('Autoría sintética');
    await field('rights_confirmed').check();
    await field('privacy_consent').check();
    await files.scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, 'attachments-390.png') });
    // Probe only localhost's real disabled server action. Programmatic submit
    // verifies the server gate even when a client ignores its disabled button.
    assert.ok(await page.locator('form').evaluate(e => e.checkValidity()));
    const actionResponse = page.waitForResponse(r => r.request().method() === 'POST' && r.url().startsWith(origin));
    await page.locator('form').evaluate(e => e.requestSubmit());
    await actionResponse;
    await page.locator('[aria-labelledby="titulo-formulario"] [role="alert"]').waitFor({ state: 'visible' });
    await page.waitForFunction(() => document.activeElement?.getAttribute('role') === 'alert');
    await page.waitForFunction(() => {
      const box = document.activeElement.getBoundingClientRect();
      return box.top >= 72 && box.bottom <= innerHeight;
    }, null, { timeout: 10000 });
    assert.equal(await field('title').inputValue(), 'Prueba local de conservación del texto');
    assert.match(await field('description').inputValue(), /Descripción sintética/);
    assert.equal(await files.evaluate(e => e.files.length), 0);
    assert.ok(await page.getByText('Si adjuntaste archivos, selecciónalos de nuevo antes de reenviar.', { exact: true }).isVisible());
    assert.equal(await submit.isDisabled(), true);
    await page.screenshot({ path: path.join(out, 'error-390.png') });
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(out, 'matrix.json'), JSON.stringify({ method: 'Local compiled Next build, real React hydration and closed server action; Chromium viewport emulation',
      rows, keyboard: true, clientFileLimits: true, draftPreserved: true, errorFocused: true, fileReselection: true,
      writes: false, successAndTurnstile: 'not tested', blockedExternalHosts: [...external], errors }, null, 2));
    console.log('PASS keyboard, conditional drafts, client file limits, closed-action error/focus/reselection');
  } finally {
    if (browser) await browser.close();
    if (!exited) child.kill('SIGTERM');
    const stopped = await Promise.race([completion.then(() => true), delay(2000).then(() => false)]);
    if (!stopped) child.kill('SIGKILL');
    await completion;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
