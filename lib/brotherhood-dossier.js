// Dosier de la Hermandad: el «fondo de armario» para seguir o comentar una
// gran jornada (p. ej. la retransmisión de una Coronación) en una sola página.
// Funciones puras sobre los datos que ya carga la ficha: no consulta nada ni
// añade datos que no estén publicados.

// Cohorte piloto, por ID de entidad (un cambio de slug no la altera).
export const BROTHERHOOD_DOSSIER_PILOT = Object.freeze([
  'fc0942dd-d555-43b2-9495-399daba54903', // El Amparo · Coronación Canónica (8 de noviembre de 2026).
])

export function usesBrotherhoodDossier(entityId) {
  return BROTHERHOOD_DOSSIER_PILOT.includes(String(entityId || ''))
}

export function dossierHref(slug = '') {
  return slug ? `/hermandades/${slug}/dosier` : ''
}

function normalized(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

function text(value) {
  return typeof value === 'string' ? value.trim() : value ? String(value) : ''
}

// Familias del patrimonio, en el orden en que se cuentan en antena: lo que
// lleva la Virgen, lo que viste, las insignias y el resto.
export const DOSSIER_HERITAGE_FAMILIES = Object.freeze([
  { key: 'orfebreria', title: 'Coronas, joyas y orfebrería', match: /corona|diadema|rafaga|joya|orfebre|cetro|media luna|punal|rostrillo|aureola|potencias|broche|alhaja/ },
  { key: 'mantos', title: 'Mantos, sayas y ajuar', match: /manto|saya|toca|ajuar|tocado|fajin|pecherin|vestido|tunica|bordado/ },
  { key: 'insignias', title: 'Insignias y enseres', match: /simpecado|estandarte|bandera|guion|vara|reglas|insignia|banderin|senatus|cruz de guia|farol|cirial|bocina|libro/ },
])

// Piezas de música (alabados, plegarias, misas…) que también se guardan como
// patrimonio: se cuentan en «Música», no entre los enseres.
const MUSIC_TYPES = /alabado|plegaria|misa|canto|sonata|oracion musicada|himno|motete|copla|salve|gozos|marcha/

export function isMusicHeritage(piece = {}) {
  return MUSIC_TYPES.test(normalized(piece.tipo))
}

export function heritageFamilyKey(piece = {}) {
  const haystack = normalized(`${piece.tipo} ${piece.nombre}`)
  return DOSSIER_HERITAGE_FAMILIES.find((family) => family.match.test(haystack))?.key || 'otras'
}

// Patrimonio material agrupado por familia (sin la música ni los carteles).
// Dentro de cada familia, primero lo destacado y después el orden del panel.
export function dossierHeritageGroups(patrimonio = [], { excludeIds = [] } = {}) {
  const excluded = new Set(excludeIds.filter(Boolean))
  const pieces = patrimonio.filter((piece) => piece?.nombre && !excluded.has(piece.id) && !isMusicHeritage(piece))
  const families = [...DOSSIER_HERITAGE_FAMILIES, { key: 'otras', title: 'Otras piezas del patrimonio' }]
  return families
    .map((family) => ({
      key: family.key,
      title: family.title,
      items: pieces
        .filter((piece) => heritageFamilyKey(piece) === family.key)
        .sort((a, b) => Number(Boolean(b.destacado)) - Number(Boolean(a.destacado)) || (a.orden || 0) - (b.orden || 0)),
    }))
    .filter((family) => family.items.length)
}

// «Bordado: Emilio José Gómez Moreno, Manuel María Ariza».
export function creditsByDiscipline(agentes = []) {
  const byDiscipline = new Map()
  for (const agent of agentes) {
    const name = text(agent?.nombre)
    if (!name) continue
    const discipline = text(agent.disciplina || agent.rol) || 'Autoría'
    if (!byDiscipline.has(discipline)) byDiscipline.set(discipline, [])
    if (!byDiscipline.get(discipline).includes(name)) byDiscipline.get(discipline).push(name)
  }
  return [...byDiscipline].map(([discipline, names]) => ({ label: discipline, value: names.join(', ') }))
}

// Datos de una pieza listos para leer en antena (solo los que existen).
export function pieceFacts(piece = {}) {
  return [
    { label: 'Fecha', value: text(piece.fecha) },
    { label: 'Bendición', value: text(piece.bendicion) },
    ...creditsByDiscipline(piece.agentes),
    { label: 'Materiales', value: text(piece.materiales) },
    { label: 'Técnica', value: text(piece.tecnica) },
    { label: 'Medidas', value: text(piece.dimensiones) },
    { label: 'Iconografía', value: text(piece.iconografia) },
    { label: 'Procedencia', value: text(piece.procedencia) },
  ].filter((fact) => fact.value)
}

// Ficha técnica de una imagen titular.
export function imageFacts(image = {}) {
  return [
    { label: 'Autoría', value: text(image.autor) },
    { label: 'Fecha', value: text(image.fecha) },
    { label: 'Tipo', value: text(image.tipo) },
    { label: 'Material', value: text(image.material) },
    { label: 'Técnica', value: text(image.tecnica) },
    { label: 'Medidas', value: text(image.dimensiones) },
    { label: 'Iconografía', value: text(image.iconografia) },
    { label: 'Restauraciones y estado', value: text(image.estadoActual) },
  ].filter((fact) => fact.value)
}

// Ficha de un paso: datos, capataz y fases documentadas.
export function stepFacts(step = {}) {
  const capataz = Array.isArray(step.capatazActual)
    ? step.capatazActual.map((person) => text(person?.nombre || person)).filter(Boolean).join(', ')
    : text(step.capatazActual?.nombre || step.capatazActual)
  return [
    { label: 'Tipo', value: text(step.tipo) },
    { label: 'Ejecución', value: text(step.ejecucion) },
    { label: 'Materiales', value: text(step.materiales) },
    { label: 'Portadores', value: text(step.sistemaPortadores) },
    { label: 'Capataz', value: capataz },
    { label: 'Estado', value: text(step.estadoActual) },
  ].filter((fact) => fact.value)
}

function yearNumber(value) {
  const match = String(value || '').match(/(1[0-9]{3}|20[0-9]{2})/)
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY
}

// Cronología completa, de lo más antiguo a lo más reciente (lo celebrado; lo
// anunciado es la propia jornada).
export function dossierChronology(cronologia = [], today = '') {
  const currentYear = today ? Number(today.slice(0, 4)) : Number.POSITIVE_INFINITY
  return cronologia
    .filter((item) => item?.titulo)
    .map((item, index) => ({ ...item, index }))
    .sort((a, b) => yearNumber(a.fecha) - yearNumber(b.fecha) || a.index - b.index)
    .map(({ index, ...item }) => ({ ...item, upcoming: yearNumber(item.fecha) > currentYear }))
}

// «Datos clave»: lo que se dice en los primeros treinta segundos.
export function dossierKeyFacts({ brotherhood = {}, image = null, step = null, outing = null, occasion = null } = {}) {
  const capataz = step ? stepFacts(step).find((fact) => fact.label === 'Capataz')?.value || '' : ''
  const bands = (outing?.music || [])
    .map((row) => [row.name, row.context].filter(Boolean).join(' · '))
    .filter(Boolean)
  const occasionMoment = occasion ? [occasion.timeText || occasion.time, occasion.place].filter(Boolean).join(' · ') : ''
  return [
    { label: 'Hermandad', value: text(brotherhood.nombreOficial || brotherhood.nombrePopular) },
    { label: 'Sede', value: text(brotherhood.sede) },
    { label: 'Fundación', value: text(brotherhood.fundacion) },
    { label: 'Titular', value: image ? [image.nombre, image.autor, image.fecha].filter(Boolean).join(' · ') : '' },
    { label: occasion?.name || 'Jornada', value: occasionMoment },
    { label: 'Procesión', value: outing ? [outing.departureTime && `Salida ${outing.departureTime}`, outing.returnTime && `entrada ${outing.returnTime}`].filter(Boolean).join(' · ') : '' },
    { label: 'Capataz', value: capataz },
    { label: 'Música', value: bands.join(' · ') },
  ].filter((fact) => fact.value)
}
