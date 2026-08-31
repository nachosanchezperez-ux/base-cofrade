'use server'

import { createHash, randomUUID } from 'node:crypto'
import { headers } from 'next/headers'
import { CONTRIBUTION_BUCKET, CONTRIBUTION_PRIVACY_VERSION } from '@/lib/contributions/config'
import { validateContributionPhoto } from '@/lib/contributions/image-validation'
import {
  contributionFingerprint,
  contributionReadiness,
  hasTrustedContributionOrigin,
  requestIp,
  verifyContributionFormTicket,
  verifyTurnstile,
} from '@/lib/contributions/security'
import {
  ContributionValidationError,
  hasHoneypotValue,
  parseContributionForm,
} from '@/lib/contributions/validation'
import { createAdminClient } from '@/lib/supabase/admin'

const GENERIC_ERROR = 'No hemos podido recibir la aportación de forma segura. Espera unos minutos y vuelve a intentarlo.'

function submissionHash(payload, photos) {
  const normalized = JSON.stringify({
    type: payload.contributionType,
    title: payload.title.toLocaleLowerCase('es-ES'),
    description: payload.description,
    pageUrl: payload.pageUrl,
    sources: payload.sources,
    photos: photos.map((photo) => photo.sha256),
  })
  return createHash('sha256').update(normalized).digest('hex')
}

async function removeUploadedPhotos(supabase, paths) {
  if (!paths.length) return
  const result = await supabase.storage.from(CONTRIBUTION_BUCKET).remove(paths)
  if (result.error) {
    console.error('[Hilo Cofrade] No se pudo limpiar una subida pública incompleta', result.error.message)
  }
}

function publicError(error) {
  if (error instanceof ContributionValidationError) return error.message
  return GENERIC_ERROR
}

export async function submitContributionAction(_previousState, formData) {
  if (!contributionReadiness().enabled) {
    return { status: 'error', message: GENERIC_ERROR }
  }

  if (hasHoneypotValue(formData)) {
    return { status: 'success', reference: 'HC-RECIBIDA' }
  }

  let supabase
  let contributionId = ''
  const uploadedPaths = []

  try {
    const requestHeaders = await headers()
    if (!hasTrustedContributionOrigin(requestHeaders)) throw new Error('Untrusted contribution origin')
    if (!verifyContributionFormTicket(formData.get('form_ticket'))) throw new Error('Invalid contribution form ticket')

    const payload = parseContributionForm(formData)
    const ip = requestIp(requestHeaders)
    const fingerprint = contributionFingerprint(ip, requestHeaders.get('user-agent') || '')
    if (!fingerprint) throw new Error('Contribution fingerprint unavailable')

    supabase = createAdminClient()
    const rateLimit = await supabase.rpc('consume_contribution_rate_limit', {
      p_fingerprint_hash: fingerprint,
    })
    if (rateLimit.error || rateLimit.data !== true) throw new Error('Contribution rate limit rejected')

    const host = (requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || '').split(',')[0].trim()
    const turnstileValid = await verifyTurnstile({
      token: String(formData.get('cf-turnstile-response') || ''),
      remoteIp: ip,
      expectedHostname: host,
    })
    if (!turnstileValid) throw new Error('Turnstile rejected contribution')

    const photos = []
    for (const file of payload.photos) photos.push(await validateContributionPhoto(file))

    const contentHash = submissionHash(payload, photos)
    const duplicateThreshold = new Date(Date.now() - 24 * 60 * 60_000).toISOString()
    const duplicate = await supabase
      .from('contributions')
      .select('id')
      .eq('submission_hash', contentHash)
      .gte('created_at', duplicateThreshold)
      .limit(1)
      .maybeSingle()
    if (duplicate.error) throw new Error(`Duplicate check failed: ${duplicate.error.message}`)
    if (duplicate.data) throw new Error('Recent duplicate contribution')

    const created = await supabase
      .from('contributions')
      .insert({
        contribution_type: payload.contributionType,
        title: payload.title,
        description: payload.description,
        page_url: payload.pageUrl,
        source_url: payload.sources[0] || null,
        source_urls: payload.sources,
        contact_name: payload.contactName,
        contact_email: payload.contactEmail,
        photo_credit: payload.photoCredit,
        photo_alt_text: payload.photoAltText,
        rights_confirmed: payload.rightsConfirmed,
        privacy_version: CONTRIBUTION_PRIVACY_VERSION,
        consented_at: new Date().toISOString(),
        client_fingerprint_hash: fingerprint,
        submission_hash: contentHash,
        status: 'pending',
      })
      .select('id')
      .single()
    if (created.error || !created.data) {
      throw new Error(`Contribution insert failed: ${created.error?.message || 'missing row'}`)
    }
    contributionId = created.data.id

    const attachmentRows = []
    for (const photo of photos) {
      const attachmentId = randomUUID()
      const storagePath = `${contributionId}/${attachmentId}.${photo.extension}`
      const uploaded = await supabase.storage.from(CONTRIBUTION_BUCKET).upload(storagePath, photo.buffer, {
        contentType: photo.verifiedMimeType,
        cacheControl: '0',
        upsert: false,
      })
      if (uploaded.error) throw new Error(`Quarantine upload failed: ${uploaded.error.message}`)
      uploadedPaths.push(storagePath)
      attachmentRows.push({
        id: attachmentId,
        contribution_id: contributionId,
        storage_path: storagePath,
        original_name: photo.originalName,
        declared_mime_type: photo.declaredMimeType,
        verified_mime_type: photo.verifiedMimeType,
        byte_size: photo.byteSize,
        width: photo.width,
        height: photo.height,
        sha256: photo.sha256,
        status: 'quarantined',
        credit: payload.photoCredit,
        alt_text: payload.photoAltText,
      })
    }

    if (attachmentRows.length) {
      const attachments = await supabase.from('contribution_attachments').insert(attachmentRows)
      if (attachments.error) throw new Error(`Attachment insert failed: ${attachments.error.message}`)
    }

    const audit = await supabase.from('audit_log').insert({
      actor_label: 'Canal público',
      action_type: 'create',
      object_type: 'contribution',
      object_id: contributionId,
      summary: `Aportación pública recibida: ${payload.contributionType}`,
      changed_fields: {
        contribution_type: payload.contributionType,
        source_count: payload.sources.length,
        attachment_count: photos.length,
      },
    })
    if (audit.error) console.error('[Hilo Cofrade] No se pudo auditar una aportación pública', audit.error.message)

    return { status: 'success', reference: `HC-${contributionId.slice(0, 8).toUpperCase()}` }
  } catch (error) {
    if (supabase && uploadedPaths.length) await removeUploadedPhotos(supabase, uploadedPaths)
    if (supabase && contributionId) {
      const removed = await supabase.from('contributions').delete().eq('id', contributionId)
      if (removed.error) console.error('[Hilo Cofrade] No se pudo retirar una aportación incompleta', removed.error.message)
    }
    console.error('[Hilo Cofrade] Envío público rechazado', {
      reason: error instanceof Error ? error.message : 'unknown',
    })
    return { status: 'error', message: publicError(error) }
  }
}
