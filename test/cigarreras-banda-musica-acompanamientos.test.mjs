import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const migration = readFileSync(
  new URL('../supabase/migrations/20260906095500_corrige_acompanamientos_banda_musica_cigarreras.sql', import.meta.url),
  'utf8',
)

const BANDA_MUSICA_VICTORIA = 'a23934c9-93e9-4bf1-886e-d98ec170b74f'
const CORNETAS_CIGARRERAS = 'b1000000-0000-0000-0000-000000000001'
const SASTRES_PERIOD = '5ba4db18-06df-40e2-ae28-9472e5ad773d'
const LUZ_PERIOD = '7730fc5e-03a7-4929-b362-ab420c49641a'

test('Sastres y la Luz pertenecen a la Banda de Música María Santísima de la Victoria', () => {
  assert.match(migration, new RegExp(`band_entity_id = '${BANDA_MUSICA_VICTORIA}'`))
  assert.match(migration, new RegExp(SASTRES_PERIOD))
  assert.match(migration, new RegExp(LUZ_PERIOD))
})

test('la corrección solo actúa sobre relaciones que sigan atribuidas a Cornetas Las Cigarreras', () => {
  assert.match(migration, new RegExp(`and band_entity_id = '${CORNETAS_CIGARRERAS}'`))
  assert.match(migration, /Banda de Música María Santísima de la Victoria/)
})
