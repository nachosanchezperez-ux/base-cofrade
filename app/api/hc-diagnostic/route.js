import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const DASHBOARD_AUTH_URL = 'https://xguihxuzqibwxjnimxev.supabase.co'
const DASHBOARD_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhndWloeHV6cWlid3hqbmlteGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNzc1MTgsImV4cCI6MjAzMzk1MzUxOH0.aIqjQ9V7djMxYit-DT1fYNV_VWMHSqldh_18XfX2_BE'
const TARGET_EMAIL = 'nacho.sanchezperez@gmail.com'
const EXPECTED_BRANCH = 'agent/nucleo-relacional-diagnostico'

const MIGRATION_SQL = `
drop policy if exists "Panel members can read image_steps" on public.image_steps;
drop policy if exists "Editors can create image_steps" on public.image_steps;
drop policy if exists "Editors can update image_steps" on public.image_steps;
drop policy if exists "Admins can delete image_steps" on public.image_steps;

create policy "Panel members can read image_steps"
on public.image_steps for select to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create image_steps"
on public.image_steps for insert to authenticated
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Editors can update image_steps"
on public.image_steps for update to authenticated
using (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
)
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Admins can delete image_steps"
on public.image_steps for delete to authenticated
using ((select public.can_admin_panel()));

grant select, insert, update, delete on public.image_steps to authenticated;

drop policy if exists "Panel members can read image_authorships" on public.image_authorships;
drop policy if exists "Editors can create image_authorships" on public.image_authorships;
drop policy if exists "Editors can update image_authorships" on public.image_authorships;
drop policy if exists "Admins can delete image_authorships" on public.image_authorships;

create policy "Panel members can read image_authorships"
on public.image_authorships for select to authenticated
using ((select public.is_panel_member()));

create policy "Editors can create image_authorships"
on public.image_authorships for insert to authenticated
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Editors can update image_authorships"
on public.image_authorships for update to authenticated
using (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
)
with check (
  (select public.can_edit_panel())
  and (status <> 'published' or (select public.can_publish_panel()))
);

create policy "Admins can delete image_authorships"
on public.image_authorships for delete to authenticated
using ((select public.can_admin_panel()));

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
select tablename, policyname, cmd, roles
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
  )
order by tablename, policyname;
`

function allowed() {
  return process.env.VERCEL_ENV === 'preview'
    && process.env.VERCEL_GIT_COMMIT_REF === EXPECTED_BRANCH
}

function response(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

async function readBody(result) {
  const text = await result.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return { text: text.slice(0, 500) } }
}

function fragmentParams(location) {
  const hashIndex = location.indexOf('#')
  if (hashIndex === -1) return new URLSearchParams()
  return new URLSearchParams(location.slice(hashIndex + 1))
}

async function managementQuery(accessToken, projectRef, query, readOnly = false) {
  const result = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, parameters: [], read_only: readOnly }),
    cache: 'no-store',
  })
  const body = await readBody(result)
  if (!result.ok) {
    throw new Error(`La consulta de gestión falló (${result.status}): ${JSON.stringify(body)}`)
  }
  return body
}

async function requestDashboardRecovery() {
  const result = await fetch(`${DASHBOARD_AUTH_URL}/auth/v1/recover?redirect_to=${encodeURIComponent('https://supabase.com/dashboard/reset-password')}`, {
    method: 'POST',
    headers: {
      apikey: DASHBOARD_ANON_KEY,
      Authorization: `Bearer ${DASHBOARD_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: TARGET_EMAIL }),
    cache: 'no-store',
  })
  const body = await readBody(result)
  return response({ requested: result.ok, status: result.status, detail: result.ok ? null : body }, result.ok ? 200 : 502)
}

async function applyMigration(link) {
  let verificationUrl
  try { verificationUrl = new URL(link) } catch { return response({ error: 'Enlace de recuperación no válido.' }, 400) }
  if (verificationUrl.hostname !== 'xguihxuzqibwxjnimxev.supabase.co') {
    return response({ error: 'El enlace no pertenece al sistema de autenticación esperado.' }, 400)
  }

  const verified = await fetch(verificationUrl, { redirect: 'manual', cache: 'no-store' })
  const location = verified.headers.get('location') || ''
  const accessToken = fragmentParams(location).get('access_token')
  if (!accessToken) {
    return response({ error: 'No se pudo abrir una sesión de gestión.', status: verified.status }, 401)
  }

  const appUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!appUrl) return response({ error: 'Falta la URL del proyecto.' }, 500)
  const projectRef = new URL(appUrl).hostname.split('.')[0]

  const projectsResult = await fetch('https://api.supabase.com/v1/projects', {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })
  const projects = await readBody(projectsResult)
  if (!projectsResult.ok || !Array.isArray(projects)) {
    return response({ error: 'La sesión no permite consultar proyectos.', status: projectsResult.status }, 403)
  }
  const project = projects.find((item) => item.ref === projectRef || item.id === projectRef)
  if (!project) return response({ error: 'El proyecto de Hilo Cofrade no está disponible para esta cuenta.' }, 403)

  await managementQuery(accessToken, projectRef, MIGRATION_SQL, false)
  const policies = await managementQuery(accessToken, projectRef, VERIFY_SQL, true)
  const policyRows = Array.isArray(policies) ? policies : policies?.result || policies?.data || []
  const policyCount = Array.isArray(policyRows) ? policyRows.length : 0

  return response({
    applied: policyCount === 8,
    policyCount,
    projectStatus: project.status || null,
  }, policyCount === 8 ? 200 : 500)
}

export async function GET(request) {
  if (!allowed()) return new NextResponse(null, { status: 404 })
  const url = new URL(request.url)
  const action = url.searchParams.get('action') || 'status'

  try {
    if (action === 'dashboard-recovery') return requestDashboardRecovery()
    if (action === 'apply-migration') return applyMigration(url.searchParams.get('link') || '')
    return response({ environment: process.env.VERCEL_ENV, branch: process.env.VERCEL_GIT_COMMIT_REF })
  } catch (error) {
    return response({ error: error instanceof Error ? error.message : String(error) }, 500)
  }
}
