import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { patrimonyEntityScore, patrimonyV4Intent } from '@/lib/tira-authors-patrimony-v4'

const NAVIGABLE = new Set(['agent', 'brotherhood', 'image', 'step'])
const TYPE_LABELS = { agent: 'Autor / profesional', brotherhood: 'Hermandad', image: 'Imagen', step: 'Paso' }

function href(entity) {
  if (!entity?.slug || !NAVIGABLE.has(entity.entity_type)) return ''
  if (entity.entity_type === 'agent') return `/autores/${entity.slug}`
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  return ''
}

function pub(entity, meta = '') {
  return entity ? { id: entity.id, entityType: entity.entity_type, type: TYPE_LABELS[entity.entity_type] || 'Entidad', name: entity.name, href: href(entity), meta } : null
}

function ctx(root, entities = [], sourceIntent = '') {
  const type = entities[0]?.entity_type || ''
  const ids = [...new Set(entities.filter((e) => e?.entity_type === type).map((e) => e.id))].slice(0, 12)
  return { entityId: root?.id || null, entityType: root?.entity_type || null, name: root?.name || '', ...(ids.length ? { resultSet: { entityType: type, entityIds: ids, count: ids.length, label: `${ids.length} ${TYPE_LABELS[type] || 'entidades'}`, sourceIntent } } : {}) }
}

function answer({ text, path = [], entities = [], items = [], evidence = [], followUps = [], context = null }) {
  return { kind: 'answer', answer: text, path, entities: entities.filter(Boolean), items, links: [], evidence, references: [], followUps, context, compactItemLimit: Math.min(Math.max(items.length, 4), 12) }
}

function missing(text, context = null) {
  return { kind: 'not_documented', answer: text, path: [], entities: [], items: [], links: [], evidence: [], references: [], followUps: [], context }
}

async function listEntities(supabase, types) {
  const result = await supabase.from('entities').select('id, entity_type, name, slug, summary').in('entity_type', types).eq('status', 'published')
  if (result.error) throw result.error
  return result.data || []
}

async function byIds(supabase, ids, type = '') {
  const unique = [...new Set((ids || []).filter(Boolean))]
  if (!unique.length) return []
  let query = supabase.from('entities').select('id, entity_type, name, slug, summary').in('id', unique).eq('status', 'published')
  if (type) query = query.eq('entity_type', type)
  const result = await query
  if (result.error) throw result.error
  const map = new Map((result.data || []).map((e) => [e.id, e]))
  return unique.map((id) => map.get(id)).filter(Boolean)
}

function best(entities, question, type = '') {
  return entities.filter((e) => !type || e.entity_type === type).map((entity) => ({ entity, score: patrimonyEntityScore(entity.name, question) })).filter((x) => x.score >= 250).sort((a, b) => b.score - a.score || b.entity.name.length - a.entity.name.length)[0] || null
}

async function contextEntity(supabase, context, type) {
  if (!context?.entityId || context.entityType !== type) return null
  return (await byIds(supabase, [context.entityId], type))[0] || null
}

async function authorsOfImage(supabase, imageId) {
  const result = await supabase.from('image_authorships').select('agent_entity_id, role_name, certainty').eq('image_entity_id', imageId).eq('status', 'published')
  if (result.error) throw result.error
  return result.data || []
}

async function resolveAgent(supabase, question, context) {
  const agents = await listEntities(supabase, ['agent'])
  const explicit = best(agents, question, 'agent')
  if (explicit?.score >= 500) return { agent: explicit.entity }
  const contextual = await contextEntity(supabase, context, 'agent')
  if (contextual) return { agent: contextual }
  if (context?.entityType === 'image' && context?.entityId && /\b(ese autor|esa autoria|ese escultor|ese imaginero|su autor)\b/i.test(question)) {
    const rows = await authorsOfImage(supabase, context.entityId)
    const ids = [...new Set(rows.map((r) => r.agent_entity_id).filter(Boolean))]
    if (ids.length === 1) return { agent: (await byIds(supabase, ids, 'agent'))[0] || null }
    if (ids.length > 1) return { ambiguous: ids.length }
  }
  return explicit ? { agent: explicit.entity } : null
}

async function resolveImage(supabase, question, context) {
  const images = await listEntities(supabase, ['image'])
  const explicit = best(images, question, 'image')
  if (explicit?.score >= 500) return explicit.entity
  return (await contextEntity(supabase, context, 'image')) || explicit?.entity || null
}

async function resolveBrotherhood(supabase, question, context) {
  const items = await listEntities(supabase, ['brotherhood'])
  const explicit = best(items, question, 'brotherhood')
  if (explicit?.score >= 500) return explicit.entity
  return (await contextEntity(supabase, context, 'brotherhood')) || explicit?.entity || null
}

async function ownersFor(supabase, table, ownerField, itemField, ids, type) {
  if (!ids.length) return new Map()
  const result = await supabase.from(table).select(`${ownerField}, ${itemField}`).in(itemField, ids).eq('status', 'published')
  if (result.error) throw result.error
  const owners = await byIds(supabase, (result.data || []).map((r) => r[ownerField]), type)
  const ownerById = new Map(owners.map((o) => [o.id, o]))
  const out = new Map()
  ;(result.data || []).forEach((row) => {
    const list = out.get(row[itemField]) || []
    const owner = ownerById.get(row[ownerField])
    if (owner) list.push(owner)
    out.set(row[itemField], list)
  })
  return out
}

async function agentImages(supabase, question, context) {
  const resolved = await resolveAgent(supabase, question, context)
  if (resolved?.ambiguous) return missing(`La imagen anterior tiene ${resolved.ambiguous} autorías estructuradas. Indica qué autor quieres seguir para no elegir uno de forma arbitraria.`, context)
  const agent = resolved?.agent
  if (!agent) return null
  const result = await supabase.from('image_authorships').select('image_entity_id, role_name, certainty').eq('agent_entity_id', agent.id).eq('status', 'published')
  if (result.error) throw result.error
  const rows = result.data || []
  const images = await byIds(supabase, rows.map((r) => r.image_entity_id), 'image')
  if (!images.length) return missing(`No hay imágenes públicas vinculadas a ${agent.name} mediante autorías estructuradas.`, ctx(agent))
  const owners = await ownersFor(supabase, 'brotherhood_images', 'brotherhood_entity_id', 'image_entity_id', images.map((i) => i.id), 'brotherhood')
  return answer({
    text: `${agent.name} aparece relacionado mediante autorías publicadas con ${images.length} ${images.length === 1 ? 'imagen' : 'imágenes'}.`,
    path: ['Autor / profesional', 'Autorías de imágenes', 'Imágenes'],
    entities: [pub(agent), ...images.slice(0, 12).map((i) => pub(i))],
    items: images.map((image) => ({ label: image.name, meta: [rows.filter((r) => r.image_entity_id === image.id).map((r) => [r.role_name, r.certainty].filter(Boolean).join(' · ')).join(' / '), (owners.get(image.id) || []).map((o) => o.name).join(', ')].filter(Boolean).join(' · '), href: href(image) })),
    evidence: [{ key: `agent-images-${agent.id}`, label: 'Autorías publicadas', detail: `${images.length} imágenes` }],
    followUps: ['¿En qué hermandades hay obras de este autor?', 'Compáralas.', 'Ordénalas de más antigua a más reciente.'],
    context: ctx(agent, images, 'agent_images'),
  })
}

async function agentSteps(supabase, question, context) {
  const resolved = await resolveAgent(supabase, question, context)
  if (resolved?.ambiguous) return missing('La referencia al autor es ambigua. Indica el profesional concreto para consultar sus trabajos en pasos.', context)
  const agent = resolved?.agent
  if (!agent) return null
  const result = await supabase.from('step_phase_details').select('step_entity_id, discipline, role_name').eq('agent_entity_id', agent.id)
  if (result.error) throw result.error
  const rows = result.data || []
  const steps = await byIds(supabase, rows.map((r) => r.step_entity_id), 'step')
  if (!steps.length) return missing(`No hay trabajos de paso estructurados para ${agent.name}.`, ctx(agent))
  const owners = await ownersFor(supabase, 'brotherhood_steps', 'brotherhood_entity_id', 'step_entity_id', steps.map((s) => s.id), 'brotherhood')
  return answer({
    text: `${agent.name} tiene trabajos estructurados en ${steps.length} ${steps.length === 1 ? 'paso' : 'pasos'} publicados.`,
    path: ['Autor / profesional', 'Trabajos en pasos', 'Pasos'],
    entities: [pub(agent), ...steps.slice(0, 12).map((s) => pub(s))],
    items: steps.map((step) => ({ label: step.name, meta: [rows.filter((r) => r.step_entity_id === step.id).map((r) => [r.discipline, r.role_name].filter(Boolean).join(' · ')).join(' / '), (owners.get(step.id) || []).map((o) => o.name).join(', ')].filter(Boolean).join(' · '), href: href(step) })),
    evidence: [{ key: `agent-steps-${agent.id}`, label: 'Trabajos de paso', detail: `${steps.length} pasos` }],
    followUps: ['¿En qué hermandades hay obras de este autor?', 'Compáralos.'],
    context: ctx(agent, steps, 'agent_steps'),
  })
}

async function interventions(supabase, question, context) {
  const image = await resolveImage(supabase, question, context)
  if (!image) return null
  const result = await supabase.from('image_restorations').select('title, update_date, year, discipline, description').eq('image_entity_id', image.id)
  if (result.error) throw result.error
  const rows = result.data || []
  if (!rows.length) return missing(`No hay restauraciones o intervenciones publicadas para ${image.name} en esta capa.`, ctx(image))
  return answer({
    text: `${image.name} tiene ${rows.length} ${rows.length === 1 ? 'intervención publicada' : 'intervenciones publicadas'}. Esta capa no atribuye un restaurador si el profesional no está estructurado en el registro.`,
    path: ['Imagen', 'Restauraciones e intervenciones'],
    entities: [pub(image)],
    items: rows.map((r) => ({ label: r.title || r.discipline || 'Intervención documentada', meta: [r.year || r.update_date, r.discipline, r.description].filter(Boolean).join(' · '), href: href(image) })),
    evidence: [{ key: `image-interventions-${image.id}`, label: 'Intervenciones publicadas', detail: `${rows.length} registros` }],
    followUps: [`¿Quién hizo ${image.name}?`, '¿Qué otras imágenes hizo ese autor?'],
    context: ctx(image),
  })
}

async function agentBrotherhoods(supabase, question, context, specific) {
  const resolved = await resolveAgent(supabase, question, context)
  if (resolved?.ambiguous) return missing('La referencia al autor es ambigua. Indica el profesional concreto para cruzarlo con Hermandades.', context)
  const agent = resolved?.agent
  if (!agent) return null
  const brotherhood = specific ? await resolveBrotherhood(supabase, question, context) : null
  if (specific && !brotherhood) return null

  const [ia, sw] = await Promise.all([
    supabase.from('image_authorships').select('image_entity_id, role_name, certainty').eq('agent_entity_id', agent.id).eq('status', 'published'),
    supabase.from('step_phase_details').select('step_entity_id, discipline, role_name').eq('agent_entity_id', agent.id),
  ])
  if (ia.error) throw ia.error
  if (sw.error) throw sw.error
  const images = await byIds(supabase, (ia.data || []).map((r) => r.image_entity_id), 'image')
  const steps = await byIds(supabase, (sw.data || []).map((r) => r.step_entity_id), 'step')
  const imageOwners = await ownersFor(supabase, 'brotherhood_images', 'brotherhood_entity_id', 'image_entity_id', images.map((i) => i.id), 'brotherhood')
  const stepOwners = await ownersFor(supabase, 'brotherhood_steps', 'brotherhood_entity_id', 'step_entity_id', steps.map((s) => s.id), 'brotherhood')
  const map = new Map()
  const add = (owner, work, kind) => {
    if (!owner || (brotherhood && owner.id !== brotherhood.id)) return
    const group = map.get(owner.id) || { owner, works: [] }
    group.works.push({ work, kind })
    map.set(owner.id, group)
  }
  images.forEach((image) => (imageOwners.get(image.id) || []).forEach((owner) => add(owner, image, 'Imagen')))
  steps.forEach((step) => (stepOwners.get(step.id) || []).forEach((owner) => add(owner, step, 'Paso')))
  const groups = [...map.values()].sort((a, b) => a.owner.name.localeCompare(b.owner.name, 'es'))
  if (!groups.length) return missing(brotherhood ? `No encuentro obras estructuradas de ${agent.name} vinculadas a ${brotherhood.name}.` : `No encuentro Hermandades públicas enlazadas a obras estructuradas de ${agent.name}.`, ctx(agent))
  if (brotherhood) {
    const works = groups[0].works
    return answer({ text: `${agent.name} tiene ${works.length} ${works.length === 1 ? 'obra o intervención estructurada' : 'obras o intervenciones estructuradas'} vinculadas a ${brotherhood.name}.`, path: ['Autor / profesional', brotherhood.name, 'Obras relacionadas'], entities: [pub(agent), pub(brotherhood), ...works.map((w) => pub(w.work))], items: works.map((w) => ({ label: w.work.name, meta: w.kind, href: href(w.work) })), evidence: [{ key: `agent-brotherhood-${agent.id}-${brotherhood.id}`, label: 'Relaciones patrimoniales', detail: `${works.length} obras` }], followUps: ['¿Qué otras hermandades tienen obras de este autor?', '¿Qué otras imágenes hizo?'], context: ctx(agent, works.map((w) => w.work), 'agent_brotherhood_works') })
  }
  const owners = groups.map((g) => g.owner)
  return answer({ text: `${agent.name} aparece relacionado con ${groups.length} ${groups.length === 1 ? 'hermandad' : 'hermandades'} mediante autorías de imágenes o trabajos de paso estructurados.`, path: ['Autor / profesional', 'Obras', 'Hermandades'], entities: [pub(agent), ...owners.slice(0, 12).map((o) => pub(o))], items: groups.map((g) => ({ label: g.owner.name, meta: g.works.map((w) => `${w.kind}: ${w.work.name}`).join(' / '), href: href(g.owner) })), evidence: [{ key: `agent-brotherhoods-${agent.id}`, label: 'Hermandades con obra estructurada', detail: `${groups.length} hermandades` }], followUps: ['¿Qué obras tiene en cada una?', 'Compáralas.'], context: ctx(agent, owners, 'agent_brotherhoods') })
}

async function sameAuthor(supabase, context) {
  const image = await contextEntity(supabase, context, 'image')
  if (!image) return null
  const authors = await authorsOfImage(supabase, image.id)
  const authorIds = [...new Set(authors.map((r) => r.agent_entity_id).filter(Boolean))]
  if (!authorIds.length) return missing(`No hay autorías estructuradas para ${image.name}.`, ctx(image))
  const owners = await supabase.from('brotherhood_images').select('brotherhood_entity_id').eq('image_entity_id', image.id).eq('status', 'published')
  if (owners.error) throw owners.error
  const ownerIds = [...new Set((owners.data || []).map((r) => r.brotherhood_entity_id).filter(Boolean))]
  if (!ownerIds.length) return missing(`${image.name} no tiene una Hermandad pública enlazada en esta relación.`, ctx(image))
  const siblings = await supabase.from('brotherhood_images').select('image_entity_id').in('brotherhood_entity_id', ownerIds).eq('status', 'published')
  if (siblings.error) throw siblings.error
  const siblingIds = [...new Set((siblings.data || []).map((r) => r.image_entity_id).filter((id) => id && id !== image.id))]
  const shared = siblingIds.length ? await supabase.from('image_authorships').select('image_entity_id, agent_entity_id').in('image_entity_id', siblingIds).in('agent_entity_id', authorIds).eq('status', 'published') : { data: [], error: null }
  if (shared.error) throw shared.error
  const matched = await byIds(supabase, (shared.data || []).map((r) => r.image_entity_id), 'image')
  if (!matched.length) return missing(`No hay otras imágenes publicadas de la misma Hermandad que compartan autoría estructurada con ${image.name}.`, ctx(image))
  const agents = await byIds(supabase, authorIds, 'agent')
  return answer({ text: `${matched.length} ${matched.length === 1 ? 'imagen de la misma Hermandad comparte' : 'imágenes de la misma Hermandad comparten'} al menos una autoría estructurada con ${image.name}.`, path: ['Imagen', 'Misma Hermandad', 'Autoría compartida'], entities: [pub(image), ...matched.map((m) => pub(m)), ...agents.map((a) => pub(a))], items: matched.map((m) => ({ label: m.name, meta: `Autoría compartida: ${[...new Set((shared.data || []).filter((r) => r.image_entity_id === m.id).map((r) => agents.find((a) => a.id === r.agent_entity_id)?.name).filter(Boolean))].join(', ')}`, href: href(m) })), evidence: [{ key: `same-author-${image.id}`, label: 'Autorías compartidas', detail: `${matched.length} coincidencias` }], followUps: ['¿Quién hizo cada una?', 'Compáralas.'], context: ctx(image, matched, 'same_author_images_in_brotherhood') })
}

export async function askHiloCofradeAuthorsPatrimonyV4(question, context = null) {
  const intent = patrimonyV4Intent(question, context)
  if (!intent) return null
  const supabase = await createClient()
  try {
    if (intent.kind === 'agent_images') return agentImages(supabase, question, context)
    if (intent.kind === 'agent_steps') return agentSteps(supabase, question, context)
    if (intent.kind === 'image_interventions') return interventions(supabase, question, context)
    if (intent.kind === 'agent_brotherhoods') return agentBrotherhoods(supabase, question, context, false)
    if (intent.kind === 'agent_brotherhood_works') return agentBrotherhoods(supabase, question, context, true)
    if (intent.kind === 'same_author_images_in_brotherhood') return sameAuthor(supabase, context)
    return null
  } catch (error) {
    console.error('[Hilo Cofrade] Error en Autores y Patrimonio V4', { question: String(question || '').slice(0, 320), kind: intent.kind, error: error instanceof Error ? error.message : String(error) })
    return null
  }
}
