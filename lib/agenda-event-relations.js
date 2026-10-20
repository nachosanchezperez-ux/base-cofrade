// El hilo de cada acto de la Agenda: imágenes y pasos relacionados en la base.
// Módulo puro (sin Supabase ni alias) para probarlo con node --test.
//
// Solo se usan relaciones confirmadas: `outing_entities` de la salida, la imagen
// del culto (`cults.image_entity_id`) y `cult_entities`. No se infiere nada por
// nombre ni por Hermandad. Solo se enlazan entidades publicadas con ficha.

const ROUTE_BY_TYPE = { image: '/imagenes/', step: '/pasos/' }

// Los roles no son uniformes en la base («processional_image», «Titular
// procesional», «Imagen titular»…): se normalizan antes de ordenar. El tipo de
// la entidad (imagen o paso) decide qué se enlaza; el rol solo ordena.
export function normalizeRelationRole(role = '') {
  return String(role || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[\s-]+/g, '_')
}

const ROLE_ORDER = {
  processional_image: 0,
  titular_procesional: 0,
  imagen_titular: 1,
  titular: 1,
  titular_del_culto: 1,
  titular_venerada: 1,
  presiding_image: 1,
  titular_trasladada: 1,
  cult_image: 2,
  honoree: 3,
  secondary_image: 4,
  participant: 5,
  processional_step: 6,
  paso_procesional: 6,
}

export function relationEntityHref(entity) {
  const base = ROUTE_BY_TYPE[entity?.entity_type]
  if (!base || !entity?.slug || entity.status !== 'published') return ''
  return `${base}${entity.slug}`
}

// links: [{ entityId, role }] en cualquier orden; entityById: Map(id → entity).
// Devuelve [{ kind: 'image' | 'step', name, href }] sin duplicados.
export function buildAgendaRelations(links = [], entityById = new Map(), { maxImages = 3, maxSteps = 2 } = {}) {
  const seen = new Set()
  const rank = (link) => ROLE_ORDER[normalizeRelationRole(link.role)] ?? 9
  const sorted = [...links].sort((a, b) => rank(a) - rank(b))
  const relations = []
  const count = { image: 0, step: 0 }
  for (const link of sorted) {
    const entity = entityById.get(link.entityId)
    const href = relationEntityHref(entity)
    if (!href || seen.has(href)) continue
    const kind = entity.entity_type
    const limit = kind === 'image' ? maxImages : maxSteps
    if (count[kind] >= limit) continue
    seen.add(href)
    count[kind] += 1
    relations.push({ kind, name: String(entity.name || '').trim(), href })
  }
  // Imágenes primero y después pasos, conservando el orden por rol.
  return relations.filter((item) => item.name).sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'image' ? -1 : 1))
}

export function relationKindLabel(kind, count = 1) {
  if (kind === 'image') return count === 1 ? 'Imagen' : 'Imágenes'
  if (kind === 'step') return count === 1 ? 'Paso' : 'Pasos'
  return ''
}

const THREAD_LABEL = { brotherhood: 'Hermandad', image: 'Imagen', step: 'Paso', band: 'Banda', municipality: 'Guía local' }
const BROTHERHOOD_PATH = /^\/hermandades\/[^/?#]+/
const BAND_PATH = /^\/bandas\/[^/?#]+/

// Enlaces del hilo de un acto, en orden de lectura: Hermandad, imágenes, pasos,
// bandas y (opcional) la guía local. Cada destino aparece una sola vez y solo si
// existe su ficha. Sirve para la lista de periodos y para la Agenda completa.
export function agendaThreadLinks(item = {}, { includeMunicipality = false, maxBands = 2 } = {}) {
  const links = []
  const seen = new Set()
  const push = (kind, name, href) => {
    const cleanName = String(name || '').trim()
    if (!href || !cleanName || seen.has(href)) return
    seen.add(href)
    links.push({ kind, label: THREAD_LABEL[kind], name: cleanName, href })
  }

  const brotherhoodHref = [item.organizerHref, item.relatedBrotherhoodHref].find((href) => BROTHERHOOD_PATH.test(String(href || ''))) || ''
  // En los conciertos `organizer` son las bandas; la Hermandad va aparte.
  const brotherhoodName = item.category === 'concerts'
    ? item.relatedBrotherhoodName
    : (item.organizer && item.organizer !== 'Entidad organizadora' ? item.organizer : '')
  push('brotherhood', brotherhoodName || 'Hermandad', brotherhoodHref)

  for (const relation of Array.isArray(item.relations) ? item.relations : []) push(relation.kind, relation.name, relation.href)

  let bands = 0
  for (const band of [...(item.bands || []), ...(item.music || [])]) {
    if (bands >= maxBands) break
    if (!BAND_PATH.test(String(band?.href || '')) || seen.has(band.href)) continue
    push('band', band.name, band.href)
    bands += 1
  }

  if (includeMunicipality) push('municipality', item.municipality, item.municipalityHref)
  return links
}
