// Foto de cada convocatoria de igualás y ensayos. Módulo puro (node --test).
//
// Mismo criterio que la Agenda (lib/agenda-event-photo.js), sin inventar nada:
//   1. Foto o cartel de la propia convocatoria (portada en entity_media).
//   2. Foto de la imagen titular que va en ese Paso (image_steps vigente).
//   3. Foto del propio Paso.
//   4. Nada: la tarjeta usa el escudo de la Hermandad, nunca una foto genérica.
// Las portadas llegan ya filtradas por derechos de publicación y con su crédito.

import { agendaPhotoFit } from './agenda-event-photo.js'

// Relación imagen ↔ Paso: primero la titular o procesional; nunca las
// secundarias del misterio ni las proyectadas.
const RELATION_RANK = new Map([
  ['titular', 0],
  ['processional_image', 1],
  ['current_processional_step', 1],
  ['processional', 2],
  ['processes_on', 2],
  ['procesiona_en', 2],
  ['Procesiona en', 2],
])

export function crewTitularRank(relationType = '') {
  return RELATION_RANK.has(relationType) ? RELATION_RANK.get(relationType) : null
}

// links: filas de image_steps vigentes y publicadas. Devuelve, por Paso, las
// imágenes candidatas ordenadas.
export function titularCandidatesByStep(links = []) {
  const byStep = new Map()
  for (const link of links) {
    const rank = crewTitularRank(link.relation_type)
    if (rank === null || !link.step_entity_id || !link.image_entity_id) continue
    const list = byStep.get(link.step_entity_id) || []
    if (!list.some((item) => item.id === link.image_entity_id)) list.push({ id: link.image_entity_id, rank })
    byStep.set(link.step_entity_id, list)
  }
  for (const list of byStep.values()) list.sort((a, b) => a.rank - b.rank)
  return byStep
}

function fromCover(cover, source, fallbackAlt, name = '') {
  if (!cover?.path) return null
  return {
    path: cover.path,
    alt: cover.alt || fallbackAlt || '',
    credit: String(cover.credit || '').trim(),
    fit: agendaPhotoFit(cover),
    position: cover.focusPosition || '50% 50%',
    mobilePosition: `${cover.mobileFocusX ?? 50}% ${cover.mobileFocusY ?? 50}%`,
    source,
    name,
  }
}

// event: convocatoria normalizada. covers: Map entityId → portada.
// titularsByStep: Map stepId → [{ id, rank }]. imageNames: Map imageId → nombre.
export function pickCrewEventPhoto(event = {}, { covers = new Map(), titularsByStep = new Map(), imageNames = new Map() } = {}) {
  const own = fromCover(covers.get(event.id), 'event', event.title)
  if (own) return own
  const steps = [...(event.steps || [])].sort((a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary)))
  for (const step of steps) {
    for (const candidate of titularsByStep.get(step.id) || []) {
      const name = imageNames.get(candidate.id) || ''
      const photo = fromCover(covers.get(candidate.id), 'titular', name || step.name, name)
      if (photo) return photo
    }
  }
  for (const step of steps) {
    const photo = fromCover(covers.get(step.id), 'step', step.name, step.name)
    if (photo) return photo
  }
  return null
}

// Pie de foto: «Fotografía de Nuestro Padre Jesús… · Autor».
export function crewPhotoCaption(photo) {
  if (!photo) return ''
  const author = String(photo.credit || '').replace(/^Fotograf[ií]a\s*·\s*/i, '').trim()
  const subject = photo.source === 'event' ? '' : photo.name
  const lead = subject ? `Fotografía de ${subject}` : (photo.fit === 'contain' ? 'Cartel' : 'Fotografía')
  return author ? `${lead} · ${author}` : (subject ? lead : '')
}
