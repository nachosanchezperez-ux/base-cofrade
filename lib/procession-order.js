// Cortejo completo (Tarea 15 · prototipo). Política pura, sin acceso a datos.
//
// Un orden procesional es una lista ordenada de posiciones. Cada posición dice
// QUÉ ocupa ese lugar (una insignia, un tramo, un paso, una presidencia…) y,
// si es una pieza patrimonial, a QUÉ registro de patrimonio corresponde. La
// pieza y su posición son cosas distintas: un mismo estandarte puede cambiar de
// sitio de un año a otro sin que cambie su historia.
//
// Hoy no existe ninguna tabla con órdenes procesionales: getBrotherhoodProcessionOrder
// devuelve null para todas las Hermandades y la ficha no cambia. Ver la
// propuesta de datos en docs/cortejo-completo-propuesta.md.

export const ITEM_KINDS = Object.freeze({
  group: 'Sección del cortejo',
  cross_guide: 'Cruz de Guía',
  insignia: 'Insignia',
  tramo: 'Tramo de nazarenos',
  step: 'Paso',
  presidency: 'Presidencia',
  antepresidency: 'Antepresidencia',
  acolytes: 'Cuerpo de acólitos',
  representation: 'Representación',
  music: 'Acompañamiento musical',
  other: 'Otro elemento',
})

// Mínimos para ofrecer «Ver cortejo completo»: una fuente que lo respalde y
// un orden con algo más que pasos (si solo hay pasos, el resumen ya lo cuenta).
export function hasDocumentedOrder(order) {
  if (!order || !Array.isArray(order.items)) return false
  if (!order.demo && !order.source?.name) return false
  const valid = order.items.filter((item) => ITEM_KINDS[item.kind] && String(item.label || '').trim())
  if (valid.length < 3) return false
  return valid.some((item) => item.kind !== 'step' && item.kind !== 'tramo')
}

// Agrupa el orden en secciones: cada tramo de nazarenos abre una sección con
// las insignias que lo encabezan o acompañan; los pasos y presidencias cierran
// su sección. Respeta siempre el orden recibido (sequence), sin reordenar.
export function processionSections(order) {
  if (!hasDocumentedOrder(order)) return []
  const items = [...order.items]
    .filter((item) => ITEM_KINDS[item.kind] && String(item.label || '').trim())
    .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
  const sections = []
  let current = null
  const open = (title, kind) => {
    current = { key: `s${sections.length + 1}`, title, kind, items: [] }
    sections.push(current)
  }
  for (const item of items) {
    if (item.kind === 'tramo' || item.kind === 'group') {
      open(item.label, item.kind)
      current.tramo = item
      continue
    }
    if (item.kind === 'step') {
      sections.push({ key: `p${sections.length + 1}`, kind: 'step', step: item, items: [] })
      current = null
      continue
    }
    if (!current) open(item.section || '', 'head')
    current.items.push(item)
  }
  return sections
}

// Una pieza patrimonial puede ocupar varias posiciones (p. ej. unas bocinas en
// dos cortejos). Todas enlazan al mismo registro; solo la primera describe cómo
// reconocerla, para no repetirlo.
export function markRepeatedHeritage(sections = []) {
  const seen = new Set()
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      const id = item.heritage?.id
      if (!id) return item
      if (seen.has(id)) return { ...item, repeatOf: id }
      seen.add(id)
      return item
    }),
  }))
}

// Recuento para el acceso «Ver cortejo completo»: «12 insignias · 9 tramos».
export function processionCounts(order) {
  const items = hasDocumentedOrder(order) ? order.items : []
  // Cada pieza cuenta una vez aunque el orden la cite dos veces.
  const count = (kinds) => new Set(items.filter((item) => kinds.includes(item.kind))
    .map((item) => item.heritage?.id || `${item.kind}:${item.label}`)).size
  return {
    insignias: count(['insignia', 'cross_guide']),
    tramos: count(['tramo']),
    steps: count(['step']),
  }
}

import { heritagePieceAnchor } from './heritage-anchor.js'

// Estado de un orden (Tarea 15.1). Un orden solo lleva año si su vigencia
// está acreditada: «documentado» no presupone el año en curso.
export const ORDER_STATUS = Object.freeze({
  documented: 'Orden documentado',
  current: 'Orden vigente',
  historical: 'Orden histórico',
})

export function orderStatusLabel(order = {}) {
  const label = ORDER_STATUS[order.status] || ORDER_STATUS.documented
  return order.status !== 'documented' && order.year ? `${label} · ${order.year}` : label
}

// ¿Está documentado el cortejo entero o solo sus insignias? Sin tramos ni
// presidencia, la ficha dice «insignias del cortejo», no «cortejo completo».
export function isFullProcessionOrder(order = {}) {
  const kinds = new Set((order.items || []).map((item) => item.kind))
  return kinds.has('tramo') && kinds.has('presidency')
}

const pieceId = (entry) => entry.pieceKey || `${entry.label}|${entry.year || ''}`
const hasPieceFacts = (entry) => Boolean(entry.author || entry.materials || entry.history)

// Lo que acompaña a la insignia en la calle, sin las varas (las explica «Qué es»).
export function visibleAccompaniment(list = []) {
  const parts = list.filter((entry) => entry?.text && entry.kind !== 'varas').map((entry) => entry.text)
  if (!parts.length) return ''
  return parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} y ${parts.at(-1)}`
}

// Un listado publicado por la Hermandad (p. ej. «Insignias» de su web), agrupado
// por cortejo, convertido en orden. Respeta el orden del listado; no inventa
// tramos. Cada posición solo apunta a su pieza: los datos viven en Patrimonio,
// y una misma pieza puede ocupar varias posiciones.
export function orderFromListing(listing = {}) {
  const documented = new Set()
  for (const entry of [...(listing.groups || []).flatMap((group) => group.items || []), ...(listing.heritageOnly || [])]) {
    if (hasPieceFacts(entry)) documented.add(pieceId(entry))
  }
  let sequence = 0
  const items = []
  for (const group of listing.groups || []) {
    items.push({ kind: 'group', label: group.label, sequence: (sequence += 10), key: `g${sequence}` })
    for (const entry of group.items || []) {
      const id = pieceId(entry)
      items.push({
        kind: entry.kind === 'cross_guide' ? 'cross_guide' : 'insignia',
        label: entry.label, // el año es de la pieza: se lee en Patrimonio
        note: entry.note || '',
        sequence: (sequence += 10),
        key: `i${sequence}`,
        heritage: { id, ...(documented.has(id) ? { href: `#${heritagePieceAnchor(id)}` } : {}) },
        look: entry.look || '',
        accompaniment: visibleAccompaniment(entry.accompaniment),
      })
    }
    // Cada cortejo termina en su paso (la fuente lo agrupa así).
    if (group.closingStep?.label) items.push({ kind: 'step', label: group.closingStep.label, note: group.closingStep.kind || '', sequence: (sequence += 10), key: `p${sequence}` })
  }
  return {
    scope: 'listing',
    status: listing.status || 'documented',
    year: listing.status && listing.status !== 'documented' ? listing.year || null : null,
    procession: Boolean(listing.procession),
    draft: true,
    source: listing.source || null,
    items,
  }
}

// Las piezas del mismo listado, una sola vez, con la forma del capítulo
// Patrimonio (lo que se cargaría en heritage_assets; borrador, sin cargar).
// Incluye las piezas de la relación que no salen en el cortejo.
export function heritagePiecesFromListing(listing = {}) {
  const pieces = []
  const seen = new Set()
  const entries = [...(listing.groups || []).flatMap((group) => group.items || []), ...(listing.heritageOnly || [])]
  for (const entry of entries) {
    if (!hasPieceFacts(entry)) continue
    const id = pieceId(entry)
    if (seen.has(id)) continue
    seen.add(id)
    pieces.push({
      id,
      nombre: entry.label,
      tipo: entry.kind === 'cross_guide' ? 'Cruz de Guía' : 'Insignia',
      fecha: entry.year || '',
      // Solo lo que es de la pieza; lo que la acompaña en la calle es del cortejo.
      resumen: entry.about || '',
      agentes: entry.author ? [{ id: `${id}-autoria`, nombre: entry.author, rol: '' }] : [],
      materiales: entry.materials || '',
      contexto: entry.history || '',
      origen: [entry.restorations ? `Restauraciones: ${entry.restorations}` : '', entry.review || ''].filter(Boolean).join(' '),
    })
  }
  return pieces
}
