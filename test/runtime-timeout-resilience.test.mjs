import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('Hoy 2.0 acota la vista relacional y conserva un fallback completo', async () => {
  const source = await read('lib/supabase/home-v2.js')

  assert.match(source, /DISCOVERY_FAST_PATH_PRIORITY = 92/)
  assert.match(source, /\.in\('activity_kind', \[\.\.\.DISCOVERY_KINDS\]\)/)
  assert.match(source, /\.gte\('priority', DISCOVERY_FAST_PATH_PRIORITY\)/)
  assert.match(source, /No se pudieron ampliar los hilos candidatos del día/)
})

test('el descubrimiento de portada evita la rama masiva entity_new', async () => {
  const source = await read('lib/supabase/home.js')

  assert.match(source, /\.in\('activity_kind', DISCOVERY_KINDS\)/)
  assert.match(source, /\.gte\('priority', DISCOVERY_FAST_PATH_PRIORITY\)/)
  assert.match(source, /No se pudo ampliar la actividad de conocimiento de la Home/)
})

test('un fallo de fuentes no convierte una hermandad publicada en 404', async () => {
  const source = await read('lib/supabase/brotherhoods.js')

  assert.match(source, /Fuentes de la hermandad omitidas temporalmente/)
  assert.match(source, /\{ attempts: 1 \}/)
  assert.match(source, /if \(local \|\| isMissingPublicSupabaseConfig\(error\)\) return local\s+throw error/)
})

test('una Gloria omite fuentes fallidas y reserva null para ausencia real', async () => {
  const source = await read('lib/supabase/glory-directory.js')

  assert.match(source, /getGloryDirectory\(\{ throwOnError: true \}\)/)
  assert.match(source, /Fuentes de la procesión de Gloria omitidas temporalmente/)
  assert.match(source, /if \(throwOnError\) throw error/)
  assert.match(source, /No se pudo cargar la ficha[\s\S]*throw error/)
})
