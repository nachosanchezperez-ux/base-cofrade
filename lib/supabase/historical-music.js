import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { createPublicClient } from '@/lib/supabase/public'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

function periodLabel(period = {}) {
  if (period.year_from && period.year_to) {
    return period.year_from === period.year_to
      ? String(period.year_from)
      : `${period.year_from}–${period.year_to}`
  }
  if (period.year_to) return `Hasta ${period.year_to}`
  if (period.year_from) return `Desde ${period.year_from}`
  return [period.date_from_text, period.date_to_text].filter(Boolean).join('–')
}

export async function getHistoricalMusicByBrotherhoodSlug(slug) {
  if (!slug) return []

  const supabase = createPublicClient()
  const entityResult = await supabase
    .from('entities')
    .select('id')
    .eq('entity_type', 'brotherhood')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (entityResult.error) {
    throw new Error(`No se pudo resolver la Hermandad para su histórico musical: ${entityResult.error.message}`)
  }
  if (!entityResult.data?.id) return []

  const periods = assertQuery(
    await supabase
      .from('music_accompaniment_periods')
      .select('id, band_entity_id, step_entity_id, position, outing_type, date_from_text, year_from, date_to_text, year_to, notes, public_step_name')
      .eq('brotherhood_entity_id', entityResult.data.id)
      .eq('is_current', false)
      .eq('status', 'published')
      .order('year_to', { ascending: false, nullsFirst: false })
      .order('year_from', { ascending: false, nullsFirst: false }),
    'No se pudo consultar el histórico musical'
  )

  if (!periods.length) return []

  const bandIds = unique(periods.map((item) => item.band_entity_id))
  const stepIds = unique(periods.map((item) => item.step_entity_id))
  const admin = createAdminClient()

  const [bandEntities, bandProfiles, stepEntities] = await Promise.all([
    bandIds.length
      ? admin
          .from('entities')
          .select('id, name, slug, status')
          .in('id', bandIds)
          .in('status', ['published', 'archived'])
      : Promise.resolve({ data: [], error: null }),
    bandIds.length
      ? admin
          .from('bands')
          .select('entity_id, band_type')
          .in('entity_id', bandIds)
      : Promise.resolve({ data: [], error: null }),
    stepIds.length
      ? supabase
          .from('entities')
          .select('id, name, slug, status')
          .in('id', stepIds)
      : Promise.resolve({ data: [], error: null }),
  ])

  const bandRows = assertQuery(bandEntities, 'No se pudieron resolver las bandas históricas')
  const profileRows = assertQuery(bandProfiles, 'No se pudieron resolver los tipos de banda históricos')
  const stepRows = assertQuery(stepEntities, 'No se pudieron resolver los pasos del histórico musical')
  const bandById = new Map(bandRows.map((item) => [item.id, item]))
  const profileById = new Map(profileRows.map((item) => [item.entity_id, item]))
  const stepById = new Map(stepRows.map((item) => [item.id, item]))

  return periods
    .map((period) => {
      const band = bandById.get(period.band_entity_id)
      if (!band) return null
      const step = stepById.get(period.step_entity_id)

      return {
        id: period.id,
        bandName: band.name,
        bandSlug: band.status === 'published' ? band.slug || '' : '',
        bandArchived: band.status === 'archived',
        bandType: profileById.get(period.band_entity_id)?.band_type || 'Formación musical',
        stepId: period.step_entity_id || '',
        stepName: period.public_step_name || step?.name || 'Otros acompañamientos',
        position: period.position || '',
        outingType: period.outing_type || '',
        period: periodLabel(period),
        yearFrom: period.year_from,
        yearTo: period.year_to,
        notes: period.notes || '',
      }
    })
    .filter(Boolean)
}
