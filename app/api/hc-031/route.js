import { createPublicKey, verify as verifySignature } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const PUBLIC_KEY = createPublicKey(`-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA5xxcEG8HcsUxO5thhqFfzvXnuOC8HAp1Uab4yfmsXVI=
-----END PUBLIC KEY-----`)
const TARGET_EMAIL = 'nacho.sanchezperez@gmail.com'
const DASHBOARD_AUTH_URL = 'https://xguihxuzqibwxjnimxev.supabase.co'
const DASHBOARD_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYXNlIiwicmVmIjoieGd1aWh4dXpxaWJ3eGpuaW14ZXYiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxODM3NzUxOCwiZXhwIjoyMDMzOTUzNTE4fQ.aIqjQ9V7djMxYit-DT1fYNV_VWMHSqldh_18XfX2_BE'
const MAX_AGE_MS = 15 * 60 * 1000
const STATUS_SET = new Set(['draft', 'review', 'published', 'archived'])

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

function json(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

function readSignedPayload(request) {
  const url = new URL(request.url)
  const encoded = url.searchParams.get('payload') || ''
  const signature = url.searchParams.get('sig') || ''
  if (!encoded || !signature) throw new Error('Firma ausente.')
  let valid = false
  try {
    valid = verifySignature(null, Buffer.from(encoded), PUBLIC_KEY, Buffer.from(signature, 'base64url'))
  } catch {
    valid = false
  }
  if (!valid) throw new Error('Firma no válida.')
  let payload
  try {
    payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
  } catch {
    throw new Error('Carga firmada no válida.')
  }
  const timestamp = Number(payload?.ts)
  if (!Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > MAX_AGE_MS) {
    throw new Error('Firma caducada.')
  }
  return payload
}

async function readResponse(response) {
  const text = await response.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return { text: text.slice(0, 1200) } }
}

function authRedirectTokens(location) {
  if (!location) return null
  let parsed
  try { parsed = new URL(location) } catch { return null }
  const params = new URLSearchParams(parsed.hash.startsWith('#') ? parsed.hash.slice(1) : parsed.search.slice(1))
  const accessToken = params.get('access_token')
  const refreshToken = params.get('refresh_token')
  return accessToken && refreshToken ? { accessToken, refreshToken } : null
}

async function consumeAuthLink(link, expectedHost) {
  let url
  try { url = new URL(link) } catch { throw new Error('Enlace de autenticación no válido.') }
  if (url.hostname !== expectedHost) throw new Error('El enlace de autenticación pertenece a un host inesperado.')
  const response = await fetch(url, { redirect: 'manual', cache: 'no-store' })
  const location = response.headers.get('location') || ''
  const tokens = authRedirectTokens(location)
  if (!tokens) throw new Error(`No se pudo abrir la sesión de autenticación (${response.status}).`)
  return tokens
}

async function managementQuery(accessToken, projectRef, query, readOnly = false) {
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, parameters: [], read_only: readOnly }),
    cache: 'no-store',
  })
  const body = await readResponse(response)
  if (!response.ok) throw new Error(`Consulta de gestión rechazada (${response.status}): ${JSON.stringify(body)}`)
  return body
}

async function requestDashboardRecovery() {
  const client = createClient(DASHBOARD_AUTH_URL, DASHBOARD_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  const { error } = await client.auth.resetPasswordForEmail(TARGET_EMAIL, {
    redirectTo: 'https://supabase.com/dashboard/reset-password',
  })
  if (error) throw new Error(`No se pudo solicitar el acceso de gestión: ${error.message}`)
  return { requested: true }
}

async function requestPanelMagicLink() {
  const appUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const appKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!appUrl || !appKey) throw new Error('Falta la configuración pública de Supabase.')
  const client = createClient(appUrl, appKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  const { error } = await client.auth.signInWithOtp({
    email: TARGET_EMAIL,
    options: { shouldCreateUser: false },
  })
  if (error) throw new Error(`No se pudo solicitar el acceso al Panel: ${error.message}`)
  return { requested: true }
}

async function applyMigration(dashboardLink) {
  const { accessToken } = await consumeAuthLink(dashboardLink, 'xguihxuzqibwxjnimxev.supabase.co')
  const appUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!appUrl) throw new Error('Falta la URL del proyecto.')
  const projectRef = new URL(appUrl).hostname.split('.')[0]

  const projectsResponse = await fetch('https://api.supabase.com/v1/projects', {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })
  const projects = await readResponse(projectsResponse)
  if (!projectsResponse.ok || !Array.isArray(projects)) {
    throw new Error(`La sesión no permite consultar proyectos (${projectsResponse.status}).`)
  }
  const project = projects.find((item) => item.ref === projectRef || item.id === projectRef)
  if (!project) throw new Error('El proyecto de Hilo Cofrade no está disponible para esta cuenta.')

  await managementQuery(accessToken, projectRef, MIGRATION_SQL, false)
  const result = await managementQuery(accessToken, projectRef, VERIFY_SQL, true)
  const rows = Array.isArray(result) ? result : result?.result || result?.data || []
  if (!Array.isArray(rows) || rows.length !== 8) {
    throw new Error(`La migración no dejó las ocho políticas esperadas (${Array.isArray(rows) ? rows.length : 0}).`)
  }
  return { applied: true, policies: rows.length }
}

function splitSetCookieHeader(value) {
  if (!value) return []
  const output = []
  let start = 0
  let inExpires = false
  for (let index = 0; index < value.length; index += 1) {
    const slice = value.slice(index, index + 8).toLowerCase()
    if (slice === 'expires=') inExpires = true
    const char = value[index]
    if (inExpires && char === ';') inExpires = false
    if (!inExpires && char === ',') {
      const remainder = value.slice(index + 1)
      if (/^\s*[^=;,\s]+\s*=/.test(remainder)) {
        output.push(value.slice(start, index).trim())
        start = index + 1
      }
    }
  }
  output.push(value.slice(start).trim())
  return output.filter(Boolean)
}

function responseSetCookies(headers) {
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie()
  return splitSetCookieHeader(headers.get('set-cookie'))
}

class CookieJar {
  constructor() {
    this.items = new Map()
  }

  set(name, value, options = {}, currentUrl) {
    const url = new URL(currentUrl)
    const rawDomain = String(options.domain || url.hostname).replace(/^\./, '').toLowerCase()
    const path = options.path || '/'
    const hostOnly = !options.domain
    const key = `${rawDomain}|${path}|${name}`
    const maxAge = options.maxAge === undefined ? null : Number(options.maxAge)
    if (!value || maxAge === 0) {
      this.items.delete(key)
      return
    }
    this.items.set(key, {
      name,
      value,
      domain: rawDomain,
      path,
      hostOnly,
      secure: Boolean(options.secure),
      expires: options.expires ? new Date(options.expires).getTime() : null,
    })
  }

  absorb(headers, currentUrl) {
    const url = new URL(currentUrl)
    for (const header of responseSetCookies(headers)) {
      const parts = header.split(';').map((item) => item.trim())
      const first = parts.shift() || ''
      const equals = first.indexOf('=')
      if (equals <= 0) continue
      const name = first.slice(0, equals)
      const value = first.slice(equals + 1)
      const options = {}
      for (const part of parts) {
        const separator = part.indexOf('=')
        const key = (separator === -1 ? part : part.slice(0, separator)).toLowerCase()
        const optionValue = separator === -1 ? true : part.slice(separator + 1)
        if (key === 'domain') options.domain = optionValue
        else if (key === 'path') options.path = optionValue
        else if (key === 'secure') options.secure = true
        else if (key === 'max-age') options.maxAge = Number(optionValue)
        else if (key === 'expires') options.expires = optionValue
      }
      this.set(name, value, options, url)
    }
  }

  header(currentUrl) {
    const url = new URL(currentUrl)
    const now = Date.now()
    const pairs = []
    for (const [key, item] of this.items.entries()) {
      if (item.expires && item.expires <= now) {
        this.items.delete(key)
        continue
      }
      const domainMatches = item.hostOnly
        ? url.hostname === item.domain
        : url.hostname === item.domain || url.hostname.endsWith(`.${item.domain}`)
      if (!domainMatches || !url.pathname.startsWith(item.path)) continue
      if (item.secure && url.protocol !== 'https:') continue
      pairs.push(`${item.name}=${item.value}`)
    }
    return pairs.join('; ')
  }
}

async function requestWithJar(jar, input, init = {}, follow = true) {
  let url = new URL(input)
  let method = init.method || 'GET'
  let body = init.body
  let headers = new Headers(init.headers || {})
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const cookie = jar.header(url)
    if (cookie) headers.set('Cookie', cookie)
    else headers.delete('Cookie')
    const response = await fetch(url, {
      ...init,
      method,
      body,
      headers,
      redirect: 'manual',
      cache: 'no-store',
    })
    jar.absorb(response.headers, url)
    const location = response.headers.get('location')
    if (!follow || !location || ![301, 302, 303, 307, 308].includes(response.status)) return response
    url = new URL(location, url)
    if (response.status === 303 || ((response.status === 301 || response.status === 302) && method !== 'GET' && method !== 'HEAD')) {
      method = 'GET'
      body = undefined
      headers.delete('Content-Type')
    }
  }
  throw new Error('Demasiadas redirecciones al acceder al despliegue.')
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
}

function parseAttributes(tag) {
  const attributes = {}
  const expression = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
  let match
  while ((match = expression.exec(tag))) {
    const key = match[1]
    if (key.toLowerCase() === 'input') continue
    attributes[key] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? '')
  }
  return attributes
}

function formsIn(html) {
  return html.match(/<form\b[\s\S]*?<\/form>/gi) || []
}

function formHasName(form, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\bname=(?:"${escaped}"|'${escaped}')`).test(form)
}

function formHasHiddenValue(form, name, value) {
  for (const input of form.match(/<input\b[^>]*>/gi) || []) {
    const attributes = parseAttributes(input)
    if (attributes.name === name && attributes.value === value) return true
  }
  return false
}

function findForm(html, requiredNames, exactHidden = {}) {
  const found = formsIn(html).find((form) => (
    requiredNames.every((name) => formHasName(form, name))
    && Object.entries(exactHidden).every(([name, value]) => formHasHiddenValue(form, name, value))
  ))
  if (!found) throw new Error(`No se encontró el formulario esperado: ${requiredNames.join(', ')}.`)
  return found
}

function hiddenInputs(form) {
  const values = []
  for (const input of form.match(/<input\b[^>]*>/gi) || []) {
    const attributes = parseAttributes(input)
    if (attributes.type === 'hidden' && attributes.name) values.push([attributes.name, attributes.value || ''])
  }
  return values
}

async function fetchHtml(jar, url) {
  const response = await requestWithJar(jar, url, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'User-Agent': 'Hilo-Cofrade-Relational-Validation/1.0',
    },
  }, true)
  const text = await response.text()
  if (!response.ok) throw new Error(`La página ${new URL(url).pathname} devolvió ${response.status}.`)
  if (/\/panel\/login/.test(response.url) || text.includes('Entrar al panel')) {
    throw new Error('La sesión editorial no quedó autenticada en el Panel.')
  }
  return { html: text, url: response.url }
}

async function submitPanelForm(jar, pageUrl, requiredNames, fields, exactHidden = {}) {
  const page = await fetchHtml(jar, pageUrl)
  const form = findForm(page.html, requiredNames, exactHidden)
  const data = new FormData()
  const provided = new Set(Object.keys(fields))
  for (const [name, value] of hiddenInputs(form)) {
    if (!provided.has(name)) data.append(name, value)
  }
  for (const [name, rawValue] of Object.entries(fields)) {
    if (Array.isArray(rawValue)) rawValue.forEach((value) => data.append(name, String(value)))
    else if (rawValue !== undefined && rawValue !== null) data.append(name, String(rawValue))
  }
  const origin = new URL(page.url).origin
  const response = await requestWithJar(jar, page.url, {
    method: 'POST',
    body: data,
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      Origin: origin,
      Referer: page.url,
      'User-Agent': 'Hilo-Cofrade-Relational-Validation/1.0',
    },
  }, false)
  const location = response.headers.get('location')
  const responseText = location ? '' : await response.text()
  return { status: response.status, location, body: responseText.slice(0, 1000) }
}

function requireRedirect(result, label) {
  if (!result.location || ![302, 303].includes(result.status)) {
    throw new Error(`${label} no terminó correctamente (${result.status}): ${result.body}`)
  }
  return result.location
}

function idFromLocation(location, section, origin) {
  const pathname = new URL(location, origin).pathname
  const match = pathname.match(new RegExp(`^/panel/${section}/([0-9a-f-]{36})(?:/|$)`))
  if (!match) throw new Error(`No se pudo recuperar el identificador creado desde ${pathname}.`)
  return match[1]
}

function jwtSubject(accessToken) {
  const parts = accessToken.split('.')
  if (parts.length < 2) throw new Error('Token editorial no válido.')
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
  if (!payload.sub) throw new Error('El token editorial no contiene usuario.')
  return payload.sub
}

function restClient(appUrl, appKey, accessToken) {
  async function request(table, { method = 'GET', query = {}, body, prefer } = {}) {
    const url = new URL(`/rest/v1/${table}`, appUrl)
    for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value)
    const headers = {
      apikey: appKey,
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    }
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    if (prefer) headers.Prefer = prefer
    const response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
    })
    const text = await response.text()
    let parsed = null
    if (text) {
      try { parsed = JSON.parse(text) } catch { parsed = text }
    }
    if (!response.ok) throw new Error(`REST ${method} ${table} falló (${response.status}): ${typeof parsed === 'string' ? parsed.slice(0, 500) : JSON.stringify(parsed)}`)
    return parsed
  }
  return { request }
}

async function publicRest(appUrl, appKey, table, query = {}) {
  const url = new URL(`/rest/v1/${table}`, appUrl)
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value)
  const response = await fetch(url, {
    headers: { apikey: appKey, Authorization: `Bearer ${appKey}`, Accept: 'application/json' },
    cache: 'no-store',
  })
  const body = await readResponse(response)
  if (!response.ok) throw new Error(`Consulta pública falló (${response.status}).`)
  return body
}

async function createPanelCookies(appUrl, appKey, accessToken, refreshToken, previewOrigin) {
  const current = []
  const setAll = (cookies) => {
    for (const cookie of cookies) {
      const index = current.findIndex((item) => item.name === cookie.name)
      if (index === -1) current.push(cookie)
      else current[index] = cookie
    }
  }
  const client = createServerClient(appUrl, appKey, {
    cookies: {
      getAll() { return current.map(({ name, value }) => ({ name, value })) },
      setAll,
    },
  })
  const { error } = await client.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
  if (error) throw new Error(`No se pudo preparar la sesión SSR: ${error.message}`)
  const jar = new CookieJar()
  for (const cookie of current) jar.set(cookie.name, cookie.value, cookie.options || { path: '/' }, previewOrigin)
  return jar
}

async function runPanelE2E(panelLink, previewShareUrl) {
  const appUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const appKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!appUrl || !appKey) throw new Error('Falta la configuración pública de Supabase.')
  const projectHost = new URL(appUrl).hostname
  const preview = new URL(previewShareUrl)
  if (!preview.hostname.endsWith('.vercel.app')) throw new Error('El despliegue de prueba no es válido.')

  const { accessToken, refreshToken } = await consumeAuthLink(panelLink, projectHost)
  const userId = jwtSubject(accessToken)
  const rest = restClient(appUrl, appKey, accessToken)
  const profileRows = await rest.request('panel_users', {
    query: { select: 'user_id,role,active', user_id: `eq.${userId}` },
  })
  const profile = Array.isArray(profileRows) ? profileRows[0] : null
  if (!profile?.active || !['admin', 'editor'].includes(profile.role)) {
    throw new Error('La cuenta no tiene permisos de edición en el Panel.')
  }

  const jar = await createPanelCookies(appUrl, appKey, accessToken, refreshToken, preview.origin)
  const bypass = await requestWithJar(jar, preview, {
    headers: { 'User-Agent': 'Hilo-Cofrade-Relational-Validation/1.0' },
  }, true)
  if (!bypass.ok) throw new Error(`No se pudo abrir el despliegue de prueba (${bypass.status}).`)
  const origin = preview.origin
  const runId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  const label = `HC QA ${runId}`
  const slugs = {
    brotherhood: `hc-qa-hermandad-${runId}`,
    image: `hc-qa-imagen-${runId}`,
    step: `hc-qa-paso-${runId}`,
    agent: `hc-qa-agente-${runId}`,
  }
  const ids = {}
  const relations = {}
  const checks = []

  async function entityBySlug(slug) {
    const rows = await rest.request('entities', {
      query: { select: 'id,entity_type,name,slug,status', slug: `eq.${slug}` },
    })
    return Array.isArray(rows) ? rows[0] : null
  }

  async function assertSingle(table, query, labelText) {
    const rows = await rest.request(table, { query: { select: '*', ...query } })
    if (!Array.isArray(rows) || rows.length !== 1) throw new Error(`${labelText}: se esperó una fila y se obtuvieron ${Array.isArray(rows) ? rows.length : 0}.`)
    return rows[0]
  }

  try {
    let result = await submitPanelForm(jar, `${origin}/panel/hermandades/nueva`, ['popular_name', 'official_name'], {
      popular_name: `${label} Hermandad`,
      official_name: `Muy Ilustre ${label} Hermandad`,
      slug: slugs.brotherhood,
    })
    ids.brotherhood = idFromLocation(requireRedirect(result, 'El alta de Hermandad'), 'hermandades', origin)
    const brotherhoodEntity = await entityBySlug(slugs.brotherhood)
    if (!brotherhoodEntity || brotherhoodEntity.id !== ids.brotherhood || brotherhoodEntity.status !== 'draft' || brotherhoodEntity.entity_type !== 'brotherhood') throw new Error('La Hermandad no quedó creada correctamente como borrador.')
    await assertSingle('brotherhoods', { entity_id: `eq.${ids.brotherhood}` }, 'Ficha de Hermandad')
    checks.push('brotherhood-created')

    result = await submitPanelForm(jar, `${origin}/panel/imagenes/nueva`, ['name', 'image_type'], {
      name: `${label} Imagen`, image_type: 'Imagen de prueba', slug: slugs.image,
    })
    ids.image = idFromLocation(requireRedirect(result, 'El alta de Imagen'), 'imagenes', origin)
    const imageEntity = await entityBySlug(slugs.image)
    if (!imageEntity || imageEntity.id !== ids.image || imageEntity.status !== 'draft' || imageEntity.entity_type !== 'image') throw new Error('La Imagen no quedó creada correctamente como borrador.')
    await assertSingle('images', { entity_id: `eq.${ids.image}` }, 'Ficha de Imagen')
    checks.push('image-created')

    result = await submitPanelForm(jar, `${origin}/panel/hermandades/${ids.brotherhood}/titulares`, ['brotherhood_id', 'image_entity_id', 'relation_type'], {
      brotherhood_id: ids.brotherhood,
      image_entity_id: ids.image,
      relation_type: 'titular',
      date_from: '2026-01-01',
      date_to: '',
    })
    requireRedirect(result, 'La relación Hermandad/Imagen')
    let row = await assertSingle('brotherhood_images', {
      brotherhood_entity_id: `eq.${ids.brotherhood}`,
      image_entity_id: `eq.${ids.image}`,
      relation_type: 'eq.titular',
    }, 'Relación Hermandad/Imagen')
    relations.brotherhoodImage = row.id

    const duplicateBrotherhoodImage = await submitPanelForm(jar, `${origin}/panel/hermandades/${ids.brotherhood}/titulares`, ['brotherhood_id', 'image_entity_id', 'relation_type'], {
      brotherhood_id: ids.brotherhood,
      image_entity_id: ids.image,
      relation_type: 'titular',
      date_from: '2026-01-01',
      date_to: '',
    })
    const brotherhoodImageRows = await rest.request('brotherhood_images', {
      query: { select: 'id', brotherhood_entity_id: `eq.${ids.brotherhood}`, image_entity_id: `eq.${ids.image}`, relation_type: 'eq.titular' },
    })
    if (!Array.isArray(brotherhoodImageRows) || brotherhoodImageRows.length !== 1 || duplicateBrotherhoodImage.location) throw new Error('La relación Hermandad/Imagen permitió un duplicado evidente.')

    result = await submitPanelForm(jar, `${origin}/panel/hermandades/${ids.brotherhood}/titulares`, ['brotherhood_id', 'relation_id', 'relation_type'], {
      brotherhood_id: ids.brotherhood,
      relation_id: relations.brotherhoodImage,
      relation_type: 'titular',
      date_from: '2026-01-01',
      date_to: '2026-01-31',
    }, { relation_id: relations.brotherhoodImage })
    requireRedirect(result, 'La edición Hermandad/Imagen')
    row = await assertSingle('brotherhood_images', { id: `eq.${relations.brotherhoodImage}` }, 'Histórico Hermandad/Imagen')
    if (row.date_to !== '2026-01-31') throw new Error('La relación Hermandad/Imagen no conservó su cierre histórico.')
    checks.push('brotherhood-image-linked-edited-deduplicated')

    result = await submitPanelForm(jar, `${origin}/panel/pasos/nuevo`, ['name', 'step_type'], {
      name: `${label} Paso`, step_type: 'Paso de prueba', slug: slugs.step,
    })
    ids.step = idFromLocation(requireRedirect(result, 'El alta de Paso'), 'pasos', origin)
    const stepEntity = await entityBySlug(slugs.step)
    if (!stepEntity || stepEntity.id !== ids.step || stepEntity.status !== 'draft' || stepEntity.entity_type !== 'step') throw new Error('El Paso no quedó creado correctamente como borrador.')
    await assertSingle('steps', { entity_id: `eq.${ids.step}` }, 'Ficha de Paso')
    checks.push('step-created')

    result = await submitPanelForm(jar, `${origin}/panel/hermandades/${ids.brotherhood}/pasos`, ['brotherhood_id', 'step_entity_id', 'relation_type'], {
      brotherhood_id: ids.brotherhood,
      step_entity_id: ids.step,
      relation_type: 'processional_step',
      date_from: '2026-02-01',
      date_to: '',
    })
    requireRedirect(result, 'La relación Hermandad/Paso')
    row = await assertSingle('brotherhood_steps', {
      brotherhood_entity_id: `eq.${ids.brotherhood}`,
      step_entity_id: `eq.${ids.step}`,
      relation_type: 'eq.processional_step',
    }, 'Relación Hermandad/Paso')
    relations.brotherhoodStep = row.id

    const duplicateBrotherhoodStep = await submitPanelForm(jar, `${origin}/panel/hermandades/${ids.brotherhood}/pasos`, ['brotherhood_id', 'step_entity_id', 'relation_type'], {
      brotherhood_id: ids.brotherhood,
      step_entity_id: ids.step,
      relation_type: 'processional_step',
      date_from: '2026-02-01',
      date_to: '',
    })
    const brotherhoodStepRows = await rest.request('brotherhood_steps', {
      query: { select: 'id', brotherhood_entity_id: `eq.${ids.brotherhood}`, step_entity_id: `eq.${ids.step}`, relation_type: 'eq.processional_step' },
    })
    if (!Array.isArray(brotherhoodStepRows) || brotherhoodStepRows.length !== 1 || duplicateBrotherhoodStep.location) throw new Error('La relación Hermandad/Paso permitió un duplicado evidente.')

    result = await submitPanelForm(jar, `${origin}/panel/hermandades/${ids.brotherhood}/pasos`, ['brotherhood_id', 'relation_id', 'relation_type'], {
      brotherhood_id: ids.brotherhood,
      relation_id: relations.brotherhoodStep,
      relation_type: 'processional_step',
      date_from: '2026-02-01',
      date_to: '2026-02-28',
    }, { relation_id: relations.brotherhoodStep })
    requireRedirect(result, 'La edición Hermandad/Paso')
    row = await assertSingle('brotherhood_steps', { id: `eq.${relations.brotherhoodStep}` }, 'Histórico Hermandad/Paso')
    if (row.date_to !== '2026-02-28') throw new Error('La relación Hermandad/Paso no conservó su cierre histórico.')
    checks.push('brotherhood-step-linked-edited-deduplicated')

    result = await submitPanelForm(jar, `${origin}/panel/relaciones/imagen-paso`, ['image_entity_id', 'step_entity_id', 'relation_type'], {
      image_entity_id: ids.image,
      step_entity_id: ids.step,
      relation_type: 'processes_on',
      date_from: '2026-03-01',
      date_to: '',
    })
    requireRedirect(result, 'La relación Imagen/Paso')
    row = await assertSingle('image_steps', {
      image_entity_id: `eq.${ids.image}`,
      step_entity_id: `eq.${ids.step}`,
      relation_type: 'eq.processes_on',
    }, 'Relación Imagen/Paso')
    relations.imageStep = row.id

    const duplicateImageStep = await submitPanelForm(jar, `${origin}/panel/relaciones/imagen-paso`, ['image_entity_id', 'step_entity_id', 'relation_type'], {
      image_entity_id: ids.image,
      step_entity_id: ids.step,
      relation_type: 'processes_on',
      date_from: '2026-03-01',
      date_to: '',
    })
    const imageStepRows = await rest.request('image_steps', {
      query: { select: 'id', image_entity_id: `eq.${ids.image}`, step_entity_id: `eq.${ids.step}`, relation_type: 'eq.processes_on' },
    })
    if (!Array.isArray(imageStepRows) || imageStepRows.length !== 1 || duplicateImageStep.location) throw new Error('La relación Imagen/Paso permitió un duplicado evidente.')

    result = await submitPanelForm(jar, `${origin}/panel/relaciones/imagen-paso`, ['relation_id', 'relation_type'], {
      relation_id: relations.imageStep,
      relation_type: 'processes_on',
      date_from: '2026-03-01',
      date_to: '2026-03-31',
    }, { relation_id: relations.imageStep })
    requireRedirect(result, 'La edición Imagen/Paso')
    row = await assertSingle('image_steps', { id: `eq.${relations.imageStep}` }, 'Histórico Imagen/Paso')
    if (row.date_to !== '2026-03-31') throw new Error('La relación Imagen/Paso no conservó su cierre histórico.')
    checks.push('image-step-linked-edited-deduplicated')

    result = await submitPanelForm(jar, `${origin}/panel/agentes/nuevo`, ['name', 'agent_kind'], {
      name: `${label} Autor`, agent_kind: 'person', slug: slugs.agent,
    })
    ids.agent = idFromLocation(requireRedirect(result, 'El alta de Agente'), 'agentes', origin)
    const agentEntity = await entityBySlug(slugs.agent)
    if (!agentEntity || agentEntity.id !== ids.agent || agentEntity.status !== 'draft' || agentEntity.entity_type !== 'agent') throw new Error('El Agente no quedó creado correctamente como borrador.')
    await assertSingle('agents', { entity_id: `eq.${ids.agent}` }, 'Ficha de Agente')
    checks.push('agent-created')

    result = await submitPanelForm(jar, `${origin}/panel/imagenes/${ids.image}/autorias`, ['image_id', 'agent_entity_id', 'authorship_type', 'certainty'], {
      image_id: ids.image,
      agent_entity_id: ids.agent,
      authorship_type: 'author',
      certainty: 'documented',
      role_name: 'autor',
      date_from: '2020-01-01',
      date_to: '',
    })
    requireRedirect(result, 'La autoría Imagen/Agente')
    row = await assertSingle('image_authorships', {
      image_entity_id: `eq.${ids.image}`,
      agent_entity_id: `eq.${ids.agent}`,
      authorship_type: 'eq.author',
      role_name: 'eq.autor',
    }, 'Autoría Imagen/Agente')
    relations.authorship = row.id

    const duplicateAuthorship = await submitPanelForm(jar, `${origin}/panel/imagenes/${ids.image}/autorias`, ['image_id', 'agent_entity_id', 'authorship_type', 'certainty'], {
      image_id: ids.image,
      agent_entity_id: ids.agent,
      authorship_type: 'author',
      certainty: 'documented',
      role_name: 'autor',
      date_from: '2020-01-01',
      date_to: '',
    })
    const authorshipRows = await rest.request('image_authorships', {
      query: { select: 'id', image_entity_id: `eq.${ids.image}`, agent_entity_id: `eq.${ids.agent}`, authorship_type: 'eq.author', role_name: 'eq.autor' },
    })
    if (!Array.isArray(authorshipRows) || authorshipRows.length !== 1 || duplicateAuthorship.location) throw new Error('La autoría Imagen/Agente permitió un duplicado evidente.')

    result = await submitPanelForm(jar, `${origin}/panel/imagenes/${ids.image}/autorias`, ['image_id', 'relation_id', 'authorship_type', 'certainty'], {
      image_id: ids.image,
      relation_id: relations.authorship,
      authorship_type: 'author',
      certainty: 'documented',
      role_name: 'autor',
      date_from: '2020-01-01',
      date_to: '2020-12-31',
    }, { relation_id: relations.authorship })
    requireRedirect(result, 'La edición Imagen/Agente')
    row = await assertSingle('image_authorships', { id: `eq.${relations.authorship}` }, 'Histórico Imagen/Agente')
    if (row.date_to !== '2020-12-31' || row.certainty !== 'documented' || row.authorship_type !== 'author') throw new Error('La autoría no conservó correctamente su edición histórica.')
    checks.push('authorship-linked-edited-deduplicated')

    for (const [kind, path, requiredNames, fields] of [
      ['brotherhood', '/panel/hermandades/nueva', ['popular_name', 'official_name'], { popular_name: `${label} Hermandad`, official_name: `Muy Ilustre ${label} Hermandad`, slug: slugs.brotherhood }],
      ['image', '/panel/imagenes/nueva', ['name', 'image_type'], { name: `${label} Imagen`, image_type: 'Imagen de prueba', slug: slugs.image }],
      ['step', '/panel/pasos/nuevo', ['name', 'step_type'], { name: `${label} Paso`, step_type: 'Paso de prueba', slug: slugs.step }],
      ['agent', '/panel/agentes/nuevo', ['name', 'agent_kind'], { name: `${label} Autor`, agent_kind: 'person', slug: slugs.agent }],
    ]) {
      const duplicate = await submitPanelForm(jar, `${origin}${path}`, requiredNames, fields)
      const rows = await rest.request('entities', { query: { select: 'id', slug: `eq.${slugs[kind]}` } })
      if (!Array.isArray(rows) || rows.length !== 1 || duplicate.location) throw new Error(`El alta de ${kind} permitió un duplicado evidente.`)
    }
    checks.push('entity-duplicates-rejected')

    for (const slug of Object.values(slugs)) {
      const rows = await publicRest(appUrl, appKey, 'entities', { select: 'id,slug,status', slug: `eq.${slug}` })
      if (!Array.isArray(rows) || rows.length !== 0) throw new Error(`El borrador ${slug} es visible mediante la API pública.`)
    }

    const publicBase = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL}`
    for (const [section, slug, name] of [
      ['hermandades', slugs.brotherhood, `${label} Hermandad`],
      ['imagenes', slugs.image, `${label} Imagen`],
      ['pasos', slugs.step, `${label} Paso`],
    ]) {
      const response = await fetch(`${publicBase}/${section}/${slug}`, { redirect: 'manual', cache: 'no-store' })
      const text = await response.text()
      if (response.status === 200 && text.includes(name)) throw new Error(`El borrador ${slug} aparece en la web pública.`)
    }
    checks.push('drafts-hidden-publicly')

    return { passed: true, role: profile.role, checks, ids, slugs }
  } finally {
    if (ids.image && profile.role === 'admin') {
      for (const id of [ids.image, ids.step, ids.brotherhood, ids.agent].filter(Boolean)) {
        try {
          await rest.request('entities', { method: 'DELETE', query: { id: `eq.${id}` } })
        } catch {
          // La limpieza no invalida la prueba; los registros siguen siendo borradores no públicos.
        }
      }
    } else if (Object.keys(ids).length) {
      for (const id of Object.values(ids)) {
        try {
          await rest.request('entities', {
            method: 'PATCH',
            query: { id: `eq.${id}` },
            body: { status: STATUS_SET.has('archived') ? 'archived' : 'draft' },
          })
        } catch {
          // Conserva los borradores si el perfil no puede archivarlos.
        }
      }
    }
  }
}

export async function GET(request) {
  if (process.env.VERCEL_ENV !== 'production') return new NextResponse(null, { status: 404 })
  try {
    const payload = readSignedPayload(request)
    if (payload.action === 'dashboard-recovery') return json(await requestDashboardRecovery())
    if (payload.action === 'panel-magic') return json(await requestPanelMagicLink())
    if (payload.action === 'apply-migration') return json(await applyMigration(payload.dashboardLink || ''))
    if (payload.action === 'e2e') return json(await runPanelE2E(payload.panelLink || '', payload.preview || ''))
    return json({ error: 'Acción no válida.' }, 400)
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 500)
  }
}
