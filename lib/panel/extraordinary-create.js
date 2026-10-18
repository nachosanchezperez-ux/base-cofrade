import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { selectAllRows } from '@/lib/panel/query-all'

export async function getExtraordinaryCreateOptions() {
  const supabase = await createClient()
  const [municipalities, brotherhoods] = await Promise.all([
    supabase.from('municipalities').select('id, name').eq('province', 'Sevilla').order('name'),
    selectAllRows(() => supabase.from('entities').select('id, name').eq('entity_type', 'brotherhood').neq('status', 'archived').order('name')),
  ])
  if (municipalities.error) throw new Error(`No se pudieron cargar los municipios: ${municipalities.error.message}`)
  if (brotherhoods.error) throw new Error(`No se pudieron cargar las Hermandades: ${brotherhoods.error.message}`)
  return { municipalities: municipalities.data || [], brotherhoods: brotherhoods.data || [] }
}
