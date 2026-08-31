import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { partitionAccompanimentsBySeason } from '../lib/bands/accompaniments.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('los acompañamientos futuros no se mezclan con la Semana Santa vigente', () => {
  const result = partitionAccompanimentsBySeason([
    { id: 'vigente', yearFrom: 2024, yearTo: 2026 },
    { id: 'futuro', yearFrom: 2027, yearTo: null },
    { id: 'finalizado', yearFrom: 2022, yearTo: 2025 },
  ], [], 2026)

  assert.deepEqual(result.current.map((item) => item.id), ['vigente'])
  assert.deepEqual(result.upcoming.map((item) => item.id), ['futuro'])
  assert.deepEqual(result.historical.map((item) => item.id), ['finalizado'])
})

test('la ficha de Banda usa lenguaje cofrade y ofrece una sección para contratos futuros', () => {
  const page = read('app/bandas/[slug]/page.js')

  assert.match(page, /Semana Santa · \{currentYear\}/)
  assert.match(page, /<h2>Acompañamientos musicales<\/h2>/)
  assert.match(page, /id="proximos-acompanamientos"/)
  assert.match(page, /Próximas vinculaciones · \{nextAccompanimentYear\}/)
  assert.doesNotMatch(page, /Temporada \{currentYear\}/)
})

test('la migración cierra Virgen de los Reyes en 2026 y abre La Encarnación en 2027', () => {
  const migration = read('supabase/migrations_archive/first-edition/20260827232524_corrige_las_vinas_virgen_reyes_encarnacion.sql')

  assert.match(migration, /year_to = 2026/)
  assert.match(migration, /is_current = false/)
  assert.match(migration, /agrupacion-musical-virgen-de-los-reyes-sevilla/)
  assert.match(migration, /agrupacion-musical-nuestra-senora-de-la-encarnacion/)
  assert.match(migration, /'Desde 2027'/)
  assert.match(migration, /'Tras el paso de misterio · tramo de vuelta'/)
})
