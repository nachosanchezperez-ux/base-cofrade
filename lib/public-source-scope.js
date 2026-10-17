// Ámbito público de una fuente («Horario e itinerario 2026»).
//
// En source_links.scope conviven textos editoriales con marcas internas de
// trabajo («outing», «· held», «cierre held-ready según autoridad documental»)
// que no deben verse en la web. Solo se filtra al mostrar: los datos no cambian.

const TECHNICAL_SCOPES = /^(?:outings?|brotherhoods?|entity|entities|bands?|images?|steps?|marches|march|agents?|events?|documentaci[oó]n)$/iu
const HELD_TAIL = /\s*(?:y\s+)?cierre\s+held[-\s]?ready\b.*$/iu

export function publicSourceScope(value = '') {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim()
  if (!text || TECHNICAL_SCOPES.test(text) || text.startsWith('relation:')) return ''
  const parts = text
    .replace(HELD_TAIL, '')
    .split('·')
    .map((part) => part.trim())
    .filter((part) => part && !/\bheld\b/iu.test(part))
  return parts.join(' · ')
}
