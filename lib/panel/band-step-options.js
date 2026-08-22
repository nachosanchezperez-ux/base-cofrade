import 'server-only'

import { createClient } from '@/lib/supabase/server'

export async function getBandStepOptions() {
  const supabase = await createClient()
  const result = await supabase
    .from('entities')
    .select('id, name, slug, status')
    .eq('entity_type', 'step')
    .neq('status', 'archived')
    .order('name')

  if (result.error) throw new Error(`No se pudieron cargar los Pasos: ${result.error.message}`)
  return result.data || []
}
