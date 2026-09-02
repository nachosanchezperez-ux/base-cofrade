import assert from 'node:assert/strict'
import test from 'node:test'
import { access, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))

async function source(path) {
  return readFile(join(ROOT, path), 'utf8')
}

test('las fichas abren con la identidad de la Hermandad y no con una guía de retransmisión', async () => {
  const layout = await source('app/hermandades/[slug]/layout.js')

  assert.doesNotMatch(layout, /BrotherhoodBroadcastGuide|broadcast-guide|guia-retransmision/i)

  await assert.rejects(access(join(ROOT, 'components/BrotherhoodBroadcastGuide.js')))
  await assert.rejects(access(join(ROOT, 'lib/supabase/brotherhood-broadcast-guide.js')))
})

test('la ficha no duplica las salidas extraordinarias en un módulo final', async () => {
  const layout = await source('app/hermandades/[slug]/layout.js')
  const page = await source('app/hermandades/[slug]/page.js')

  assert.doesNotMatch(layout, /RelatedExtraordinaryOutings/)
  assert.match(page, /s\.slug \? `\/extraordinarias\/\$\{s\.slug\}` : ''/)
})

test('los datos de salida, paso, música e historia permanecen en sus secciones naturales', async () => {
  const page = await source('app/hermandades/[slug]/page.js')

  assert.match(page, /id="pasos"/)
  assert.match(page, /BrotherhoodOwnBands/)
  assert.match(page, /BrotherhoodMusicalHeritage/)
  assert.match(page, /id="historia"/)
  assert.match(page, /id="salidas"/)
})

test('la ficha pública omite marcadores internos de datos todavía no documentados', async () => {
  const page = await source('app/hermandades/[slug]/page.js')
  const loader = await source('lib/supabase/brotherhoods.js')
  const authority = await source('lib/brotherhood-authority-core.js')

  assert.match(page, /const authorship = \[imagen\.autor, imagen\.fecha\]\.filter\(Boolean\)\.join\(' · '\)/)
  assert.match(page, /authorship \? <p className="image-card-authorship">/)
  assert.match(loader, /function documentedPublicText/)
  assert.doesNotMatch(loader, /Autoría pendiente de documentar|Fecha pendiente de documentar/)
  assert.match(authority, /function documentedPublicText/)
  assert.doesNotMatch(authority, /Autoría pendiente de documentar|Fecha pendiente de documentar/)
  assert.match(loader, /documentedPublicText\(outing\.time_text\)/)
  assert.match(loader, /documentedPublicText\(movement\.time_text\)/)
})

test('los créditos fotográficos no duplican la palabra Fotografía', async () => {
  const media = await source('lib/supabase/entity-media.js')

  assert.match(media, /normalizePhotoCredit/)
  assert.match(media, /Fotografía · \$\{creditName\}/)
  assert.doesNotMatch(media, /Fotografía • \$\{creditName\}/)
})
