import 'server-only'

import { cache } from 'react'
import { getCachedPublicData, PUBLIC_CACHE_TAGS } from '@/lib/cache/public-cache'
import { getBandsDirectory } from '@/lib/supabase/bands'
import { getHermandadesDirectory } from '@/lib/supabase/brotherhood-directory'
import { createPublicClient } from '@/lib/supabase/public'

function subtitle(parts = []) {
  return parts.filter(Boolean).join(' · ')
}

function directoryItems(brotherhoods, bands) {
  return [
    ...brotherhoods.map((hermandad) => ({
      type: 'Hermandad',
      title: hermandad.nombrePopular,
      subtitle: subtitle([hermandad.localidad, hermandad.diaSalida]),
      href: `/hermandades/${hermandad.slug}`,
    })),
    ...bands.map((band) => ({
      type: 'Banda',
      title: band.popularName,
      subtitle: subtitle([band.type, band.municipality]),
      href: `/bandas/${band.slug}`,
    })),
  ]
}

function assertResult(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

async function loadGlobalSearchItems() {
  const [brotherhoods, bands] = await Promise.all([
    getHermandadesDirectory(),
    getBandsDirectory(),
  ])
  const baseItems = directoryItems(brotherhoods, bands)

  try {
    const supabase = createPublicClient()
    const relatedEntities = assertResult(
      await supabase
        .from('entities')
        .select('id, entity_type, name, slug')
        .in('entity_type', ['image', 'step'])
        .eq('status', 'published')
        .not('slug', 'is', null)
        .order('name'),
      'No se pudieron consultar las imágenes y los pasos del buscador'
    )

    if (!relatedEntities.length) return baseItems

    const imageIds = relatedEntities
      .filter((item) => item.entity_type === 'image')
      .map((item) => item.id)
    const stepIds = relatedEntities
      .filter((item) => item.entity_type === 'step')
      .map((item) => item.id)

    const [imageRowsResult, stepRowsResult, imageLinksResult, stepLinksResult] = await Promise.all([
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
    ])

    const imageRows = assertResult(imageRowsResult, 'No se pudieron consultar los datos de las imágenes')
    const stepRows = assertResult(stepRowsResult, 'No se pudieron consultar los datos de los pasos')
    const imageLinks = assertResult(imageLinksResult, 'No se pudieron consultar las hermandades de las imágenes')
    const stepLinks = assertResult(stepLinksResult, 'No se pudieron consultar las hermandades de los pasos')
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
        }
      }

      const step = stepById.get(entity.id) || {}
      const parent = parentById.get(stepParentById.get(entity.id))
      return {
        type: 'Paso',
        title: entity.name,
        subtitle: subtitle([step.step_type || 'Paso', parent?.name || '', step.execution_date_text || '']),
        href: `/pasos/${entity.slug}`,
      }
    })

    return [...baseItems, ...relatedItems]
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo completar el buscador desde Supabase', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
}

export const getGlobalSearchItems = cache(() => getCachedPublicData({
  key: ['global-search'],
  tags: [
    PUBLIC_CACHE_TAGS.BROTHERHOODS,
    PUBLIC_CACHE_TAGS.BANDS,
    PUBLIC_CACHE_TAGS.IMAGES,
    PUBLIC_CACHE_TAGS.STEPS,
  ],
  loader: loadGlobalSearchItems,
}))
