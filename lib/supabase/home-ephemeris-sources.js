import 'server-only'

import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/public-server'
import { selectAllRows, selectRowsByIds } from '@/lib/supabase/query-all'
import { kindPriority, OPERATIONAL_EVENT_TYPES } from '@/lib/home-ephemeris'

// Hechos con fecha exacta para «Tal día como hoy»: acontecimientos de las
// Hermandades, estrenos de marchas y salidas extraordinarias ya celebradas.
// Todos enlazan a una ficha publicada; sin ficha, no hay efeméride.

function assertRows(result, message) {
  if (result.error) throw new Error(`${message}: ${result.error.message}`)
  return result.data || []
}

async function publishedEntities(supabase, ids) {
  const rows = assertRows(
    await selectRowsByIds(ids, (batch) => supabase
      .from('entities')
      .select('id, entity_type, name, slug')
      .in('id', batch)
      .eq('status', 'published')),
    'No se pudieron leer las fichas de las efemérides',
  )
  return new Map(rows.map((row) => [row.id, row]))
}

async function loadEphemerisCandidates() {
  const supabase = createClient()
  const [eventsResult, marchesResult, outingsResult] = await Promise.all([
    selectAllRows(() => supabase
      .from('events')
      .select('entity_id, event_type, event_date, description, brotherhood_entity_id')
      .not('event_date', 'is', null)
      .not('brotherhood_entity_id', 'is', null), { tieBreaker: 'entity_id' }),
    selectAllRows(() => supabase
      .from('marches')
      .select('entity_id, premiere_date, premiered_by_band_entity_id')
      .not('premiere_date', 'is', null), { tieBreaker: 'entity_id' }),
    selectAllRows(() => supabase
      .from('extraordinary_outings_directory')
      .select('id, title, outing_type, outing_date, brotherhood_entity_id, brotherhood_name, reason')
      .not('outing_date', 'is', null)
      .not('brotherhood_entity_id', 'is', null)),
  ])

  const events = assertRows(eventsResult, 'No se pudieron leer los acontecimientos')
    .filter((row) => !OPERATIONAL_EVENT_TYPES.has(row.event_type))
  const marches = assertRows(marchesResult, 'No se pudieron leer los estrenos de marchas')
  const outings = assertRows(outingsResult, 'No se pudieron leer las salidas extraordinarias')

  const entities = await publishedEntities(supabase, [
    ...events.flatMap((row) => [row.entity_id, row.brotherhood_entity_id]),
    ...marches.flatMap((row) => [row.entity_id, row.premiered_by_band_entity_id]),
    ...outings.map((row) => row.brotherhood_entity_id),
  ])
  const brotherhoodHref = (id) => {
    const entity = entities.get(id)
    return entity?.entity_type === 'brotherhood' && entity.slug ? `/hermandades/${entity.slug}` : ''
  }

  const candidates = []
  for (const row of events) {
    const event = entities.get(row.entity_id)
    const href = brotherhoodHref(row.brotherhood_entity_id)
    if (!event || !href) continue
    candidates.push({
      id: `event:${row.entity_id}`,
      date: row.event_date,
      kind: row.event_type || '',
      title: event.name,
      summary: row.description || '',
      href,
      rootEntityId: row.brotherhood_entity_id,
      priority: kindPriority(row.event_type || ''),
    })
  }
  for (const row of marches) {
    const march = entities.get(row.entity_id)
    if (!march?.slug) continue
    const band = entities.get(row.premiered_by_band_entity_id)
    candidates.push({
      id: `march:${row.entity_id}`,
      date: row.premiere_date,
      kind: 'Estreno de marcha',
      title: `Estreno de la marcha «${march.name}»`,
      summary: band?.name ? `La estrenó ${band.name}.` : '',
      href: `/marchas/${march.slug}`,
      rootEntityId: row.premiered_by_band_entity_id || '',
      priority: kindPriority('estreno'),
    })
  }
  for (const row of outings) {
    const href = brotherhoodHref(row.brotherhood_entity_id)
    if (!href || !row.title) continue
    candidates.push({
      id: `outing:${row.id}`,
      date: row.outing_date,
      kind: row.outing_type || 'Salida extraordinaria',
      title: row.title,
      summary: row.reason || '',
      href,
      rootEntityId: row.brotherhood_entity_id,
      priority: kindPriority('extraordinaria'),
    })
  }
  return candidates
}

// Los hechos no dependen del día: una lectura por hora; la elección del día se
// hace en memoria (lib/home-ephemeris.js).
export const getEphemerisCandidates = unstable_cache(
  loadEphemerisCandidates,
  ['home-ephemeris-candidates-v1'],
  { revalidate: 3600, tags: ['home-public'] },
)
