// «Mis bandas»: igual que «Mis hermandades», la selección vive solo en el
// navegador (localStorage), sin cuentas ni datos personales en el servidor.
// Reutiliza la normalización de lib/followed-brotherhoods.js (lista de
// {slug, name, municipality}) con su propia clave y su propio evento.
import { normalizeFollowed, toggleFollowed } from './followed-brotherhoods.js'

export const FOLLOWED_BANDS_STORAGE_KEY = 'hc:mis-bandas:v1'
export const FOLLOWED_BANDS_CHANGE_EVENT = 'hc:mis-bandas'

export { normalizeFollowed as normalizeFollowedBands, toggleFollowed as toggleFollowedBand }

let memoryRaw = '[]'

export function writeFollowedBands(list) {
  const value = normalizeFollowed(list)
  memoryRaw = JSON.stringify(value)
  try {
    window.localStorage.setItem(FOLLOWED_BANDS_STORAGE_KEY, memoryRaw)
  } catch {
    // Sin almacenamiento (modo privado o bloqueado): se mantiene en esta visita.
  }
  try {
    window.dispatchEvent(new CustomEvent(FOLLOWED_BANDS_CHANGE_EVENT, { detail: value }))
  } catch {
    // Sin sincronización entre componentes en navegadores muy antiguos.
  }
  return value
}

export function subscribeFollowedBands(callback) {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event) => { if (event.key === FOLLOWED_BANDS_STORAGE_KEY) callback() }
  window.addEventListener(FOLLOWED_BANDS_CHANGE_EVENT, callback)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(FOLLOWED_BANDS_CHANGE_EVENT, callback)
    window.removeEventListener('storage', onStorage)
  }
}

let cachedRaw = null
let cachedList = []
export function followedBandsSnapshot() {
  let raw = memoryRaw
  try { raw = window.localStorage.getItem(FOLLOWED_BANDS_STORAGE_KEY) ?? memoryRaw } catch { raw = memoryRaw }
  if (raw !== cachedRaw) {
    cachedRaw = raw
    try { cachedList = normalizeFollowed(JSON.parse(raw)) } catch { cachedList = [] }
  }
  return cachedList
}

const EMPTY = []
export function followedBandsServerSnapshot() {
  return EMPTY
}

// Novedades que tocan algo que el usuario sigue (Hermandad o banda).
export function isFollowedUpdate(update, { brotherhoods = [], bands = [] } = {}) {
  const follow = update?.follow
  if (!follow) return false
  return (follow.brotherhood && brotherhoods.some((item) => item.slug === follow.brotherhood))
    || (follow.band && bands.some((item) => item.slug === follow.band))
}
