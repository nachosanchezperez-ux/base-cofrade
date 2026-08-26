import 'server-only'

import { askHiloCofradeV10 } from '@/lib/supabase/tira-del-hilo-v10'
import { createClient } from '@/lib/supabase/server'

const NAVIGABLE_TYPES = new Set(['brotherhood', 'image', 'step', 'band'])
const TYPE_LABELS = {
  brotherhood: 'Hermandad',
  image: 'Imagen',
  step: 'Paso',
  band: 'Banda',
  march: 'Marcha',
  agent: 'Autor / profesional',
  event: 'Acontecimiento',
  heritage_asset: 'Patrimonio',
  advocation: 'Advocación',
}

function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function entityHref(entity) {
  if (!entity?.slug || !NAVIGABLE_TYPES.has(entity.entity_type)) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function publicEntity(entity, meta = '') {
  return {
    id: entity.id,
    entityType: entity.entity_type,
    type: TYPE_LABELS[entity.entity_type] || 'Entidad',
    name: entity.name,
    href: entityHref(entity),
    meta,
  }
}

function answer({ text, path = [], entities = [], items = [], followUps = [], context = null }) {
  return {
    kind: 'answer',
    answer: text,
    path,
    entities: entities.filter(Boolean),
    items,
    followUps,
    context,
  }
}

function isDiscoveryQuestion(question) {
  const q = normalize(question)
  return /\b(sorprendeme|sorprende|descubre|descubrir|curioso|curiosa|curiosidad|tira de un hilo|tira del hilo|alguna conexion interesante|alguna relacion interesante)\b/.test(q)
}

function scoreEntityName(entity, question) {
  const q = normalize(question)
  const name = normalize(entity.name)
  if (!name || !q) return 0
  if (q.includes(name)) return 1000 + name.length
  const trimmed = name
    .replace(/^hermandad de /, '')
    .replace(/^hermandad /, '')
    .replace(/^banda de /, '')
    .replace(/^banda /, '')
    .replace(/^(la|el) /, '')
  if (trimmed.length >= 5 && q.includes(trimmed)) return 800 + trimmed.length
  return 0
}

async function allPublicEntities(supabase) {
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary, created_at')
    .eq('status', 'published')
  if (result.error) throw result.error
  return result.data || []
}

function explicitEntity(question, entities) {
  return entities
    .map((entity) => ({ entity, score: scoreEntityName(entity, question) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.entity || null
}

function stablePick(entities) {
  if (!entities.length) return null
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date())
  let hash = 0
  for (const char of date) hash = ((hash * 31) + char.charCodeAt(0)) >>> 0
  const preferred = entities.filter((entity) => ['brotherhood', 'band', 'image', 'step', 'march'].includes(entity.entity_type))
  const pool = preferred.length ? preferred : entities
  return pool[hash % pool.length]
}

async function entitiesByIds(supabase, ids = []) {
  const unique = [...new Set(ids.filter(Boolean))].slice(0, 40)
  if (!unique.length) return []
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .in('id', unique)
    .eq('status', 'published')
  if (result.error) throw result.error
  const byId = new Map((result.data || []).map((entity) => [entity.id, entity]))
  return unique.map((id) => byId.get(id)).filter(Boolean)
}

function pushEdge(edges, targetId, relation, detail = '', priority = 50) {
  if (!targetId) return
  edges.push({ targetId, relation, detail, priority })
}

async function neighborhood(supabase, entity) {
  const edges = []

  if (entity.entity_type === 'brotherhood') {
    const [images, steps, music] = await Promise.all([
      supabase.from('brotherhood_images').select('image_entity_id, relation_type').eq('brotherhood_entity_id', entity.id).eq('status', 'published'),
      supabase.from('brotherhood_steps').select('step_entity_id, relation_type').eq('brotherhood_entity_id', entity.id).eq('status', 'published'),
      supabase.from('current_music_accompaniments').select('band_entity_id, step_entity_id, outing_type, position').eq('brotherhood_entity_id', entity.id),
    ])
    if (images.error) throw images.error
    if (steps.error) throw steps.error
    if (music.error) throw music.error
    ;(images.data || []).forEach((row) => pushEdge(edges, row.image_entity_id, row.relation_type === 'titular' ? 'Titular' : 'Imagen relacionada', row.relation_type || '', 95))
    ;(steps.data || []).forEach((row) => pushEdge(edges, row.step_entity_id, 'Paso relacionado', row.relation_type || '', 90))
    ;(music.data || []).forEach((row) => pushEdge(edges, row.band_entity_id, 'Acompañamiento musical actual', [row.outing_type, row.position].filter(Boolean).join(' · '), 85))
  }

  if (entity.entity_type === 'band') {
    const music = await supabase
      .from('current_music_accompaniments')
      .select('brotherhood_entity_id, step_entity_id, outing_type, position')
      .eq('band_entity_id', entity.id)
    if (music.error) throw music.error
    ;(music.data || []).forEach((row) => {
      pushEdge(edges, row.brotherhood_entity_id, 'Acompañamiento actual', [row.outing_type, row.position].filter(Boolean).join(' · '), 95)
      pushEdge(edges, row.step_entity_id, 'Acompaña a un paso', [row.outing_type, row.position].filter(Boolean).join(' · '), 80)
    })
  }

  if (entity.entity_type === 'step') {
    const [brotherhoods, personnel, images, music] = await Promise.all([
      supabase.from('brotherhood_steps').select('brotherhood_entity_id, relation_type').eq('step_entity_id', entity.id).eq('status', 'published'),
      supabase.from('current_step_personnel').select('agent_entity_id, role_name').eq('step_entity_id', entity.id),
      supabase.from('image_steps').select('image_entity_id, relation_type').eq('step_entity_id', entity.id).eq('status', 'published'),
      supabase.from('current_music_accompaniments').select('band_entity_id, position, outing_type').eq('step_entity_id', entity.id),
    ])
    if (brotherhoods.error) throw brotherhoods.error
    if (personnel.error) throw personnel.error
    if (images.error) throw images.error
    if (music.error) throw music.error
    ;(brotherhoods.data || []).forEach((row) => pushEdge(edges, row.brotherhood_entity_id, 'Pertenece a', row.relation_type || '', 95))
    ;(personnel.data || []).forEach((row) => pushEdge(edges, row.agent_entity_id, row.role_name || 'Responsable del paso', '', 90))
    ;(images.data || []).forEach((row) => pushEdge(edges, row.image_entity_id, 'Imagen del paso', row.relation_type || '', 88))
    ;(music.data || []).forEach((row) => pushEdge(edges, row.band_entity_id, 'Acompañamiento musical', [row.outing_type, row.position].filter(Boolean).join(' · '), 85))
  }

  if (entity.entity_type === 'image') {
    const [brotherhoods, authors, steps] = await Promise.all([
      supabase.from('brotherhood_images').select('brotherhood_entity_id, relation_type').eq('image_entity_id', entity.id).eq('status', 'published'),
      supabase.from('image_authorships').select('agent_entity_id, role_name, certainty').eq('image_entity_id', entity.id).eq('status', 'published'),
      supabase.from('image_steps').select('step_entity_id, relation_type').eq('image_entity_id', entity.id).eq('status', 'published'),
    ])
    if (brotherhoods.error) throw brotherhoods.error
    if (authors.error) throw authors.error
    if (steps.error) throw steps.error
    ;(brotherhoods.data || []).forEach((row) => pushEdge(edges, row.brotherhood_entity_id, row.relation_type === 'titular' ? 'Titular de' : 'Relacionada con hermandad', row.relation_type || '', 95))
    ;(authors.data || []).forEach((row) => pushEdge(edges, row.agent_entity_id, row.role_name || 'Autoría', row.certainty ? `Certeza: ${row.certainty}` : '', 92))
    ;(steps.data || []).forEach((row) => pushEdge(edges, row.step_entity_id, 'Procesiona en / relacionada con paso', row.relation_type || '', 88))
  }

  if (entity.entity_type === 'march') {
    const [authors, dedications] = await Promise.all([
      supabase.from('march_authors').select('agent_entity_id, author_role').eq('march_entity_id', entity.id).eq('status', 'published'),
      supabase.from('march_dedications').select('dedicatee_entity_id, dedication_type').eq('march_entity_id', entity.id).eq('status', 'published'),
    ])
    if (authors.error) throw authors.error
    if (dedications.error) throw dedications.error
    ;(authors.data || []).forEach((row) => pushEdge(edges, row.agent_entity_id, row.author_role === 'composer' ? 'Compositor' : 'Autoría', row.author_role || '', 95))
    ;(dedications.data || []).forEach((row) => pushEdge(edges, row.dedicatee_entity_id, 'Dedicada a', row.dedication_type || '', 90))
  }

  if (entity.entity_type === 'agent') {
    const [marches, phases, personnel, images] = await Promise.all([
      supabase.from('march_authors').select('march_entity_id, author_role').eq('agent_entity_id', entity.id).eq('status', 'published'),
      supabase.from('step_phase_details').select('step_entity_id, discipline, role_name').eq('agent_entity_id', entity.id),
      supabase.from('current_step_personnel').select('step_entity_id, role_name').eq('agent_entity_id', entity.id),
      supabase.from('image_authorships').select('image_entity_id, role_name, certainty').eq('agent_entity_id', entity.id).eq('status', 'published'),
    ])
    if (marches.error) throw marches.error
    if (phases.error) throw phases.error
    if (personnel.error) throw personnel.error
    if (images.error) throw images.error
    ;(marches.data || []).forEach((row) => pushEdge(edges, row.march_entity_id, row.author_role === 'composer' ? 'Compuso' : 'Autoría musical', row.author_role || '', 90))
    ;(phases.data || []).forEach((row) => pushEdge(edges, row.step_entity_id, row.discipline || row.role_name || 'Trabajo en paso', row.role_name || '', 88))
    ;(personnel.data || []).forEach((row) => pushEdge(edges, row.step_entity_id, row.role_name || 'Responsable actual', '', 92))
    ;(images.data || []).forEach((row) => pushEdge(edges, row.image_entity_id, row.role_name || 'Autoría de imagen', row.certainty ? `Certeza: ${row.certainty}` : '', 90))
  }

  const targetEntities = await entitiesByIds(supabase, edges.map((edge) => edge.targetId))
  const targetById = new Map(targetEntities.map((target) => [target.id, target]))
  const seenTargets = new Set()
  const seenTypes = new Set()

  return edges
    .filter((edge) => targetById.has(edge.targetId))
    .sort((a, b) => b.priority - a.priority)
    .sort((a, b) => {
      const typeA = targetById.get(a.targetId)?.entity_type || ''
      const typeB = targetById.get(b.targetId)?.entity_type || ''
      const diversityA = seenTypes.has(typeA) ? 0 : 1
      const diversityB = seenTypes.has(typeB) ? 0 : 1
      return diversityB - diversityA
    })
    .filter((edge) => {
      if (seenTargets.has(edge.targetId)) return false
      seenTargets.add(edge.targetId)
      seenTypes.add(targetById.get(edge.targetId)?.entity_type || '')
      return true
    })
    .slice(0, 5)
    .map((edge) => ({ ...edge, entity: targetById.get(edge.targetId) }))
}

async function discoveryAnswer(supabase, question, context) {
  const entities = await allPublicEntities(supabase)
  let root = explicitEntity(question, entities)

  if (!root && context?.entityId) {
    root = entities.find((entity) => entity.id === context.entityId) || null
  }
  if (!root) root = stablePick(entities)
  if (!root) return null

  const relations = await neighborhood(supabase, root)
  if (!relations.length) return null

  const typeCount = new Set(relations.map((item) => item.entity.entity_type)).size
  return answer({
    text: `Tiro del hilo de ${root.name}: he encontrado ${relations.length} conexiones públicas en ${typeCount} ${typeCount === 1 ? 'tipo de entidad' : 'tipos de entidad'} distintos. Empieza por cualquiera y sigue navegando por el grafo.`,
    path: [TYPE_LABELS[root.entity_type] || 'Entidad', 'Relaciones', 'Descubrimiento'],
    entities: [publicEntity(root, 'Punto de partida')],
    items: relations.map(({ entity, relation, detail }) => ({
      label: entity.name,
      meta: [relation, detail, TYPE_LABELS[entity.entity_type]].filter(Boolean).join(' · '),
      href: entityHref(entity),
    })),
    followUps: [
      `Busca otra conexión de ${root.name}`,
      `¿Qué relación hay entre ${root.name} y ${relations[0].entity.name}?`,
      `Cuéntame sobre ${relations[0].entity.name}`,
    ],
    context: {
      entityId: root.id,
      entityType: root.entity_type,
      name: root.name,
    },
  })
}

export async function askHiloCofradeV11(question, context = null) {
  const clean = String(question || '').trim()
  if (!isDiscoveryQuestion(clean)) return askHiloCofradeV10(clean, context)

  try {
    const supabase = await createClient()
    const response = await discoveryAnswer(supabase, clean, context)
    return response || askHiloCofradeV10(clean, context)
  } catch (error) {
    console.error('[Hilo Cofrade] Error en modo descubrimiento', {
      question: clean,
      error: error instanceof Error ? error.message : String(error),
    })
    return askHiloCofradeV10(clean, context)
  }
}
