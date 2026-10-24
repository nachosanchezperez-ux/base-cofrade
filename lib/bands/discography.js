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

const FOLD_THRESHOLD = 6
const RECENT_VISIBLE = 3

function decadeOf(release) {
  const year = Number(release?.year)
  return Number.isFinite(year) && year > 0 ? Math.floor(year / 10) * 10 : null
}

// Rótulo con los años reales del grupo (p. ej. «1986–1989»), no la década teórica.
function periodLabel(releases = []) {
  const years = releases.map((release) => Number(release.year)).filter((year) => Number.isFinite(year) && year > 0)
  if (!years.length) return 'Sin fecha'
  const first = Math.min(...years)
  const last = Math.max(...years)
  return first === last ? String(first) : `${first}–${last}`
}

/**
 * Discografía plegada (24/10/2026): los últimos trabajos quedan visibles y el
 * resto se agrupa por décadas. Una década con un solo trabajo se une a la
 * siguiente (o a la anterior si es la última), para no crear grupos de uno.
 * Las listas cortas se muestran enteras. `releases` llega ordenado del más
 * reciente al más antiguo.
 */
export function groupReleasesForDisplay(releases = [], { visible = RECENT_VISIBLE, threshold = FOLD_THRESHOLD } = {}) {
  if (releases.length <= threshold) return { recent: releases, groups: [] }

  const recent = releases.slice(0, visible)
  const decades = []
  for (const release of releases.slice(visible)) {
    const decade = decadeOf(release)
    const current = decades[decades.length - 1]
    if (current && current.decade === decade) current.releases.push(release)
    else decades.push({ decade, releases: [release] })
  }

  const merged = []
  for (let index = 0; index < decades.length; index += 1) {
    const group = { from: decades[index].decade, to: decades[index].decade, releases: [...decades[index].releases] }
    const canMerge = (next) => next && group.from !== null && next.decade !== null
    while (group.releases.length === 1 && canMerge(decades[index + 1])) {
      index += 1
      group.to = decades[index].decade
      group.releases.push(...decades[index].releases)
    }
    const previous = merged[merged.length - 1]
    if (group.releases.length === 1 && previous && previous.from !== null && group.from !== null) {
      previous.to = group.to
      previous.releases.push(...group.releases)
    } else {
      merged.push(group)
    }
  }

  return {
    recent,
    groups: merged.map((group) => ({
      key: `${group.from ?? 'sin-fecha'}-${group.to ?? ''}`,
      label: periodLabel(group.releases),
      releases: group.releases,
    })),
  }
}
