import 'server-only'

import { createClient } from '@/lib/supabase/server'

export const LEGAL_DOCUMENT_ORDER = [
  'direction_sheet',
  'legal_notice',
  'privacy_policy',
  'storage_policy',
]

export async function getLegalDrafts() {
  const supabase = await createClient()
  const result = await supabase
    .from('legal_drafts')
    .select('id, document_key, title, body, status, internal_notes, updated_at')

  if (result.error) throw new Error(`No se pudieron cargar los borradores legales: ${result.error.message}`)

  const order = new Map(LEGAL_DOCUMENT_ORDER.map((key, index) => [key, index]))
  return (result.data || []).sort(
    (a, b) => (order.get(a.document_key) ?? 99) - (order.get(b.document_key) ?? 99),
  )
}
