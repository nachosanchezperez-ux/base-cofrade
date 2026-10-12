// Control de integridad de la enciclopedia (Tarea 07) · modelo común.
//
// Este módulo y los de `checks/` son funciones puras: reciben una instantánea de
// filas ya leídas y devuelven incidencias. No importan Supabase ni Next.js, no
// escriben nada y se pueden probar con datos de ejemplo.
//
// Tres niveles, para no mezclar errores con fichas por completar:
//   * error      → contradicción confirmada por los propios datos (duplicado con
//                  solape real, fechas invertidas, vigencia imposible…);
//   * warning    → patrón sospechoso que requiere criterio editorial;
//   * incomplete → dato que falta. No es un error: la ficha funciona, pero pierde
//                  un enlace, una hora o una fotografía.
//
// La completitud de fichas (campos vacíos, fuentes, autorías, escudos…) ya la
// cubre el Panel en Datos → Salud (`lib/panel/data-health.js`). Estas
// comprobaciones no la repiten: se centran en coherencia y relaciones.

export const SEVERITIES = ['error', 'warning', 'incomplete']

export const SEVERITY_LABELS = {
  error: 'Error confirmado',
  warning: 'Revisar',
  incomplete: 'Dato incompleto',
}

export const AREA_LABELS = {
  core: 'Hermandades, imágenes y pasos',
  music: 'Bandas y acompañamientos',
  agenda: 'Agenda cofrade',
}

export const ENTITY_TYPE_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  band: 'Banda',
  march: 'Marcha',
  agent: 'Persona',
  heritage_asset: 'Patrimonio',
  event: 'Acontecimiento',
  outing: 'Salida',
  music_period: 'Periodo musical',
  music_position: 'Posición musical',
  relation: 'Relación',
  cult: 'Culto',
  url: 'URL conservada',
  aggregate: 'Conjunto',
}

const PANEL_PATHS = {
  brotherhood: '/panel/hermandades/',
  image: '/panel/imagenes/',
  step: '/panel/pasos/',
  band: '/panel/bandas/',
  march: '/panel/marchas/',
  agent: '/panel/agentes/',
  event: '/panel/acontecimientos/',
}

export function panelHref(entityType, id) {
  const base = PANEL_PATHS[entityType]
  return base && id ? `${base}${id}` : ''
}

export function makeIssue(check, fields) {
  const {
    entityType,
    entityId,
    entityName = '',
    reason,
    fix = check.fix,
    severity = check.severity,
    related = [],
    href = panelHref(entityType, entityId),
  } = fields
  return {
    check: check.id,
    area: check.area,
    severity,
    title: check.title,
    entityType,
    entityLabel: ENTITY_TYPE_LABELS[entityType] || entityType,
    entityId: entityId ? String(entityId) : '',
    entityName: String(entityName || ''),
    reason,
    fix,
    related: related.filter(Boolean).map(String),
    href,
  }
}

// ---------------------------------------------------------------------------
// Utilidades de comparación
// ---------------------------------------------------------------------------

export function blank(value) {
  return value == null || String(value).trim() === ''
}

// Nombre comparable: sin tildes, minúsculas, solo letras y números.
export function normalizeName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const TITLE_STOPWORDS = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'a', 'al', 'en', 'nuestra', 'nuestro'])

// Título comparable para duplicados de obras: ignora artículos y posesivos,
// de modo que «Tú eres el orgullo de nuestro pueblo» y «Tú eres orgullo pueblo»
// coinciden. Solo se usa junto con otra coincidencia fuerte (mismos autores).
export function normalizeTitle(value) {
  return normalizeName(value)
    .split(' ')
    .filter((word) => word && !TITLE_STOPWORDS.has(word))
    .join(' ')
}

// Misma regla que `slugify` de lib/supabase/glory-directory.js. Se replica aquí
// (no se importa) porque ese módulo es solo de servidor; un test de paridad
// garantiza que ambas sigan iguales.
export function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function intOrNull(value) {
  // Number(null) y Number('') valen 0: un año ausente no debe convertirse en el año 0.
  if (blank(value)) return null
  const number = Number(value)
  return Number.isInteger(number) ? number : null
}

export function yearOf(dateText) {
  const match = /^(\d{4})-\d{2}-\d{2}/.exec(String(dateText || ''))
  return match ? Number(match[1]) : null
}

// Las relaciones vigentes son las publicadas sin fecha de fin.
export function isCurrentRelation(row) {
  return row?.status === 'published' && blank(row.date_to)
}

export function groupBy(items, keyOf) {
  const groups = new Map()
  for (const item of items) {
    const key = keyOf(item)
    if (key == null) continue
    const list = groups.get(key)
    if (list) list.push(item)
    else groups.set(key, [item])
  }
  return groups
}

// Domingo de Pascua (algoritmo anónimo gregoriano), en UTC.
export function easterSunday(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// Temporada musical vigente: la del último Domingo de Ramos ya alcanzado.
// Hasta la Semana Santa de 2027, los acompañamientos «vigentes» son los de 2026.
export function musicSeasonYear(today) {
  const year = yearOf(today)
  if (!year) throw new Error(`Fecha no válida para calcular la temporada: ${today}`)
  const easter = easterSunday(year)
  const palmSunday = new Date(Date.parse(`${easter}T00:00:00Z`) - 7 * 86400000).toISOString().slice(0, 10)
  return today >= palmSunday ? year : year - 1
}

// Fecha de hoy en Madrid (YYYY-MM-DD), independiente de la zona del servidor.
export function madridToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}
