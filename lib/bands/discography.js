const RELEASE_TYPES = new Map([
  ['album', 'Álbum'],
  ['live', 'En directo'],
  ['compilation', 'Recopilatorio'],
  ['single', 'Sencillo'],
  ['ep', 'EP'],
])

export function presentReleaseType(value = '') {
  const raw = String(value || '').trim()
  return RELEASE_TYPES.get(raw.toLocaleLowerCase('es')) || raw
}

export function externalReleaseLinkLabel(value = '') {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./, '')
    if (hostname === 'music.apple.com') return 'Escuchar en Apple Music ↗'
    if (hostname === 'youtube.com' || hostname === 'youtu.be') return 'Escuchar en YouTube ↗'
  } catch {
    // Conserva una etiqueta neutra si el enlace heredado no es una URL válida.
  }
  return 'Más información ↗'
}
