import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { askHiloCofradeV10 } from '@/lib/supabase/tira-del-hilo-v10'
import {
  chooseDiscoveryCandidate,
  discoveryDateKey,
  isDiscoveryIntent,
  normalizeDiscovery,
} from '@/lib/tira-discovery'

const ROOT_TYPES = new Set(['brotherhood', 'band', 'step', 'image', 'agent', 'march'])
const STOPWORDS = new Set(['hermandad', 'banda', 'nuestra', 'senora', 'santa', 'santo', 'santisimo', 'santisima', 'paso'])

function variants(entity) {
  const name = normalizeDiscovery(entity.name)
  const values = new Set([name])
  if (entity.entity_type === 'brotherhood') {
    values.add(name.replace(/^hermandad de /, ''))
    values.add(name.replace(/^hermandad /, ''))
  }
  if (entity.entity_type === 'band') {
    values.add(name.replace(/^banda de /, ''))
    values.add(name.replace(/^banda /, ''))
  }
  for (const value of [...values]) values.add(value.replace(/^(la|el) /, ''))
  return [...values].filter((value) => value.length >= 4)
}

function entityScore(entity, question) {
  const q = normalizeDiscovery(question)
  const direct = variants(entity).filter((value) => q.includes(value)).sort((a, b) => b.length - a.length)[0]
  if (direct) return 1000 + direct.length

  const nameTokens = normalizeDiscovery(entity.name)
    .split(' ')
    .filter((token) => token.length > 3 && !STOPWORDS.has(token))
  const queryTokens = new Set(q.split(' ').filter((token) => token.length > 3))
  const overlap = nameTokens.filter((token) => queryTokens.has(token)).length
  return overlap >= 2 ? overlap * 100 : 0
}

async function publicEntities(supabase) {
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('status', 'published')
  if (result.error) throw result.error
  return result.data || []
}

function explicitRoot(question, entities) {
  return entities
    .filter((entity) => ROOT_TYPES.has(entity.entity_type))
    .map((entity) => ({ entity, score: entityScore(entity, question) }))
    .filter((item) => item.score >= 200)
    .sort((a, b) => b.score - a.score)[0]?.entity || null
}

function addCandidate(map, entity, score, reason = '') {
  if (!entity) return
  const current = map.get(entity.id)
  if (!current || score > current.score) {
    map.set(entity.id, { ...entity, score, reason })
  }
}

function byId(entities) {
  return new Map(entities.map((entity) => [entity.id, entity]))
}

async function brotherhoodCandidates(supabase, root, entities) {
  const candidates = new Map()
  const entityMap = byId(entities)
  const [stepsResult, imagesResult, musicResult] = await Promise.all([
    supabase.from('brotherhood_steps').select('step_entity_id').eq('brotherhood_entity_id', root.id).eq('status', 'published'),
    supabase.from('brotherhood_images').select('image_entity_id').eq('brotherhood_entity_id', root.id).eq('status', 'published'),
    supabase.from('current_music_accompaniments').select('band_entity_id').eq('brotherhood_entity_id', root.id),
  ])
  const error = [stepsResult, imagesResult, musicResult].find((result) => result.error)?.error
  if (error) throw error

  const stepIds = [...new Set((stepsResult.data || []).map((row) => row.step_entity_id).filter(Boolean))]
  const imageIds = [...new Set((imagesResult.data || []).map((row) => row.image_entity_id).filter(Boolean))]
  const bandIds = [...new Set((musicResult.data || []).map((row) => row.band_entity_id).filter(Boolean))]

  if (stepIds.length) {
    const personnel = await supabase.from('current_step_personnel').select('agent_entity_id').in('step_entity_id', stepIds)
    if (personnel.error) throw personnel.error
    ;(personnel.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.agent_entity_id), 95, 'Profesional conectado a un paso'))
  }

  if (imageIds.length) {
    const authors = await supabase.from('image_authorships').select('agent_entity_id').in('image_entity_id', imageIds).eq('status', 'published')
    if (authors.error) throw authors.error
    ;(authors.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.agent_entity_id), 88, 'Autor relacionado con una imagen'))
  }

  if (bandIds.length) {
    const otherBrotherhoods = await supabase
      .from('current_music_accompaniments')
      .select('brotherhood_entity_id, band_entity_id')
      .in('band_entity_id', bandIds)
      .neq('brotherhood_entity_id', root.id)
    if (otherBrotherhoods.error) throw otherBrotherhoods.error
    ;(otherBrotherhoods.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.brotherhood_entity_id), 105, 'Otra hermandad conectada por música'))
  }

  stepIds.forEach((id) => addCandidate(candidates, entityMap.get(id), 45, 'Paso relacionado'))
  imageIds.forEach((id) => addCandidate(candidates, entityMap.get(id), 42, 'Imagen relacionada'))
  bandIds.forEach((id) => addCandidate(candidates, entityMap.get(id), 48, 'Banda relacionada'))
  candidates.delete(root.id)
  return [...candidates.values()]
}

async function bandCandidates(supabase, root, entities) {
  const candidates = new Map()
  const entityMap = byId(entities)
  const relations = await supabase
    .from('current_music_accompaniments')
    .select('brotherhood_entity_id, step_entity_id')
    .eq('band_entity_id', root.id)
  if (relations.error) throw relations.error
  const brotherhoodIds = [...new Set((relations.data || []).map((row) => row.brotherhood_entity_id).filter(Boolean))]
  const stepIds = [...new Set((relations.data || []).map((row) => row.step_entity_id).filter(Boolean))]

  brotherhoodIds.forEach((id) => addCandidate(candidates, entityMap.get(id), 60, 'Hermandad acompañada'))
  stepIds.forEach((id) => addCandidate(candidates, entityMap.get(id), 65, 'Paso acompañado'))

  if (stepIds.length) {
    const personnel = await supabase.from('current_step_personnel').select('agent_entity_id').in('step_entity_id', stepIds)
    if (personnel.error) throw personnel.error
    ;(personnel.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.agent_entity_id), 100, 'Profesional conectado a un paso acompañado'))
  }

  if (brotherhoodIds.length) {
    const siblingBands = await supabase
      .from('current_music_accompaniments')
      .select('band_entity_id')
      .in('brotherhood_entity_id', brotherhoodIds)
      .neq('band_entity_id', root.id)
    if (siblingBands.error) throw siblingBands.error
    ;(siblingBands.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.band_entity_id), 82, 'Otra banda conectada por hermandad'))
  }

  candidates.delete(root.id)
  return [...candidates.values()]
}

async function stepCandidates(supabase, root, entities) {
  const candidates = new Map()
  const entityMap = byId(entities)
  const [brotherhoods, personnel, bands, images] = await Promise.all([
    supabase.from('brotherhood_steps').select('brotherhood_entity_id').eq('step_entity_id', root.id).eq('status', 'published'),
    supabase.from('current_step_personnel').select('agent_entity_id').eq('step_entity_id', root.id),
    supabase.from('current_music_accompaniments').select('band_entity_id').eq('step_entity_id', root.id),
    supabase.from('image_steps').select('image_entity_id').eq('step_entity_id', root.id).eq('status', 'published'),
  ])
  const error = [brotherhoods, personnel, bands, images].find((result) => result.error)?.error
  if (error) throw error

  const agentIds = [...new Set((personnel.data || []).map((row) => row.agent_entity_id).filter(Boolean))]
  agentIds.forEach((id) => addCandidate(candidates, entityMap.get(id), 72, 'Profesional actual'))
  ;(brotherhoods.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.brotherhood_entity_id), 55, 'Hermandad del paso'))
  ;(bands.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.band_entity_id), 58, 'Banda del paso'))
  ;(images.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.image_entity_id), 52, 'Imagen del paso'))

  if (agentIds.length) {
    const otherSteps = await supabase
      .from('current_step_personnel')
      .select('step_entity_id, agent_entity_id')
      .in('agent_entity_id', agentIds)
      .neq('step_entity_id', root.id)
    if (otherSteps.error) throw otherSteps.error
    ;(otherSteps.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.step_entity_id), 110, 'Otro paso conectado por profesional'))
  }

  candidates.delete(root.id)
  return [...candidates.values()]
}

async function imageCandidates(supabase, root, entities) {
  const candidates = new Map()
  const entityMap = byId(entities)
  const [authors, brotherhoods, steps] = await Promise.all([
    supabase.from('image_authorships').select('agent_entity_id').eq('image_entity_id', root.id).eq('status', 'published'),
    supabase.from('brotherhood_images').select('brotherhood_entity_id').eq('image_entity_id', root.id).eq('status', 'published'),
    supabase.from('image_steps').select('step_entity_id').eq('image_entity_id', root.id).eq('status', 'published'),
  ])
  const error = [authors, brotherhoods, steps].find((result) => result.error)?.error
  if (error) throw error

  const authorIds = [...new Set((authors.data || []).map((row) => row.agent_entity_id).filter(Boolean))]
  authorIds.forEach((id) => addCandidate(candidates, entityMap.get(id), 70, 'Autoría de la imagen'))
  ;(brotherhoods.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.brotherhood_entity_id), 52, 'Hermandad relacionada'))
  ;(steps.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.step_entity_id), 56, 'Paso relacionado'))

  if (authorIds.length) {
    const otherImages = await supabase
      .from('image_authorships')
      .select('image_entity_id, agent_entity_id')
      .in('agent_entity_id', authorIds)
      .neq('image_entity_id', root.id)
      .eq('status', 'published')
    if (otherImages.error) throw otherImages.error
    ;(otherImages.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.image_entity_id), 108, 'Otra imagen conectada por autoría'))
  }

  candidates.delete(root.id)
  return [...candidates.values()]
}

async function agentCandidates(supabase, root, entities) {
  const candidates = new Map()
  const entityMap = byId(entities)
  const [phases, personnel, marches, images] = await Promise.all([
    supabase.from('step_phase_details').select('step_entity_id').eq('agent_entity_id', root.id),
    supabase.from('current_step_personnel').select('step_entity_id').eq('agent_entity_id', root.id),
    supabase.from('march_authors').select('march_entity_id').eq('agent_entity_id', root.id).eq('status', 'published'),
    supabase.from('image_authorships').select('image_entity_id').eq('agent_entity_id', root.id).eq('status', 'published'),
  ])
  const error = [phases, personnel, marches, images].find((result) => result.error)?.error
  if (error) throw error

  const stepIds = [...new Set([...(phases.data || []), ...(personnel.data || [])].map((row) => row.step_entity_id).filter(Boolean))]
  const marchIds = [...new Set((marches.data || []).map((row) => row.march_entity_id).filter(Boolean))]
  const imageIds = [...new Set((images.data || []).map((row) => row.image_entity_id).filter(Boolean))]
  stepIds.forEach((id) => addCandidate(candidates, entityMap.get(id), 68, 'Paso relacionado'))
  marchIds.forEach((id) => addCandidate(candidates, entityMap.get(id), 72, 'Marcha relacionada'))
  imageIds.forEach((id) => addCandidate(candidates, entityMap.get(id), 70, 'Imagen relacionada'))

  if (stepIds.length) {
    const brotherhoods = await supabase
      .from('brotherhood_steps')
      .select('brotherhood_entity_id')
      .in('step_entity_id', stepIds)
      .eq('status', 'published')
    if (brotherhoods.error) throw brotherhoods.error
    ;(brotherhoods.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.brotherhood_entity_id), 105, 'Hermandad conectada a través de un paso'))
  }

  if (marchIds.length) {
    const dedications = await supabase
      .from('march_dedications')
      .select('dedicatee_entity_id')
      .in('march_entity_id', marchIds)
      .eq('status', 'published')
    if (dedications.error) throw dedications.error
    ;(dedications.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.dedicatee_entity_id), 98, 'Destinatario conectado por una marcha'))
  }

  candidates.delete(root.id)
  return [...candidates.values()]
}

async function marchCandidates(supabase, root, entities) {
  const candidates = new Map()
  const entityMap = byId(entities)
  const [authors, dedications] = await Promise.all([
    supabase.from('march_authors').select('agent_entity_id').eq('march_entity_id', root.id).eq('status', 'published'),
    supabase.from('march_dedications').select('dedicatee_entity_id').eq('march_entity_id', root.id).eq('status', 'published'),
  ])
  const error = [authors, dedications].find((result) => result.error)?.error
  if (error) throw error

  const authorIds = [...new Set((authors.data || []).map((row) => row.agent_entity_id).filter(Boolean))]
  authorIds.forEach((id) => addCandidate(candidates, entityMap.get(id), 62, 'Autor de la marcha'))
  ;(dedications.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.dedicatee_entity_id), 74, 'Destinatario de la marcha'))

  if (authorIds.length) {
    const otherMarches = await supabase
      .from('march_authors')
      .select('march_entity_id')
      .in('agent_entity_id', authorIds)
      .neq('march_entity_id', root.id)
      .eq('status', 'published')
    if (otherMarches.error) throw otherMarches.error
    ;(otherMarches.data || []).forEach((row) => addCandidate(candidates, entityMap.get(row.march_entity_id), 105, 'Otra marcha conectada por autoría'))
  }

  candidates.delete(root.id)
  return [...candidates.values()]
}

async function candidatesFor(supabase, root, entities) {
  if (root.entity_type === 'brotherhood') return brotherhoodCandidates(supabase, root, entities)
  if (root.entity_type === 'band') return bandCandidates(supabase, root, entities)
  if (root.entity_type === 'step') return stepCandidates(supabase, root, entities)
  if (root.entity_type === 'image') return imageCandidates(supabase, root, entities)
  if (root.entity_type === 'agent') return agentCandidates(supabase, root, entities)
  if (root.entity_type === 'march') return marchCandidates(supabase, root, entities)
  return []
}

function defaultRoot(entities, seed) {
  const roots = entities.filter((entity) => ['brotherhood', 'band', 'step', 'image'].includes(entity.entity_type))
  return chooseDiscoveryCandidate(roots.map((entity) => ({ ...entity, score: entity.entity_type === 'brotherhood' ? 100 : 70 })), seed)
}

export async function askDiscoveryHilo(question) {
  if (!isDiscoveryIntent(question)) return null

  const supabase = await createClient()
  const entities = await publicEntities(supabase)
  const dateKey = discoveryDateKey()
  const root = explicitRoot(question, entities)
    || defaultRoot(entities, `${dateKey}|${normalizeDiscovery(question)}`)
  if (!root) return null

  const candidates = await candidatesFor(supabase, root, entities)
  const target = chooseDiscoveryCandidate(
    candidates,
    `${dateKey}|${root.id}|${normalizeDiscovery(question)}`
  )
  if (!target) {
    return {
      kind: 'not_documented',
      answer: `Todavía no tengo suficientes relaciones publicadas para tirar de un hilo distinto desde ${root.name}.`,
      path: [],
      entities: [],
      items: [],
      followUps: [],
      context: { entityId: root.id, entityType: root.entity_type, name: root.name },
    }
  }

  const synthetic = `Busca alguna conexión entre ${root.name} y ${target.name}`
  const response = await askHiloCofradeV10(synthetic, null)
  if (response?.kind !== 'answer') return response

  return {
    ...response,
    answer: `${response.answer} Lo he seleccionado como hilo para descubrir desde ${root.name}.`,
    discovery: {
      root: root.name,
      target: target.name,
      reason: target.reason || '',
    },
    followUps: [
      `Tira de otro hilo sobre ${root.name}`,
      `Cuéntame sobre ${target.name}`,
      ...(response.followUps || []),
    ].slice(0, 3),
  }
}
