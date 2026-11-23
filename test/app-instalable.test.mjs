// App instalable (24/11/2026): manifiesto, iPhone y aviso «Añadir a inicio».
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import manifest from '../app/manifest.js'
import { INSTALL_SNOOZE_DAYS, installPromptVariant, isIosSafari } from '../lib/install-prompt.js'

const IPHONE_SAFARI = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
const IPHONE_CHROME = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0 Mobile/15E148 Safari/604.1'
const IPHONE_INSTAGRAM = `${IPHONE_SAFARI} Instagram 350.0`

test('manifiesto: identidad estable, iconos adaptables y accesos directos reales', () => {
  const data = manifest()
  assert.equal(data.id, '/')
  assert.equal(data.display, 'standalone')
  assert.equal(data.lang, 'es')
  assert.match(data.description, /central de datos/)
  const maskable = data.icons.filter((icon) => icon.purpose === 'maskable')
  assert.deepEqual(maskable.map((icon) => icon.sizes), ['192x192', '512x512'])
  for (const icon of data.icons) assert.ok(statSync(new URL(`../public${icon.src}`, import.meta.url)).size > 0)
  assert.deepEqual(data.shortcuts.map((item) => item.url), ['/agenda-cofrade/hoy', '/semana-santa-sevilla-2027', '/igualas-y-ensayos', '/hermandades'])
})

test('iPhone: a pantalla completa con su nombre', () => {
  const layout = readFileSync(new URL('../app/layout.js', import.meta.url), 'utf8')
  assert.match(layout, /appleWebApp: \{ capable: true, title: 'Hilo Cofrade'/)
  assert.match(layout, /<HiloInstallPrompt \/>/)
})

test('solo Safari de iPhone recibe las instrucciones de iOS', () => {
  assert.equal(isIosSafari(IPHONE_SAFARI), true)
  assert.equal(isIosSafari(IPHONE_CHROME), false)
  assert.equal(isIosSafari(IPHONE_INSTAGRAM), false)
  assert.equal(isIosSafari('Mozilla/5.0 (Linux; Android 14) Chrome/131 Mobile Safari/537.36'), false)
})

test('aviso: desde la segunda visita, nunca dentro de la app ni en el Panel, 30 días de silencio', () => {
  const now = Date.parse('2026-11-24T10:00:00Z')
  const base = { state: { visits: 2 }, pathname: '/', userAgent: IPHONE_SAFARI, now }
  assert.equal(installPromptVariant(base), 'ios')
  assert.equal(installPromptVariant({ ...base, state: { visits: 1 } }), null)
  assert.equal(installPromptVariant({ ...base, standalone: true }), null)
  assert.equal(installPromptVariant({ ...base, pathname: '/panel/hoy' }), null)
  assert.equal(installPromptVariant({ ...base, state: { visits: 5, dismissedAt: now - 86400000 } }), null)
  assert.equal(installPromptVariant({ ...base, state: { visits: 5, dismissedAt: now - (INSTALL_SNOOZE_DAYS + 1) * 86400000 } }), 'ios')
  assert.equal(installPromptVariant({ ...base, userAgent: 'Android Chrome', hasNativePrompt: true }), 'native')
  assert.equal(installPromptVariant({ ...base, userAgent: 'Android Firefox' }), null)
})
