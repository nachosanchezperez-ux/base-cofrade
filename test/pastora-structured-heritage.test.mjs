import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('los Simpecados usan patrimonio y nombres genéricos reutilizables', async () => {
  const migration = await source('supabase/migrations/20260824002000_structured_simpecados_and_musical_work_types.sql')

  assert.match(migration, /create table if not exists public\.entity_names/)
  assert.match(migration, /alter table public\.heritage_assets\s+add column if not exists usage_text text/)
  assert.doesNotMatch(migration, /create table[^;]*pastora_simpecados/i)

  for (const slug of [
    'simpecado-primitivo-pastora-cantillana',
    'simpecado-blanco-gala-pastora-cantillana',
    'simpecado-grana-rojo-pastora-cantillana',
    'simpecado-verde-peregrino-pastora-cantillana',
    'simpecado-azul-iii-centenario-pastora-cantillana',
  ]) {
    assert.match(migration, new RegExp(slug))
  }

  assert.match(migration, /heritage_interventions/)
  assert.match(migration, /entity_relations/)
  assert.match(migration, /source_links/)
})

test('la tipología musical separa naturaleza de estilo y mantiene relaciones del grafo', async () => {
  const migration = await source('supabase/migrations/20260824002000_structured_simpecados_and_musical_work_types.sql')

  assert.match(migration, /add column if not exists work_type text/)
  for (const type of ['Marcha procesional', 'Himno', 'Copla', 'Adaptación']) {
    assert.match(migration, new RegExp(type))
  }
  assert.match(migration, /march_authors/)
  assert.match(migration, /march_dedications/)
  assert.match(migration, /target\.slug in \('pastora-de-cantillana','divina-pastora-de-las-almas-de-cantillana'\)/)
  assert.match(migration, /premiered_by_band_entity_id/)
  assert.match(migration, /composed_for_band/)
  assert.match(migration, /adaptation_of/)
})

test('el patrimonio musical ordena por año ascendente y muestra Año Título Compositor Estilo', async () => {
  const loader = await source('lib/supabase/brotherhood-musical-heritage.js')
  const component = await source('components/BrotherhoodMusicalHeritage.js')

  assert.match(loader, /composition_year, composition_date_text, work_type, music_type/)
  assert.match(loader, /return yearA - yearB/)
  assert.match(loader, /if \(knownA\) return -1/)
  assert.match(loader, /if \(knownB\) return 1/)

  for (const label of ['Año', 'Título', 'Compositor', 'Estilo']) {
    assert.match(component, new RegExp(label))
  }
  for (const type of ['Marcha procesional', 'Himno', 'Copla', 'Adaptación']) {
    assert.match(component, new RegExp(type))
  }
})

test('las fechas discutidas quedan abiertas en vez de inventarse', async () => {
  const migration = await source('supabase/migrations/20260824002000_structured_simpecados_and_musical_work_types.sql')

  assert.match(migration, /Documentada en grabación de 1996 · fecha de composición por confirmar/)
  assert.match(migration, /La grabación oficial de 1996 acredita existencia, no año de composición/)
  assert.match(migration, /Año por documentar/)
  assert.match(migration, /Encargado en 1805 · estrenado en 1806/)
})

test('la fuente del estreno de Salve Pastora queda versionada sin alterar la fecha de composición', async () => {
  const migration = await source('supabase/migrations/20260824002500_source_salve_pastora_premiere.sql')

  assert.match(migration, /Cantillana y su Pastora/)
  assert.match(migration, /2013-09-08|8 de septiembre de 2013|8 de septiembre de 2013|8 de septiembre/i)
  assert.match(migration, /Patrimonio musical · estreno/)
  assert.doesNotMatch(migration, /update public\.marches[\s\S]*composition_year/i)
})
