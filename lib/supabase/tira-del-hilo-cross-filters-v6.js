import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { crossFiltersV6Intent } from '@/lib/tira-cross-filters-v6'
import { relationalEntityScore } from '@/lib/tira-relational-v2'

const LABELS = { agent: 'Autor / profesional', band: 'Banda', brotherhood: 'Hermandad', image: 'Imagen', march: 'Marcha' }
function href(entity) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'march') return `/marchas/${entity.slug}`
  return ''
}
function card(entity, meta = '') { return entity ? { id: entity.id, entityType: entity.entity_type, type: LABELS[entity.entity_type] || 'Entidad', name: entity.name, href: href(entity), meta } : null }
function setContext(entities, sourceIntent) {
  const type = entities[0]?.entity_type || ''
  const ids = [...new Set(entities.filter((entity) => entity.entity_type === type).map((entity) => entity.id))].slice(0, 12)
  return ids.length ? { entityId: null, entityType: null, name: '', resultSet: { entityType: type, entityIds: ids, count: ids.length, label: `${ids.length} ${LABELS[type] || 'entidades'}`, sourceIntent } } : null
}
function answer({ text, path, entities = [], items, evidence = [], followUps = [], context = null }) {
  return { kind: 'answer', answer: text, path, entities: entities.filter(Boolean), items, links: [], evidence, references: [], followUps, context, compactItemLimit: Math.min(Math.max(items.length, 4), 12) }
}
function missing(text) { return { kind: 'not_documented', answer: text, path: [], entities: [], items: [], links: [], evidence: [], references: [], followUps: [], context: null } }

async function publicEntities(supabase, types) {
  const result = await supabase.from('entities').select('id, entity_type, name, slug, summary').in('entity_type', types).eq('status', 'published')
  if (result.error) throw result.error
  return result.data || []
}
function best(entities, question, type) {
  return entities.filter((entity) => entity.entity_type === type).map((entity) => ({ entity, score: relationalEntityScore(entity.name, question, type) })).filter((row) => row.score >= 250).sort((a, b) => b.score - a.score || b.entity.name.length - a.entity.name.length)[0] || null
}
async function byIds(supabase, ids, type) {
  const unique = [...new Set((ids || []).filter(Boolean))]
  if (!unique.length) return []
  const result = await supabase.from('entities').select('id, entity_type, name, slug, summary').in('id', unique).eq('entity_type', type).eq('status', 'published')
  if (result.error) throw result.error
  const map = new Map((result.data || []).map((entity) => [entity.id, entity]))
  return unique.map((id) => map.get(id)).filter(Boolean)
}

async function brotherhoodsByDayBand(supabase, question, day) {
  const all = await publicEntities(supabase, ['band'])
  const band = best(all, question, 'band')?.entity
  if (!band) return null
  const brotherhoodRows = await supabase.from('brotherhoods').select('entity_id, current_procession_day').eq('current_procession_day', day)
  if (brotherhoodRows.error) throw brotherhoodRows.error
  const ids = (brotherhoodRows.data || []).map((row) => row.entity_id)
  if (!ids.length) return missing(`No hay Hermandades publicadas de ${day} con las que cruzar esa Banda.`)
  const music = await supabase.from('current_music_accompaniments').select('brotherhood_entity_id, step_entity_id, position, outing_type').eq('band_entity_id', band.id).in('brotherhood_entity_id', ids)
  if (music.error) throw music.error
  const relationRows = music.data || []
  const brotherhoods = await byIds(supabase, relationRows.map((row) => row.brotherhood_entity_id), 'brotherhood')
  if (!brotherhoods.length) return missing(`${band.name} no tiene actualmente Hermandades publicadas del ${day} en los acompañamientos estructurados.`)
  const rowByBrotherhood = new Map(relationRows.map((row) => [row.brotherhood_entity_id, row]))
  return answer({
    text: `${brotherhoods.length} ${brotherhoods.length === 1 ? 'Hermandad del' : 'Hermandades del'} ${day} ${brotherhoods.length === 1 ? 'está' : 'están'} relacionada${brotherhoods.length === 1 ? '' : 's'} actualmente con ${band.name}.`,
    path: ['Hermandades', day, 'Acompañamientos', band.name],
    entities: [card(band), ...brotherhoods.map((item) => card(item))],
    items: brotherhoods.map((item) => { const row = rowByBrotherhood.get(item.id); return { label: item.name, meta: [day, row?.position, row?.outing_type, band.name].filter(Boolean).join(' · '), href: href(item) } }),
    evidence: [{ key: `day-band-${day}-${band.id}`, label: 'Cruce jornada + acompañamiento actual', detail: `${brotherhoods.length} coincidencias` }],
    followUps: ['¿Qué bandas acompañan a estas hermandades?', 'Compáralas.'],
    context: setContext(brotherhoods, 'brotherhoods_by_day_band'),
  })
}

async function imagesByAgentDay(supabase, question, day) {
  const agents = await publicEntities(supabase, ['agent'])
  const agent = best(agents, question, 'agent')?.entity
  if (!agent) return null
  const authorships = await supabase.from('image_authorships').select('image_entity_id, role_name, certainty').eq('agent_entity_id', agent.id).eq('status', 'published')
  if (authorships.error) throw authorships.error
  const imageIds = [...new Set((authorships.data || []).map((row) => row.image_entity_id).filter(Boolean))]
  if (!imageIds.length) return missing(`No hay imágenes públicas con autoría estructurada de ${agent.name}.`)
  const links = await supabase.from('brotherhood_images').select('image_entity_id, brotherhood_entity_id').in('image_entity_id', imageIds).eq('status', 'published')
  if (links.error) throw links.error
  const brotherhoodIds = [...new Set((links.data || []).map((row) => row.brotherhood_entity_id).filter(Boolean))]
  const profiles = await supabase.from('brotherhoods').select('entity_id, current_procession_day').in('entity_id', brotherhoodIds).eq('current_procession_day', day)
  if (profiles.error) throw profiles.error
  const validBrotherhoodIds = new Set((profiles.data || []).map((row) => row.entity_id))
  const validLinks = (links.data || []).filter((row) => validBrotherhoodIds.has(row.brotherhood_entity_id))
  const images = await byIds(supabase, validLinks.map((row) => row.image_entity_id), 'image')
  const brotherhoods = await byIds(supabase, validLinks.map((row) => row.brotherhood_entity_id), 'brotherhood')
  if (!images.length) return missing(`No hay imágenes publicadas de ${agent.name} vinculadas a Hermandades del ${day}.`)
  const brotherhoodById = new Map(brotherhoods.map((item) => [item.id, item]))
  const ownerByImage = new Map(validLinks.map((row) => [row.image_entity_id, brotherhoodById.get(row.brotherhood_entity_id)]))
  return answer({
    text: `${images.length} ${images.length === 1 ? 'imagen atribuida o realizada' : 'imágenes atribuidas o realizadas'} por ${agent.name} ${images.length === 1 ? 'está vinculada' : 'están vinculadas'} a Hermandades del ${day}.`,
    path: ['Imágenes', agent.name, day],
    entities: [card(agent), ...images.map((item) => card(item)), ...brotherhoods.map((item) => card(item))],
    items: images.map((image) => { const owner = ownerByImage.get(image.id); return { label: image.name, meta: [agent.name, owner?.name, day].filter(Boolean).join(' · '), href: href(image) } }),
    evidence: [{ key: `agent-images-day-${agent.id}-${day}`, label: 'Cruce autoría + jornada', detail: `${images.length} imágenes` }],
    followUps: ['¿Qué otras imágenes hizo este autor?', '¿En qué otras hermandades hay obras suyas?'],
    context: setContext(images, 'images_by_agent_day'),
  })
}

async function marchesByAgentBand(supabase, question) {
  const entities = await publicEntities(supabase, ['agent', 'band'])
  const agent = best(entities, question, 'agent')?.entity
  const band = best(entities, question, 'band')?.entity
  if (!agent || !band) return null
  const authors = await supabase.from('march_authors').select('march_entity_id').eq('agent_entity_id', agent.id).eq('author_role', 'composer').eq('status', 'published')
  if (authors.error) throw authors.error
  const marchIds = [...new Set((authors.data || []).map((row) => row.march_entity_id).filter(Boolean))]
  if (!marchIds.length) return missing(`No hay marchas publicadas compuestas por ${agent.name}.`)
  const repertoires = await supabase.from('musical_repertoires').select('id, slug, title').eq('band_entity_id', band.id).eq('repertoire_kind', 'performed').eq('status', 'published')
  if (repertoires.error) throw repertoires.error
  const repertoireIds = (repertoires.data || []).map((row) => row.id)
  if (!repertoireIds.length) return missing(`${band.name} no tiene crucetas publicadas con las que cruzar las marchas de ${agent.name}.`)
  const entries = await supabase.from('musical_repertoire_entries').select('repertoire_id, march_entity_id, performance_count').in('repertoire_id', repertoireIds).in('march_entity_id', marchIds)
  if (entries.error) throw entries.error
  const rows = entries.data || []
  const marches = await byIds(supabase, rows.map((row) => row.march_entity_id), 'march')
  if (!marches.length) return missing(`No hay marchas publicadas de ${agent.name} documentadas en crucetas de ${band.name}.`)
  const repertoireById = new Map((repertoires.data || []).map((row) => [row.id, row]))
  const usagesByMarch = new Map()
  rows.forEach((row) => { const list = usagesByMarch.get(row.march_entity_id) || []; list.push(row); usagesByMarch.set(row.march_entity_id, list) })
  return answer({
    text: `${marches.length} ${marches.length === 1 ? 'marcha de' : 'marchas de'} ${agent.name} ${marches.length === 1 ? 'aparece' : 'aparecen'} en crucetas publicadas de ${band.name}.`,
    path: ['Marchas', agent.name, 'Interpretadas por', band.name],
    entities: [card(agent), card(band), ...marches.map((item) => card(item))],
    items: marches.map((march) => ({ label: march.name, meta: (usagesByMarch.get(march.id) || []).map((row) => { const rep = repertoireById.get(row.repertoire_id); return [rep?.title, row.performance_count > 1 ? `${row.performance_count} interpretaciones` : ''].filter(Boolean).join(' · ') }).join(' / '), href: href(march) })),
    evidence: [{ key: `agent-band-marches-${agent.id}-${band.id}`, label: 'Cruce compositor + crucetas de Banda', detail: `${marches.length} marchas` }],
    followUps: ['¿En qué crucetas aparece cada una?', '¿Qué otras marchas de este compositor están en crucetas?'],
    context: setContext(marches, 'marches_by_agent_band'),
  })
}

export async function askHiloCofradeCrossFiltersV6(question, context = null) {
  const intent = crossFiltersV6Intent(question, context)
  if (!intent) return null
  const supabase = await createClient()
  try {
    if (intent.kind === 'brotherhoods_by_day_band') return brotherhoodsByDayBand(supabase, question, intent.day)
    if (intent.kind === 'images_by_agent_day') return imagesByAgentDay(supabase, question, intent.day)
    if (intent.kind === 'marches_by_agent_band') return marchesByAgentBand(supabase, question)
    return null
  } catch (error) {
    console.error('[Hilo Cofrade] Error en cruces relacionales V6', { question: String(question || '').slice(0, 320), kind: intent.kind, error: error instanceof Error ? error.message : String(error) })
    return null
  }
}
