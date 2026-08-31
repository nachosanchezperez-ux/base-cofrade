import 'server-only'

import { createClient } from '@/lib/supabase/server'

export const CONTRIBUTION_TYPE_LABELS = {
  correction: 'Corrección de ficha',
  new_record: 'Información nueva',
  media: 'Fotografías o documentos',
  suggestion: 'Sugerencia general',
}

export const CONTRIBUTION_STATUS_LABELS = {
  pending: 'Pendiente',
  in_review: 'En revisión',
  needs_info: 'Falta información',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
  applied: 'Incorporada',
  expired: 'Caducada',
}

function queryValue(value) {
  return String(value || '').trim()
}

export async function getPanelContributions({ status = '', type = '', search = '', focusedId = '' } = {}) {
  const supabase = await createClient()
  let query = supabase
    .from('contributions')
    .select('id, contribution_type, title, status, contact_name, assigned_to, created_at, contribution_attachments(id)')
    .order('created_at', { ascending: false })
    .limit(100)

  const safeStatus = queryValue(status)
  const safeType = queryValue(type)
  const safeSearch = queryValue(search).slice(0, 100)
  if (safeStatus && Object.hasOwn(CONTRIBUTION_STATUS_LABELS, safeStatus)) query = query.eq('status', safeStatus)
  if (safeType && Object.hasOwn(CONTRIBUTION_TYPE_LABELS, safeType)) query = query.eq('contribution_type', safeType)
  if (safeSearch) query = query.ilike('title', `%${safeSearch.replace(/[%_]/g, '\\$&')}%`)

  const listResult = await query
  if (listResult.error) throw new Error(`No se pudo cargar la cola de aportaciones: ${listResult.error.message}`)

  let focused = null
  if (/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(focusedId)) {
    const detailResult = await supabase
      .from('contributions')
      .select(`
        id, contribution_type, title, description, page_url, source_urls,
        contact_name, contact_email, photo_credit, photo_alt_text,
        rights_confirmed, privacy_version, consented_at, status, assigned_to,
        reviewed_by, reviewed_at, resolved_at, internal_notes,
        resolution_summary, expires_at, created_at, updated_at,
        contribution_attachments(
          id, storage_path, original_name, verified_mime_type, byte_size,
          width, height, status, credit, alt_text, created_at
        )
      `)
      .eq('id', focusedId)
      .maybeSingle()
    if (detailResult.error) throw new Error(`No se pudo abrir la aportación: ${detailResult.error.message}`)
    focused = detailResult.data || null
  }

  if (focused?.contribution_attachments?.length) {
    focused.contribution_attachments = await Promise.all(
      focused.contribution_attachments.map(async (attachment) => {
        const signed = await supabase.storage
          .from('hilo-contributions-quarantine')
          .createSignedUrl(attachment.storage_path, 300, { download: attachment.original_name })
        return {
          ...attachment,
          signedUrl: signed.error ? '' : signed.data?.signedUrl || '',
        }
      }),
    )
  }

  return { contributions: listResult.data || [], focused }
}

