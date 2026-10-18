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

// Notas editoriales que se colaron en las palabras clave («preflight», «pendiente
// de ficha…»): no son términos de búsqueda y no deben viajar al público.
const INTERNAL_KEYWORD = /\bpreflight\b|pendientes? de (?:ficha|evidencia)|evidencia suficiente/iu

const KIND_LABEL = { brotherhood: 'Hermandad', image: 'Imagen', step: 'Paso', band: 'Banda' }
const KIND_MEDIA = { brotherhood: 'crest', image: 'photo', step: 'photo', band: 'logo' }

function withoutEmpty(object) {
  for (const key of Object.keys(object)) {
    const value = object[key]
    if (value === '' || value === null || value === undefined || (Array.isArray(value) && !value.length)) delete object[key]
  }
  return object
}

// Lo que pinta y filtra el directorio al cargar. Medido el 18/10/2026: el array
// pesaba 883 KB (1.635 fichas). Se omiten:
// - id: la clave es kind + href, ya único;
// - label y mediaKind: salen de kind (directoryItemDefaults);
// - subtypeValues cuando es solo [subtype];
// - officialName y keywords: solo sirven para buscar texto y se cargan aparte
//   (directorySearchExtras, /api/directorio/busqueda) al empezar a escribir.
export function compactDirectoryItem(item = {}) {
  const subtypeValues = (item.subtypeValues || []).filter(Boolean)
  const onlySubtype = subtypeValues.length === 1 && subtypeValues[0] === item.subtype
  return withoutEmpty({
    kind: item.kind,
    name: item.name,
    href: item.href,
    subtype: item.subtype,
    subtypeValues: onlySubtype ? undefined : subtypeValues,
    municipality: item.municipality,
    holyWeekDay: item.holyWeekDay,
    gloryMonth: item.gloryMonth,
    context: item.context,
    relation: item.relation,
    mediaPath: item.mediaPath,
  })
}

// Inverso de lo anterior, en el navegador.
export function directoryItemDefaults(item = {}) {
  return {
    ...item,
    label: item.label || KIND_LABEL[item.kind] || '',
    mediaKind: item.mediaKind || KIND_MEDIA[item.kind] || '',
    subtypeValues: item.subtypeValues || (item.subtype ? [item.subtype] : []),
  }
}

// Texto adicional para la búsqueda, por href: nombre oficial (o) y palabras
// clave (k) que no repiten lo que ya viaja en la tarjeta.
export function directorySearchExtras(items = []) {
  const extras = {}
  for (const item of items) {
    if (!item?.href) continue
    const searched = fold([item.name, item.officialName, item.label, item.subtype, item.municipality, item.holyWeekDay, item.gloryMonth, item.context, item.relation].filter(Boolean).join(' '))
    const keywords = [...new Set((item.keywords || []).filter(Boolean))]
      .filter((keyword) => !INTERNAL_KEYWORD.test(keyword) && !searched.includes(fold(keyword)))
    const entry = withoutEmpty({
      o: item.officialName && item.officialName !== item.name ? item.officialName : undefined,
      k: keywords,
    })
    if (Object.keys(entry).length) extras[item.href] = entry
  }
  return extras
}
