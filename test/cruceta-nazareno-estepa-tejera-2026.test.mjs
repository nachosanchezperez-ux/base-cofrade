import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(new URL(
  '../supabase/migrations_archive/post-first-edition-editorial/20261103220000_publica_cruceta_nazareno_estepa_tejera_2026.sql',
  import.meta.url,
), 'utf8')

test('publica la cruceta del Nazareno de Estepa con 21 obras sin inventar orden', () => {
  assert.match(migration, /jesus-nazareno-estepa-maestro-tejera-2026/)
  assert.match(migration, /<> 21/)
  assert.match(migration, /sum\(performance_count\).*<> 21/s)
  assert.match(migration, /la disposición de la lámina no se presenta como orden procesional/i)
})

test('conserva la intervención parcial de Tejera en el regreso', () => {
  assert.match(migration, /'segment'/)
  assert.match(migration, /Cementerio Municipal de Estepa/)
  assert.match(migration, /San Sebastián/)
  assert.match(migration, /Tras el paso de Nuestro Padre Jesús Nazareno en el regreso/)
})

test('resuelve los homónimos con su autor correcto', () => {
  assert.match(migration, /cristo-buena-muerte-jose-albero/)
  assert.match(migration, /piedad-eduardo-lopez-juarranz/)
  assert.match(migration, /virgen-angustias-enrique-baez/)
  assert.match(migration, /nuestra-senora-montserrat-pedro-brana/)
  assert.doesNotMatch(migration, /marcha-cristo-de-la-buena-muerte'/)
})

test('documenta la fuente directa y la paleta de la lámina', () => {
  assert.match(migration, /Repertorio musical · Jesús Nazareno de Estepa 2026/)
  assert.match(migration, /'#5A3D68','#C9B38A','published'/)
})
