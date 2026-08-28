import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

export const PUBLIC_LEGAL_DOCUMENTS = {
  legal_notice: '/aviso-legal',
  privacy_policy: '/privacidad',
  storage_policy: '/cookies',
}

export async function getPublicLegalDocument(documentKey) {
  if (!Object.hasOwn(PUBLIC_LEGAL_DOCUMENTS, documentKey)) return null

  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('legal_drafts')
    .select('document_key, title, body, updated_at')
    .eq('document_key', documentKey)
    .eq('status', 'ready')
    .maybeSingle()

  if (error) throw new Error(`No se pudo cargar el documento legal: ${error.message}`)
  return data || null
}
