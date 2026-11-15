import 'server-only'
import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import { loadPublicRowsInBatches } from '@/lib/supabase/public-query-batches'
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media'
import { resolveBrotherhoodPalette } from '@/lib/brotherhood-palette'
import {
  buildVirgenesCoronadas,
  CORONATION_EVENT_TYPE_PATTERNS,
  CORONATION_MUSIC_WINDOW,
} from '@/lib/virgenes-coronadas'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function batch(supabase, ids, build, label) {
  return ids.length ? loadPublicRowsInBatches(ids, (batchIds) => build(supabase, batchIds), label) : []
}

function byId(rows, key = 'id') {
  return new Map(rows.map((row) => [row[key], row]))
}

async function loadVirgenesCoronadas() {
  const supabase = createPublicClient()

  // 1. Acontecimientos de coronación (todas las variantes de tipo cargadas).
  // Una consulta por patrón: .ilike() codifica el comodín; dentro de .or() no.
  const eventResults = await Promise.all(CORONATION_EVENT_TYPE_PATTERNS.map((pattern) => supabase
    .from('events')
    .select('entity_id, event_type, event_date, event_date_text, event_status, location_text, brotherhood_entity_id, municipality_id')
    .ilike('event_type', pattern)))
  const events = [...new Map(eventResults
    .flatMap((result) => assertRows(result, 'No se pudieron consultar las coronaciones'))
    .map((row) => [row.entity_id, row])).values()]
  const eventIds = events.map((row) => row.entity_id)

  // 2. Entidad publicada de cada acontecimiento y sus relaciones.
  const [eventEntities, relations] = await Promise.all([
    batch(supabase, eventIds, (client, ids) => client
      .from('entities').select('id, name, status').in('id', ids).eq('status', 'published'),
    'No se pudieron consultar las fichas de las coronaciones'),
    batch(supabase, eventIds, (client, ids) => client
      .from('entity_relations')
      .select('source_entity_id, target_entity_id, relation_type, status')
      .in('source_entity_id', ids)
      .in('relation_type', ['involves', 'officiated_by']),
    'No se pudieron consultar las relaciones de las coronaciones'),
  ])
  const publishedEvents = byId(eventEntities)
  const visibleEvents = events
    .filter((row) => publishedEvents.has(row.entity_id))
    .map((row) => ({ ...row, name: publishedEvents.get(row.entity_id).name }))

  const liveRelations = relations.filter((relation) => !relation.status || relation.status === 'published')
  const targetIds = [...new Set(liveRelations.map((relation) => relation.target_entity_id))]
  const targets = byId(await batch(supabase, targetIds, (client, ids) => client
    .from('entities').select('id, entity_type, name, slug, status').in('id', ids),
  'No se pudieron consultar las imágenes y prelados de las coronaciones'))

  const links = new Map()
  for (const relation of liveRelations) {
    const target = targets.get(relation.target_entity_id)
    if (!target) continue
    const link = links.get(relation.source_entity_id) || { imageId: null, officiants: [] }
    // Imágenes publicadas o en revisión (las coronaciones anunciadas pueden
    // preceder a la ficha completa); las segundas se muestran sin enlace.
    if (relation.relation_type === 'involves' && target.entity_type === 'image' && ['published', 'review'].includes(target.status) && !link.imageId) {
      link.imageId = target.id
    }
    if (relation.relation_type === 'officiated_by' && target.entity_type === 'agent') {
      link.officiants.push({ id: target.id })
    }
    links.set(relation.source_entity_id, link)
  }

  const imageIds = [...new Set([...links.values()].map((link) => link.imageId).filter(Boolean))]

  // 3. Hermandad titular de cada imagen (para las coronaciones sin hermandad en el evento).
  const imageLinks = await batch(supabase, imageIds, (client, ids) => client
    .from('brotherhood_images')
    .select('image_entity_id, brotherhood_entity_id, relation_type, status')
    .in('image_entity_id', ids),
  'No se pudieron consultar las hermandades de las imágenes coronadas')
  const imageBrotherhood = new Map()
  for (const row of imageLinks) {
    if (row.status && row.status !== 'published') continue
    if (!/^titular$/i.test(row.relation_type || '') && imageBrotherhood.has(row.image_entity_id)) continue
    imageBrotherhood.set(row.image_entity_id, row.brotherhood_entity_id)
  }

  const brotherhoodIds = [...new Set([
    ...visibleEvents.map((row) => row.brotherhood_entity_id),
    ...imageBrotherhood.values(),
  ].filter(Boolean))]

  const [brotherhoodEntities, brotherhoodRows, colorRows, covers] = await Promise.all([
    batch(supabase, brotherhoodIds, (client, ids) => client
      .from('entities').select('id, name, slug, status').in('id', ids).eq('status', 'published'),
    'No se pudieron consultar las hermandades de las coronadas'),
    batch(supabase, brotherhoodIds, (client, ids) => client
      .from('brotherhoods').select('entity_id, popular_name, municipality_id, crest_path').in('entity_id', ids),
    'No se pudieron consultar los datos de las hermandades de las coronadas'),
    batch(supabase, brotherhoodIds, (client, ids) => client
      .from('brotherhood_colors')
      .select('id, brotherhood_entity_id, color_name, hex_value, color_role, sort_order, status')
      .in('brotherhood_entity_id', ids),
    'No se pudieron consultar los colores de las hermandades de las coronadas'),
    getPublishedEntityCoverMediaMap([...imageIds, ...brotherhoodIds], {
      entityTypesById: new Map([
        ...imageIds.map((id) => [id, 'image']),
        ...brotherhoodIds.map((id) => [id, 'brotherhood']),
      ]),
      throwOnError: true,
    }),
  ])

  // Misma hermandad que usará la página: la del acto o, si falta, la titular de la imagen.
  const musicEvents = visibleEvents.map((row) => ({
    ...row,
    brotherhood_entity_id: row.brotherhood_entity_id || imageBrotherhood.get(links.get(row.entity_id)?.imageId) || null,
  }))
  const outings = await loadCoronationOutings(supabase, brotherhoodIds, musicEvents)

  const brotherhoodData = byId(brotherhoodRows, 'entity_id')
  const colorsByBrotherhood = new Map()
  for (const color of colorRows) {
    const list = colorsByBrotherhood.get(color.brotherhood_entity_id) || []
    list.push(color)
    colorsByBrotherhood.set(color.brotherhood_entity_id, list)
  }

  const brotherhoods = new Map(brotherhoodEntities.map((entity) => {
    const data = brotherhoodData.get(entity.id) || {}
    const colors = colorsByBrotherhood.get(entity.id) || []
    return [entity.id, {
      name: data.popular_name || entity.name,
      slug: entity.slug,
      municipalityId: data.municipality_id || null,
      crest: data.crest_path || '',
      cover: covers.get(entity.id) || null,
      palette: colors.length ? resolveBrotherhoodPalette(colors) : null,
    }]
  }))

  const municipalityIds = [...new Set([
    ...visibleEvents.map((row) => row.municipality_id),
    ...brotherhoodRows.map((row) => row.municipality_id),
  ].filter(Boolean))]
  const municipalityRows = await batch(supabase, municipalityIds, (client, ids) => client
    .from('municipalities').select('id, name').in('id', ids),
  'No se pudieron consultar los municipios de las coronadas')

  const images = new Map(imageIds
    .map((id) => targets.get(id))
    .filter(Boolean)
    .map((image) => [image.id, { name: image.name, slug: image.slug, published: image.status === 'published', cover: covers.get(image.id) || null }]))

  const agents = new Map([...targets.values()]
    .filter((target) => target.entity_type === 'agent')
    .map((agent) => [agent.id, { id: agent.id, name: agent.name, slug: agent.slug, published: agent.status === 'published' }]))

  return buildVirgenesCoronadas({
    events: visibleEvents,
    links,
    images,
    brotherhoods,
    agents,
    municipalities: new Map(municipalityRows.map((row) => [row.id, row.name])),
    imageBrotherhood,
    outings,
  })
}

// Salidas publicadas de las hermandades de las coronadas alrededor de las
// fechas de coronación, con sus bandas (para «Música» en cada acto).
async function loadCoronationOutings(supabase, brotherhoodIds, events) {
  const dates = events.map((row) => row.event_date).filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(String(date || ''))).sort()
  if (!brotherhoodIds.length || !dates.length) return new Map()
  const from = shiftDays(dates[0], -CORONATION_MUSIC_WINDOW.before)
  const to = shiftDays(dates.at(-1), CORONATION_MUSIC_WINDOW.after)
  const outingRows = await batch(supabase, brotherhoodIds, (client, ids) => client
    .from('outings')
    .select('id, brotherhood_entity_id, outing_date, title, character, status')
    .in('brotherhood_entity_id', ids)
    .eq('status', 'published')
    .gte('outing_date', from)
    .lte('outing_date', to),
  'No se pudieron consultar las salidas de las coronaciones')
  // Solo las salidas que caen junto a una coronación de su propia hermandad.
  const windows = new Map()
  for (const row of events) {
    if (!row.brotherhood_entity_id || !/^\d{4}-\d{2}-\d{2}$/.test(String(row.event_date || ''))) continue
    const list = windows.get(row.brotherhood_entity_id) || []
    list.push([shiftDays(row.event_date, -CORONATION_MUSIC_WINDOW.before), shiftDays(row.event_date, CORONATION_MUSIC_WINDOW.after)])
    windows.set(row.brotherhood_entity_id, list)
  }
  const nearby = outingRows.filter((row) => (windows.get(row.brotherhood_entity_id) || [])
    .some(([start, end]) => row.outing_date >= start && row.outing_date <= end))
  const outingIds = nearby.map((row) => row.id)
  const musicRows = await batch(supabase, outingIds, (client, ids) => client
    .from('outing_music_details')
    .select('outing_id, position_order, band_order, band_entity_id, band_name')
    .in('outing_id', ids),
  'No se pudo consultar la música de las coronaciones')
  const bandIds = [...new Set(musicRows.map((row) => row.band_entity_id).filter(Boolean))]
  const bandEntities = byId(await batch(supabase, bandIds, (client, ids) => client
    .from('entities').select('id, name, slug, status').in('id', ids).eq('status', 'published'),
  'No se pudieron consultar las bandas de las coronaciones'))

  const bandsByOuting = new Map()
  for (const row of [...musicRows].sort((first, second) => (first.position_order || 0) - (second.position_order || 0) || (first.band_order || 0) - (second.band_order || 0))) {
    const entity = row.band_entity_id ? bandEntities.get(row.band_entity_id) : null
    const name = entity?.name || row.band_name
    if (!name) continue
    const list = bandsByOuting.get(row.outing_id) || []
    list.push({ id: entity?.id || '', name, href: entity?.slug ? `/bandas/${entity.slug}` : '' })
    bandsByOuting.set(row.outing_id, list)
  }

  const outings = new Map()
  for (const row of nearby) {
    const list = outings.get(row.brotherhood_entity_id) || []
    list.push({ date: row.outing_date, title: row.title || '', character: row.character || '', bands: bandsByOuting.get(row.id) || [] })
    outings.set(row.brotherhood_entity_id, list)
  }
  return outings
}

function shiftDays(date, days) {
  const value = new Date(`${date}T12:00:00Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

// Solo se cachean lecturas correctas: un fallo nunca debe quedar como lista vacía.
export const getVirgenesCoronadas = unstable_cache(
  loadVirgenesCoronadas,
  ['virgenes-coronadas-v3'],
  { revalidate: 900 },
)

// Coronaciones presididas por un prelado (para su ficha de autor).
export async function getCoronationsByOfficiant(agentId) {
  if (!agentId) return []
  const { crowned, upcoming } = await getVirgenesCoronadas()
  return [...upcoming, ...crowned]
    .map((item) => ({
      ...item,
      acts: item.acts.filter((act) => act.officiants.some((officiant) => officiant.id === agentId)),
    }))
    .filter((item) => item.acts.length)
    .sort((first, second) => String(first.acts[0].date || first.acts[0].year).localeCompare(String(second.acts[0].date || second.acts[0].year)))
}
