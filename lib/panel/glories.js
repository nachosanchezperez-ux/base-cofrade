import 'server-only'

import { createClient } from '@/lib/supabase/server'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function madridDate() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export async function getPanelGlories({ query = '', status = '' } = {}) {
  const supabase = await createClient()
  const today = madridDate()

  const brotherhoods = assertQuery(
    await supabase
      .from('brotherhoods')
      .select('entity_id, official_name, popular_name, municipality_id, brotherhood_types, crest_path')
      .contains('brotherhood_types', ['Gloria'])
      .order('popular_name'),
    'No se pudieron cargar las Hermandades de Gloria',
  )

  if (!brotherhoods.length) {
    return { rows: [], upcoming: [], pending: [], counts: { total: 0, upcoming: 0, pending: 0 }, today }
  }

  const ids = brotherhoods.map((item) => item.entity_id)
  let entityQuery = supabase
    .from('entities')
    .select('id, name, slug, status, updated_at')
    .eq('entity_type', 'brotherhood')
    .in('id', ids)

  if (status) entityQuery = entityQuery.eq('status', status)

  const entities = assertQuery(await entityQuery, 'No se pudieron cargar las entidades de Gloria')
  if (!entities.length) {
    return { rows: [], upcoming: [], pending: [], counts: { total: 0, upcoming: 0, pending: 0 }, today }
  }

  const entityIds = entities.map((item) => item.id)
  const relevantBrotherhoods = brotherhoods.filter((item) => entityIds.includes(item.entity_id))
  const municipalityIds = [...new Set(relevantBrotherhoods.map((item) => item.municipality_id).filter(Boolean))]

  const [municipalitiesResult, outingsResult] = await Promise.all([
    municipalityIds.length
      ? supabase.from('municipalities').select('id, name, province').in('id', municipalityIds)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from('outings')
      .select('id, brotherhood_entity_id, title, outing_type, outing_date, departure_time, status, event_status')
      .in('brotherhood_entity_id', entityIds)
      .neq('status', 'archived')
      .ilike('outing_type', 'Procesión de Gloria')
      .gte('outing_date', today)
      .order('outing_date', { ascending: true })
      .order('departure_time', { ascending: true }),
  ])

  const municipalities = assertQuery(municipalitiesResult, 'No se pudieron cargar las localidades de las Glorias')
  const outings = assertQuery(outingsResult, 'No se pudieron cargar las próximas procesiones de Gloria')
    .filter((item) => item.event_status !== 'cancelled')

  const brotherhoodById = new Map(relevantBrotherhoods.map((item) => [item.entity_id, item]))
  const municipalityById = new Map(municipalities.map((item) => [item.id, item]))
  const nextOutingByBrotherhood = new Map()

  outings.forEach((outing) => {
    if (!nextOutingByBrotherhood.has(outing.brotherhood_entity_id)) {
      nextOutingByBrotherhood.set(outing.brotherhood_entity_id, outing)
    }
  })

  const normalizedQuery = normalize(query)
  const rows = entities
    .map((entity) => {
      const brotherhood = brotherhoodById.get(entity.id) || {}
      const municipality = municipalityById.get(brotherhood.municipality_id)
      return {
        id: entity.id,
        slug: entity.slug,
        status: entity.status,
        name: brotherhood.popular_name || entity.name,
        officialName: brotherhood.official_name || entity.name,
        municipality: municipality?.name || 'Sin localidad',
        province: municipality?.province || '',
        types: brotherhood.brotherhood_types || [],
        crestPath: brotherhood.crest_path || '',
        nextOuting: nextOutingByBrotherhood.get(entity.id) || null,
      }
    })
    .filter((item) => {
      if (!normalizedQuery) return true
      return normalize(`${item.name} ${item.officialName} ${item.municipality}`).includes(normalizedQuery)
    })
    .sort((a, b) => {
      const aDate = a.nextOuting?.outing_date || '9999-12-31'
      const bDate = b.nextOuting?.outing_date || '9999-12-31'
      if (aDate !== bDate) return aDate.localeCompare(bDate)
      return a.name.localeCompare(b.name, 'es')
    })

  const upcoming = rows.filter((item) => item.nextOuting)
  const pending = rows.filter((item) => !item.nextOuting)

  return {
    rows,
    upcoming,
    pending,
    counts: {
      total: rows.length,
      upcoming: upcoming.length,
      pending: pending.length,
    },
    today,
  }
}
