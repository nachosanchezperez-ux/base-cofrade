const TRACKING_PARAMS = new Set([
  'fbclid',
  'gclid',
  'dclid',
  'msclkid',
  'mc_cid',
  'mc_eid',
])

function isTrackingParam(name) {
  const key = String(name || '').toLowerCase()
  return key.startsWith('utm_') || TRACKING_PARAMS.has(key)
}

export function normalizeSourceUrl(candidate) {
  const raw = String(candidate || '').trim()
  if (!raw) return null

  const prepared = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`
  let parsed
  try {
    parsed = new URL(prepared)
  } catch {
    throw new Error('La URL de la Fuente no es válida.')
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('La URL de la Fuente debe usar http o https.')
  }

  parsed.hash = ''
  parsed.hostname = parsed.hostname.toLowerCase()

  for (const key of [...parsed.searchParams.keys()]) {
    if (isTrackingParam(key)) parsed.searchParams.delete(key)
  }
  parsed.searchParams.sort()

  if (parsed.pathname.length > 1) parsed.pathname = parsed.pathname.replace(/\/+$/, '') || '/'

  let normalized = parsed.toString()
  if (!parsed.search && parsed.pathname === '/') normalized = normalized.replace(/\/$/, '')
  return normalized
}

export function sourceUrlVariants(candidate) {
  const canonical = normalizeSourceUrl(candidate)
  if (!canonical) return []

  const values = new Set([canonical])
  const parsed = new URL(canonical)
  if (!parsed.search) {
    values.add(canonical.endsWith('/') ? canonical.slice(0, -1) : `${canonical}/`)
  }
  return [...values].filter(Boolean)
}
