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
