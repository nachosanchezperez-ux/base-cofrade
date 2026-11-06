import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la imagen para estados es vertical, valida el ID y solo usa datos publicados de la salida', () => {
  const route = read('app/salidas/[id]/estado/route.js')
  const image = read('lib/outing-story-image.js')
  assert.match(route, /\^\[0-9a-f-\]\{36\}\$/)
  assert.match(image, /estado: { width: 1080, height: 1920 }/)
  assert.match(image, /cuadrado: { width: 1080, height: 1080 }/)
  assert.match(image, /getGloryDetailByOutingId\(outingId\)/)
  assert.match(image, /© OpenStreetMap/)
})

test('los iconos de Lucide se incluyen con su licencia, sin dependencias nuevas', () => {
  const icons = read('components/icons/LucideIcons.js')
  const pkg = JSON.parse(read('package.json'))
  assert.match(icons, /Licencia ISC/)
  assert.equal(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).some((name) => /lucide|icons/i.test(name)), false)
})

test('la tarjeta de la salida ofrece calendario, imagen para estados, WhatsApp, compartir y cómo llegar', () => {
  const bar = read('components/OutingShareBar.js')
  for (const label of ['Añadir al calendario', 'Imagen para tus estados', 'WhatsApp', 'Compartir', 'Cómo llegar']) assert.match(bar, new RegExp(label))
  assert.match(bar, /navigator\.canShare\?\.\(\{ files: \[file\] \}\)/)
  assert.match(read('lib/outing-actions.js'), /storyHref: upcoming && outing\.id \? `\/salidas\/\$\{outing\.id\}\/estado` : ''/)
  for (const file of ['components/BrotherhoodChapterOuting.js', 'app/procesiones-de-gloria/[slug]/page.js']) {
    assert.match(read(file), /outingActionLinks\(/, file)
  }
})

test('cuenta atrás del día de la salida en hora de Madrid', async () => {
  const { minutesUntilDeparture, countdownLabel } = await import('../lib/procession-live-status.js')
  // 8 nov 2026, 14:45 en Madrid (13:45 UTC, horario de invierno).
  const now = new Date('2026-11-08T13:45:00Z')
  assert.equal(minutesUntilDeparture({ date: '2026-11-08', startTime: '17:00' }, now), 135)
  assert.equal(countdownLabel(135), 'Sale en 2 h 15 min')
  assert.equal(countdownLabel(15), 'Sale en 15 min')
  assert.equal(minutesUntilDeparture({ date: '2026-11-08', startTime: '12:00' }, now), null)
  assert.equal(minutesUntilDeparture({ date: '2026-11-07', startTime: '17:00' }, now), null)
})
