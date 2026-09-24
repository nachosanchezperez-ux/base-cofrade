import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la ficha de Hermandad recupera y enlaza sus igualás y ensayos', async () => {
  const [page, section, loader] = await Promise.all([
    source('app/hermandades/[slug]/page.js'),
    source('components/BrotherhoodCrewEventsSection.js'),
    source('lib/supabase/crew-events.js'),
  ])

  assert.match(page, /async function BrotherhoodCrewEventsAsync/)
  assert.match(page, /getCrewEventsByBrotherhoodId\(brotherhoodId\)/)
  assert.match(page, /href: '#igualas-y-ensayos', label: 'Igualás y ensayos'/)
  assert.match(page, /<BrotherhoodCrewEventsSection events=\{events\} \/>/)
  assert.match(page, /<Suspense fallback=\{null\}>[\s\S]*<BrotherhoodCrewEventsAsync/)
  assert.match(loader, /\.eq\('brotherhood_entity_id', brotherhoodId\)/)
  assert.match(loader, /export async function getCrewEventsByBrotherhoodId/)
  assert.match(section, /href=\{event\.detailHref\}/)
})

test('el bloque separa próximas citas e histórico sin mostrar vacíos editoriales', async () => {
  const section = await source('components/BrotherhoodCrewEventsSection.js')

  assert.match(section, /if \(!events\.length\) return null/)
  assert.match(section, /Próximas citas/)
  assert.match(section, /Histórico de convocatorias/)
  assert.match(section, /open=\{!upcoming\.length\}/)
  assert.match(section, /event\.steps/)
  assert.match(section, /primaryAgent/)
})
