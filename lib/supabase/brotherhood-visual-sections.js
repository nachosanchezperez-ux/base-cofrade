import 'server-only'

import { getPublishedCultCoverMediaMap } from '@/lib/supabase/cult-media'
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media'

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

  const cultos = hermandad.cultos || []
  const carteles = hermandad.cartelesFiestas || []
  const patrimonio = hermandad.patrimonio || []
  const simpecados = patrimonio.filter(isSimpecado)
  const patrimonioGeneral = patrimonio.filter((item) => !isSimpecado(item))
  const heritageIds = [...new Set([
    ...carteles.map((item) => item.id),
    ...simpecados.map((item) => item.id),
  ].filter(Boolean))]

  const [cultMedia, heritageMedia] = await Promise.all([
    getPublishedCultCoverMediaMap(cultos.map((culto) => culto.id)),
    getPublishedEntityCoverMediaMap(heritageIds),
  ])

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
      imagen: mediaImage(heritageMedia.get(simpecado.id), simpecado.imagen),
    })),
    patrimonio: patrimonioGeneral,
  }
}
