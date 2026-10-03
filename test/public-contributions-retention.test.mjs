import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { authorizedRetentionRequest, removeOldContributionFingerprints, purgeExpiredContribution } from '../lib/contributions/retention.js'

const id = '11111111-1111-4111-8111-111111111111'
const attachmentId = '22222222-2222-4222-8222-222222222222'
const now = new Date('2026-10-03T05:00:00Z')
const expired = { id, status: 'expired', expires_at: '2026-10-01T00:00:00Z', contribution_attachments: [{ id: attachmentId, storage_path: `${id}/${attachmentId}.pdf` }] }

function client(row = expired, failure = '') {
  const calls = []
  const api = { calls, storage: { from(bucket) { return { async remove(paths) { calls.push({ operation: 'storage', bucket, paths }); return { error: failure === 'storage' ? {} : null } } } } }, from(table) {
    const call = { table, filters: [] }
    const chain = {
      select(fields) { call.fields = fields; return chain },
      update(values) { call.operation = 'update'; call.values = values; return chain },
      delete() { call.operation = 'delete'; return chain },
      eq(key, value) { call.filters.push(['eq', key, value]); return chain },
      lt(key, value) { call.filters.push(['lt', key, value]); return chain },
      lte(key, value) { call.filters.push(['lte', key, value]); return chain },
      or(value) { call.filters.push(['or', value]); return chain },
      maybeSingle() { return chain },
      then(resolve, reject) {
        calls.push(call)
        const data = call.operation === 'delete' ? { id } : row
        return Promise.resolve({ data, error: failure === table ? {} : null, count: 2 }).then(resolve, reject)
      },
    }
    return chain
  } }
  return api
}

test('mantenimiento requiere un secreto independiente fuerte y cabecera exacta', () => {
  const secret = 'retention-test-only-secret-32-bytes-long'
  assert.equal(authorizedRetentionRequest(new Headers({ authorization: `Bearer ${secret}` }), secret), true)
  for (const configured of [undefined, '', 'short']) assert.equal(authorizedRetentionRequest(new Headers({ authorization: `Bearer ${configured}` }), configured), false)
  for (const value of ['', `Basic ${secret}`, `Bearer ${secret}x`]) assert.equal(authorizedRetentionRequest(new Headers({ authorization: value }), secret), false)
})

test('limpia intentos y hashes anteriores a 48h sin seleccionar contenido o contactos', async () => {
  const api = client()
  assert.deepEqual(await removeOldContributionFingerprints(api, now), { attemptsRemoved: 2, contributionsScrubbed: 2 })
  assert.equal(api.calls[0].table, 'contribution_attempts')
  assert.deepEqual(api.calls[0].filters, [['lt', 'attempted_at', '2026-10-01T05:00:00.000Z']])
  assert.deepEqual(api.calls[1].values, { client_fingerprint_hash: null, submission_hash: null })
  assert.ok(api.calls.every((call) => !call.fields))
  await assert.rejects(() => removeOldContributionFingerprints(client(expired, 'contribution_attempts'), now), /cleanup failed/)
})

test('la supresión solo inspecciona por defecto; rechaza filas vivas, plazos futuros y rutas ajenas', async () => {
  const api = client()
  assert.deepEqual(await purgeExpiredContribution(api, id, { now }), { eligible: true, dryRun: true, attachments: 1 })
  assert.equal(api.calls.length, 1)
  for (const row of [{ ...expired, status: 'pending' }, { ...expired, expires_at: '2027-01-01' }, { ...expired, expires_at: null }, { ...expired, contribution_attachments: [{ id: attachmentId, storage_path: 'other/file.pdf' }] }]) {
    const rejected = client(row)
    await assert.rejects(() => purgeExpiredContribution(rejected, id, { apply: true, now }))
    assert.equal(rejected.calls.length, 1)
  }
})

test('sanea auditoría, elimina objetos mediante Storage y después la fila con condición de caducidad', async () => {
  const api = client()
  assert.equal((await purgeExpiredContribution(api, id, { apply: true, now })).removed, true)
  assert.equal(api.calls[1].table, 'audit_log')
  assert.deepEqual(api.calls[1].values.changed_fields, {})
  assert.equal(api.calls[2].operation, 'storage')
  assert.equal(api.calls[2].bucket, 'hilo-contributions-quarantine')
  assert.equal(api.calls[3].operation, 'delete')
  assert.deepEqual(api.calls[3].filters, [['eq', 'id', id], ['eq', 'status', 'expired'], ['lte', 'expires_at', now.toISOString()]])
})

test('un fallo de auditoría o Storage conserva la fila; ausencia permite reintento idempotente', async () => {
  for (const failure of ['audit_log', 'storage']) {
    const api = client(expired, failure)
    await assert.rejects(() => purgeExpiredContribution(api, id, { apply: true, now }))
    assert.ok(!api.calls.some((call) => call.operation === 'delete'))
  }
  const api = client(null)
  assert.deepEqual(await purgeExpiredContribution(api, id, { apply: true, now }), { absent: true, removed: false })
  assert.equal(api.calls.length, 1)
})

test('el endpoint deniega acceso sin autorizar y queda cerrado aunque se aporte un token válido', async () => {
  const source = await readFile(new URL('../app/api/cron/contributions-retention/route.js', import.meta.url), 'utf8')
  const module = await import(`data:text/javascript;base64,${Buffer.from(source
    .replace("import { createAdminClient } from '@/lib/supabase/admin'", 'const createAdminClient = () => { throw new Error("No database access expected") }')
    .replace("'@/lib/contributions/retention'", JSON.stringify(new URL('../lib/contributions/retention.js', import.meta.url).href))).toString('base64')}`)
  const previous = { secret: process.env.CRON_SECRET, enabled: process.env.CONTRIBUTION_RETENTION_ENABLED }
  try {
    delete process.env.CRON_SECRET
    assert.equal((await module.GET(new Request('https://example.com'))).status, 401)
    process.env.CRON_SECRET = 'retention-test-only-secret-32-bytes-long'
    delete process.env.CONTRIBUTION_RETENTION_ENABLED
    const response = await module.GET(new Request('https://example.com', { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } }))
    assert.equal(response.status, 503)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.match(response.headers.get('x-robots-tag'), /noindex/)
  } finally {
    for (const [key, value] of [['CRON_SECRET', previous.secret], ['CONTRIBUTION_RETENTION_ENABLED', previous.enabled]]) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
})

test('el Panel cierra caducadas, exige motivo y rechaza revisiones que pierden la carrera de estado', async () => {
  const source = await readFile(new URL('../app/panel/(protected)/aportaciones/actions.js', import.meta.url), 'utf8')
  const transformed = source
    .replace("import { revalidatePath } from 'next/cache'", 'const revalidatePath = () => {}')
    .replace("import { redirect } from 'next/navigation'", 'const redirect = () => {}')
    .replace("import { requirePanelEditor } from '@/lib/panel/auth'", 'const requirePanelEditor = async () => ({id:"editor",name:"Editor"})')
    .replace("import { CONTRIBUTION_STATUS_LABELS } from '@/lib/panel/contributions'", 'const CONTRIBUTION_STATUS_LABELS = {pending:"Pendiente",expired:"Caducada"}')
    .replace("import { createClient } from '@/lib/supabase/server'", 'let api; export function setClient(value) { api=value }; const createClient = async () => api')
  const module = await import(`data:text/javascript;base64,${Buffer.from(transformed).toString('base64')}`)
  const data = new FormData()
  data.set('contribution_id', id)
  data.set('status', 'expired')
  const mock = (status) => {
    const filters = []
    const chain = {
      select() { return chain },
      eq(key, value) { filters.push([key,value]); return chain },
      update() { return chain },
      async maybeSingle() { return {data:{id,status}} },
      async single() { return {error:{message:'stale revision'}} },
    }
    return {from:()=>chain,filters}
  }
  module.setClient(mock('expired'))
  await assert.rejects(() => module.reviewContributionAction(data), /no puede reabrirse/)
  module.setClient(mock('pending'))
  await assert.rejects(() => module.reviewContributionAction(data), /motivo/)
  data.set('resolution_summary', 'Plazo de conservación revisado')
  const stale = mock('pending')
  module.setClient(stale)
  await assert.rejects(() => module.reviewContributionAction(data), /stale revision/)
  assert.ok(stale.filters.some(([key,value]) => key === 'status' && value === 'pending'))
})
