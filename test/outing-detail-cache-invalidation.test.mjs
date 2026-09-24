import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la invalidación de salidas distingue Extraordinarias y Procesiones de Gloria', () => {
  const helper = read('lib/panel/revalidate-outings.js')

  assert.match(helper, /outing\?\.character === 'extraordinary'/)
  assert.match(helper, /includes\('procesion de gloria'\)/)
  assert.match(helper, /brotherhoodSlugById\.get\(outing\.brotherhood_entity_id\)/)
  assert.match(helper, /revalidatePath\(`\/extraordinarias\/\$\{outing\.slug\}`\)/)
  assert.match(helper, /revalidatePath\(`\/procesiones-de-gloria\/\$\{slug\}`\)/)
  assert.match(helper, /revalidateTag\('public-glory-directory', \{ expire: 0 \}\)/)
  assert.match(helper, /revalidateTag\('public-glory-detail', \{ expire: 0 \}\)/)
  assert.match(helper, /revalidatePath\('\/agenda-cofrade'\)/)
})

test('el editor de Salidas invalida la ficha actual y conserva el tipo anterior', () => {
  const actions = read('app/panel/(protected)/hermandades/[id]/salidas/actions.js')

  assert.match(actions, /import \{ revalidateOutingPages \} from '@\/lib\/panel\/revalidate-outings'/)
  assert.match(actions, /previousOuting = outingId \? await requireOuting/)
  assert.match(actions, /await revalidateOutingPages\(supabase, outingIds, previousOutings\)/)
  assert.match(actions, /\[saved\.id\], previousOuting \? \[previousOuting\] : \[\]/)
})

test('el editor de Bandas invalida las salidas extraordinarias relacionadas', () => {
  const actions = read('app/panel/(protected)/bandas/[id]/actions.js')

  assert.match(actions, /await revalidateOutingPages\(supabase, \[outing\.id\]\)/)
  assert.match(actions, /await revalidateOutingPages\(supabase, \[outingId\]\)/)
})

test('un cambio de slug en Extraordinarias invalida también la URL anterior', () => {
  const actions = read('app/panel/(protected)/extraordinarias/[id]/general/actions.js')

  assert.match(actions, /previousSlug && previousSlug !== slug/)
  assert.match(actions, /revalidatePath\(`\/extraordinarias\/\$\{previousSlug\}`\)/)
  assert.match(actions, /refresh\(outingId, slug, outing\.slug\)/)
})
