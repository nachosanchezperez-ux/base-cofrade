import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { isActOnStreet } from '../lib/procession-live-status.js'

const read = (path) => readFileSync(path, 'utf8')

test('la ficha de gloria no repite hermandad, localidad, fecha y estado', () => {
  const page = read('app/procesiones-de-gloria/[slug]/page.js')
  assert.doesNotMatch(page, /<article><span>Hermandad<\/span>/)
  assert.doesNotMatch(page, /<article><span>Estado<\/span>/)
  assert.match(page, /item\.publicNotes \? \(/)
})

test('cambios 2027: el recuento no se repite en cabecera y resumen', () => {
  const page = read('app/semana-santa/2027/cambios-musicales/page.js')
  assert.doesNotMatch(page, /cambios confirmados<\/span>/)
  assert.doesNotMatch(page, /Hilo Cofrade reúne en esta guía/)
  assert.equal((page.match(/changes\.length/g) || []).filter(Boolean).length >= 2, true)
})

test('un acto en la calle se dice «En la calle», no «Hoy»', () => {
  const now = new Date('2026-10-25T18:10:00Z') // 20:10 en Madrid
  assert.equal(isActOnStreet({ date: '2026-10-25', departureTime: '17:30', returnTime: '21:40' }, now), true)
  assert.equal(isActOnStreet({ date: '2026-10-25', departureTime: '21:00', returnTime: '23:40' }, now), false)
  assert.equal(isActOnStreet({ date: '2026-10-25', departureTime: '17:30', returnTime: '' }, now), false)
  for (const page of ['app/procesiones-de-gloria/[slug]/page.js', 'app/extraordinarias/[slug]/page.js']) {
    assert.match(read(page), /isActOnStreet\(/, page)
    assert.match(read(page), /'En la calle'/, page)
  }
})
