import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const migration = await readFile(
  new URL('../supabase/migrations/20260907032000_cierra_pasion_y_muerte.sql', import.meta.url),
  'utf8',
)

test('Pasión y Muerte se cierra con DML editorial y sin tocar arquitectura', () => {
  assert.doesNotMatch(migration, /create\s+(table|policy|index)|alter\s+table|enable\s+row\s+level\s+security/i)
  assert.match(migration, /completion <> 100/)
  assert.match(migration, /Los ocho cultos recurrentes no quedaron publicados/)
  assert.match(migration, /Las tres salidas documentadas no quedaron publicadas/)
})

test('la Resurrección se modela como titular no visual sin fabricar multimedia', () => {
  assert.match(migration, /resurreccion-nuestro-senor-pasion-y-muerte-sevilla/)
  assert.match(migration, /Titularidad no representada por una imagen de talla/)
  assert.doesNotMatch(migration, /insert into public\.(brotherhood_images|media_assets)/i)
})

test('Penitencia, Gloria y Rosario permanecen como series diferentes', () => {
  assert.match(migration, /Estación de penitencia del Viernes de Dolores/)
  assert.match(migration, /Salida procesional de Santa María del Buen Aire/)
  assert.match(migration, /Rosario público de Nuestra Señora del Desconsuelo y Visitación/)
  assert.match(migration, /Las tres salidas habituales no quedaron separadas/)
})

test('la Gloria futura conserva estado anunciado y no inventa itinerario', () => {
  assert.match(migration, /date '2026-09-26'[\s\S]*?'announced','published'/)
  assert.match(migration, /el recorrido concreto queda pendiente de publicación oficial/)
  assert.match(migration, /outing_date>date '2026-09-06' and event_status='held'/)
})

test('la relación madrina se documenta sin forzar la publicación de la Estrella', () => {
  assert.match(migration, /el nodo canónico de la Hermandad de la Estrella siga en draft/)
  assert.doesNotMatch(migration, /set status='published',[\s\S]*?godmother_brotherhood/)
  assert.match(migration, /La relación con la Hermandad madrina no quedó documentada/)
})
