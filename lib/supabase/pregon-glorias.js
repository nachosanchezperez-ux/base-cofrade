import 'server-only'
import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import { loadPublicRowsInBatches } from '@/lib/supabase/public-query-batches'
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media'
import { resolveBrotherhoodPalette } from '@/lib/brotherhood-palette'
import { buildPregonGlorias, PREGON_GLORIAS_EVENT_TYPE } from '@/lib/pregon-glorias'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function batch(supabase, ids, build, label) {
  return ids.length ? loadPublicRowsInBatches(ids, (batchIds) => build(supabase, batchIds), label) : []
}

async function loadPregonGlorias() {
  const supabase = createPublicClient()
  const rows = assertRows(
    await supabase
      .from('events')
      .select('entity_id, event_date, event_date_text, event_status, location_text, public_notes, brotherhood_entity_id')
      .eq('event_type', PREGON_GLORIAS_EVENT_TYPE),
    'No se pudo consultar el Pregón de las Glorias'
  )
  const eventIds = rows.map((row) => row.entity_id)

  // Imagen que presidió cada pregón (relación involves publicada, si existe).
  const relations = await batch(supabase, eventIds, (client, ids) => client
    .from('entity_relations')
    .select('source_entity_id, target_entity_id, status')
    .in('source_entity_id', ids)
    .eq('relation_type', 'involves')
    .eq('status', 'published'),
  'No se pudieron consultar las imágenes del Pregón')
  const targetIds = [...new Set(relations.map((relation) => relation.target_entity_id))]
  const imageEntities = await batch(supabase, targetIds, (client, ids) => client
    .from('entities').select('id, name').in('id', ids).eq('entity_type', 'image').eq('status', 'published'),
  'No se pudieron consultar las fichas de las imágenes del Pregón')
  const imageNames = new Map(imageEntities.map((image) => [image.id, image.name]))
  const imageByEvent = new Map()
  for (const relation of relations) {
    if (imageNames.has(relation.target_entity_id) && !imageByEvent.has(relation.source_entity_id)) {
      imageByEvent.set(relation.source_entity_id, relation.target_entity_id)
    }
  }
  const imageIds = [...new Set(imageByEvent.values())]

  const brotherhoodIds = [...new Set(rows.map((row) => row.brotherhood_entity_id).filter(Boolean))]
  const [entities, brotherhoods, colorRows, covers] = await Promise.all([
    batch(supabase, brotherhoodIds, (client, ids) => client
      .from('entities').select('id, slug, name, status').in('id', ids).eq('status', 'published'),
    'No se pudieron consultar las fichas del Pregón'),
    batch(supabase, brotherhoodIds, (client, ids) => client
      .from('brotherhoods').select('entity_id, popular_name, crest_path').in('entity_id', ids),
    'No se pudieron consultar las hermandades del Pregón'),
    batch(supabase, brotherhoodIds, (client, ids) => client
      .from('brotherhood_colors')
      .select('id, brotherhood_entity_id, color_name, hex_value, color_role, sort_order, status')
      .in('brotherhood_entity_id', ids),
    'No se pudieron consultar los colores de las hermandades del Pregón'),
    getPublishedEntityCoverMediaMap([...imageIds, ...brotherhoodIds], {
      entityTypesById: new Map([
        ...imageIds.map((id) => [id, 'image']),
        ...brotherhoodIds.map((id) => [id, 'brotherhood']),
      ]),
      throwOnError: true,
    }),
  ])

  const brotherhoodData = new Map(brotherhoods.map((row) => [row.entity_id, row]))
  // Solo se enlazan las hermandades publicadas; las demás se muestran por la
  // denominación que consigna el archivo del Consejo.
  const published = new Map(
    entities
      .filter((row) => row.slug)
      .map((row) => [row.id, { slug: row.slug, name: brotherhoodData.get(row.id)?.popular_name || row.name }])
  )

  const colorsByBrotherhood = new Map()
  for (const color of colorRows) {
    const list = colorsByBrotherhood.get(color.brotherhood_entity_id) || []
    list.push(color)
    colorsByBrotherhood.set(color.brotherhood_entity_id, list)
  }

  // Foto de la imagen que presidió; si no, la de la hermandad (solo publicada);
  // si no, su escudo sobre sus colores. Sin nada de eso, no hay visual.
  const visuals = new Map()
  for (const row of rows) {
    const imageId = imageByEvent.get(row.entity_id)
    const brotherhoodId = row.brotherhood_entity_id
    const brotherhoodName = published.get(brotherhoodId)?.name || ''
    const imageCover = imageId ? covers.get(imageId) : null
    const brotherhoodCover = published.has(brotherhoodId) ? covers.get(brotherhoodId) : null
    const colors = colorsByBrotherhood.get(brotherhoodId) || []
    const crest = brotherhoodData.get(brotherhoodId)?.crest_path || ''
    const cover = imageCover || brotherhoodCover
    const photo = cover?.path
      ? {
          src: cover.path,
          alt: cover.alt || (imageCover ? imageNames.get(imageId) : brotherhoodName) || '',
          focus: cover.focusPosition || '50% 30%',
        }
      : null
    if (!photo && !crest) continue
    visuals.set(row.entity_id, {
      photo,
      crest,
      crestAlt: brotherhoodName ? `Escudo de ${brotherhoodName}` : '',
      palette: colors.length ? resolveBrotherhoodPalette(colors) : null,
    })
  }

  return buildPregonGlorias(rows, published, visuals)
}

// Cache only successful reads. Rejected loads must never become empty snapshots.
export const getPregonGlorias = unstable_cache(
  loadPregonGlorias,
  ['pregon-glorias-v2'],
  { revalidate: 900 },
)
