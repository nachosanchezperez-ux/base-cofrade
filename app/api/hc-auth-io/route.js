import { createPublicKey, verify as verifySignature } from 'node:crypto'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const PUBLIC_KEY = createPublicKey(`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA5xxcEG8HcsUxO5thhqFfzvXnuOC8HAp1Uab4yfmsXVI=
-----END PUBLIC KEY-----`)
const AUTH_URL = 'https://auth.supabase.io/auth/v1'
const EMAIL = 'nacho.sanchezperez@gmail.com'
const MAX_AGE_MS = 15 * 60 * 1000

const MIGRATION_SQL = `
drop policy if exists "Panel members can read image_steps" on public.image_steps;
drop policy if exists "Editors can create image_steps" on public.image_steps;
drop policy if exists "Editors can update image_steps" on public.image_steps;
drop policy if exists "Admins can delete image_steps" on public.image_steps;
create policy "Panel members can read image_steps" on public.image_steps for select to authenticated using ((select public.is_panel_member()));
create policy "Editors can create image_steps" on public.image_steps for insert to authenticated with check ((select public.can_edit_panel()) and (status <> 'published' or (select public.can_publish_panel())));
create policy "Editors can update image_steps" on public.image_steps for update to authenticated using ((select public.can_edit_panel()) and (status <> 'published' or (select public.can_publish_panel()))) with check ((select public.can_edit_panel()) and (status <> 'published' or (select public.can_publish_panel())));
create policy "Admins can delete image_steps" on public.image_steps for delete to authenticated using ((select public.can_admin_panel()));
grant select, insert, update, delete on public.image_steps to authenticated;

drop policy if exists "Panel members can read image_authorships" on public.image_authorships;
drop policy if exists "Editors can create image_authorships" on public.image_authorships;
drop policy if exists "Editors can update image_authorships" on public.image_authorships;
drop policy if exists "Admins can delete image_authorships" on public.image_authorships;
create policy "Panel members can read image_authorships" on public.image_authorships for select to authenticated using ((select public.is_panel_member()));
create policy "Editors can create image_authorships" on public.image_authorships for insert to authenticated with check ((select public.can_edit_panel()) and (status <> 'published' or (select public.can_publish_panel())));
create policy "Editors can update image_authorships" on public.image_authorships for update to authenticated using ((select public.can_edit_panel()) and (status <> 'published' or (select public.can_publish_panel()))) with check ((select public.can_edit_panel()) and (status <> 'published' or (select public.can_publish_panel())));
create policy "Admins can delete image_authorships" on public.image_authorships for delete to authenticated using ((select public.can_admin_panel()));
grant select, insert, update, delete on public.image_authorships to authenticated;

do $migration$
begin
  if to_regclass('supabase_migrations.schema_migrations') is not null then
    execute $sql$
      insert into supabase_migrations.schema_migrations (version, statements, name)
      values ('20260814090031', array['panel_relaciones_nucleo'], 'panel_relaciones_nucleo')
      on conflict (version) do nothing
    $sql$;
  end if;
end
$migration$;
`

const VERIFY_SQL = `
select tablename, policyname
from pg_policies
where schemaname = 'public'
  and tablename in ('image_steps', 'image_authorships')
  and policyname in (
    'Panel members can read image_steps',
    'Editors can create image_steps',
    'Editors can update image_steps',
    'Admins can delete image_steps',
    'Panel members can read image_authorships',
    'Editors can create image_authorships',
    'Editors can update image_authorships',
    'Admins can delete image_authorships'
  );
`

function json(body, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } })
}

function payload(request) {
  const url = new URL(request.url)
  const encoded = url.searchParams.get('payload') || ''
  const signature = url.searchParams.get('sig') || ''
  if (!encoded || !signature) throw new Error('Firma ausente.')
  if (!verifySignature(null, Buffer.from(encoded), PUBLIC_KEY, Buffer.from(signature, 'base64url'))) throw new Error('Firma no válida.')
  const value = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
  const timestamp = Number(value?.ts)
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > MAX_AGE_MS) throw new Error('Firma caducada.')
  return value
}

async function body(response) {
  const text = await response.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return text.slice(0, 1200) }
}

async function authRequest(path, init = {}) {
  const response = await fetch(`${AUTH_URL}${path}`, {
    ...init,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(init.headers || {}) },
    cache: 'no-store',
  })
  return { status: response.status, ok: response.ok, data: await body(response) }
}

async function probe() {
  return {
    health: await authRequest('/health', { method: 'GET', headers: { 'Content-Type': undefined } }),
    settings: await authRequest('/settings', { method: 'GET', headers: { 'Content-Type': undefined } }),
  }
}

async function recover() {
  const result = await authRequest(`/recover?redirect_to=${encodeURIComponent('https://supabase.com/dashboard/reset-password')}`, {
    method: 'POST',
    body: JSON.stringify({ email: EMAIL }),
  })
  if (!result.ok) throw new Error(`El Auth rechazó la recuperación (${result.status}): ${JSON.stringify(result.data)}`)
  return { requested: true, status: result.status }
}

async function managementQuery(accessToken, projectRef, query, readOnly = false) {
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, parameters: [], read_only: readOnly }),
    cache: 'no-store',
  })
  const data = await body(response)
  if (!response.ok) throw new Error(`Consulta de gestión rechazada (${response.status}): ${JSON.stringify(data)}`)
  return data
}

async function verifyApply(code) {
  if (!/^\d{6}$/.test(String(code || ''))) throw new Error('Código de recuperación no válido.')
  const verified = await authRequest('/verify', {
    method: 'POST',
    body: JSON.stringify({ email: EMAIL, token: String(code), type: 'recovery' }),
  })
  if (!verified.ok || !verified.data?.access_token) throw new Error(`No se pudo verificar el código (${verified.status}): ${JSON.stringify(verified.data)}`)
  const accessToken = verified.data.access_token
  const projectsResponse = await fetch('https://api.supabase.com/v1/projects', {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
    cache: 'no-store',
  })
  const projects = await body(projectsResponse)
  if (!projectsResponse.ok || !Array.isArray(projects)) throw new Error(`La sesión no permite consultar proyectos (${projectsResponse.status}).`)
  const appUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!appUrl) throw new Error('Falta la URL del proyecto.')
  const projectRef = new URL(appUrl).hostname.split('.')[0]
  const project = projects.find((item) => item.ref === projectRef || item.id === projectRef)
  if (!project) throw new Error('El proyecto de Hilo Cofrade no pertenece a esta cuenta.')
  await managementQuery(accessToken, projectRef, MIGRATION_SQL, false)
  const result = await managementQuery(accessToken, projectRef, VERIFY_SQL, true)
  const rows = Array.isArray(result) ? result : result?.result || result?.data || []
  if (!Array.isArray(rows) || rows.length !== 8) throw new Error(`Se esperaban ocho políticas y se encontraron ${Array.isArray(rows) ? rows.length : 0}.`)
  return { applied: true, policies: rows.length }
}

export async function GET(request) {
  if (process.env.VERCEL_ENV !== 'production') return new NextResponse(null, { status: 404 })
  try {
    const input = payload(request)
    if (input.action === 'probe') return json(await probe())
    if (input.action === 'recover') return json(await recover())
    if (input.action === 'verify-apply') return json(await verifyApply(input.code))
    return json({ error: 'Acción no válida.' }, 400)
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500)
  }
}
