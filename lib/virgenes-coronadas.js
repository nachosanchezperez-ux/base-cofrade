// Vírgenes Coronadas de la provincia de Sevilla: lectura pública de los
// acontecimientos de coronación (`events`) agrupados por imagen.
//
// Fuente de verdad: cada coronación es un acontecimiento con
//   · `entity_relations` involves → image (la imagen coronada),
//   · `entity_relations` officiated_by → agent (el prelado que la coronó),
//   · `events.brotherhood_entity_id` y `events.municipality_id`.
// Una imagen puede tener varios actos: una coronación litúrgica o popular y,
// años después, su reconocimiento canónico. Aquí solo se clasifican y agrupan.

export const VIRGENES_CORONADAS_PATH = '/virgenes-coronadas'

// Tipos con los que se cargan hoy las coronaciones (con o sin mayúsculas).
export const CORONATION_EVENT_TYPE_PATTERNS = ['Coronaci%', 'Reconocimiento canónico%']

export const CORONATION_KINDS = Object.freeze({
  pontificia: { key: 'pontificia', label: 'Pontificia', act: 'Coronación pontificia' },
  canonica: { key: 'canonica', label: 'Canónica', act: 'Coronación canónica' },
  reconocimiento: { key: 'reconocimiento', label: 'Canónica', act: 'Reconocimiento canónico' },
  liturgica: { key: 'liturgica', label: 'Litúrgica', act: 'Coronación litúrgica' },
  popular: { key: 'popular', label: 'Popular', act: 'Coronación popular' },
  coronacion: { key: 'coronacion', label: 'Coronada', act: 'Coronación' },
})

// Rango que marca el sello de la tarjeta: la coronación de mayor rango manda.
const KIND_RANK = { pontificia: 5, canonica: 4, reconocimiento: 4, liturgica: 2, popular: 1, coronacion: 0 }

const DAY_FORMAT = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Madrid',
})

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function fold(value) {
  return clean(value).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

// Clasifica un acontecimiento por su tipo y, si el tipo es genérico, por su
// nombre. Devuelve null para lo que no es un acto de coronación (breves,
// inicio de expediente…), que no debe contarse como coronación.
export function classifyCoronation({ event_type: type = '', name = '' } = {}) {
  const typeKey = fold(type)
  const nameKey = fold(name)
  const both = `${typeKey} ${nameKey}`

  // Fases previas (breve pontificio, expediente, inicio del proceso): no son
  // coronaciones aunque se hayan cargado con un tipo de coronación.
  if (/\bbreve\b|\bexpediente\b|\bproceso\b|\bsolicitud\b/.test(both)) return null
  if (/reconocimiento|elevacion|convalidacion/.test(both)) return CORONATION_KINDS.reconocimiento
  if (/pontifici/.test(both)) return CORONATION_KINDS.pontificia
  if (/liturgic|episcopal/.test(typeKey)) return CORONATION_KINDS.liturgica
  if (/popular/.test(typeKey)) return CORONATION_KINDS.popular
  if (/canonic/.test(typeKey)) return CORONATION_KINDS.canonica
  if (/^coronacion/.test(typeKey)) {
    if (/canonic/.test(nameKey)) return CORONATION_KINDS.canonica
    if (/imposicion de la corona|liturgic/.test(nameKey)) return CORONATION_KINDS.liturgica
    return CORONATION_KINDS.coronacion
  }
  return null
}

export function coronationYear(row = {}) {
  const fromDate = String(row.event_date || '').match(/^\d{4}/)
  if (fromDate) return Number(fromDate[0])
  const fromText = String(row.event_date_text || '').match(/\b(1[89]\d{2}|20\d{2})\b/)
  return fromText ? Number(fromText[0]) : null
}

// Fecha legible: el día completo cuando se conoce; si solo hay año (o mes y
// año) se respeta el texto cargado, sin inventar el resto.
export function coronationDateLabel(row = {}) {
  if (row.event_date && !/^\d{4}$/.test(clean(row.event_date_text))) {
    const date = new Date(`${row.event_date}T12:00:00`)
    if (!Number.isNaN(date.getTime())) return DAY_FORMAT.format(date)
  }
  return clean(row.event_date_text) || (row.event_date ? String(row.event_date).slice(0, 4) : '')
}

function sortKey(act) {
  return act.date || (act.year ? `${act.year}-99-99` : '9999-99-99')
}

/**
 * @param {object} input
 * @param {Array} input.events filas de `events` (+ `name` de su entidad)
 * @param {Map<string, {imageId: string, officiants: Array<{id: string}>}>} input.links por evento
 * @param {Map<string, object>} input.images imágenes publicadas por id {name, slug, cover}
 * @param {Map<string, object>} input.brotherhoods hermandades por id {name, slug, cover, crest, palette, municipalityId}
 * @param {Map<string, object>} input.agents prelados por id {name, slug, published}
 * @param {Map<string, string>} input.municipalities nombres por id
 * @param {Map<string, string>} input.imageBrotherhood hermandad titular por imagen
 */
export function buildVirgenesCoronadas({
  events = [],
  links = new Map(),
  images = new Map(),
  brotherhoods = new Map(),
  agents = new Map(),
  municipalities = new Map(),
  imageBrotherhood = new Map(),
} = {}) {
  const groups = new Map()

  for (const row of events) {
    const kind = classifyCoronation(row)
    if (!kind) continue
    const link = links.get(row.entity_id) || {}
    const image = link.imageId ? images.get(link.imageId) : null
    // Sin imagen publicada no hay a quién atribuir la coronación.
    if (!image) continue

    const brotherhoodId = row.brotherhood_entity_id || imageBrotherhood.get(link.imageId) || null
    const brotherhood = brotherhoodId ? brotherhoods.get(brotherhoodId) || null : null
    const municipalityId = row.municipality_id || brotherhood?.municipalityId || null
    const officiants = (link.officiants || [])
      .map(({ id }) => agents.get(id))
      .filter(Boolean)
      .map((agent) => ({
        id: agent.id,
        name: agent.name,
        href: agent.published && agent.slug ? `/autores/${agent.slug}` : '',
      }))

    const act = {
      id: row.entity_id,
      kind: kind.key,
      label: kind.act,
      date: row.event_date || '',
      year: coronationYear(row),
      dateLabel: coronationDateLabel(row),
      isAnnounced: row.event_status === 'announced',
      place: clean(row.location_text),
      officiants,
    }

    if (!groups.has(link.imageId)) {
      groups.set(link.imageId, {
        id: link.imageId,
        name: image.name,
        href: image.slug ? `/imagenes/${image.slug}` : '',
        photo: image.cover || brotherhood?.cover || null,
        crest: brotherhood?.crest || '',
        palette: brotherhood?.palette || null,
        brotherhood: brotherhood
          ? { id: brotherhoodId, name: brotherhood.name, href: brotherhood.slug ? `/hermandades/${brotherhood.slug}` : '' }
          : null,
        municipality: municipalityId ? municipalities.get(municipalityId) || '' : '',
        custodian: image.custodian || '',
        acts: [],
      })
    }
    const group = groups.get(link.imageId)
    if (!group.municipality && municipalityId) group.municipality = municipalities.get(municipalityId) || ''
    group.acts.push(act)
  }

  const items = [...groups.values()].map((group) => {
    const acts = group.acts.sort((first, second) => sortKey(first).localeCompare(sortKey(second)))
    const held = acts.filter((act) => !act.isAnnounced)
    const top = (held.length ? held : acts)
      .reduce((best, act) => (KIND_RANK[act.kind] > KIND_RANK[best.kind] ? act : best))
    // El año de referencia es el de la coronación de mayor rango ya celebrada
    // (la canónica cuando existe); si todo está anunciado, el de la anunciada.
    const officiants = []
    for (const act of acts) {
      for (const officiant of act.officiants) {
        if (!officiants.some((entry) => entry.id === officiant.id)) officiants.push(officiant)
      }
    }
    return {
      ...group,
      acts,
      kind: top.kind,
      kindLabel: CORONATION_KINDS[top.kind].label,
      year: top.year,
      isUpcoming: held.length === 0,
      officiants,
    }
  })

  const upcoming = items
    .filter((item) => item.isUpcoming)
    .sort((first, second) => sortKey(first.acts[0]).localeCompare(sortKey(second.acts[0])))
  const crowned = items
    .filter((item) => !item.isUpcoming)
    .sort((first, second) => (
      (second.year || 0) - (first.year || 0)
      || sortKey(second.acts.at(-1)).localeCompare(sortKey(first.acts.at(-1)))
      || first.name.localeCompare(second.name, 'es')
    ))

  const municipalityOptions = [...new Set(crowned.map((item) => item.municipality).filter(Boolean))]
    .sort((first, second) => (first === 'Sevilla' ? -1 : second === 'Sevilla' ? 1 : first.localeCompare(second, 'es')))
    .map((name) => ({ value: name, label: name, count: crowned.filter((item) => item.municipality === name).length }))

  const officiantCounts = new Map()
  for (const item of crowned) {
    for (const act of item.acts) {
      for (const officiant of act.officiants) {
        const entry = officiantCounts.get(officiant.id) || { ...officiant, images: new Set() }
        entry.images.add(item.id)
        officiantCounts.set(officiant.id, entry)
      }
    }
  }
  const officiantOptions = [...officiantCounts.values()]
    .map(({ images: crownedImages, ...officiant }) => ({ ...officiant, count: crownedImages.size }))
    .sort((first, second) => second.count - first.count || first.name.localeCompare(second.name, 'es'))

  const years = crowned.map((item) => item.year).filter(Boolean)

  return {
    upcoming,
    crowned,
    filters: {
      municipalities: municipalityOptions,
      kinds: ['pontificia', 'canonica', 'liturgica', 'popular']
        .map((key) => ({ value: key, label: CORONATION_KINDS[key].label, count: crowned.filter((item) => item.kind === key || (key === 'canonica' && item.kind === 'reconocimiento')).length }))
        .filter((option) => option.count),
      officiants: officiantOptions,
    },
    stats: {
      count: crowned.length,
      municipalityCount: municipalityOptions.length,
      firstYear: years.length ? Math.min(...years) : null,
      lastYear: years.length ? Math.max(...years) : null,
    },
  }
}
