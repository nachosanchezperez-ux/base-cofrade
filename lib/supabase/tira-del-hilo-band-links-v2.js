import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  normalizeRelationalText,
  relationalEntityScore,
  relationalPeriodLabel,
  relationalV2Intent,
} from '@/lib/tira-relational-v2'

function entityHref(entity) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  return ''
}

function publicEntity(entity, meta = '') {
  if (!entity) return null
  return {
    id: entity.id,
    entityType: entity.entity_type,
    type: entity.entity_type === 'band' ? 'Banda' : entity.entity_type === 'brotherhood' ? 'Hermandad' : 'Paso',
    name: entity.name,
    href: entityHref(entity),
    meta,
  }
}

function contextFor(band, brotherhoods, sourceIntent) {
  const ids = [...new Set(brotherhoods.map((entity) => entity.id).filter(Boolean))].slice(0, 12)
  return {
    entityId: band.id,
    entityType: 'band',
    name: band.name,
    ...(ids.length ? {
      resultSet: {
        entityType: 'brotherhood',
        entityIds: ids,
        count: ids.length,
        label: `${ids.length} ${ids.length === 1 ? 'hermandad' : 'hermandades'}`,
        sourceIntent,
      },
    } : {}),
  }
}

function answer({ text, path, band, brotherhoods, rows, stepById, historical = false }) {
  const brotherhoodById = new Map(brotherhoods.map((entity) => [entity.id, entity]))
  return {
    kind: 'answer',
    answer: text,
    path,
    entities: [publicEntity(band), ...brotherhoods.map((entity) => publicEntity(entity))],
    items: rows.map((row) => {
      const brotherhood = brotherhoodById.get(row.brotherhood_entity_id)
      const step = stepById.get(row.step_entity_id)
      return {
        label: brotherhood?.name || 'Hermandad por documentar',
        meta: historical
          ? [relationalPeriodLabel(row), row.outing_type, row.position, step?.name].filter(Boolean).join(' · ')
          : [row.outing_type, row.position, step?.name, row.date_from_text || row.year_from].filter(Boolean).join(' · '),
        href: entityHref(brotherhood),
        ...(historical ? { group: row.is_current ? 'Vigente' : 'Histórico' } : {}),
      }
    }),
    links: [],
    evidence: [{
      key: `${historical ? 'history' : 'current'}-band-${band.id}`,
      label: historical ? 'Periodos musicales publicados' : 'Acompañamientos actuales publicados',
      detail: `${rows.length} ${historical ? 'periodos' : 'relaciones'} · ${brotherhoods.length} ${brotherhoods.length === 1 ? 'hermandad' : 'hermandades'}`,
    }],
    references: [],
    followUps: historical
      ? [`¿A qué hermandades acompaña actualmente ${band.name}?`, `Cuéntame sobre ${band.name}`]
      : [`¿A qué hermandades ha acompañado ${band.name}?`, `Cuéntame sobre ${band.name}`],
    context: contextFor(band, brotherhoods, historical ? 'band_music_history' : 'band_current_brotherhoods'),
    compactItemLimit: Math.min(Math.max(rows.length, 5), 12),
  }
}

async function entityById(supabase, id, entityType) {
  if (!id) return null
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('id', id)
    .eq('entity_type', entityType)
    .eq('status', 'published')
    .maybeSingle()
  if (result.error) throw result.error
  return result.data || null
}

async function entitiesByIds(supabase, ids, entityType) {
  const unique = [...new Set((ids || []).filter(Boolean))]
  if (!unique.length) return []
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('entity_type', entityType)
    .eq('status', 'published')
    .in('id', unique)
  if (result.error) throw result.error
  const byId = new Map((result.data || []).map((entity) => [entity.id, entity]))
  return unique.map((id) => byId.get(id)).filter(Boolean)
}

async function resolveBand(supabase, question, context) {
  if (context?.entityType === 'band' && context?.entityId) {
    const q = normalizeRelationalText(question)
    const contextualFollowUp = !context.name || !q.includes(normalizeRelationalText(context.name))
    if (contextualFollowUp) {
      const contextual = await entityById(supabase, context.entityId, 'band')
      if (contextual) return contextual
    }
  }

  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, summary')
    .eq('entity_type', 'band')
    .eq('status', 'published')
  if (result.error) throw result.error
  return (result.data || [])
    .map((entity) => ({ entity, score: relationalEntityScore(entity.name, question, 'band') }))
    .filter(({ score }) => score >= 250)
    .sort((first, second) => second.score - first.score)[0]?.entity || null
}

async function currentBrotherhoods(supabase, band) {
  const result = await supabase
    .from('current_music_accompaniments')
    .select('brotherhood_entity_id, step_entity_id, position, outing_type, year_from, date_from_text')
    .eq('band_entity_id', band.id)
  if (result.error) throw result.error
  const rows = result.data || []
  if (!rows.length) return null

  const [brotherhoods, steps] = await Promise.all([
    entitiesByIds(supabase, rows.map((row) => row.brotherhood_entity_id), 'brotherhood'),
    entitiesByIds(supabase, rows.map((row) => row.step_entity_id), 'step'),
  ])
  const publicIds = new Set(brotherhoods.map((entity) => entity.id))
  const usable = rows.filter((row) => publicIds.has(row.brotherhood_entity_id))
  const uniqueBrotherhoods = brotherhoods.filter((entity) => usable.some((row) => row.brotherhood_entity_id === entity.id))
  if (!usable.length) return null

  return answer({
    text: `${band.name} aparece actualmente relacionada con ${uniqueBrotherhoods.length} ${uniqueBrotherhoods.length === 1 ? 'hermandad' : 'hermandades'} mediante ${usable.length} ${usable.length === 1 ? 'acompañamiento publicado' : 'acompañamientos publicados'}.`,
    path: ['Banda', 'Acompañamientos actuales', 'Hermandades'],
    band,
    brotherhoods: uniqueBrotherhoods,
    rows: usable,
    stepById: new Map(steps.map((entity) => [entity.id, entity])),
  })
}

async function historicalBrotherhoods(supabase, band) {
  const result = await supabase
    .from('music_accompaniment_periods')
    .select('brotherhood_entity_id, step_entity_id, position, outing_type, date_from_text, year_from, date_to_text, year_to, is_current')
    .eq('band_entity_id', band.id)
    .eq('status', 'published')
  if (result.error) throw result.error
  const rows = result.data || []
  if (!rows.length) return null

  const [brotherhoods, steps] = await Promise.all([
    entitiesByIds(supabase, rows.map((row) => row.brotherhood_entity_id), 'brotherhood'),
    entitiesByIds(supabase, rows.map((row) => row.step_entity_id), 'step'),
  ])
  const publicIds = new Set(brotherhoods.map((entity) => entity.id))
  const usable = rows.filter((row) => publicIds.has(row.brotherhood_entity_id))
  const uniqueBrotherhoods = brotherhoods.filter((entity) => usable.some((row) => row.brotherhood_entity_id === entity.id))
  if (!usable.length) return null

  return answer({
    text: `${band.name} tiene ${usable.length} ${usable.length === 1 ? 'periodo de acompañamiento publicado' : 'periodos de acompañamiento publicados'} con ${uniqueBrotherhoods.length} ${uniqueBrotherhoods.length === 1 ? 'hermandad' : 'hermandades'}, incluyendo vínculos vigentes e históricos.`,
    path: ['Banda', 'Acompañamientos', 'Histórico documentado'],
    band,
    brotherhoods: uniqueBrotherhoods,
    rows: usable,
    stepById: new Map(steps.map((entity) => [entity.id, entity])),
    historical: true,
  })
}

export async function askHiloCofradeBandLinksV2(question = '', context = null) {
  const intent = relationalV2Intent(question, context)
  if (!intent || !['current_band_brotherhoods', 'music_history'].includes(intent.kind)) return null

  const q = normalizeRelationalText(question)
  const bandCentricHistory = intent.kind === 'music_history'
    && (context?.entityType === 'band' || /\b(a que hermandades|en que hermandades|que hermandades|cuales hermandades|donde)\b/.test(q))
  if (intent.kind === 'music_history' && !bandCentricHistory) return null

  try {
    const supabase = await createClient()
    const band = await resolveBand(supabase, question, context)
    if (!band) return null
    return intent.kind === 'music_history'
      ? await historicalBrotherhoods(supabase, band)
      : await currentBrotherhoods(supabase, band)
  } catch (error) {
    console.error('[Hilo Cofrade] Error al resolver relaciones inversas de Banda', {
      question: String(question || '').slice(0, 320),
      kind: intent.kind,
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}
