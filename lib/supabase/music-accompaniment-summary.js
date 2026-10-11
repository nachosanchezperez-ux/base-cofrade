import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'
import { loadPublicRowsInBatches, loadPublicRowsInPages } from '@/lib/supabase/public-query-batches'

const PERIOD_COLUMNS = [
  'id', 'band_entity_id', 'brotherhood_entity_id', 'step_entity_id', 'position', 'outing_type',
  'year_from', 'year_to', 'date_from', 'date_to', 'date_from_text', 'is_current', 'notes', 'updated_at',
  'public_band_name', 'public_brotherhood_name', 'public_step_name',
  'public_municipality_name', 'public_municipality_slug', 'public_province',
].join(',')

/** Public, minimal relation snapshots. All reads must succeed before the cache is refreshed. */
export async function getPublicMusicAccompanimentPeriods() {
  const supabase = createPublicClient()
  const periods = await loadPublicRowsInPages((from, to) => supabase
    .from('music_accompaniment_periods').select(PERIOD_COLUMNS)
    .eq('status', 'published').order('id').range(from, to), 'No se pudieron consultar los acompañamientos musicales')
  if (!periods.length) return []

  const bandIds = periods.map((period) => period.band_entity_id)
  const brotherhoodIds = periods.map((period) => period.brotherhood_entity_id)
  const entityIds = periods.flatMap((period) => [period.band_entity_id, period.brotherhood_entity_id, period.step_entity_id])
  const [entities, bands, brotherhoods] = await Promise.all([
    loadPublicRowsInBatches(entityIds, (ids) => supabase.from('entities')
      .select('id, name, slug').eq('status', 'published').in('id', ids), 'No se pudieron consultar las fichas musicales públicas'),
    loadPublicRowsInBatches(bandIds, (ids) => supabase.from('bands')
      .select('entity_id, band_type').in('entity_id', ids), 'No se pudieron consultar las formaciones musicales'),
    loadPublicRowsInBatches(brotherhoodIds, (ids) => supabase.from('brotherhoods')
      .select('entity_id, popular_name, municipality_id, current_procession_day').in('entity_id', ids), 'No se pudieron consultar las Hermandades de los acompañamientos'),
  ])
  const municipalities = await loadPublicRowsInBatches(brotherhoods.map((item) => item.municipality_id),
    (ids) => supabase.from('municipalities').select('id, name, slug, province').in('id', ids),
    'No se pudieron consultar los municipios de los acompañamientos')
  const entityById = new Map(entities.map((item) => [item.id, item]))
  const bandById = new Map(bands.map((item) => [item.entity_id, item]))
  const brotherhoodById = new Map(brotherhoods.map((item) => [item.entity_id, item]))
  const municipalityById = new Map(municipalities.map((item) => [item.id, item]))

  return periods.map((period) => {
    const band = entityById.get(period.band_entity_id)
    const brotherhood = entityById.get(period.brotherhood_entity_id)
    const profile = brotherhood ? brotherhoodById.get(period.brotherhood_entity_id) : undefined
    const municipality = municipalityById.get(profile?.municipality_id)
    const step = entityById.get(period.step_entity_id)
    return {
      id: period.id,
      bandEntityId: period.band_entity_id, bandName: band?.name || period.public_band_name || '',
      bandHref: band?.slug ? `/bandas/${band.slug}` : '', bandType: bandById.get(period.band_entity_id)?.band_type || '',
      brotherhoodEntityId: period.brotherhood_entity_id,
      brotherhoodName: period.public_brotherhood_name || (brotherhood ? profile?.popular_name || brotherhood.name : '') || '',
      brotherhoodHref: brotherhood?.slug ? `/hermandades/${brotherhood.slug}` : '',
      stepEntityId: period.step_entity_id || '', stepName: period.public_step_name || step?.name || '',
      stepHref: step?.slug ? `/pasos/${step.slug}` : '',
      position: period.position || '', outingType: period.outing_type || '', day: profile?.current_procession_day || '',
      municipality: municipality?.name || period.public_municipality_name || '',
      municipalitySlug: municipality?.slug || period.public_municipality_slug || '',
      province: municipality?.province || period.public_province || '',
      yearFrom: period.year_from, yearTo: period.year_to, dateFrom: period.date_from, dateTo: period.date_to,
      dateFromText: period.date_from_text || '', isCurrent: period.is_current,
      notes: period.notes || '', updatedAt: period.updated_at || '',
    }
  })
}
