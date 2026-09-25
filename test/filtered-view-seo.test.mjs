import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { filteredViewRobots } from '../lib/seo.js'

async function read(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las URLs limpias conservan indexación normal', () => {
  assert.equal(filteredViewRobots(undefined), undefined)
  assert.equal(filteredViewRobots({}), undefined)
  assert.equal(filteredViewRobots(new URLSearchParams()), undefined)
})

test('las vistas con parámetros quedan noindex, follow', () => {
  assert.deepEqual(filteredViewRobots({ categoria: 'processions' }), { index: false, follow: true })
  assert.deepEqual(filteredViewRobots({ localidad: 'cadiz', tipo: 'cornetas' }), { index: false, follow: true })
  assert.deepEqual(filteredViewRobots(new URLSearchParams('q=macarena')), { index: false, follow: true })
})

test('Agenda, Bandas y Directorio aplican el contrato a sus filtros', async () => {
  for (const path of ['app/agenda-cofrade/page.js', 'app/bandas/page.js', 'app/directorio/page.js']) {
    const source = await read(path)
    assert.match(source, /generateMetadata\(\{ searchParams \}/)
    assert.match(source, /filteredViewRobots/)
    assert.match(source, /robots/)
  }
})
