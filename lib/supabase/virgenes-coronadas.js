import 'server-only'
import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import { loadPublicRowsInBatches } from '@/lib/supabase/public-query-batches'
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media'
import { resolveBrotherhoodPalette } from '@/lib/brotherhood-palette'
import {
  buildVirgenesCoronadas,
  CORONATION_EVENT_TYPE_PATTERNS,
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
    if (relation.relation_type === 'involves' && target.entity_type === 'image' && target.status === 'published' && !link.imageId) {
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
    .map((image) => [image.id, { name: image.name, slug: image.slug, cover: covers.get(image.id) || null }]))

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
  })
}

// Solo se cachean lecturas correctas: un fallo nunca debe quedar como lista vacía.
export const getVirgenesCoronadas = unstable_cache(
  loadVirgenesCoronadas,
  ['virgenes-coronadas-v1'],
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
