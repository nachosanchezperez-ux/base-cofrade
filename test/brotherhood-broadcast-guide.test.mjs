import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))

async function source(path) {
  return readFile(join(ROOT, path), 'utf8')
}

test('la guía se integra de forma genérica en el layout de las fichas', async () => {
  const layout = await source('app/hermandades/[slug]/layout.js')
  const loader = await source('lib/supabase/brotherhood-broadcast-guide.js')

  assert.match(layout, /getBrotherhoodBroadcastGuideBySlug\(slug\)/)
  assert.match(layout, /<BrotherhoodBroadcastGuide guide=\{guide\}/)
  assert.doesNotMatch(layout, /pastora-de-cantillana/)
  assert.doesNotMatch(loader, /pastora-de-cantillana/)
})

test('la lectura de la guía es pública, stateless y solo usa datos documentados', async () => {
  const loader = await source('lib/supabase/brotherhood-broadcast-guide.js')

  assert.match(loader, /createPublicClient/)
  assert.doesNotMatch(loader, /@\/lib\/supabase\/server/)
  assert.doesNotMatch(loader, /next\/headers|cookies\(/)
  assert.match(loader, /documentedText/)
  assert.match(loader, /por confirmar/)
  assert.match(loader, /por anunciar/)
  assert.match(loader, /\.gte\('outing_date', today\)/)
  assert.match(loader, /\.eq\('status', PUBLISHED\)/)
})

test('la pieza visual prioriza fecha, operativa, capataces, bandas y claves', async () => {
  const component = await source('components/BrotherhoodBroadcastGuide.js')
  const css = await source('components/BrotherhoodBroadcastGuide.module.css')

  assert.match(component, /data-broadcast-guide="true"/)
  assert.match(component, /Apoyo para la retransmisión/)
  assert.match(component, /Mandos del paso/)
  assert.match(component, /Música procesional/)
  assert.match(component, /Claves para el comentario/)
  assert.match(component, /operationalFacts\.length > 0/)
  assert.match(component, /outing\.route\?\.length > 0/)
  assert.match(css, /--broadcast-primary/)
  assert.match(css, /@media \(max-width: 760px\)/)
})

test('la ficha no rellena con avisos los datos de visita que aún no existen', async () => {
  const seat = await source('components/BrotherhoodSeatSection.js')
  const seatCss = await source('components/BrotherhoodSeatSection.module.css')

  assert.doesNotMatch(seat, /pendiente/i)
  assert.match(seat, /hasOpeningHours/)
  assert.match(seat, /styles\.mainGridSingle/)
  assert.match(seatCss, /\.mainGridSingle/)
})

test('los créditos fotográficos no duplican la palabra Fotografía', async () => {
  const media = await source('lib/supabase/entity-media.js')

  assert.match(media, /normalizePhotoCredit/)
  assert.match(media, /Fotografía · \$\{creditName\}/)
  assert.doesNotMatch(media, /Fotografía • \$\{creditName\}/)
})
