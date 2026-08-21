import 'server-only'

import { getBandsDirectory } from '@/lib/supabase/bands'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'
import { createClient } from '@/lib/supabase/server'

function subtitle(parts = []) {
  return parts.filter(Boolean).join(' · ')
}

function directoryItems(brotherhoods, bands) {
  return [
    ...brotherhoods.map((hermandad) => ({
      entityId: hermandad.id,
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
        .in('entity_type', ['image', 'step'])
        .eq('status', 'published')
        .not('slug', 'is', null)
        .order('name'),
      'No se pudieron consultar las imágenes y los pasos del buscador'
    )

    const imageIds = relatedEntities
      .filter((item) => item.entity_type === 'image')
      .map((item) => item.id)
    const stepIds = relatedEntities
      .filter((item) => item.entity_type === 'step')
      .map((item) => item.id)

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
    ] = await Promise.all([
      imageIds.length
        ? supabase
            .from('images')
            .select('entity_id, image_type, execution_date, execution_date_text')
            .in('entity_id', imageIds)
        : Promise.resolve({ data: [], error: null }),
      stepIds.length
        ? supabase
            .from('steps')
            .select('entity_id, step_type, execution_date_text')
            .in('entity_id', stepIds)
        : Promise.resolve({ data: [], error: null }),
      imageIds.length
        ? supabase
            .from('brotherhood_images')
            .select('brotherhood_entity_id, image_entity_id')
            .in('image_entity_id', imageIds)
            .eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      stepIds.length
        ? supabase
            .from('brotherhood_steps')
            .select('brotherhood_entity_id, step_entity_id')
            .in('step_entity_id', stepIds)
            .eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      imageIds.length
        ? supabase
            .from('image_authorship_details')
            .select('image_entity_id, agent_name')
            .in('image_entity_id', imageIds)
        : Promise.resolve({ data: [], error: null }),
      stepIds.length
        ? supabase
            .from('step_phase_details')
            .select('step_entity_id, agent_name, discipline')
            .in('step_entity_id', stepIds)
        : Promise.resolve({ data: [], error: null }),
      stepIds.length
        ? supabase
            .from('step_image_history')
            .select('step_entity_id, image_name')
            .in('step_entity_id', stepIds)
        : Promise.resolve({ data: [], error: null }),
      bandIds.length
        ? supabase
            .from('band_premieres')
            .select('band_entity_id, title, composer_name')
            .in('band_entity_id', bandIds)
            .eq('status', 'published')
        : Promise.resolve({ data: [], error: null }),
      bandIds.length
        ? supabase
            .from('editorial_content_links')
            .select('editorial_content_id, entity_id')
            .in('entity_id', bandIds)
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
    const contentIds = [...new Set(bandContentLinks.map((item) => item.editorial_content_id).filter(Boolean))]
    const bandContents = contentIds.length
      ? assertResult(
          await supabase
            .from('editorial_content')
            .select('id, title, subtitle, summary')
            .in('id', contentIds)
            .eq('status', 'published'),
          'No se pudieron consultar los contenidos editoriales del buscador'
        )
      : []
    const parentIds = [...new Set([
      ...imageLinks.map((item) => item.brotherhood_entity_id),
      ...stepLinks.map((item) => item.brotherhood_entity_id),
    ].filter(Boolean))]
    const parentEntities = parentIds.length
      ? assertResult(
          await supabase
            .from('entities')
            .select('id, name')
            .in('id', parentIds)
            .eq('entity_type', 'brotherhood')
            .eq('status', 'published'),
          'No se pudieron consultar las hermandades relacionadas'
        )
      : []

    const imageById = new Map(imageRows.map((item) => [item.entity_id, item]))
    const stepById = new Map(stepRows.map((item) => [item.entity_id, item]))
    const parentById = new Map(parentEntities.map((item) => [item.id, item]))
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
    const enrichedBaseItems = baseItems.map(({ entityId, ...item }) => ({
      ...item,
      keywords: [...(item.keywords || []), ...(bandKeywordsById.get(entityId) || [])].filter(Boolean),
    }))

    const relatedItems = relatedEntities.map((entity) => {
      if (entity.entity_type === 'image') {
        const image = imageById.get(entity.id) || {}
        const parent = parentById.get(imageParentById.get(entity.id))
        return {
          type: 'Imagen',
          title: entity.name,
          subtitle: subtitle([
            image.image_type || 'Imagen',
            image.execution_date_text || image.execution_date || '',
            parent?.name || '',
          ]),
          href: `/imagenes/${entity.slug}`,
          keywords: [entity.summary, ...(imageKeywordsById.get(entity.id) || [])].filter(Boolean),
        }
      }

      const step = stepById.get(entity.id) || {}
      const parent = parentById.get(stepParentById.get(entity.id))
      return {
        type: 'Paso',
        title: entity.name,
        subtitle: subtitle([step.step_type || 'Paso', parent?.name || '', step.execution_date_text || '']),
        href: `/pasos/${entity.slug}`,
        keywords: [entity.summary, ...(stepKeywordsById.get(entity.id) || [])].filter(Boolean),
      }
    })

    return [...enrichedBaseItems, ...relatedItems]
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo completar el buscador desde Supabase', {
      error: error instanceof Error ? error.message : String(error),
    })
    return baseItems
  }
}
