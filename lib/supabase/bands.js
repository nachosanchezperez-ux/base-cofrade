import 'server-only'

import { unstable_cache } from 'next/cache'
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

  const ordinaryOutings = band.outings.filter((item) => item.character === 'ordinary')
  if (!ordinaryOutings.length) {
    return {
      ...band,
      outings: band.outings.filter((item) => item.character !== 'ordinary'),
    }
  }

  const supabase = createPublicClient()
  const ordinaryBrotherhoodIds = unique(ordinaryOutings.map((item) => item.brotherhoodEntityId))

  const [brotherhoodEntities, brotherhoodProfiles] = await Promise.all([
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
  ])

  const brotherhoodById = byId(brotherhoodEntities)
  const brotherhoodProfileById = new Map(brotherhoodProfiles.map((row) => [row.entity_id, row]))

  const ordinaryAccompaniments = ordinaryOutings.map((outing) => {
    const brotherhood = brotherhoodById.get(outing.brotherhoodEntityId) || null
    const brotherhoodProfile = brotherhoodProfileById.get(outing.brotherhoodEntityId) || null

    return {
      id: `outing-${outing.id}`,
      brotherhoodName: brotherhood?.name || outing.organizerName || '',
      brotherhoodSlug: brotherhood?.slug || '',
      brotherhoodPageReady: isPublicEntityPageReady(brotherhood, brotherhoodProfile),
      brotherhoodTypes: brotherhoodProfile?.brotherhood_types || [],
      municipality: outing.municipality || '',
      municipalitySlug: outing.municipalitySlug || '',
      province: outing.province || '',
      stepName: '',
      stepSlug: '',
      stepPageReady: false,
      outingType: outing.type || '',
      position: outing.position || 'Acompañamiento musical',
      yearFrom: outing.year,
      yearTo: outing.year,
      periodText: outing.date || '',
      notes: outing.description || '',
      source: null,
    }
  })

  const currentAccompaniments = [...(band.accompaniments || [])]
  ordinaryAccompaniments.forEach((candidate) => {
    if (!currentAccompaniments.some((existing) => sameAccompaniment(existing, candidate))) {
      currentAccompaniments.push(candidate)
    }
  })

  return {
    ...band,
    accompaniments: currentAccompaniments,
    outings: band.outings.filter((item) => item.character !== 'ordinary'),
  }
}

async function loadBandBySlug(slug) {
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

const getCachedBandBySlug = unstable_cache(
  loadBandBySlug,
  ['hilo-cofrade-public-band-detail-v2'],
  { revalidate: 900, tags: ['public-band-detail'] }
)

export async function getBandBySlug(slug) {
  return getCachedBandBySlug(slug)
}
