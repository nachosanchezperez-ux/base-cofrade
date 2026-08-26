import 'server-only'

import { getPublishedCultCoverMediaMap } from '@/lib/supabase/cult-media'
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media'
import { createPublicClient } from '@/lib/supabase/public'

function normalized(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function isSimpecado(item) {
  return normalized(item?.tipo).includes('simpecado')
}

function mediaImage(media, fallback = null) {
  if (!media?.path) return fallback

  return {
    ...(fallback || {}),
    src: media.path,
    alt: media.alt || fallback?.alt || media.title || '',
    autor: media.credit || fallback?.autor || '',
    pie: media.caption || fallback?.pie || '',
    width: media.width || fallback?.width || null,
    height: media.height || fallback?.height || null,
    focusX: media.focusX,
    focusY: media.focusY,
    mobileFocusX: media.mobileFocusX,
    mobileFocusY: media.mobileFocusY,
    focusPosition: media.focusPosition,
    mobileFocusPosition: media.mobileFocusPosition,
    fitMode: media.fitMode || fallback?.fitMode || 'cover',
  }
}

export async function enrichBrotherhoodVisualSections(hermandad) {
  if (!hermandad?.id) return hermandad

  const supabase = createPublicClient()
  const cultos = hermandad.cultos || []
  const carteles = hermandad.cartelesFiestas || []
  const patrimonio = hermandad.patrimonio || []
  const simpecados = patrimonio.filter(isSimpecado)
  const patrimonioGeneral = patrimonio.filter((item) => !isSimpecado(item))
  const simpecadoIds = simpecados.map((item) => item.id).filter(Boolean)
  const heritageIds = [...new Set([
    ...carteles.map((item) => item.id),
    ...simpecadoIds,
  ].filter(Boolean))]

  const [cultMedia, heritageMedia, nameResult, usageResult] = await Promise.all([
    getPublishedCultCoverMediaMap(cultos.map((culto) => culto.id)),
    getPublishedEntityCoverMediaMap(heritageIds),
    simpecadoIds.length
      ? supabase
          .from('entity_names')
          .select('entity_id, name, name_type, is_current')
          .in('entity_id', simpecadoIds)
          .eq('status', 'published')
          .order('name')
      : Promise.resolve({ data: [], error: null }),
    simpecadoIds.length
      ? supabase
          .from('heritage_assets')
          .select('entity_id, usage_text')
          .in('entity_id', simpecadoIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  if (nameResult.error) throw new Error(`No se pudieron consultar las denominaciones de los Simpecados: ${nameResult.error.message}`)
  if (usageResult.error) throw new Error(`No se pudo consultar el uso de los Simpecados: ${usageResult.error.message}`)

  const namesByEntity = new Map()
  ;(nameResult.data || []).forEach((row) => {
    const list = namesByEntity.get(row.entity_id) || []
    list.push(row.name)
    namesByEntity.set(row.entity_id, list)
  })
  const usageByEntity = new Map((usageResult.data || []).map((row) => [row.entity_id, row.usage_text || '']))

  return {
    ...hermandad,
    cultos: cultos.map((culto) => {
      const media = cultMedia.get(culto.id)
      return media
        ? {
            ...culto,
            imagen: mediaImage(media),
          }
        : culto
    }),
    cartelesFiestas: carteles.map((cartel) => ({
      ...cartel,
      imagen: mediaImage(heritageMedia.get(cartel.id), cartel.imagen),
    })),
    simpecados: simpecados.map((simpecado) => ({
      ...simpecado,
      denominaciones: namesByEntity.get(simpecado.id) || [],
      uso: usageByEntity.get(simpecado.id) || '',
      imagen: mediaImage(heritageMedia.get(simpecado.id), simpecado.imagen),
    })),
    patrimonio: patrimonioGeneral,
  }
}
