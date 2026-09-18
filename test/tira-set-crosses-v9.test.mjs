import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

import { setCrossesV9Intent } from '../lib/tira-set-crosses-v9.js'

const brotherhoodSet = {
  resultSet: {
    entityType: 'brotherhood',
    entityIds: ['h1', 'h2', 'h3'],
  },
}

test('detecta bandas repetidas en el conjunto anterior', () => {
  assert.equal(setCrossesV9Intent('¿Qué bandas se repiten?', brotherhoodSet)?.kind, 'brotherhood_set_repeated_bands')
  assert.equal(setCrossesV9Intent('¿Qué bandas tienen en común?', brotherhoodSet)?.kind, 'brotherhood_set_repeated_bands')
})

test('detecta marchas dedicadas a las hermandades o a sus titulares', () => {
  assert.equal(setCrossesV9Intent('¿Qué marchas tienen dedicadas?', brotherhoodSet)?.kind, 'brotherhood_set_dedicated_marches')
  assert.equal(setCrossesV9Intent('Marchas con dedicatorias para estas hermandades', brotherhoodSet)?.kind, 'brotherhood_set_dedicated_marches')
})

test('detecta imágenes que comparten autor entre hermandades distintas', () => {
  assert.equal(setCrossesV9Intent('¿Qué imágenes son del mismo autor?', brotherhoodSet)?.kind, 'brotherhood_set_shared_author_images')
  assert.equal(setCrossesV9Intent('¿Qué titulares comparten autor?', brotherhoodSet)?.kind, 'brotherhood_set_shared_author_images')
})

test('detecta la comparación estructurada del conjunto', () => {
  assert.equal(setCrossesV9Intent('Compáralas.', brotherhoodSet)?.kind, 'brotherhood_set_compare')
  assert.equal(setCrossesV9Intent('¿En qué se diferencian?', brotherhoodSet)?.kind, 'brotherhood_set_compare')
})

test('V9 solo actúa sobre conjuntos de Hermandades', () => {
  assert.equal(setCrossesV9Intent('Compáralas.', null), null)
  assert.equal(setCrossesV9Intent('¿Qué bandas se repiten?', {
    resultSet: { entityType: 'band', entityIds: ['b1', 'b2'] },
  }), null)
})

test('V9 usa cruces estructurados y se integra antes del fallback relacional', async () => {
  const source = await readFile(new URL('../lib/supabase/tira-del-hilo-set-crosses-v9.js', import.meta.url), 'utf8')
  const orchestrator = await readFile(new URL('../lib/supabase/tira-del-hilo-v12.js', import.meta.url), 'utf8')

  assert.match(source, /from\('current_music_accompaniments'\)/)
  assert.match(source, /from\('march_dedications'\)/)
  assert.match(source, /relation_type', 'titular'/)
  assert.match(source, /from\('image_authorships'\)/)
  assert.match(source, /from\('brotherhoods'\)/)
  assert.match(source, /from\('calendar_cult_days'\)/)
  assert.match(source, /'brotherhood_set_repeated_bands'/)
  assert.match(source, /'brotherhood_set_dedicated_marches'/)
  assert.match(source, /'brotherhood_set_shared_author_images'/)
  assert.match(source, /'brotherhood_set_compare'/)
  assert.match(orchestrator, /askHiloCofradeSetCrossesV9/)
  assert.ok(
    orchestrator.indexOf('askHiloCofradeSetCrossesV9(clean, context)')
      < orchestrator.indexOf('askHiloCofradeRelationalV2(clean, context)')
  )
})
