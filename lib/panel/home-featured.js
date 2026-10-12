import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { homeFeaturedStatus } from '@/lib/home-featured-form'

const OUTING_FIELDS = 'id, title, outing_date, return_date, organizer_name, brotherhood_entity_id, municipality_id, status, character, home_featured_starts_on, home_featured_ends_on, home_featured_priority'

function madridDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(date)
}

function addDays(key, amount) {
  const date = new Date(`${key}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return date.toISOString().slice(0, 10)
}

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function formatDate(key) {
  if (!key) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(`${key}T12:00:00Z`))
}

export async function getHomeFeaturedPanelData() {
  const supabase = await createClient()
  const today = madridDateKey()

  const [featuredRows, candidateRows] = await Promise.all([
    supabase
      .from('outings')
      .select(OUTING_FIELDS)
      .not('home_featured_starts_on', 'is', null)
      .gte('home_featured_ends_on', addDays(today, -14))
      .order('home_featured_starts_on', { ascending: true })
      .limit(50)
      .then((result) => rows(result, 'No se pudieron leer los destacados')),
    supabase
      .from('outings')
      .select(OUTING_FIELDS)
      .eq('status', 'published')
      .gte('outing_date', addDays(today, -1))
      .order('outing_date', { ascending: true })
      .limit(400)
      .then((result) => rows(result, 'No se pudieron leer las salidas próximas')),
  ])

  const all = [...featuredRows, ...candidateRows]
  const brotherhoodIds = [...new Set(all.map((row) => row.brotherhood_entity_id).filter(Boolean))]
  const municipalityIds = [...new Set(all.map((row) => row.municipality_id).filter(Boolean))]

  const [entities, municipalities] = await Promise.all([
    brotherhoodIds.length
      ? supabase.from('entities').select('id, name').in('id', brotherhoodIds).then((result) => rows(result, 'No se pudieron leer las Hermandades'))
      : [],
    municipalityIds.length
      ? supabase.from('municipalities').select('id, name').in('id', municipalityIds).then((result) => rows(result, 'No se pudieron leer los municipios'))
      : [],
  ])
  const entityName = new Map(entities.map((row) => [row.id, row.name]))
  const municipalityName = new Map(municipalities.map((row) => [row.id, row.name]))

  const describe = (row) => {
    const organizer = entityName.get(row.brotherhood_entity_id) || row.organizer_name || ''
    const municipality = municipalityName.get(row.municipality_id) || ''
    return {
      id: row.id,
      title: row.title || 'Salida sin título',
      date: row.outing_date || '',
      dateLabel: formatDate(row.outing_date),
      organizer,
      municipality,
      status: row.status,
      isExtraordinary: row.character === 'extraordinary',
      startsOn: row.home_featured_starts_on || '',
      endsOn: row.home_featured_ends_on || '',
      priority: row.home_featured_priority || 0,
    }
  }

  const featured = featuredRows.map((row) => {
    const item = describe(row)
    return { ...item, featuredStatus: homeFeaturedStatus(item, today) }
  })

  const outingOptions = candidateRows.map((row) => {
    const item = describe(row)
    return {
      id: item.id,
      name: `${item.title}`,
      meta: [item.dateLabel, item.organizer, item.municipality, item.isExtraordinary ? 'Extraordinaria' : ''].filter(Boolean).join(' · '),
    }
  })

  return { today, featured, outingOptions }
}
