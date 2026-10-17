// Textos SEO de las páginas de una localidad, generados solo con datos publicados.
//
// Cada localidad tiene dos páginas con intención distinta:
// - la guía cofrade (/agenda-cofrade/localidad/x): página principal de la
//   localidad («Cofradías de X»), con agenda, hermandades, bandas y patrimonio;
// - el listado (/hermandades/localidad/x): «Hermandades de X», ordenado por tipo
//   y día de salida, que remite a la guía.
// Módulo puro (sin alias @/) para probarlo con node --test.

const KINDS = [
  { key: 'agrupacion', heading: 'Agrupaciones parroquiales', countLabel: ['agrupación parroquial', 'agrupaciones parroquiales'] },
  { key: 'penitencia', heading: 'Hermandades de Semana Santa', countLabel: ['de Semana Santa', 'de Semana Santa'] },
  { key: 'gloria', heading: 'Hermandades de Gloria', countLabel: ['de Gloria', 'de Gloria'] },
  { key: 'sacramental', heading: 'Hermandades sacramentales', countLabel: ['sacramental', 'sacramentales'] },
  { key: 'otras', heading: 'Otras corporaciones', countLabel: ['de otro tipo', 'de otro tipo'] },
]

const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const lower = (value) => clean(value).toLocaleLowerCase('es')

// Tipo principal de una corporación, por orden de prioridad. Una Hermandad de
// penitencia que además es sacramental cuenta como de Semana Santa.
export function brotherhoodPrimaryKind(item = {}) {
  const types = (item.tipos || []).map(lower)
  const official = lower(item.nombreOficial)
  if (types.includes('agrupación parroquial') || official.includes('agrupación parroquial')) return 'agrupacion'
  if (types.includes('penitencia')) return 'penitencia'
  if (types.includes('gloria')) return 'gloria'
  if (types.includes('sacramental')) return 'sacramental'
  return 'otras'
}

// Grupos con encabezado, en orden fijo y sin grupos vacíos.
export function localityBrotherhoodGroups(items = []) {
  return KINDS
    .map((kind) => ({ ...kind, items: items.filter((item) => brotherhoodPrimaryKind(item) === kind.key) }))
    .filter((group) => group.items.length)
}

function joinList(parts) {
  if (parts.length <= 1) return parts.join('')
  return `${parts.slice(0, -1).join(', ')} y ${parts.at(-1)}`
}

// «10 de Semana Santa, 5 de Gloria y 2 sacramentales»
export function localityKindSummary(items = []) {
  const groups = localityBrotherhoodGroups(items)
  if (groups.length < 2) return ''
  return joinList(groups.map((group) => `${group.items.length} ${group.countLabel[group.items.length === 1 ? 0 : 1]}`))
}

function corporationsNoun(count) {
  return count === 1 ? 'corporación' : 'corporaciones'
}

export function localityDirectorySeo(label = '', items = []) {
  const name = clean(label)
  const count = items.length
  const summary = localityKindSummary(items)
  const title = [
    `Hermandades de ${name}: listado por tipo y día de salida`,
    `Hermandades de ${name}: listado y días de salida`,
    `Hermandades de ${name}`,
  ].find((candidate) => candidate.length <= 58) || `Hermandades de ${name}`
  const lead = summary
    ? `Hilo Cofrade documenta ${count} ${corporationsNoun(count)} de ${name}: ${summary}. Cada ficha reúne sus titulares, pasos, sede, cultos y salidas, con fuentes.`
    : `Hilo Cofrade documenta ${count} ${corporationsNoun(count)} de ${name}. Cada ficha reúne sus titulares, pasos, sede, cultos y salidas, con fuentes.`
  const description = summary
    ? `Las ${count} hermandades de ${name} (${summary}): titulares, pasos, sede y salidas.`
    : `Hermandades de ${name} en Hilo Cofrade, con titulares, pasos, sede, cultos y salidas documentadas.`
  return { title, lead, description }
}

function countPhrase(count, singular, plural) {
  return count ? `${count} ${count === 1 ? singular : plural}` : ''
}

// Guía cofrade: recuentos reales en la descripción, sin cambiar la intención
// «Cofradías de X» que ya tenía la página.
export function localityGuideSeo(hub = {}) {
  const name = clean(hub.label)
  const entities = [
    countPhrase(hub.brotherhoods?.length || 0, 'hermandad', 'hermandades'),
    countPhrase(hub.bands?.length || 0, 'banda', 'bandas'),
    countPhrase(hub.images?.length || 0, 'imagen', 'imágenes'),
    countPhrase(hub.steps?.length || 0, 'paso', 'pasos'),
  ].filter(Boolean)
  const upcoming = hub.items?.length || 0
  const agendaText = upcoming
    ? `${upcoming} ${upcoming === 1 ? 'próxima cita' : 'próximas citas'} en la agenda`
    : 'su agenda de procesiones, cultos y besamanos'
  const description = entities.length
    ? `Guía cofrade de ${name}: ${joinList(entities)}, y ${agendaText}.`
    : `Guía cofrade de ${name}: ${agendaText}.`
  return { description }
}
