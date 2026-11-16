import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('cada acto de Vírgenes Coronadas lleva «Editar en el Panel» solo para la sesión del Panel', async () => {
  const card = await read('components/CoronadaCard.js')
  assert.match(card, /import PanelEditLink from '@\/components\/PanelEditLink'/)
  assert.match(card, /<PanelEditLink href=\{`\/panel\/acontecimientos\/\$\{act\.id\}`\} label="Editar en el Panel" tone="light" \/>/)
  const link = await read('components/PanelEditLink.js')
  assert.match(link, /hasPanelSessionCookie\(document\.cookie\)/)
  assert.match(link, /tone === 'light'/)
})

test('el editor de Acontecimientos gestiona el prelado y el estado del acto', async () => {
  const lib = await read('lib/panel/events.js')
  assert.match(lib, /EVENT_RELATION_TYPES = \['involves', 'officiated_by'\]/)
  assert.match(lib, /\.in\('relation_type', EVENT_RELATION_TYPES\)/)
  for (const status of ['announced', 'held', 'postponed', 'rescheduled', 'suspended', 'cancelled']) {
    assert.match(lib, new RegExp(`${status}:`))
  }
  const page = await read('app/panel/(protected)/acontecimientos/[id]/page.js')
  assert.match(page, /name="relation_type"/)
  assert.match(page, /name="event_status"/)
  const actions = await read('app/panel/(protected)/acontecimientos/actions.js')
  assert.match(actions, /relation_type: type/)
  assert.match(actions, /type === 'officiated_by' && target\.entity_type !== 'agent'/)
  assert.match(actions, /eq\('relation_type', type\)/)
  assert.match(actions, /event_status: eventStatus\(formData/)
})

test('guardar en el Panel refresca Vírgenes Coronadas al momento', async () => {
  const actions = await read('app/panel/(protected)/acontecimientos/actions.js')
  assert.match(actions, /revalidateTag\('virgenes-coronadas', \{ expire: 0 \}\)/)
  assert.match(actions, /revalidatePath\(`\/autores\/\$\{entity\.slug\}`\)/)
  const loader = await read('lib/supabase/virgenes-coronadas.js')
  assert.match(loader, /tags: \['virgenes-coronadas'\]/)
})
