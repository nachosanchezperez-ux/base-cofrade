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

// Una pieza patrimonial se muestra una sola vez: si el orden la cita dos veces
// (p. ej. por error de carga), la segunda aparición queda solo como nombre.
export function markRepeatedHeritage(sections = []) {
  const seen = new Set()
  return sections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      const id = item.heritage?.id
      if (!id) return item
      if (seen.has(id)) return { ...item, heritage: null, repeatOf: id }
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

// Un listado publicado por la Hermandad (p. ej. «Insignias» de su web), agrupado
// por cortejo, convertido en orden. Respeta el orden del listado; no inventa
// tramos ni coloca los pasos. scope: 'listing' para decirlo en pantalla.
export function orderFromListing(listing = {}) {
  let sequence = 0
  const items = []
  for (const group of listing.groups || []) {
    items.push({ kind: 'group', label: group.label, sequence: (sequence += 10), key: `g${sequence}` })
    for (const entry of group.items || []) {
      const id = entry.pieceKey || `${entry.label}|${entry.year || ''}`
      // La posición solo apunta a la pieza: sus datos viven en Patrimonio.
      const hasPiece = Boolean(entry.author || entry.materials || entry.history)
      items.push({
        kind: entry.kind === 'cross_guide' ? 'cross_guide' : 'insignia',
        label: entry.year ? `${entry.label} (${entry.year})` : entry.label,
        note: entry.note || '',
        sequence: (sequence += 10),
        key: `i${sequence}`,
        heritage: { id, ...(hasPiece ? { href: `#${heritagePieceAnchor(id)}` } : {}) },
        look: entry.look || '',
        materials: entry.materials || '',
      })
    }
    // Cada cortejo termina en su paso (la fuente lo agrupa así).
    if (group.closingStep?.label) items.push({ kind: 'step', label: group.closingStep.label, note: group.closingStep.kind || '', sequence: (sequence += 10), key: `p${sequence}` })
  }
  return {
    scope: 'listing',
    procession: Boolean(listing.procession),
    draft: true,
    source: listing.source || null,
    items,
  }
}

// Las piezas del mismo listado, una sola vez, con la forma del capítulo
// Patrimonio. Es lo que se cargaría en heritage_assets (borrador, sin cargar).
export function heritagePiecesFromListing(listing = {}) {
  const pieces = []
  const seen = new Set()
  for (const group of listing.groups || []) {
    for (const entry of group.items || []) {
      if (!(entry.author || entry.materials || entry.history)) continue
      const id = entry.pieceKey || `${entry.label}|${entry.year || ''}`
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
        origen: [entry.history, entry.review ? 'Fechas pendientes de confirmar con la Hermandad.' : ''].filter(Boolean).join(' '),
      })
    }
  }
  return pieces
}
