import 'server-only'

import { isPublicEntityPageReady } from '@/lib/supabase/public-entity-page'
import { createPublicClient } from '@/lib/supabase/public'
import {
  getBandBySlug as getCoreBandBySlug,
  getBandsDirectory,
  youtubeEmbedUrl,
} from './bands-core'

export { getBandsDirectory, youtubeEmbedUrl }

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function byId(rows) {
  return new Map(rows.map((row) => [row.id, row]))
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/\s+/g, ' ')
    .trim()
}

function outingYear(row) {
  return Number(row?.year) || Number(String(row?.outing_date || '').slice(0, 4)) || null
}

function sameAccompaniment(existing, candidate) {
  const sameBrotherhood = existing.brotherhoodSlug && candidate.brotherhoodSlug
    ? existing.brotherhoodSlug === candidate.brotherhoodSlug
    : normalize(existing.brotherhoodName) === normalize(candidate.brotherhoodName)
  if (!sameBrotherhood) return false
  if (normalize(existing.outingType) !== normalize(candidate.outingType)) return false

  const year = Number(candidate.yearFrom)
  if (!year) return false
  const startsBefore = !existing.yearFrom || Number(existing.yearFrom) <= year
  const endsAfter = !existing.yearTo || Number(existing.yearTo) >= year
  return startsBefore && endsAfter
}

async function routeBandOutingsByCharacter(band) {
  if (!band?.outings?.length) return band

  const supabase = createPublicClient()
  const outingIds = band.outings.map((item) => item.id).filter(Boolean)
  if (!outingIds.length) return band

  const outingRows = assertQuery(
    await supabase
      .from('outings')
      .select('id, character, brotherhood_entity_id, outing_type, outing_date, year, municipality_id, description, status')
      .in('id', outingIds)
      .eq('status', 'published'),
    'No se pudieron clasificar las salidas relacionadas con la banda'
  )

  const outingById = byId(outingRows)
  const ordinaryRows = outingRows.filter((row) => row.character === 'ordinary')
  const ordinaryBrotherhoodIds = unique(ordinaryRows.map((row) => row.brotherhood_entity_id))
  const ordinaryMunicipalityIds = unique(ordinaryRows.map((row) => row.municipality_id))

  const [brotherhoodEntities, brotherhoodProfiles, municipalities] = await Promise.all([
    ordinaryBrotherhoodIds.length
      ? assertQuery(
          await supabase
            .from('entities')
            .select('id, name, slug, entity_type, status')
            .in('id', ordinaryBrotherhoodIds),
          'No se pudieron cargar las hermandades de las salidas ordinarias de la banda'
        )
      : [],
    ordinaryBrotherhoodIds.length
      ? assertQuery(
          await supabase
            .from('brotherhoods')
            .select('entity_id, municipality_id, brotherhood_types')
            .in('entity_id', ordinaryBrotherhoodIds),
          'No se pudieron cargar los perfiles de las hermandades de las salidas ordinarias'
        )
      : [],
    ordinaryMunicipalityIds.length
      ? assertQuery(
          await supabase
            .from('municipalities')
            .select('id, name, slug, province')
            .in('id', ordinaryMunicipalityIds),
          'No se pudieron cargar las localidades de las salidas ordinarias de la banda'
        )
      : [],
  ])

  const brotherhoodById = byId(brotherhoodEntities)
  const brotherhoodProfileById = new Map(brotherhoodProfiles.map((row) => [row.entity_id, row]))
  const municipalityById = byId(municipalities)
  const coreOutingById = byId(band.outings)

  const ordinaryAccompaniments = ordinaryRows.map((row) => {
    const coreOuting = coreOutingById.get(row.id) || {}
    const brotherhood = brotherhoodById.get(row.brotherhood_entity_id) || null
    const brotherhoodProfile = brotherhoodProfileById.get(row.brotherhood_entity_id) || null
    const municipality = municipalityById.get(row.municipality_id) || null
    const year = outingYear(row)

    return {
      id: `outing-${row.id}`,
      brotherhoodName: brotherhood?.name || coreOuting.organizerName || '',
      brotherhoodSlug: brotherhood?.slug || '',
      brotherhoodPageReady: isPublicEntityPageReady(brotherhood, brotherhoodProfile),
      brotherhoodTypes: brotherhoodProfile?.brotherhood_types || [],
      municipality: municipality?.name || coreOuting.municipality || '',
      municipalitySlug: municipality?.slug || '',
      province: municipality?.province || '',
      stepName: '',
      stepSlug: '',
      stepPageReady: false,
      outingType: row.outing_type || coreOuting.type || '',
      position: coreOuting.position || 'Acompañamiento musical',
      yearFrom: year,
      yearTo: year,
      periodText: row.outing_date || '',
      notes: coreOuting.description || row.description || '',
      source: null,
    }
  })

  const currentAccompaniments = [...(band.accompaniments || [])]
  ordinaryAccompaniments.forEach((candidate) => {
    if (!currentAccompaniments.some((existing) => sameAccompaniment(existing, candidate))) {
      currentAccompaniments.push(candidate)
    }
  })

  const extraordinaryOutings = band.outings.filter((item) => {
    const row = outingById.get(item.id)
    return !row || row.character === 'extraordinary'
  })

  return {
    ...band,
    accompaniments: currentAccompaniments,
    outings: extraordinaryOutings,
  }
}

export async function getBandBySlug(slug) {
  const band = await getCoreBandBySlug(slug)
  if (!band) return null

  try {
    return await routeBandOutingsByCharacter(band)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron clasificar las salidas relacionadas con la banda', {
      slug,
      error: error instanceof Error ? error.message : String(error),
    })
    return band
  }
}
