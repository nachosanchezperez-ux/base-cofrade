import 'server-only'

import { createClient } from '@/lib/supabase/server'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function dateParts(value) {
  if (!value) return { day: '', month: '', year: '', label: '' }

  const date = new Date(`${value}T12:00:00`)
  const day = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    timeZone: 'Europe/Madrid',
  }).format(date)
  const month = new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    timeZone: 'Europe/Madrid',
  }).format(date).replace('.', '').toUpperCase()
  const year = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date)
  const label = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date)

  return { day, month, year, label }
}

function timeLabel(value) {
  return value ? String(value).slice(0, 5) : ''
}

export async function getUpcomingExtraordinaryOutings(limit = 4) {
  try {
    const supabase = await createClient()
    const rows = assertQuery(
      await supabase
        .from('upcoming_extraordinary_outings')
        .select('*')
        .limit(limit),
      'No se pudieron consultar las próximas salidas extraordinarias'
    )

    return rows.map((item) => ({
      id: item.id,
      title: item.title || item.outing_type || 'Salida extraordinaria',
      brotherhoodName: item.brotherhood_name || item.organizer_name || 'Entidad organizadora por documentar',
      municipality: item.municipality_name || '',
      date: item.outing_date,
      dateParts: dateParts(item.outing_date),
      departureTime: timeLabel(item.departure_time),
      returnTime: timeLabel(item.return_time),
      reason: item.reason || '',
      origin: item.origin_place_name || '',
      destination: item.destination_place_name || '',
      routeSummary: item.route_summary || '',
    }))
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las extraordinarias de la Home', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}
