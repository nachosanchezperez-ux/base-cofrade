// Pregón de las Glorias de Sevilla: lectura pública de los acontecimientos
// `events.event_type = 'Pregón de las Glorias'`. Los datos de cada año viven en
// Supabase (pregonero y presidencia en `public_notes`, enlace estructural en
// `events.brotherhood_entity_id`); aquí solo se ordenan y agrupan.

export const PREGON_GLORIAS_EVENT_TYPE = 'Pregón de las Glorias'
export const PREGON_GLORIAS_PATH = '/pregon-de-las-glorias'

const MONTH_FORMAT = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  timeZone: 'Europe/Madrid',
})

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function stripFinalDot(value) {
  return clean(value).replace(/\.$/, '').trim()
}

// «Pregonero: X · Presidencia: Y.» (el orden varía entre años).
export function parsePregonNotes(notes = '') {
  const parts = clean(notes).split('·').map((part) => part.trim()).filter(Boolean)
  let pregonero = ''
  let presidencia = ''

  for (const part of parts) {
    const pregoneroMatch = part.match(/^Pregoner[oa]:\s*(.+)$/i)
    if (pregoneroMatch) {
      pregonero = stripFinalDot(pregoneroMatch[1])
      continue
    }
    const presidenciaMatch = part.match(/^Presidencia:\s*(.+)$/i)
    if (presidenciaMatch) presidencia = stripFinalDot(presidenciaMatch[1])
  }

  return { pregonero, presidencia }
}

export function pregonYear(row = {}) {
  const fromText = String(row.event_date_text || '').match(/\d{4}/)
  if (fromText) return Number(fromText[0])
  const fromDate = String(row.event_date || '').match(/^\d{4}/)
  return fromDate ? Number(fromDate[0]) : null
}

export function pregonDateLabel(value) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return MONTH_FORMAT.format(date)
}

function normalizeKey(value) {
  return clean(value)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

/**
 * @param {Array} rows filas de `events` del Pregón de las Glorias
 * @param {Map<string, {name: string, slug: string}>} brotherhoods hermandades publicadas por id
 */
export function buildPregonGlorias(rows = [], brotherhoods = new Map()) {
  const pregones = rows
    .map((row) => {
      const year = pregonYear(row)
      if (!year) return null
      const { pregonero, presidencia } = parsePregonNotes(row.public_notes)
      const brotherhood = row.brotherhood_entity_id ? brotherhoods.get(row.brotherhood_entity_id) || null : null
      return {
        id: row.entity_id,
        year,
        dateLabel: pregonDateLabel(row.event_date),
        place: clean(row.location_text),
        pregonero,
        presidencia,
        isAnnounced: row.event_status === 'announced',
        brotherhood: brotherhood
          ? { name: brotherhood.name, href: `/hermandades/${brotherhood.slug}` }
          : null,
      }
    })
    .filter(Boolean)
    .sort((first, second) => second.year - first.year)

  const next = pregones.find((item) => item.isAnnounced) || null
  const held = pregones.filter((item) => !item.isAnnounced)

  // Agrupa por hermandad enlazada; sin enlace, por la denominación del archivo.
  const groups = new Map()
  for (const item of pregones) {
    if (!item.brotherhood && !item.presidencia) continue
    const key = item.brotherhood ? `b:${item.brotherhood.href}` : `p:${normalizeKey(item.presidencia)}`
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        name: item.brotherhood?.name || item.presidencia,
        href: item.brotherhood?.href || '',
        years: [],
      })
    }
    groups.get(key).years.push({ year: item.year, isAnnounced: item.isAnnounced })
  }

  const presidencies = [...groups.values()]
    .map((group) => ({
      ...group,
      years: group.years.sort((first, second) => first.year - second.year),
      count: group.years.length,
    }))
    .sort((first, second) => (
      second.count - first.count
      || second.years[second.years.length - 1].year - first.years[first.years.length - 1].year
      || first.name.localeCompare(second.name, 'es')
    ))

  const decades = []
  for (const item of held) {
    const decade = Math.floor(item.year / 10) * 10
    let bucket = decades.find((entry) => entry.decade === decade)
    if (!bucket) {
      bucket = { decade, label: `Década de ${decade}`, items: [] }
      decades.push(bucket)
    }
    bucket.items.push(item)
  }

  const firstYear = held.length ? held[held.length - 1].year : null
  const lastYear = held.length ? held[0].year : null

  return {
    next,
    held,
    presidencies,
    decades,
    stats: {
      heldCount: held.length,
      firstYear,
      lastYear,
      corporationCount: presidencies.length,
      linkedCount: presidencies.filter((group) => group.href).length,
    },
  }
}
