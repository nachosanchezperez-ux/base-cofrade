import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migrationPath = '../supabase/migrations_archive/post-first-edition-editorial/20260915230129_estabiliza_caratulas_oliva_salteras.sql'
const sql = readFileSync(new URL(migrationPath, import.meta.url), 'utf8')

const historicalTitles = [
  'Crucifixus',
  'Salteras y sus Bandas de Música',
  'Partituras de Pasión. Volumen 1',
  'Passio',
  '1913… desde Salteras',
  'Pasión. Un siglo de música',
  'Camino del Gólgota',
  'Mektub «Estaba escrito»',
  'Vera Cruz',
  'Cordero de Dios',
  'Sevilla Llora',
  'Al Cachorro',
  'Pasodobles Taurinos',
  'Sinfonía Sevillana',
  'De Triana a Sevilla',
  'Coronación',
  'Semana Santa en Triana',
]

test('las 17 carátulas históricas de La Oliva usan ediciones canónicas estables', () => {
  assert.equal(historicalTitles.length, 17)

  for (const title of historicalTitles) {
    assert.match(sql, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  }

  assert.equal((sql.match(/https:\/\/is1-ssl\.mzstatic\.com\/image\/thumb\//g) || []).length, 17)
  assert.doesNotMatch(sql, /https:\/\/laolivadesalteras\.com\/wp-content\/uploads\//)
  assert.match(sql, /v_updated_count <> 17/)
  assert.match(sql, /entity_type = 'band'/)
  assert.match(sql, /Carátula editorial · Apple Music/)
})
