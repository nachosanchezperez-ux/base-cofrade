import 'server-only'
import { createPublicClient } from '@/lib/supabase/public'
import { applyExtraordinaryMarks } from '@/lib/agenda-extraordinary'

// Las marcas son pocas: se leen todas las marcadas (dos consultas por lectura
// de la Agenda, nunca una por tarjeta). RLS sigue en vigor.
// hc-despliegue: tolerante. Antes de aplicar la migración
// 20261108080000_extraordinary_act_kind (42703: columna inexistente) la Agenda
// sigue igual, sin marcas. Cualquier otro fallo tampoco la tumba: es un añadido.
const MISSING_COLUMN = '42703'

async function readMarks(supabase, table) {
  const result = await supabase
    .from(table)
    .select('id, extraordinary_kind')
    .not('extraordinary_kind', 'is', null)
    .limit(1000)
  if (result.error) {
    if (result.error.code !== MISSING_COLUMN) {
      console.error('[Hilo Cofrade] Marcas de acto extraordinario no disponibles', { table, error: result.error.message })
    }
    return new Map()
  }
  return new Map((result.data || []).map((row) => [row.id, row.extraordinary_kind]))
}

export async function withAgendaExtraordinaryMarks(groups) {
  try {
    const supabase = createPublicClient()
    const [outings, occurrences] = await Promise.all([
      readMarks(supabase, 'outings'),
      readMarks(supabase, 'cult_occurrences'),
    ])
    return applyExtraordinaryMarks(groups, { outings, occurrences })
  } catch (error) {
    console.error('[Hilo Cofrade] Marcas de acto extraordinario no disponibles', {
      error: error instanceof Error ? error.message : String(error),
    })
    return groups
  }
}
