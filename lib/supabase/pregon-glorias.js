import 'server-only'
import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import { buildPregonGlorias, PREGON_GLORIAS_EVENT_TYPE } from '@/lib/pregon-glorias'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
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

  const brotherhoodIds = [...new Set(rows.map((row) => row.brotherhood_entity_id).filter(Boolean))]
  const [entities, brotherhoods] = brotherhoodIds.length
    ? await Promise.all([
        supabase.from('entities').select('id, slug, name, status').in('id', brotherhoodIds).eq('status', 'published'),
        supabase.from('brotherhoods').select('entity_id, popular_name').in('entity_id', brotherhoodIds),
      ])
    : [{ data: [] }, { data: [] }]

  const popularNames = new Map(
    assertRows(brotherhoods, 'No se pudieron consultar las hermandades del Pregón')
      .map((row) => [row.entity_id, row.popular_name])
  )
  // Solo se enlazan las hermandades publicadas; las demás se muestran por la
  // denominación que consigna el archivo del Consejo.
  const published = new Map(
    assertRows(entities, 'No se pudieron consultar las fichas del Pregón')
      .filter((row) => row.slug)
      .map((row) => [row.id, { slug: row.slug, name: popularNames.get(row.id) || row.name }])
  )

  return buildPregonGlorias(rows, published)
}

// Cache only successful reads. Rejected loads must never become empty snapshots.
export const getPregonGlorias = unstable_cache(
  loadPregonGlorias,
  ['pregon-glorias-v1'],
  { revalidate: 900 },
)
