import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const migration = read('supabase/migrations/20261010100100_normalize_outing_type_trigger.sql')

test('un trigger normaliza el tipo de salida antes de insertar o actualizar', () => {
  assert.match(migration, /create trigger outings_normalize_outing_type/)
  assert.match(migration, /before insert or update of outing_type on public\.outings/)
})

test('el trigger fija la forma canónica de cada tipo de la lista cerrada', () => {
  for (const canonical of [
    'Estación de Penitencia',
    'Procesión de Gloria',
    'Procesión sacramental',
    'Rosario Matutino',
    'Rosario de la Aurora',
    'Rosario Vespertino',
    'Rosario Público',
    'Rosario Extraordinario',
    'Vía Crucis',
    'Vía Lucis',
  ]) {
    assert.ok(migration.includes(`'${canonical}'`), `falta ${canonical}`)
  }
  assert.match(migration, /when 'procesion extraordinaria'\s+then 'Procesión'/)
  assert.match(migration, /when 'via crucis del consejo'\s+then 'Vía Crucis'/)
})

test('al acortar una variante extraordinaria se conserva el carácter y la variante', () => {
  assert.match(migration, /key like '%extraordinari%'[\s\S]*?new\."character" := 'extraordinary'/)
  assert.match(migration, /new\.outing_subtype := variant/)
  assert.match(migration, /'del Consejo de Hermandades y Cofradías'/)
})

test('un tipo desconocido se deja tal cual en lugar de rechazarse', () => {
  assert.match(migration, /if canonical is null then\s+return new;/)
})
