import 'server-only'

import { uniquePublicOutings, publicOutingRouteSlug } from '@/lib/outings/public-outing-link'
import { getHermandadPageBySlug as getBrotherhoodDisplayBySlug } from '@/lib/supabase/brotherhood-display'
import { enrichBrotherhoodEditorialSections } from '@/lib/supabase/brotherhood-editorial-sections'
import { getExtraordinaryGuideSlugs } from '@/lib/supabase/extraordinary-guide-slugs'
import { createPublicClient as createClient } from '@/lib/supabase/public'
import { enrichBrotherhoodVisualSections } from '@/lib/supabase/brotherhood-visual-sections'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

async function enrichBrotherhoodIdentityLightColor(hermandad) {
  if (!hermandad?.id) return hermandad

  const supabase = await createClient()
  const result = await supabase
    .from('brotherhood_colors')
    .select('hex_value')
    .eq('brotherhood_entity_id', hermandad.id)
    .eq('color_role', 'identity')
    .eq('status', 'published')
    .not('hex_value', 'is', null)
    .order('sort_order')
    .limit(1)
    .maybeSingle()

  if (result.error) {
    throw new Error(`No se pudo consultar el color claro de identidad: ${result.error.message}`)
  }

  const lightColor = result.data?.hex_value
  if (!lightColor) return hermandad

  return {
    ...hermandad,
    colores: {
      ...(hermandad.colores || {}),
      claro: lightColor,
    },
  }
}

function historicalAccompanimentKey(item = {}) {
  return [item.banda, item.periodo, item.paso]
    .map((value) => String(value || '').trim().toLocaleLowerCase('es'))
    .join('|')
}

function historicalPeriodLabel(period = {}) {
  if (period.year_from && period.year_to) {
    return period.year_from === period.year_to
      ? String(period.year_from)
      : `${period.year_from}–${period.year_to}`
  }
  if (period.year_to) return `Hasta ${period.year_to}`
  return [period.date_from_text, period.date_to_text].filter(Boolean).join('–')
}

async function enrichBrotherhoodHistoricalAccompaniments(hermandad) {
  if (!hermandad?.id) return hermandad

  const supabase = await createClient()
  const periodsResult = await supabase
    .from('music_accompaniment_periods')
    .select('id, band_entity_id, step_entity_id, position, outing_type, date_from_text, year_from, date_to_text, year_to, notes, public_step_name')
    .eq('brotherhood_entity_id', hermandad.id)
    .eq('is_current', false)
    .eq('status', 'published')
    .order('year_to', { ascending: false, nullsFirst: false })
    .order('year_from', { ascending: false, nullsFirst: false })

  if (periodsResult.error) {
    throw new Error(`No se pudo consultar el histórico musical: ${periodsResult.error.message}`)
  }

  const periods = periodsResult.data || []
  if (!periods.length) return hermandad

  const bandIds = [...new Set(periods.map((period) => period.band_entity_id).filter(Boolean))]
  const [bandEntitiesResult, bandProfilesResult] = await Promise.all([
    bandIds.length
      ? supabase
          .from('entities')
          .select('id, name, slug, status')
          .in('id', bandIds)
          .eq('status', 'published')
      : Promise.resolve({ data: [], error: null }),
    bandIds.length
      ? supabase
          .from('bands')
          .select('entity_id, band_type')
          .in('entity_id', bandIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  if (bandEntitiesResult.error) {
    throw new Error(`No se pudieron resolver las bandas históricas: ${bandEntitiesResult.error.message}`)
  }
  if (bandProfilesResult.error) {
    throw new Error(`No se pudieron resolver los tipos de las bandas históricas: ${bandProfilesResult.error.message}`)
  }

  const bandEntityById = new Map((bandEntitiesResult.data || []).map((band) => [band.id, band]))
  const bandProfileById = new Map((bandProfilesResult.data || []).map((band) => [band.entity_id, band]))
  const databaseItems = periods
    .map((period) => {
      const bandEntity = bandEntityById.get(period.band_entity_id)
      if (!bandEntity) return null

      const stepName = String(period.public_step_name || '').trim()
      const position = String(period.position || '').trim()
      const sameDetail = stepName && position
        && stepName.localeCompare(position, 'es', { sensitivity: 'base' }) === 0
      const stepDetail = sameDetail
        ? stepName
        : [stepName, position].filter(Boolean).join(' · ')

      return {
        id: period.id,
        banda: bandEntity.name,
        bandaSlug: bandEntity.slug || '',
        tipo: bandProfileById.get(period.band_entity_id)?.band_type || 'Formación musical',
        paso: stepDetail,
        periodo: historicalPeriodLabel(period),
        salida: period.outing_type || '',
        observaciones: period.notes || '',
      }
    })
    .filter(Boolean)

  const databaseKeys = new Set(databaseItems.map(historicalAccompanimentKey))
  const preservedItems = (hermandad.acompanamientos || []).filter((item) => (
    !databaseKeys.has(historicalAccompanimentKey(item))
  ))

  return {
    ...hermandad,
    acompanamientos: [...databaseItems, ...preservedItems],
  }
}

async function enrichBrotherhoodOutingImages(hermandad) {
  const outingIds = [...new Set(
    (hermandad?.salidas || [])
      .map((outing) => String(outing?.id || '').trim())
      .filter((id) => UUID_PATTERN.test(id))
  )]
  if (!outingIds.length) return hermandad

  const supabase = await createClient()
  const result = await supabase
    .from('outings')
    .select('id, hero_image_path, hero_image_alt, hero_image_credit')
    .in('id', outingIds)
    .eq('brotherhood_entity_id', hermandad.id)
    .eq('status', 'published')

  if (result.error) {
    throw new Error(`No se pudieron consultar las imágenes de las salidas: ${result.error.message}`)
  }

  const imageByOutingId = new Map((result.data || []).map((outing) => [outing.id, outing]))

  return {
    ...hermandad,
    salidas: (hermandad.salidas || []).map((outing) => {
      const image = imageByOutingId.get(outing.id)
      if (!image?.hero_image_path) return outing

      return {
        ...outing,
        imagen: {
          src: image.hero_image_path,
          alt: image.hero_image_alt || outing.nombre || 'Fotografía de la salida',
          credito: image.hero_image_credit || '',
        },
      }
    }),
  }
}

export async function getHermandadPageBySlug(slug) {
  const hermandad = await getBrotherhoodDisplayBySlug(slug)
  if (!hermandad) return hermandad

  let enriched = hermandad

  try {
    enriched = await enrichBrotherhoodIdentityLightColor(enriched)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo completar el color claro de identidad de la hermandad', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  try {
    enriched = await enrichBrotherhoodHistoricalAccompaniments(enriched)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo completar el histórico musical de la hermandad', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  try {
    enriched = await enrichBrotherhoodVisualSections(enriched)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron completar los módulos visuales de la hermandad', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  try {
    enriched = await enrichBrotherhoodEditorialSections(enriched)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron completar los módulos editoriales de la hermandad', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  try {
    enriched = await enrichBrotherhoodOutingImages(enriched)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron completar las imágenes de las salidas', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  try {
    const salidas = uniquePublicOutings(enriched.salidas || [])
    const guideSlugs = await getExtraordinaryGuideSlugs(salidas.map((outing) => outing.slug))
    enriched = {
      ...enriched,
      salidas: salidas.map((outing) => ({
        ...outing,
        slug: publicOutingRouteSlug(outing, guideSlugs),
      })),
    }
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudo resolver la ficha pública de las salidas', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
  }

  return enriched
}
