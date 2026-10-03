import { createAdminClient } from '@/lib/supabase/admin'
import { authorizedRetentionRequest, removeOldContributionFingerprints } from '@/lib/contributions/retention'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' }

export async function GET(request) {
  if (!authorizedRetentionRequest(request.headers, process.env.CRON_SECRET)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers })
  }
  if (process.env.CONTRIBUTION_RETENTION_ENABLED !== 'true') {
    return Response.json({ error: 'Unavailable' }, { status: 503, headers })
  }
  try {
    const result = await removeOldContributionFingerprints(createAdminClient())
    return Response.json({ ok: true, ...result }, { headers })
  } catch {
    console.error('[Hilo Cofrade] Limpieza de huellas no completada')
    return Response.json({ error: 'Maintenance failed' }, { status: 500, headers })
  }
}
