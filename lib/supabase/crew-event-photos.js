import 'server-only'
import { createPublicClient } from '@/lib/supabase/public'
import { loadPublicRowsInBatches } from '@/lib/supabase/public-query-batches'
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media'
import { pickCrewEventPhoto, titularCandidatesByStep } from '@/lib/crew-event-photo'

// Fotos del calendario de igualás en tres lecturas por lotes, nunca una por
// tarjeta: imágenes vigentes de cada Paso, sus nombres publicados y todas las
// portadas (convocatoria, titular y Paso) de una vez. Si algo falla, el
// calendario sigue con los escudos.
export async function withCrewEventPhotos(events = []) {
  try {
    return await attachCrewEventPhotos(events)
  } catch (error) {
    console.error('[Hilo Cofrade] Fotos de igualás no disponibles', {
      error: error instanceof Error ? error.message : String(error),
    })
    return events
  }
}

async function attachCrewEventPhotos(events) {
  if (!events.length) return events
  const supabase = createPublicClient()
  const stepIds = [...new Set(events.flatMap((event) => (event.steps || []).map((step) => step.id)).filter(Boolean))]

  const links = stepIds.length
    ? await loadPublicRowsInBatches(
        stepIds,
        (batchIds) => supabase
          .from('image_steps')
          .select('image_entity_id, step_entity_id, relation_type')
          .in('step_entity_id', batchIds)
          .eq('status', 'published')
          .is('date_to', null),
        'No se pudieron consultar las imágenes de los Pasos',
      )
    : []
  const candidates = titularCandidatesByStep(links)
  const imageIds = [...new Set([...candidates.values()].flat().map((item) => item.id))]

  const images = imageIds.length
    ? await loadPublicRowsInBatches(
        imageIds,
        (batchIds) => supabase
          .from('entities')
          .select('id, name, status')
          .in('id', batchIds)
          .eq('status', 'published'),
        'No se pudieron consultar los nombres de las imágenes',
      )
    : []
  const imageNames = new Map(images.map((item) => [item.id, item.name]))
  // Solo imágenes publicadas.
  const titularsByStep = new Map([...candidates].map(([stepId, list]) => [stepId, list.filter((item) => imageNames.has(item.id))]))

  const covers = await getPublishedEntityCoverMediaMap(
    [...events.map((event) => event.id), ...imageNames.keys(), ...stepIds],
    { throwOnError: true },
  )
  if (!covers.size) return events

  return events.map((event) => {
    const photo = pickCrewEventPhoto(event, { covers, titularsByStep, imageNames })
    return photo ? { ...event, photo } : event
  })
}
