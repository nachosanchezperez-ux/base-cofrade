import 'server-only'

import { getBandsDirectory } from '@/lib/supabase/bands'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'
import { createPublicClient as createClient } from '@/lib/supabase/public'

const TYPE_LABELS = {
  image: 'Imagen',
  step: 'Paso',
  agent: 'Autor / profesional',
  march: 'Marcha',
  event: 'Acontecimiento',
  heritage_asset: 'Patrimonio',
  advocation: 'Advocación',
}

function subtitle(parts = []) {
  return parts.filter(Boolean).join(' · ')
}

function compact(value = '', max = 112) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}

function directoryItems(brotherhoods, bands) {
  return [
    ...brotherhoods.map((hermandad) => ({
      entityId: hermandad.id,
      entityType: 'brotherhood',
      type: 'Hermandad',
      title: hermandad.nombrePopular,
      subtitle: subtitle([hermandad.localidad, hermandad.diaSalida]),
      href: `/hermandades/${hermandad.slug}`,
      keywords: [
        hermandad.nombreOficial,
        hermandad.sede,
        hermandad.barrio,
        ...(hermandad.tipos || []),
      ].filter(Boolean),
    })),
    ...bands.map((band) => ({
      entityId: band.id,
      entityType: 'band',
      type: 'Banda',
      title: band.popularName,
      subtitle: subtitle([band.type, band.municipality]),
      href: `/bandas/${band.slug}`,
      keywords: [
        band.officialName,
        band.officialShortName,
        band.summary,
        band.linkedBrotherhood,
      ].filter(Boolean),
    })),
  ]
}

function assertResult(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function universalHref(entity) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  return ''
}

export async function getGlobalSearchItems() {
  const [brotherhoods, bands] = await Promise.all([
    getHermandadesDirectory(),
    getBandsDirectory(),
  ])
  const baseItems = directoryItems(brotherhoods, bands)

  try {
    const supabase = await createClient()
    const relatedEntities = assertResult(
      await supabase
        .from('entities')
        .select('id, entity_type, name, slug, summary')
        .in('entity_type', ['image', 'step', 'agent', 'march', 'event', 'heritage_asset', 'advocation'])
        .eq('status', 'published')
        .not('slug', 'is', null)
        .order('name'),
      'No se pudieron consultar las entidades del buscador'
    )

    const imageIds = relatedEntities.filter((item) => item.entity_type === 'image').map((item) => item.id)
    const stepIds = relatedEntities.filter((item) => item.entity_type === 'step').map((item) => item.id)
    const agentIds = relatedEntities.filter((item) => item.entity_type === 'agent').map((item) => item.id)
    const marchIds = relatedEntities.filter((item) => item.entity_type === 'march').map((item) => item.id)
    const bandIds = bands.map((band) => band.id).filter(Boolean)

    const [
      imageRowsResult,
      stepRowsResult,
      imageLinksResult,
      stepLinksResult,
      imageAuthorshipsResult,
      stepPhasesResult,
      stepImagesResult,
      bandPremieresResult,
      bandContentLinksResult,
      agentDisciplinesResult,
      marchAuthorsResult,
    ] = await Promise.all([
      imageIds.length
        ? supabase.from('images').select('entity_id, image_type, execution_date, execution_date_text').in('entity_id', imageIds)
        : Promise.resolve({ data: [], error: null }),
      stepIds.length
        ? supabase.from('steps').select('entity_id, step_type, execution_date_text').in('entity_id', stepIds)
        : Promise.resolve({ data: [], error: null }),
      imageIds.length
        ? supabase.from('brotherhood_images').select('brotherhood_entity_id, image_entity_id').in('image_entity_id', imageIds).eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      stepIds.length
        ? supabase.from('brotherhood_steps').select('brotherhood_entity_id, step_entity_id').in('step_entity_id', stepIds).eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      imageIds.length
        ? supabase.from('image_authorship_details').select('image_entity_id, agent_name').in('image_entity_id', imageIds)
        : Promise.resolve({ data: [], error: null }),
      stepIds.length
        ? supabase.from('step_phase_details').select('step_entity_id, agent_name, discipline').in('step_entity_id', stepIds)
        : Promise.resolve({ data: [], error: null }),
      stepIds.length
        ? supabase.from('step_image_history').select('step_entity_id, image_name').in('step_entity_id', stepIds)
        : Promise.resolve({ data: [], error: null }),
      bandIds.length
        ? supabase.from('band_premieres').select('band_entity_id, title, composer_name').in('band_entity_id', bandIds).eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      bandIds.length
        ? supabase.from('editorial_content_links').select('editorial_content_id, entity_id').in('entity_id', bandIds)
        : Promise.resolve({ data: [], error: null }),
      agentIds.length
        ? supabase.from('agent_disciplines').select('agent_entity_id, discipline, is_primary').in('agent_entity_id', agentIds)
        : Promise.resolve({ data: [], error: null }),
      marchIds.length
        ? supabase.from('march_authors').select('march_entity_id, agent_entity_id, author_role').in('march_entity_id', marchIds).eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
    ])

    const imageRows = assertResult(imageRowsResult, 'No se pudieron consultar los datos de las imágenes')
    const stepRows = assertResult(stepRowsResult, 'No se pudieron consultar los datos de los pasos')
    const imageLinks = assertResult(imageLinksResult, 'No se pudieron consultar las hermandades de las imágenes')
    const stepLinks = assertResult(stepLinksResult, 'No se pudieron consultar las hermandades de los pasos')
    const imageAuthorships = assertResult(imageAuthorshipsResult, 'No se pudieron consultar las autorías del buscador')
    const stepPhases = assertResult(stepPhasesResult, 'No se pudieron consultar los autores de los pasos del buscador')
    const stepImages = assertResult(stepImagesResult, 'No se pudieron consultar las imágenes de los pasos del buscador')
    const bandPremieres = assertResult(bandPremieresResult, 'No se pudieron consultar los estrenos de las bandas del buscador')
    const bandContentLinks = assertResult(bandContentLinksResult, 'No se pudieron consultar los contenidos relacionados con las bandas')
    const agentDisciplines = assertResult(agentDisciplinesResult, 'No se pudieron consultar las disciplinas de autores y profesionales')
    const marchAuthors = assertResult(marchAuthorsResult, 'No se pudieron consultar las autorías de las marchas')

    const contentIds = [...new Set(bandContentLinks.map((item) => item.editorial_content_id).filter(Boolean))]
    const bandContents = contentIds.length
      ? assertResult(
          await supabase.from('editorial_content').select('id, title, subtitle, summary').in('id', contentIds).eq('status', 'published'),
          'No se pudieron consultar los contenidos editoriales del buscador'
        )
      : []

    const parentIds = [...new Set([
      ...imageLinks.map((item) => item.brotherhood_entity_id),
      ...stepLinks.map((item) => item.brotherhood_entity_id),
    ].filter(Boolean))]
    const authorIds = [...new Set(marchAuthors.map((item) => item.agent_entity_id).filter(Boolean))]
    const entityIdsToResolve = [...new Set([...parentIds, ...authorIds])]
    const resolvedEntities = entityIdsToResolve.length
      ? assertResult(
          await supabase.from('entities').select('id, name').in('id', entityIdsToResolve).eq('status', 'published'),
          'No se pudieron resolver entidades relacionadas del buscador'
        )
      : []

    const imageById = new Map(imageRows.map((item) => [item.entity_id, item]))
    const stepById = new Map(stepRows.map((item) => [item.entity_id, item]))
    const resolvedById = new Map(resolvedEntities.map((item) => [item.id, item]))
    const imageParentById = new Map(imageLinks.map((item) => [item.image_entity_id, item.brotherhood_entity_id]))
    const stepParentById = new Map(stepLinks.map((item) => [item.step_entity_id, item.brotherhood_entity_id]))

    const imageKeywordsById = imageAuthorships.reduce((map, item) => {
      const values = map.get(item.image_entity_id) || []
      values.push(item.agent_name)
      map.set(item.image_entity_id, values)
      return map
    }, new Map())

    const stepKeywordsById = [...stepPhases, ...stepImages].reduce((map, item) => {
      const values = map.get(item.step_entity_id) || []
      values.push(item.agent_name, item.discipline, item.image_name)
      map.set(item.step_entity_id, values)
      return map
    }, new Map())

    const disciplineByAgent = agentDisciplines.reduce((map, item) => {
      const values = map.get(item.agent_entity_id) || []
      if (item.discipline) values.push({ value: item.discipline, primary: item.is_primary })
      map.set(item.agent_entity_id, values)
      return map
    }, new Map())

    const authorsByMarch = marchAuthors.reduce((map, item) => {
      const values = map.get(item.march_entity_id) || []
      const author = resolvedById.get(item.agent_entity_id)
      if (author?.name) values.push({ name: author.name, role: item.author_role })
      map.set(item.march_entity_id, values)
      return map
    }, new Map())

    const contentById = new Map(bandContents.map((item) => [item.id, item]))
    const bandKeywordsById = new Map()
    bandPremieres.forEach((item) => {
      const values = bandKeywordsById.get(item.band_entity_id) || []
      values.push(item.title, item.composer_name)
      bandKeywordsById.set(item.band_entity_id, values)
    })
    bandContentLinks.forEach((link) => {
      const content = contentById.get(link.editorial_content_id)
      if (!content) return
      const values = bandKeywordsById.get(link.entity_id) || []
      values.push(content.title, content.subtitle, content.summary)
      bandKeywordsById.set(link.entity_id, values)
    })

    const enrichedBaseItems = baseItems.map((item) => ({
      ...item,
      keywords: [...(item.keywords || []), ...(bandKeywordsById.get(item.entityId) || [])].filter(Boolean),
    }))

    const universalItems = relatedEntities.map((entity) => {
      if (entity.entity_type === 'image') {
        const image = imageById.get(entity.id) || {}
        const parent = resolvedById.get(imageParentById.get(entity.id))
        return {
          entityId: entity.id,
          entityType: entity.entity_type,
          type: 'Imagen',
          title: entity.name,
          subtitle: subtitle([image.image_type || 'Imagen', image.execution_date_text || image.execution_date || '', parent?.name || '']),
          href: universalHref(entity),
          keywords: [entity.summary, ...(imageKeywordsById.get(entity.id) || [])].filter(Boolean),
        }
      }

      if (entity.entity_type === 'step') {
        const step = stepById.get(entity.id) || {}
        const parent = resolvedById.get(stepParentById.get(entity.id))
        return {
          entityId: entity.id,
          entityType: entity.entity_type,
          type: 'Paso',
          title: entity.name,
          subtitle: subtitle([step.step_type || 'Paso', parent?.name || '', step.execution_date_text || '']),
          href: universalHref(entity),
          keywords: [entity.summary, ...(stepKeywordsById.get(entity.id) || [])].filter(Boolean),
        }
      }

      if (entity.entity_type === 'agent') {
        const disciplines = [...(disciplineByAgent.get(entity.id) || [])]
          .sort((a, b) => Number(b.primary) - Number(a.primary))
          .map((item) => item.value)
        return {
          entityId: entity.id,
          entityType: entity.entity_type,
          type: TYPE_LABELS.agent,
          title: entity.name,
          subtitle: disciplines.length ? disciplines.slice(0, 3).join(' · ') : 'Autor, artista o profesional',
          href: '',
          keywords: [entity.summary, ...disciplines].filter(Boolean),
        }
      }

      if (entity.entity_type === 'march') {
        const authors = authorsByMarch.get(entity.id) || []
        const composer = authors.find((item) => item.role === 'composer') || authors[0]
        return {
          entityId: entity.id,
          entityType: entity.entity_type,
          type: 'Marcha',
          title: entity.name,
          subtitle: composer?.name ? `Composición · ${composer.name}` : 'Composición musical',
          href: '',
          keywords: [entity.summary, ...authors.map((item) => item.name)].filter(Boolean),
        }
      }

      return {
        entityId: entity.id,
        entityType: entity.entity_type,
        type: TYPE_LABELS[entity.entity_type] || 'Entidad',
        title: entity.name,
        subtitle: compact(entity.summary, 90) || TYPE_LABELS[entity.entity_type] || 'Entidad documentada',
        href: '',
        keywords: [entity.summary].filter(Boolean),
      }
    })

    return [...enrichedBaseItems, ...universalItems]
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo completar el buscador desde Supabase', {
      error: error instanceof Error ? error.message : String(error),
    })
    return baseItems
  }
}
