// «Mis hermandades»: la selección vive solo en el navegador del usuario
// (localStorage), sin cuentas ni datos personales en el servidor.
// Las funciones puras (normalize/toggle/slugFromHref) se prueban con node --test;
// las de almacenamiento toleran navegadores sin localStorage o en modo privado.

export const FOLLOWED_STORAGE_KEY = 'hc:mis-hermandades:v1'
export const FOLLOWED_CHANGE_EVENT = 'hc:mis-hermandades'
export const FOLLOWED_LIMIT = 40

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function brotherhoodSlugFromHref(href = '') {
  const match = /^\/hermandades\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?(?:[#?].*)?$/.exec(String(href || ''))
  return match ? match[1] : ''
}

// Hermandades de un acto de la Agenda: la organizadora y, en conciertos y actos
// compartidos, la Hermandad relacionada. Igual que el calendario de cada una.
export function agendaItemBrotherhoodSlugs(item = {}) {
  return [...new Set([item.organizerHref, item.relatedBrotherhoodHref].map(brotherhoodSlugFromHref).filter(Boolean))]
}

export function normalizeFollowed(value) {
  const list = Array.isArray(value) ? value : []
  const seen = new Set()
  const result = []
  for (const item of list) {
    const slug = String(item?.slug || '').trim()
    if (!SLUG.test(slug) || seen.has(slug)) continue
    seen.add(slug)
    result.push({ slug, name: String(item?.name || slug).trim().slice(0, 120), municipality: String(item?.municipality || '').trim().slice(0, 80) })
    if (result.length >= FOLLOWED_LIMIT) break
  }
  return result
}

export function toggleFollowed(list, brotherhood) {
  const current = normalizeFollowed(list)
  const slug = String(brotherhood?.slug || '')
  if (!SLUG.test(slug)) return current
  if (current.some((item) => item.slug === slug)) return current.filter((item) => item.slug !== slug)
  return normalizeFollowed([{ slug, name: brotherhood.name, municipality: brotherhood.municipality }, ...current])
}

export function readFollowed() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return []
    return normalizeFollowed(JSON.parse(window.localStorage.getItem(FOLLOWED_STORAGE_KEY) || '[]'))
  } catch {
    return []
  }
}

let memoryRaw = '[]'

export function writeFollowed(list) {
  const value = normalizeFollowed(list)
  memoryRaw = JSON.stringify(value)
  try {
    window.localStorage.setItem(FOLLOWED_STORAGE_KEY, memoryRaw)
  } catch {
    // Sin almacenamiento (modo privado o bloqueado): se mantiene en esta visita.
  }
  try {
    window.dispatchEvent(new CustomEvent(FOLLOWED_CHANGE_EVENT, { detail: value }))
  } catch {
    // Navegadores muy antiguos: no hay sincronización entre componentes.
  }
  return value
}

// Para useSyncExternalStore: cambios en esta pestaña y en otras.
export function subscribeFollowed(callback) {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event) => { if (event.key === FOLLOWED_STORAGE_KEY) callback() }
  window.addEventListener(FOLLOWED_CHANGE_EVENT, callback)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(FOLLOWED_CHANGE_EVENT, callback)
    window.removeEventListener('storage', onStorage)
  }
}

let cachedRaw = null
let cachedList = []
// Devuelve la misma referencia mientras no cambie el almacenamiento.
export function followedSnapshot() {
  let raw = memoryRaw
  try { raw = window.localStorage.getItem(FOLLOWED_STORAGE_KEY) ?? memoryRaw } catch { raw = memoryRaw }
  if (raw !== cachedRaw) {
    cachedRaw = raw
    try { cachedList = normalizeFollowed(JSON.parse(raw)) } catch { cachedList = [] }
  }
  return cachedList
}

const EMPTY = []
export function followedServerSnapshot() {
  return EMPTY
}
