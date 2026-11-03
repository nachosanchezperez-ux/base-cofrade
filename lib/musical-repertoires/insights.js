// Lecturas transversales de las crucetas publicadas. Funciones puras: reciben
// las crucetas ya cargadas (getMusicalRepertoires / getMusicalRepertoireBySlug)
// y no consultan Supabase. Se agrupa siempre por marcha (march entity id), no por
// título: dos obras distintas pueden llamarse igual («Macarena»).

function entryKey(entry) {
  return entry.marchId || `titulo:${String(entry.title || '').toLowerCase()}`
}

// «Lo que más suena»: marchas presentes en más crucetas.
export function topMarches(repertoires = [], { limit = 6, minRepertoires = 3 } = {}) {
  const byMarch = new Map()

  for (const repertoire of repertoires) {
    for (const entry of repertoire.entries || []) {
      const key = entryKey(entry)
      const item = byMarch.get(key) || {
        id: key,
        title: entry.catalogTitle || entry.title,
        href: entry.marchHref || '',
        repertoireIds: new Set(),
        bandIds: new Set(),
        performances: 0,
      }
      item.repertoireIds.add(repertoire.id)
      if (repertoire.band?.id) item.bandIds.add(repertoire.band.id)
      item.performances += Number(entry.count) || 1
      byMarch.set(key, item)
    }
  }

  return [...byMarch.values()]
    .map((item) => ({
      id: item.id,
      title: item.title,
      href: item.href,
      repertoires: item.repertoireIds.size,
      bands: item.bandIds.size,
      performances: item.performances,
    }))
    .filter((item) => item.repertoires >= minRepertoires)
    .sort((first, second) => second.repertoires - first.repertoires
      || second.performances - first.performances
      || first.title.localeCompare(second.title, 'es'))
    .slice(0, limit)
}

// Marchas compuestas el mismo año de la cruceta, con dónde sonaron. Se marca
// «estreno» solo cuando la fecha de estreno documentada coincide con la salida.
export function newMarchesOfYear(repertoires = [], year) {
  const byMarch = new Map()

  for (const repertoire of repertoires) {
    if (year && Number(repertoire.year) !== Number(year)) continue
    for (const entry of repertoire.entries || []) {
      if (!entry.isNewThisYear) continue
      const key = entryKey(entry)
      const item = byMarch.get(key) || {
        id: key,
        title: entry.catalogTitle || entry.title,
        href: entry.marchHref || '',
        premiere: null,
        sounded: [],
      }
      const sounded = {
        href: repertoire.href,
        label: repertoire.identityName || repertoire.brotherhood?.name || repertoire.displayTitle,
        band: repertoire.band?.name || '',
        date: repertoire.date || '',
      }
      if (!item.sounded.some((existing) => existing.href === sounded.href)) item.sounded.push(sounded)
      if (entry.isPremiere) item.premiere = sounded
      byMarch.set(key, item)
    }
  }

  return [...byMarch.values()]
    .map((item) => ({ ...item, sounded: item.sounded.sort((first, second) => first.date.localeCompare(second.date)) }))
    .sort((first, second) => second.sounded.length - first.sounded.length || first.title.localeCompare(second.title, 'es'))
}

// Marchas habituales de una banda: presentes en al menos el 75 % de sus crucetas,
// y solo cuando la banda tiene tres o más crucetas publicadas.
export function bandHabitualMarchIds(repertoires = [], bandId, { minRepertoires = 3, share = 0.75 } = {}) {
  const own = repertoires.filter((item) => bandId && item.band?.id === bandId)
  if (own.length < minRepertoires) return new Set()

  const counts = new Map()
  for (const repertoire of own) {
    for (const key of new Set((repertoire.entries || []).map(entryKey))) {
      counts.set(key, (counts.get(key) || 0) + 1)
    }
  }

  const threshold = Math.ceil(own.length * share)
  return new Set([...counts].filter(([, count]) => count >= threshold).map(([key]) => key))
}

export function isHabitualEntry(entry, habitualIds) {
  return habitualIds.has(entryKey(entry))
}

// La cruceta del año anterior de la misma Hermandad y el mismo tipo de salida.
export function previousEdition(repertoire, repertoires = []) {
  if (!repertoire?.brotherhood?.id || !repertoire.year) return null
  return repertoires
    .filter((item) => item.id !== repertoire.id
      && item.brotherhood?.id === repertoire.brotherhood.id
      && Number(item.year) === Number(repertoire.year) - 1
      && (item.outing?.type || '') === (repertoire.outing?.type || ''))
    .sort((first, second) => String(second.date || '').localeCompare(String(first.date || '')))[0] || null
}

export function compareEditions(current, previous) {
  if (!current || !previous) return null
  const keysOf = (repertoire) => new Map((repertoire.entries || []).map((entry) => [entryKey(entry), entry]))
  const now = keysOf(current)
  const before = keysOf(previous)
  const pick = (entry) => ({ title: entry.catalogTitle || entry.title, href: entry.marchHref || '' })

  return {
    previous: {
      href: previous.href,
      year: previous.year,
      band: previous.band?.name || '',
    },
    sameBand: Boolean(current.band?.id && current.band.id === previous.band?.id),
    entered: [...now].filter(([key]) => !before.has(key)).map(([, entry]) => pick(entry)),
    left: [...before].filter(([key]) => !now.has(key)).map(([, entry]) => pick(entry)),
    kept: [...now].filter(([key]) => before.has(key)).length,
  }
}
