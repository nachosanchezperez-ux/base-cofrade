import 'server-only'
import { createPublicClient } from '@/lib/supabase/public'
import { withEventScheduleChange } from '@/lib/event-schedule-change'

// Lectura adicional compatible con el despliegue previo a la migración.
// Solo la ausencia de la columna nueva permite continuar sin metadatos.
export async function withScheduleChanges(items, table) {
  if (!items.length) return items
  const idColumn = table === 'events' ? 'entity_id' : 'id'
  const supabase = createPublicClient()
  const metadata = new Map()
  for (let offset = 0; offset < items.length; offset += 100) {
    const result = await supabase.from(table).select(`${idColumn}, event_status, schedule_change`).in(idColumn, items.slice(offset, offset + 100).map((item) => item.id))
    if (result.error) {
      if (['42703', 'PGRST204'].includes(result.error.code) && String(result.error.message).includes('schedule_change')) return items.map((item) => withEventScheduleChange(item))
      throw new Error(`No se pudo leer el cambio de convocatoria: ${result.error.message}`)
    }
    for (const row of result.data || []) metadata.set(row[idColumn], row)
  }
  return items.map((item) => {
    const row = metadata.get(item.id)
    return withEventScheduleChange({ ...item, eventStatus: row?.event_status || item.eventStatus }, row?.schedule_change || {})
  })
}
