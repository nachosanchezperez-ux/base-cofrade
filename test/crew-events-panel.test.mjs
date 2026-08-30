import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el Panel gestiona convocatorias, Pasos y capataces como relaciones reutilizables', async () => {
  const [actions, editor, navigation] = await Promise.all([
    source('app/panel/(protected)/igualas-y-ensayos/actions.js'),
    source('app/panel/(protected)/igualas-y-ensayos/[id]/page.js'),
    source('lib/panel/navigation.js'),
  ])

  assert.match(actions, /createCrewEventAction/)
  assert.match(actions, /saveCrewEventStepAction/)
  assert.match(actions, /saveCrewEventAgentAction/)
  assert.match(actions, /archiveCrewEventAction/)
  assert.match(editor, /Pasos convocados/)
  assert.match(editor, /Capataces y responsables/)
  assert.match(navigation, /\/panel\/igualas-y-ensayos/)
})

test('Acontecimientos queda reservado al archivo histórico', async () => {
  const [loader, actions] = await Promise.all([
    source('lib/panel/events.js'),
    source('app/panel/(protected)/acontecimientos/actions.js'),
  ])

  assert.match(loader, /\.eq\('event_category', 'historical'\)/)
  assert.match(actions, /event_category: 'historical'/)
  assert.match(actions, /\.eq\('event_category', 'historical'\)/)
})
