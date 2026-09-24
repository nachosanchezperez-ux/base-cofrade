import 'server-only'

import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import { createPublicClient } from '@/lib/supabase/public'
import {
  loadPublicRowsInBatches,
  loadPublicRowsInPages,
} from '@/lib/supabase/public-query-batches'

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values) {
  return [...new Set((values || []).filter(Boolean))]
}

function increment(map, key) {
  if (!key) return
  map.set(key, (map.get(key) || 0) + 1)
}

function publicEntityHref(entity) {
  if (!entity?.slug || entity.status !== 'published') return ''
  if (entity.entity_type === 'march') return `/marchas/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'heritage_asset') return ''
  return ''
}

export function publicAgentIsIndexable({
  relationCount = 0,
  sourceCount = 0,
  summary = '',
  description = '',
} = {}) {
  const editorialText = String(description || summary || '').trim()
  return relationCount > 0 && (
    relationCount >= 3
    || sourceCount >= 1
    || editorialText.length >= 80
  )
}

async function loadAgentCoverage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL
    || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    if (process.env.VERCEL) {
      throw new Error('Falta la configuración pública de Supabase para generar el directorio de Autores')
    }
    return []
  }

  const supabase = createPublicClient()
  const entities = await loadPublicRowsInPages(
    (from, to) => supabase
      .from('entities')
      .select('id, name, slug, summary, status, updated_at, content_updated_at')
      .eq('entity_type', 'agent')
      .eq('status', 'published')
      .not('slug', 'is', null)
      .order('id')
      .range(from, to),
    'No se pudieron consultar los Autores publicados'
  )

  const ids = entities.map((item) => item.id)
  if (!ids.length) return []

  const [profiles, imageAuthorships, marchAuthorships, interventions, stepAgents, sourceLinks] = await Promise.all([
    loadPublicRowsInBatches(
      ids,
      (batch) => supabase
        .from('agents')
        .select('entity_id, agent_kind, description')
        .in('entity_id', batch),
      'No se pudieron consultar los perfiles de Autor'
    ),
    loadPublicRowsInBatches(
      ids,
      (batch) => supabase
        .from('image_authorships')
        .select('agent_entity_id')
        .in('agent_entity_id', batch)
        .eq('status', 'published'),
      'No se pudieron contar las autorías de imágenes'
    ),
    loadPublicRowsInBatches(
      ids,
      (batch) => supabase
        .from('march_authors')
        .select('agent_entity_id')
        .in('agent_entity_id', batch)
        .eq('status', 'published'),
      'No se pudieron contar las autorías musicales'
    ),
    loadPublicRowsInBatches(
      ids,
      (batch) => supabase
        .from('heritage_interventions')
        .select('agent_entity_id')
        .in('agent_entity_id', batch)
        .eq('status', 'published'),
      'No se pudieron contar las intervenciones patrimoniales'
    ),
    loadPublicRowsInBatches(
      ids,
      (batch) => supabase
        .from('step_phase_agents')
        .select('agent_entity_id')
        .in('agent_entity_id', batch),
      'No se pudieron contar las participaciones en Pasos'
    ),
    loadPublicRowsInBatches(
      ids,
      (batch) => supabase
        .from('source_links')
        .select('entity_id, scope')
        .in('entity_id', batch),
      'No se pudieron contar las Fuentes de Autores'
    ),
  ])

  const profileById = new Map(profiles.map((profile) => [profile.entity_id, profile]))
  const relationCounts = new Map()
  for (const row of [...imageAuthorships, ...marchAuthorships, ...interventions, ...stepAgents]) {
    increment(relationCounts, row.agent_entity_id)
  }

  const sourceCounts = new Map()
  for (const link of sourceLinks) {
    if (String(link.scope || '').startsWith('relation:')) continue
    increment(sourceCounts, link.entity_id)
  }

  return entities.map((entity) => {
    const profile = profileById.get(entity.id) || {}
    const relationCount = relationCounts.get(entity.id) || 0
    const sourceCount = sourceCounts.get(entity.id) || 0
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      summary: entity.summary || '',
      kind: profile.agent_kind || '',
      description: profile.description || '',
      relationCount,
      sourceCount,
      updatedAt: entity.content_updated_at || entity.updated_at || null,
      indexable: publicAgentIsIndexable({
        relationCount,
        sourceCount,
        summary: entity.summary,
        description: profile.description,
      }),
    }
  })
}

const getCachedPublicAgentDirectory = unstable_cache(
  loadAgentCoverage,
  ['hilo-cofrade-public-agent-directory-v1'],
  { revalidate: 900, tags: ['public-agent-directory'] }
)

export const getPublicAgentDirectory = cache(async function getPublicAgentDirectory() {
  return (await getCachedPublicAgentDirectory())
    .filter((agent) => agent.indexable)
    .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
})

export const getPublicAgentSitemapEntries = cache(async function getPublicAgentSitemapEntries() {
  return (await getPublicAgentDirectory()).map((agent) => ({
    slug: agent.slug,
    updatedAt: agent.updatedAt,
  }))
})

async function loadPublicAgentBySlug(slug) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL
    || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    if (process.env.VERCEL) {
      throw new Error('Falta la configuración pública de Supabase para cargar el Autor')
    }
    return null
  }

  const supabase = createPublicClient()
  const entityResult = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary, status, updated_at, content_updated_at')
    .eq('entity_type', 'agent')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (entityResult.error) throw new Error(`No se pudo consultar el Autor: ${entityResult.error.message}`)
  if (!entityResult.data) return null
  const entity = entityResult.data

  const [profileResult, disciplinesResult, namesResult, imageAuthorshipsResult, marchAuthorshipsResult, interventionsResult, stepAgentsResult, sourceLinksResult] = await Promise.all([
    supabase
      .from('agents')
      .select('entity_id, agent_kind, municipality_id, foundation_or_birth_text, death_or_end_text, website_url, instagram_url, description, birth_or_foundation_date, death_or_end_date')
      .eq('entity_id', entity.id)
      .maybeSingle(),
    supabase
      .from('agent_disciplines')
      .select('discipline, is_primary')
      .eq('agent_entity_id', entity.id),
    supabase
      .from('agent_names')
      .select('name, name_type, is_current')
      .eq('agent_entity_id', entity.id),
    supabase
      .from('image_authorships')
      .select('image_entity_id, authorship_type, role_name, certainty, date_from_text, date_to_text')
      .eq('agent_entity_id', entity.id)
      .eq('status', 'published'),
    supabase
      .from('march_authors')
      .select('march_entity_id, author_role')
      .eq('agent_entity_id', entity.id)
      .eq('status', 'published'),
    supabase
      .from('heritage_interventions')
      .select('id, target_entity_id, discipline, intervention_type, phase, date_from, date_from_text, date_to, date_to_text, description')
      .eq('agent_entity_id', entity.id)
      .eq('status', 'published'),
    supabase
      .from('step_phase_agents')
      .select('step_phase_id, discipline, role_name')
      .eq('agent_entity_id', entity.id),
    supabase
      .from('source_links')
      .select('source_id, scope')
      .eq('entity_id', entity.id),
  ])

  if (profileResult.error) throw new Error(`No se pudo consultar el perfil del Autor: ${profileResult.error.message}`)
  const profile = profileResult.data || {}
  const disciplines = rows(disciplinesResult, 'No se pudieron consultar las disciplinas del Autor')
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
  const alternateNames = rows(namesResult, 'No se pudieron consultar los nombres del Autor')
    .map((item) => item.name)
    .filter((name) => name && name !== entity.name)
  const imageAuthorships = rows(imageAuthorshipsResult, 'No se pudieron consultar las Imágenes del Autor')
  const marchAuthorships = rows(marchAuthorshipsResult, 'No se pudieron consultar las Marchas del Autor')
  const interventions = rows(interventionsResult, 'No se pudieron consultar las intervenciones del Autor')
  const stepAgents = rows(stepAgentsResult, 'No se pudieron consultar los Pasos del Autor')
  const directSourceLinks = rows(sourceLinksResult, 'No se pudieron consultar las Fuentes del Autor')
    .filter((link) => !String(link.scope || '').startsWith('relation:'))

  const stepPhaseIds = unique(stepAgents.map((item) => item.step_phase_id))
  const stepPhases = stepPhaseIds.length
    ? rows(
        await supabase
          .from('step_phases')
          .select('id, step_entity_id, phase_name, phase_type, date_from_text, date_to_text, status')
          .in('id', stepPhaseIds)
          .eq('status', 'published'),
        'No se pudieron consultar las fases de Paso del Autor'
      )
    : []

  const relatedEntityIds = unique([
    ...imageAuthorships.map((item) => item.image_entity_id),
    ...marchAuthorships.map((item) => item.march_entity_id),
    ...interventions.map((item) => item.target_entity_id),
    ...stepPhases.map((item) => item.step_entity_id),
  ])

  const [relatedEntitiesResult, marchProfilesResult, sourcesResult, municipalityResult] = await Promise.all([
    relatedEntityIds.length
      ? supabase
          .from('entities')
          .select('id, entity_type, name, slug, summary, status')
          .in('id', relatedEntityIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    marchAuthorships.length
      ? supabase
          .from('marches')
          .select('entity_id, composition_year, composition_date_text, work_type, music_type')
          .in('entity_id', unique(marchAuthorships.map((item) => item.march_entity_id)))
      : Promise.resolve({ data: [], error: null }),
    directSourceLinks.length
      ? supabase
          .from('sources')
          .select('id, name, url, source_type, author_or_publisher, publication_date')
          .in('id', unique(directSourceLinks.map((item) => item.source_id)))
          .order('name')
      : Promise.resolve({ data: [], error: null }),
    profile.municipality_id
      ? supabase
          .from('municipalities')
          .select('id, name, province')
          .eq('id', profile.municipality_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ])

  const relatedEntities = rows(relatedEntitiesResult, 'No se pudieron consultar las obras relacionadas del Autor')
  const marchProfiles = rows(marchProfilesResult, 'No se pudieron consultar las fichas de Marchas del Autor')
  const sources = rows(sourcesResult, 'No se pudieron consultar las Fuentes documentales del Autor')
  if (municipalityResult.error) throw new Error(`No se pudo consultar la localidad del Autor: ${municipalityResult.error.message}`)

  const entityById = new Map(relatedEntities.map((item) => [item.id, item]))
  const marchProfileById = new Map(marchProfiles.map((item) => [item.entity_id, item]))
  const phaseById = new Map(stepPhases.map((item) => [item.id, item]))

  const marches = marchAuthorships.map((relation) => {
    const work = entityById.get(relation.march_entity_id)
    if (!work) return null
    const march = marchProfileById.get(work.id) || {}
    return {
      id: work.id,
      name: work.name,
      href: publicEntityHref(work),
      role: relation.author_role || '',
      year: march.composition_year || march.composition_date_text || '',
      workType: march.work_type || 'Marcha procesional',
      musicType: march.music_type || '',
    }
  }).filter(Boolean).sort((a, b) => String(a.year || '').localeCompare(String(b.year || '')) || a.name.localeCompare(b.name, 'es'))

  const images = imageAuthorships.map((relation) => {
    const work = entityById.get(relation.image_entity_id)
    if (!work) return null
    return {
      id: work.id,
      name: work.name,
      href: publicEntityHref(work),
      role: relation.role_name || relation.authorship_type || 'Autoría',
      certainty: relation.certainty || '',
      date: relation.date_from_text || relation.date_to_text || '',
    }
  }).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name, 'es'))

  const heritage = interventions.map((relation) => {
    const work = entityById.get(relation.target_entity_id)
    return {
      id: relation.id,
      name: work?.name || relation.intervention_type || relation.discipline || 'Intervención patrimonial',
      href: publicEntityHref(work),
      type: relation.intervention_type || relation.discipline || 'Intervención',
      phase: relation.phase || '',
      date: relation.date_from_text || relation.date_from || relation.date_to_text || relation.date_to || '',
      description: relation.description || '',
    }
  }).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))

  const steps = stepAgents.map((relation, index) => {
    const phase = phaseById.get(relation.step_phase_id)
    const work = phase ? entityById.get(phase.step_entity_id) : null
    if (!work) return null
    return {
      id: `${relation.step_phase_id}-${index}`,
      name: work.name,
      href: publicEntityHref(work),
      role: relation.role_name || relation.discipline || phase.phase_type || 'Intervención',
      phase: phase.phase_name || '',
      date: phase.date_from_text || phase.date_to_text || '',
    }
  }).filter(Boolean)

  const relationCount = marches.length + images.length + heritage.length + steps.length
  const indexable = publicAgentIsIndexable({
    relationCount,
    sourceCount: sources.length,
    summary: entity.summary,
    description: profile.description,
  })

  return {
    id: entity.id,
    slug: entity.slug,
    name: entity.name,
    summary: entity.summary || '',
    description: profile.description || entity.summary || '',
    kind: profile.agent_kind || '',
    municipality: municipalityResult.data?.name || '',
    province: municipalityResult.data?.province || '',
    birthText: profile.foundation_or_birth_text || '',
    deathText: profile.death_or_end_text || '',
    birthDate: profile.birth_or_foundation_date || '',
    deathDate: profile.death_or_end_date || '',
    websiteUrl: profile.website_url || '',
    instagramUrl: profile.instagram_url || '',
    alternateNames: unique(alternateNames),
    disciplines: unique(disciplines.map((item) => item.discipline)),
    primaryDiscipline: disciplines.find((item) => item.is_primary)?.discipline || disciplines[0]?.discipline || '',
    marches,
    images,
    heritage,
    steps,
    sources: sources.map((source) => ({
      id: source.id,
      nombre: source.name,
      url: source.url,
      tipo: source.source_type || '',
      autor: source.author_or_publisher || '',
      fecha: source.publication_date || '',
    })),
    relationCount,
    indexable,
    updatedAt: entity.content_updated_at || entity.updated_at || null,
  }
}

const getCachedPublicAgentBySlug = unstable_cache(
  loadPublicAgentBySlug,
  ['hilo-cofrade-public-agent-detail-v1'],
  { revalidate: 900, tags: ['public-agent-detail'] }
)

export const getPublicAgentBySlug = cache(function getPublicAgentBySlug(slug) {
  return getCachedPublicAgentBySlug(slug)
})
