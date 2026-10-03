import { timingSafeEqual } from 'node:crypto'
import { CONTRIBUTION_BUCKET } from './config.js'

const UUID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

export function authorizedRetentionRequest(headers, secret) {
  if (typeof secret !== 'string' || Buffer.byteLength(secret) < 32) return false
  const expected = Buffer.from(`Bearer ${secret}`)
  const actual = Buffer.from(headers.get('authorization') || '')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export async function removeOldContributionFingerprints(supabase, now = new Date()) {
  const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString()
  const attempts = await supabase.from('contribution_attempts').delete({ count: 'exact' }).lt('attempted_at', cutoff)
  if (attempts.error) throw new Error('Retention attempts cleanup failed')
  const contributions = await supabase.from('contributions')
    .update({ client_fingerprint_hash: null, submission_hash: null }, { count: 'exact' })
    .lt('created_at', cutoff)
    .or('client_fingerprint_hash.not.is.null,submission_hash.not.is.null')
  if (contributions.error) throw new Error('Retention fingerprint cleanup failed')
  return { attemptsRemoved: attempts.count || 0, contributionsScrubbed: contributions.count || 0 }
}

// Explicit single-record operation. Preview by default; never purge a whole
// bucket, infer candidates from contact details, or log their private content.
export async function purgeExpiredContribution(supabase, id, { apply = false, now = new Date() } = {}) {
  if (!UUID.test(id)) throw new Error('Invalid contribution reference')
  const current = await supabase.from('contributions')
    .select('id,status,expires_at,contribution_attachments(id,storage_path)')
    .eq('id', id).maybeSingle()
  if (current.error) throw new Error('Retention inspection failed')
  if (!current.data) return { absent: true, removed: false }
  const row = current.data
  const expires = new Date(row.expires_at).getTime()
  if (row.id !== id || row.status !== 'expired' || typeof row.expires_at !== 'string' || !Number.isFinite(expires) || expires > now.getTime()) {
    throw new Error('Contribution must be expired and its retention deadline reached')
  }
  const attachments = row.contribution_attachments || []
  if (attachments.length > 3 || attachments.some((item) => !UUID.test(item.id)
    || !['jpg', 'png', 'webp', 'pdf'].some((extension) => item.storage_path === `${id}/${item.id}.${extension}`))) {
    throw new Error('Retention attachment ownership could not be verified')
  }
  if (!apply) return { eligible: true, dryRun: true, attachments: attachments.length }

  // Titles can contain personal data; retain an audit trace without that text.
  const audit = await supabase.from('audit_log')
    .update({ summary: 'Aportación suprimida por conservación', changed_fields: {} })
    .eq('object_type', 'contribution').eq('object_id', id)
  if (audit.error) throw new Error('Retention audit sanitization failed')
  if (attachments.length) {
    const removed = await supabase.storage.from(CONTRIBUTION_BUCKET).remove(attachments.map((item) => item.storage_path))
    if (removed.error) throw new Error('Retention storage removal failed')
  }
  // Storage API first; FK cascade removes attachment metadata with the row.
  const deleted = await supabase.from('contributions').delete()
    .eq('id', id).eq('status', 'expired').lte('expires_at', now.toISOString())
    .select('id').maybeSingle()
  if (deleted.error) throw new Error('Retention contribution removal failed')
  return { dryRun: false, removed: Boolean(deleted.data), attachments: attachments.length }
}
