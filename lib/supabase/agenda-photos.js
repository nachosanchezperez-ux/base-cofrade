import 'server-only'
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media'
import { getPublishedCultCoverMediaMap } from '@/lib/supabase/cult-media'
import { titularEntityId } from '@/lib/agenda-event-photo'

// Fotos de la Agenda en tres lecturas por lotes, nunca una por tarjeta:
//   - portadas de los cultos próximos (cult_media),
//   - portadas de los conciertos y actos próximos (entity_media del acto),
//   - portada de la imagen titular del hilo, para los actos sin foto propia.
// Los lectores de portadas ya descartan fotos sin derechos de publicación.
// Grupos: [rosarios, extraordinarias, glorias, salidas generales, cultos,
// conciertos]. Si algo falla, la Agenda sigue sin fotos nuevas.
export async function withAgendaPhotos(groups) {
  try {
    return await attachAgendaPhotos(groups)
  } catch (error) {
    console.error('[Hilo Cofrade] Fotos de la Agenda no disponibles', {
      error: error instanceof Error ? error.message : String(error),
    })
    return groups
  }
}

async function attachAgendaPhotos(groups) {
  const cults = (groups[4] || []).filter((item) => item.isUpcoming && item.cultId)
  const concerts = (groups[5] || []).filter((item) => item.isUpcoming && item.id)

  const [cultCovers, eventCovers] = await Promise.all([
    getPublishedCultCoverMediaMap(cults.map((item) => item.cultId)),
    getPublishedEntityCoverMediaMap(concerts.map((item) => item.id), { throwOnError: true }),
  ])

  const withOwn = groups.map((group, index) => {
    if (index === 4) return group.map((item) => (cultCovers.has(item.cultId) ? { ...item, eventCover: cultCovers.get(item.cultId) } : item))
    if (index === 5) return group.map((item) => (eventCovers.has(item.id) ? { ...item, eventCover: eventCovers.get(item.id) } : item))
    return group
  })

  // Solo se busca la foto del titular para los actos próximos sin foto propia.
  const titularIds = new Set()
  for (const group of withOwn) {
    for (const item of group) {
      if (!item.isUpcoming || item.heroImagePath || item.eventCover) continue
      const titular = titularEntityId(item)
      if (titular) titularIds.add(titular.id)
    }
  }
  if (!titularIds.size) return withOwn

  const titularCovers = await getPublishedEntityCoverMediaMap([...titularIds], { throwOnError: true })
  if (!titularCovers.size) return withOwn

  return withOwn.map((group) => group.map((item) => {
    if (!item.isUpcoming || item.heroImagePath || item.eventCover) return item
    const titular = titularEntityId(item)
    const cover = titular && titularCovers.get(titular.id)
    return cover ? { ...item, titularCover: cover, titularName: titular.name } : item
  }))
}
