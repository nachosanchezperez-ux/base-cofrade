import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { filteredViewRobots } from '../lib/seo.js'

async function read(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las URLs limpias y los parámetros técnicos conservan indexación normal', () => {
  const agendaFilters = ['categoria', 'periodo', 'territorio', 'municipio']
  assert.equal(filteredViewRobots(undefined, agendaFilters), undefined)
  assert.equal(filteredViewRobots({}, agendaFilters), undefined)
  assert.equal(filteredViewRobots(new URLSearchParams(), agendaFilters), undefined)
  assert.equal(filteredViewRobots({ _vercel_share: 'token' }, agendaFilters), undefined)
  assert.equal(filteredViewRobots({ utm_source: 'social' }, agendaFilters), undefined)
})

test('solo los filtros funcionales dejan la vista noindex, follow', () => {
  assert.deepEqual(
    filteredViewRobots({ categoria: 'processions', _vercel_share: 'token' }, ['categoria', 'periodo']),
    { index: false, follow: true }
  )
  assert.deepEqual(
    filteredViewRobots({ localidad: 'cadiz', tipo: 'cornetas' }, ['tipo', 'localidad']),
    { index: false, follow: true }
  )
  assert.deepEqual(
    filteredViewRobots(new URLSearchParams('q=macarena&utm_source=test'), ['q', 'tipo']),
    { index: false, follow: true }
  )
})

test('Agenda, Bandas y Directorio aplican el contrato a sus filtros', async () => {
  for (const path of ['app/agenda-cofrade/page.js', 'app/bandas/page.js', 'app/directorio/page.js']) {
    const source = await read(path)
    assert.match(source, /generateMetadata\(\{ searchParams \}/)
    assert.match(source, /filteredViewRobots/)
    assert.match(source, /robots/)
  }
})
