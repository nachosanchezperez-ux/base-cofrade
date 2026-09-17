import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las ediciones de convocatorias invalidan agenda, ficha y superficies relacionadas', () => {
  const actions = read('app/panel/(protected)/igualas-y-ensayos/actions.js')

  assert.match(actions, /revalidatePath\('\/igualas-y-ensayos'\)/)
  assert.match(actions, /revalidatePath\('\/agenda-cofrade'\)/)
  assert.match(actions, /revalidatePath\(`\/igualas-y-ensayos\/\$\{entity\.slug\}`\)/)
  assert.match(actions, /revalidatePath\(`\/hermandades\/\$\{entity\.slug\}`\)/)
  assert.match(actions, /revalidatePath\(`\/pasos\/\$\{entity\.slug\}`\)/)
})

test('los cambios de Fuentes invalidan la ficha pública de la convocatoria', () => {
  const actions = read('app/panel/(protected)/fuentes/actions.js')

  assert.match(actions, /result\.data\.entity_type === 'event'/)
  assert.match(actions, /\.eq\('entity_id', entityId\)/)
  assert.match(actions, /event\.data\?\.event_category === 'crew_call'/)
  assert.match(actions, /revalidatePath\(`\/igualas-y-ensayos\/\$\{result\.data\.slug\}`\)/)
})
