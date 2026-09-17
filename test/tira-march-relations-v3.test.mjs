import assert from 'node:assert/strict'
import test from 'node:test'

import {
  marchRelationEntityScore,
  marchRelationsV3Intent,
  marchUsageKey,
} from '../lib/tira-march-relations-v3.js'

test('detecta el sentido Marcha -> Crucetas', () => {
  assert.equal(
    marchRelationsV3Intent('¿En qué crucetas aparece Salud Siempre?')?.kind,
    'march_repertoires'
  )
  assert.equal(
    marchRelationsV3Intent('¿Dónde ha sonado esta marcha?', { entityType: 'march' })?.kind,
    'march_repertoires'
  )
})

test('detecta el sentido Marcha -> Bandas con continuidad contextual', () => {
  const context = {
    entityId: 'march-1',
    entityType: 'march',
    name: 'Salud Siempre',
  }
  assert.equal(
    marchRelationsV3Intent('¿Qué bandas han interpretado Salud Siempre?', context)?.kind,
    'march_bands'
  )
  assert.equal(
    marchRelationsV3Intent('¿Qué bandas la han interpretado?', context)?.kind,
    'march_bands'
  )
})

test('las dedicatorias se resuelven sin inferir por el título', () => {
  assert.equal(
    marchRelationsV3Intent('¿A quién está dedicada Salud Siempre?')?.kind,
    'march_dedications'
  )
  assert.equal(
    marchRelationsV3Intent('¿Cuál es su dedicatoria?', { entityType: 'march' })?.kind,
    'march_dedications'
  )
})

test('detecta Autor -> Marchas -> Crucetas en ambos formatos', () => {
  assert.equal(
    marchRelationsV3Intent('¿Qué marchas de Manuel Marvizón aparecen en crucetas?')?.kind,
    'agent_repertoire_marches'
  )
  assert.equal(
    marchRelationsV3Intent('¿En qué crucetas aparecen marchas de Manuel Marvizón?')?.kind,
    'agent_repertoires'
  )
})

test('continúa desde una Marcha hacia otras obras del mismo compositor', () => {
  const context = {
    entityId: 'march-1',
    entityType: 'march',
    name: 'Salud Siempre',
  }
  assert.equal(
    marchRelationsV3Intent('¿Qué otras marchas del mismo compositor aparecen en crucetas?', context)?.kind,
    'same_author_repertoire_marches'
  )
})

test('reconoce nombres parciales de Marchas y autores sin depender de prefijos', () => {
  assert.ok(marchRelationEntityScore('Salud Siempre', '¿En qué crucetas aparece Salud Siempre?') >= 1500)
  assert.ok(marchRelationEntityScore('Manuel Marvizón Carvallo', '¿Qué marchas de Manuel Marvizón aparecen en crucetas?') >= 300)
})

test('la clave de uso diferencia una misma Marcha en distintas crucetas', () => {
  assert.equal(
    marchUsageKey({ march_entity_id: 'm1', repertoire_id: 'r1' }),
    'm1|r1'
  )
  assert.notEqual(
    marchUsageKey({ march_entity_id: 'm1', repertoire_id: 'r1' }),
    marchUsageKey({ march_entity_id: 'm1', repertoire_id: 'r2' })
  )
})

test('una consulta básica de autoría no se apropia de V3', () => {
  assert.equal(marchRelationsV3Intent('¿Quién compuso Salud Siempre?'), null)
  assert.equal(marchRelationsV3Intent('¿De qué año es Salud Siempre?'), null)
  assert.equal(marchRelationsV3Intent('Escuchar Salud Siempre'), null)
})
