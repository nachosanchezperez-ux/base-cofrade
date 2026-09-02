import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync(new URL('../app/bandas/[slug]/page.js', import.meta.url), 'utf8')
const rail = readFileSync(new URL('../app/bandas/[slug]/HistoricalAccompanimentsRail.js', import.meta.url), 'utf8')
const migration = readFileSync(new URL('../supabase/migrations/20260902090401_normaliza_textos_historicos_bandas.sql', import.meta.url), 'utf8')

test('la microcopia del histórico habla de trayectoria y etapas', () => {
  assert.match(page, /Un recorrido por las hermandades y los pasos que forman parte de su trayectoria\./)
  assert.doesNotMatch(page, /relaciones documentadas para explorar/)
  assert.match(rail, /De la etapa más reciente a la más antigua/)
})

test('la tarjeta no repite la posición cuando actúa como identidad visible', () => {
  assert.match(page, /const stepIdentity = step\.name \|\| item\.position \|\| 'Acompañamiento musical'/)
  assert.match(page, /step\.position && step\.position !== stepIdentity/)
  assert.doesNotMatch(page, /\{step\.position \? <small>\{step\.position\}<\/small> : null\}/)
})

test('las observaciones públicas eliminan fórmulas internas y notas puramente redundantes', () => {
  assert.match(migration, /v_expected integer := 34/)
  assert.match(migration, /null::text/)
  assert.doesNotMatch(migration, /responsable editorial de Hilo Cofrade/i)
  assert.doesNotMatch(migration, /Fuente oficial de la banda/i)
  assert.doesNotMatch(migration, /Contrato documentado para la Semana Santa/i)
})
