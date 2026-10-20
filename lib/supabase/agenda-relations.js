import 'server-only'
import { createPublicClient } from '@/lib/supabase/public'
import { buildAgendaRelations } from '@/lib/agenda-event-relations'

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function chunks(values, size = 100) {
  return Array.from({ length: Math.ceil(values.length / size) }, (_, index) => values.slice(index * size, (index + 1) * size))
}

// Hilo de la Agenda (imágenes y pasos de cada acto) en lecturas por lotes:
// nunca una consulta por tarjeta. Grupos: [rosarios, extraordinarias, glorias,
// salidas generales, cultos, conciertos]; los cuatro primeros son salidas.
// Si falla, la Agenda sigue sin el hilo: es un añadido, no puede tumbarla.
export async function withAgendaRelations(groups) {
  try {
    return await attachAgendaRelations(groups)
  } catch (error) {
    console.error('[Hilo Cofrade] Hilo de la Agenda no disponible', {
      error: error instanceof Error ? error.message : String(error),
    })
    return groups
  }
}

async function attachAgendaRelations(groups) {
  const outingIds = [...new Set(groups.slice(0, 4).flatMap((group) => group.filter((item) => item.isUpcoming).map((item) => item.id)).filter(Boolean))]
  const upcomingCults = (groups[4] || []).filter((item) => item.isUpcoming && item.cultId)
  const cultIds = [...new Set(upcomingCults.map((item) => item.cultId))]
  if (!outingIds.length && !cultIds.length) return groups

  const supabase = createPublicClient()
  const [outingLinks, cultLinks] = await Promise.all([
    Promise.all(chunks(outingIds).map(async (batch) => rows(
      await supabase.from('outing_entities').select('outing_id, entity_id, role').in('outing_id', batch),
      'Relaciones de salidas en la Agenda'
    ))).then((parts) => parts.flat()),
    Promise.all(chunks(cultIds).map(async (batch) => rows(
      await supabase.from('cult_entities').select('cult_id, entity_id, role').in('cult_id', batch),
      'Relaciones de cultos en la Agenda'
    ))).then((parts) => parts.flat()),
  ])

  const entityIds = [...new Set([
    ...outingLinks.map((row) => row.entity_id),
    ...cultLinks.map((row) => row.entity_id),
    ...upcomingCults.map((item) => item.imageEntityId),
  ].filter(Boolean))]
  if (!entityIds.length) return groups

  const entities = (await Promise.all(chunks(entityIds).map(async (batch) => rows(
    await supabase.from('entities').select('id, name, slug, entity_type, status').in('id', batch).eq('status', 'published').in('entity_type', ['image', 'step']),
    'Imágenes y pasos de la Agenda'
  )))).flat()
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))

  const linksByOuting = new Map()
  for (const row of outingLinks) {
    if (!linksByOuting.has(row.outing_id)) linksByOuting.set(row.outing_id, [])
    linksByOuting.get(row.outing_id).push({ entityId: row.entity_id, role: row.role })
  }
  const linksByCult = new Map()
  for (const row of cultLinks) {
    if (!linksByCult.has(row.cult_id)) linksByCult.set(row.cult_id, [])
    linksByCult.get(row.cult_id).push({ entityId: row.entity_id, role: row.role })
  }

  return groups.map((group, index) => {
    if (index < 4) {
      return group.map((item) => {
        const links = linksByOuting.get(item.id)
        return links ? { ...item, relations: buildAgendaRelations(links, entityById) } : item
      })
    }
    if (index === 4) {
      return group.map((item) => {
        if (!item.cultId) return item
        const links = [
          ...(item.imageEntityId ? [{ entityId: item.imageEntityId, role: 'cult_image' }] : []),
          ...(linksByCult.get(item.cultId) || []),
        ]
        return links.length ? { ...item, relations: buildAgendaRelations(links, entityById) } : item
      })
    }
    return group
  })
}
