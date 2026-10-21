// Alta rápida de un acto en la Agenda (#agenda-alta-rapida). Núcleo puro: tipos,
// validación y registros que se crean. Sin Supabase, para probarlo con node --test.
//
// Cada tipo va a la tabla y con el carácter que la Agenda ya lee:
//  - salidas → outings (rosarios, glorias, procesiones, romerías y extraordinarias);
//  - cultos  → cults (se reutiliza el culto del mismo tipo de la Hermandad) +
//              cult_occurrences (la edición con fecha) + cult_occurrence_days.

export const QUICK_ACT_TYPES = [
  { key: 'rosario-aurora', group: 'outing', label: 'Rosario de la Aurora', outingType: 'Rosario de la Aurora', character: 'ordinary' },
  { key: 'rosario-vespertino', group: 'outing', label: 'Rosario vespertino', outingType: 'Rosario Vespertino', character: 'ordinary' },
  { key: 'gloria', group: 'outing', label: 'Procesión de Gloria', outingType: 'Procesión de Gloria', character: 'ordinary' },
  { key: 'procesion', group: 'outing', label: 'Procesión (ordinaria)', outingType: 'Procesión', character: 'ordinary' },
  { key: 'procesion-extraordinaria', group: 'outing', label: 'Procesión extraordinaria', outingType: 'Procesión', character: 'extraordinary' },
  { key: 'traslado-extraordinario', group: 'outing', label: 'Traslado extraordinario', outingType: 'Traslado', character: 'extraordinary' },
  { key: 'romeria', group: 'outing', label: 'Romería', outingType: 'Romería', character: 'ordinary' },
  { key: 'triduo', group: 'cult', label: 'Triduo', cultType: 'Triduo' },
  { key: 'quinario', group: 'cult', label: 'Quinario', cultType: 'Quinario' },
  { key: 'septenario', group: 'cult', label: 'Septenario', cultType: 'Septenario' },
  { key: 'novena', group: 'cult', label: 'Novena', cultType: 'Novena' },
  { key: 'besamanos', group: 'cult', label: 'Besamanos', cultType: 'Besamanos' },
  { key: 'besapies', group: 'cult', label: 'Besapiés', cultType: 'Besapiés' },
  { key: 'funcion-principal', group: 'cult', label: 'Función Principal', cultType: 'Función Principal' },
  { key: 'funcion-solemne', group: 'cult', label: 'Función Solemne', cultType: 'Función Solemne' },
  { key: 'via-crucis', group: 'cult', label: 'Vía Crucis', cultType: 'Vía Crucis' },
  { key: 'misa-hermandad', group: 'cult', label: 'Misa de Hermandad', cultType: 'Misa de Hermandad' },
]

const UUID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
const MAX_DAYS = 15

const text = (value, max = 0) => {
  const clean = String(value ?? '').replace(/\s+/g, ' ').trim()
  return max ? clean.slice(0, max) : clean
}

export function quickActType(key = '') {
  return QUICK_ACT_TYPES.find((type) => type.key === key) || null
}

export function slugify(value = '') {
  return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90)
}

function addDays(date, days) {
  const value = new Date(`${date}T12:00:00Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

// Días de un culto de varios días (triduo, quinario…), con su número.
export function dayRange(start, end) {
  const days = []
  let current = start
  const last = end && end >= start ? end : start
  while (current <= last && days.length < MAX_DAYS) {
    days.push(current)
    current = addDays(current, 1)
  }
  return days
}

// get(name) → valor del formulario. Devuelve { act } o { errors: [...] }.
export function parseQuickAct(get) {
  const errors = []
  const type = quickActType(text(get('act_type')))
  if (!type) errors.push('Elige el tipo de acto.')
  const brotherhoodId = text(get('brotherhood_id'))
  if (!UUID.test(brotherhoodId)) errors.push('Elige la Hermandad.')
  const startDate = text(get('start_date'))
  if (!DATE.test(startDate)) errors.push('Indica la fecha.')
  const endDate = text(get('end_date'))
  if (endDate && (!DATE.test(endDate) || endDate < startDate)) errors.push('La fecha final no puede ser anterior a la inicial.')
  if (endDate && DATE.test(startDate) && DATE.test(endDate) && (Date.parse(`${endDate}T12:00:00Z`) - Date.parse(`${startDate}T12:00:00Z`)) / 86400000 + 1 > MAX_DAYS) errors.push(`Un acto puede durar como máximo ${MAX_DAYS} días.`)
  const startTime = text(get('start_time'))
  if (startTime && !TIME.test(startTime)) errors.push('La hora debe tener el formato 20:30.')
  const municipalityId = text(get('municipality_id'))
  if (municipalityId && !UUID.test(municipalityId)) errors.push('Localidad no válida.')
  const placeId = text(get('place_id'))
  if (placeId && !UUID.test(placeId)) errors.push('Lugar no válido.')
  if (errors.length) return { errors }

  return {
    act: {
      type,
      brotherhoodId,
      title: text(get('title'), 160),
      startDate,
      endDate: endDate && endDate !== startDate ? endDate : '',
      startTime,
      timeText: text(get('time_text'), 120),
      municipalityId,
      placeId,
      placeText: text(get('place_text'), 160),
      description: text(get('description'), 2000),
      publish: get('publish') === 'on' || get('publish') === '1',
    },
  }
}

// Título por defecto: «Rosario de la Aurora · Hermandad de X».
export function quickActTitle(act, brotherhoodName = '') {
  return act.title || [act.type.label.replace(/ \((?:ordinaria)\)$/, ''), text(brotherhoodName)].filter(Boolean).join(' · ')
}

export function quickOutingPayload(act, { brotherhoodName = '', slug = '' } = {}) {
  const year = Number(act.startDate.slice(0, 4))
  return {
    brotherhood_entity_id: act.brotherhoodId,
    title: quickActTitle(act, brotherhoodName),
    slug: slug || null,
    outing_type: act.type.outingType,
    character: act.type.character,
    outing_date: act.startDate,
    return_date: act.endDate || null,
    year,
    departure_time: act.startTime || null,
    municipality_id: act.municipalityId || null,
    origin_place_id: act.placeId || null,
    origin_text: act.placeId ? null : (act.placeText || null),
    description: act.description || null,
    organizer_name: text(brotherhoodName) || null,
    event_status: 'announced',
    status: act.publish ? 'published' : 'draft',
  }
}

export function quickCultPayloads(act, { brotherhoodName = '', existingCultId = '' } = {}) {
  const title = quickActTitle(act, brotherhoodName)
  const status = act.publish ? 'published' : 'draft'
  return {
    cult: existingCultId ? null : {
      brotherhood_entity_id: act.brotherhoodId,
      cult_type: act.type.cultType,
      title: act.type.cultType,
      place_id: act.placeId || null,
      status,
    },
    occurrence: {
      year: Number(act.startDate.slice(0, 4)),
      title_override: title,
      start_date: act.startDate,
      end_date: act.endDate || null,
      place_id: act.placeId || null,
      description_override: act.description || null,
      event_status: 'announced',
      status,
    },
    days: dayRange(act.startDate, act.endDate).map((date, index, all) => ({
      day_number: all.length > 1 ? index + 1 : null,
      celebration_date: date,
      start_time: act.startTime || null,
      time_text: act.timeText || null,
      place_id: act.placeId || null,
    })),
  }
}
