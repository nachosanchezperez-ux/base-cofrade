// Estado inicial del directorio a partir de la URL (?tipo=, ?q=, ?localidad=…).
// Se calcula en el servidor: así el listado viaja una sola vez en el HTML (antes
// un Suspense lo repetía como reserva, ~1,4 MB de carga duplicada, 17/10/2026).

const KINDS = new Set(['all', 'brotherhood', 'image', 'step', 'band'])
const TERRITORIES = new Set(['todos', 'sevilla-capital', 'provincia'])

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function resolveOption(values, requested) {
  if (!requested) return 'todos'
  return values.find((value) => slugify(value) === slugify(requested)) || 'todos'
}

function first(value) {
  return Array.isArray(value) ? String(value[0] || '') : String(value || '')
}

export function entityDirectoryInitialState(items = [], params = {}) {
  const get = (name) => first(params?.[name])
  const requestedKind = get('tipo') || 'all'
  const kind = KINDS.has(requestedKind) ? requestedKind : 'all'
  const scopedItems = kind === 'all' ? items : items.filter((item) => item.kind === kind)
  const municipalities = [...new Set(scopedItems.map((item) => item.municipality).filter(Boolean))]
  const subtypeValues = [...new Set(scopedItems.flatMap((item) => item.subtypeValues || []).filter(Boolean))]
  const holyWeekDays = [...new Set(scopedItems.map((item) => item.holyWeekDay).filter(Boolean))]
  const gloryMonths = [...new Set(scopedItems.map((item) => item.gloryMonth).filter(Boolean))]
  const requestedTerritory = get('territorio') || 'todos'

  const initialState = {
    query: get('q'),
    kind,
    territory: TERRITORIES.has(requestedTerritory) ? requestedTerritory : 'todos',
    municipality: resolveOption(municipalities, get('localidad')),
    subtype: kind === 'all' ? 'todos' : resolveOption(subtypeValues, get('subtipo')),
    holyWeekDay: kind === 'all' ? 'todos' : resolveOption(holyWeekDays, get('dia')),
    gloryMonth: kind === 'all' ? 'todos' : resolveOption(gloryMonths, get('mes')),
    limit: get('limite'),
  }
  const stateKey = ['q', 'tipo', 'territorio', 'localidad', 'subtipo', 'dia', 'mes', 'limite'].map((name) => `${name}=${get(name)}`).join('&')
  return { initialState, stateKey }
}

function fold(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// Solo lo que el buscador del directorio usa. Las palabras clave que ya están en
// el nombre, la sede o el contexto no se repiten (eran ~320 KB de 1,2 MB).
export function compactDirectoryItem(item = {}) {
  const searched = fold([item.name, item.officialName, item.label, item.subtype, item.municipality, item.holyWeekDay, item.gloryMonth, item.context, item.relation].filter(Boolean).join(' '))
  const keywords = [...new Set((item.keywords || []).filter(Boolean))].filter((keyword) => !searched.includes(fold(keyword)))
  const compact = {
    id: item.id,
    kind: item.kind,
    name: item.name,
    href: item.href,
    label: item.label,
    subtype: item.subtype,
    subtypeValues: item.subtypeValues,
    municipality: item.municipality,
    holyWeekDay: item.holyWeekDay,
    gloryMonth: item.gloryMonth,
    context: item.context,
    relation: item.relation,
    mediaPath: item.mediaPath,
    mediaKind: item.mediaKind,
  }
  if (item.officialName && item.officialName !== item.name) compact.officialName = item.officialName
  if (keywords.length) compact.keywords = keywords
  for (const key of Object.keys(compact)) {
    const value = compact[key]
    if (value === '' || value === null || value === undefined || (Array.isArray(value) && !value.length)) delete compact[key]
  }
  return compact
}
