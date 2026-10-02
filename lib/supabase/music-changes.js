import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'
import {
  canonicalSemanaSantaDay,
  musicChangeKind,
  normalizeMusicChangeText,
  sortMusicChanges,
} from '@/lib/music-changes'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function bestPreviousPeriod(change, periods) {
  const candidates = periods.filter((period) => (
    period.brotherhood_entity_id === change.brotherhood_entity_id
    && period.band_entity_id !== change.band_entity_id
  ))

  let best = null
  let bestScore = 0
  const changePosition = normalizeMusicChangeText(change.position)
  const changeOuting = canonicalSemanaSantaDay(change.outing_type)

  for (const period of candidates) {
    let score = 0

    if (change.step_entity_id && period.step_entity_id === change.step_entity_id) {
      score += 12
    } else if (change.step_entity_id) {
      continue
    } else if (!period.step_entity_id) {
      const previousPosition = normalizeMusicChangeText(period.position)
      if (changePosition && previousPosition === changePosition) score += 10
      if (
        changePosition.includes('cruz de guia')
        && previousPosition.includes('cruz de guia')
      ) score += 8
    } else {
      continue
    }

    const previousOuting = canonicalSemanaSantaDay(period.outing_type)
    if (changeOuting && previousOuting === changeOuting) score += 3

    if (score > bestScore) {
      best = period
      bestScore = score
    }
  }

  return bestScore >= 8 ? best : null
}

export async function getMusicChangesForYear(year = 2027, { throwOnError = false } = {}) {
  try {
    const supabase = createPublicClient()
    const incoming = assertQuery(
      await supabase
        .from('music_accompaniment_periods')
        .select([
          'id',
          'brotherhood_entity_id',
          'band_entity_id',
          'step_entity_id',
          'position',
          'outing_type',
          'year_from',
          'notes',
          'updated_at',
          'public_brotherhood_name',
          'public_brotherhood_slug',
          'public_step_name',
          'public_municipality_name',
          'public_municipality_slug',
          'public_province',
        ].join(','))
        .eq('year_from', year)
        .eq('status', 'published')
        .order('updated_at', { ascending: false }),
      `No se pudieron consultar los cambios musicales de ${year}`,
    )

    if (!incoming.length) return []

    const brotherhoodIds = unique(incoming.map((item) => item.brotherhood_entity_id))
    const bandIds = unique(incoming.map((item) => item.band_entity_id))
    const stepIds = unique(incoming.map((item) => item.step_entity_id))

    const [brotherhoodsResult, brotherhoodEntitiesResult, bandsResult, stepsResult, previousResult] = await Promise.all([
      supabase
        .from('brotherhoods')
        .select('entity_id, popular_name, municipality_id, current_procession_day')
        .in('entity_id', brotherhoodIds),
      supabase
        .from('entities')
        .select('id, name, slug, status')
        .in('id', brotherhoodIds),
      supabase
        .from('entities')
        .select('id, name, slug, status')
        .in('id', bandIds),
      stepIds.length
        ? supabase
            .from('entities')
            .select('id, name, slug, status')
            .in('id', stepIds)
        : Promise.resolve({ data: [], error: null }),
      supabase
        .from('music_accompaniment_periods')
        .select('id, brotherhood_entity_id, band_entity_id, step_entity_id, position, outing_type, year_to, updated_at')
        .in('brotherhood_entity_id', brotherhoodIds)
        .eq('year_to', year - 1)
        .eq('status', 'published'),
    ])

    const brotherhoods = assertQuery(brotherhoodsResult, 'No se pudieron consultar las Hermandades de los cambios musicales')
    const brotherhoodEntities = assertQuery(brotherhoodEntitiesResult, 'No se pudieron consultar las entidades de Hermandad')
    const newBands = assertQuery(bandsResult, 'No se pudieron consultar las nuevas bandas')
    const steps = assertQuery(stepsResult, 'No se pudieron consultar los Pasos de los cambios musicales')
    const previousPeriods = assertQuery(previousResult, 'No se pudieron consultar los acompañamientos anteriores')

    const municipalityIds = unique(brotherhoods.map((item) => item.municipality_id))
    const oldBandIds = unique(previousPeriods.map((item) => item.band_entity_id))

    const [municipalitiesResult, oldBandsResult] = await Promise.all([
      municipalityIds.length
        ? supabase.from('municipalities').select('id, name, slug, province').in('id', municipalityIds)
        : Promise.resolve({ data: [], error: null }),
      oldBandIds.length
        ? supabase.from('entities').select('id, name, slug, status').in('id', oldBandIds)
        : Promise.resolve({ data: [], error: null }),
    ])

    const municipalities = assertQuery(municipalitiesResult, 'No se pudieron consultar las localidades de los cambios musicales')
    const oldBands = assertQuery(oldBandsResult, 'No se pudieron consultar las bandas anteriores')

    const brotherhoodById = new Map(brotherhoods.map((item) => [item.entity_id, item]))
    const brotherhoodEntityById = new Map(brotherhoodEntities.map((item) => [item.id, item]))
    const municipalityById = new Map(municipalities.map((item) => [item.id, item]))
    const bandById = new Map(newBands.map((item) => [item.id, item]))
    const oldBandById = new Map(oldBands.map((item) => [item.id, item]))
    const stepById = new Map(steps.map((item) => [item.id, item]))

    const changes = incoming.flatMap((change) => {
      const brotherhood = brotherhoodById.get(change.brotherhood_entity_id) || {}
      const brotherhoodEntity = brotherhoodEntityById.get(change.brotherhood_entity_id) || {}
      const municipality = municipalityById.get(brotherhood.municipality_id) || {}
      const province = change.public_province || municipality.province || ''
      const municipalityName = change.public_municipality_name || municipality.name || ''

      if (province !== 'Sevilla' && municipalityName !== 'Sevilla') return []

      const newBand = bandById.get(change.band_entity_id) || {}
      if (!newBand.name || newBand.status !== 'published') return []

      const step = stepById.get(change.step_entity_id) || {}
      const previousPeriod = bestPreviousPeriod(change, previousPeriods)
      const previousBand = previousPeriod
        ? oldBandById.get(previousPeriod.band_entity_id) || {}
        : {}

      const day = canonicalSemanaSantaDay(
        brotherhood.current_procession_day || change.outing_type,
      ) || brotherhood.current_procession_day || change.outing_type || 'Semana Santa'

      const brotherhoodName = change.public_brotherhood_name
        || brotherhood.popular_name
        || brotherhoodEntity.name
        || 'Hermandad'

      const brotherhoodSlug = change.public_brotherhood_slug
        || brotherhoodEntity.slug
        || ''

      const stepName = change.public_step_name
        || step.name
        || change.position
        || 'Acompañamiento musical'

      const previousBandName = previousBand.status === 'published' ? previousBand.name : ''

      return [{
        id: change.id,
        year,
        day,
        brotherhoodName,
        brotherhoodSlug,
        brotherhoodHref: brotherhoodSlug ? `/hermandades/${brotherhoodSlug}` : '',
        municipality: municipalityName,
        scope: municipalityName === 'Sevilla' ? 'capital' : 'province',
        stepName,
        stepSlug: step.status === 'published' ? step.slug || '' : '',
        stepHref: step.status === 'published' && step.slug ? `/pasos/${step.slug}` : '',
        position: change.position || '',
        outingType: change.outing_type || '',
        previousBandName,
        previousBandSlug: previousBand.status === 'published' ? previousBand.slug || '' : '',
        previousBandHref: previousBand.status === 'published' && previousBand.slug
          ? `/bandas/${previousBand.slug}`
          : '',
        newBandName: newBand.name,
        newBandSlug: newBand.slug || '',
        newBandHref: newBand.slug ? `/bandas/${newBand.slug}` : '',
        kind: musicChangeKind({
          position: change.position,
          previousBandName,
        }),
        notes: change.notes || '',
        updatedAt: change.updated_at || '',
      }]
    })

    return sortMusicChanges(changes)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar los cambios musicales', {
      year,
      error: error instanceof Error ? error.message : String(error),
    })
    if (throwOnError) throw error
    return []
  }
}
