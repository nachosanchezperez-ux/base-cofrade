import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

import {
  foundationChronologyKey,
  setReasoningV8Intent,
} from '../lib/tira-set-reasoning-v8.js'
import { relationalV2Intent } from '../lib/tira-relational-v2.js'

const brotherhoodSet = {
  resultSet: {
    entityType: 'brotherhood',
    entityIds: ['h1', 'h2', 'h3'],
  },
}

test('ordena un conjunto de Hermandades por antigüedad documentada', () => {
  assert.deepEqual(
    setReasoningV8Intent('Ordénalas de más antigua a más reciente.', brotherhoodSet),
    { kind: 'brotherhood_set_foundation_order', direction: 'oldest_first' }
  )
  assert.deepEqual(
    setReasoningV8Intent('Clasifícalas de más recientes a más antiguas', brotherhoodSet),
    { kind: 'brotherhood_set_foundation_order', direction: 'newest_first' }
  )
})

test('extrae una clave cronológica sin confundir reorganizaciones posteriores', () => {
  assert.equal(foundationChronologyKey('1575'), 1575)
  assert.equal(foundationChronologyKey('Siglo XV; reorganizada en 1942'), 1401)
  assert.equal(
    foundationChronologyKey('La corporación integra la Santa Cruz (c. 1635), el Rosario (1697) y Las Aguas (1750)'),
    1635
  )
  assert.equal(foundationChronologyKey('Pendiente de documentar'), null)
})

test('detecta cultos futuros sobre el conjunto anterior', () => {
  assert.equal(
    setReasoningV8Intent('¿Qué cultos tienen próximamente?', brotherhoodSet)?.kind,
    'brotherhood_set_upcoming_cults'
  )
  assert.equal(
    setReasoningV8Intent('¿Qué triduos les quedan?', brotherhoodSet)?.kind,
    'brotherhood_set_upcoming_cults'
  )
})

test('detecta autores o profesionales repetidos entre varias Hermandades', () => {
  assert.equal(
    setReasoningV8Intent('¿Qué autores se repiten entre ellas?', brotherhoodSet)?.kind,
    'brotherhood_set_repeated_agents'
  )
  assert.equal(
    setReasoningV8Intent('¿Qué artistas tienen en común?', brotherhoodSet)?.kind,
    'brotherhood_set_repeated_agents'
  )
})

test('el filtro musical existente sigue cubriendo el cuarto caso conversacional', () => {
  assert.equal(
    relationalV2Intent('¿Cuáles llevan banda de música?', brotherhoodSet)?.kind,
    'brotherhoods_with_music'
  )
})

test('V8 solo actúa sobre conjuntos de al menos dos Hermandades', () => {
  assert.equal(setReasoningV8Intent('Ordénalas por antigüedad.', null), null)
  assert.equal(setReasoningV8Intent('¿Qué autores se repiten?', {
    resultSet: { entityType: 'band', entityIds: ['b1', 'b2'] },
  }), null)
  assert.equal(setReasoningV8Intent('¿Qué cultos tienen próximamente?', {
    resultSet: { entityType: 'brotherhood', entityIds: ['h1'] },
  }), null)
})

test('la implementación V8 usa solo relaciones estructuradas y preserva el conjunto', async () => {
  const source = await readFile(new URL('../lib/supabase/tira-del-hilo-set-reasoning-v8.js', import.meta.url), 'utf8')
  const orchestrator = await readFile(new URL('../lib/supabase/tira-del-hilo-v12.js', import.meta.url), 'utf8')

  assert.match(source, /from\('brotherhoods'\)/)
  assert.match(source, /from\('calendar_cult_days'\)/)
  assert.match(source, /from\('brotherhood_images'\)/)
  assert.match(source, /from\('image_authorships'\)/)
  assert.match(source, /from\('brotherhood_steps'\)/)
  assert.match(source, /from\('step_phase_details'\)/)
  assert.match(source, /'brotherhood_set_foundation_order'/)
  assert.match(source, /'brotherhood_set_upcoming_cults'/)
  assert.match(source, /'brotherhood_set_repeated_agents'/)
  assert.match(orchestrator, /askHiloCofradeSetReasoningV8/)
  assert.ok(
    orchestrator.indexOf('askHiloCofradeSetReasoningV8(clean, context)')
      < orchestrator.indexOf('askHiloCofradeRelationalV2(clean, context)')
  )
})
