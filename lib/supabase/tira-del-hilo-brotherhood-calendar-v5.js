import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { brotherhoodCalendarMonth, brotherhoodCalendarV5Intent, dateRangeMatchesMonth, normalizeBrotherhoodCalendarText } from '@/lib/tira-brotherhood-calendar-v5'
import { relationalEntityScore } from '@/lib/tira-relational-v2'

function href(entity) { return entity?.slug ? `/hermandades/${entity.slug}` : '' }
function entityCard(entity) { return entity ? { id: entity.id, entityType: 'brotherhood', type: 'Hermandad', name: entity.name, href: href(entity), meta: '' } : null }
function contextFor(entity) { return entity ? { entityId: entity.id, entityType: 'brotherhood', name: entity.name } : null }
function answer({ text, path, brotherhood, items, links = [], evidence = [], followUps = [] }) {
  return { kind: 'answer', answer: text, path, entities: [entityCard(brotherhood)].filter(Boolean), items, links, evidence, references: [], followUps, context: contextFor(brotherhood), compactItemLimit: Math.min(Math.max(items.length, 4), 12) }
}
function missing(text, brotherhood = null) {
  return { kind: 'not_documented', answer: text, path: [], entities: [entityCard(brotherhood)].filter(Boolean), items: [], links: [], evidence: [], references: [], followUps: brotherhood ? ['¿Qué cultos tiene?', '¿Qué acontecimientos históricos tiene?'] : [], context: contextFor(brotherhood) }
}
function todayMadrid() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date()) }
function formatDate(value = '') { const parts = String(value).split('-'); return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value }
function rangeLabel(start = '', end = '') { return !start ? '' : (!end || end === start ? formatDate(start) : `${formatDate(start)}–${formatDate(end)}`) }

async function resolveBrotherhood(supabase, question, context) {
  const result = await supabase.from('entities').select('id, entity_type, name, slug, summary').eq('entity_type', 'brotherhood').eq('status', 'published')
  if (result.error) throw result.error
  const explicit = (result.data || []).map((entity) => ({ entity, score: relationalEntityScore(entity.name, question, 'brotherhood') })).filter((item) => item.score >= 250).sort((a, b) => b.score - a.score || b.entity.name.length - a.entity.name.length)[0]
  if (explicit?.score >= 500) return explicit.entity
  if (context?.entityType === 'brotherhood' && context?.entityId) {
    const contextual = await supabase.from('entities').select('id, entity_type, name, slug, summary').eq('id', context.entityId).eq('entity_type', 'brotherhood').eq('status', 'published').maybeSingle()
    if (contextual.error) throw contextual.error
    if (contextual.data) return contextual.data
  }
  return explicit?.entity || null
}

function groupCalendarDays(rows = []) {
  const groups = new Map()
  for (const row of rows) {
    const key = row.occurrence_id || row.calendar_item_id
    const item = groups.get(key) || { id: key, title: row.title, subtype: row.subtype, startDate: row.item_date, endDate: row.item_date, time: row.item_time, place: row.place_name, status: row.event_status }
    if (row.item_date && row.item_date < item.startDate) item.startDate = row.item_date
    if (row.item_date && row.item_date > item.endDate) item.endDate = row.item_date
    if (!item.time && row.item_time) item.time = row.item_time
    if (!item.place && row.place_name) item.place = row.place_name
    groups.set(key, item)
  }
  return [...groups.values()].sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)))
}

async function upcoming(supabase, brotherhood, question) {
  const month = brotherhoodCalendarMonth(question)
  const result = await supabase.from('calendar_cult_days').select('calendar_item_id, brotherhood_entity_id, title, subtype, item_date, item_time, place_name, event_status, occurrence_id').eq('brotherhood_entity_id', brotherhood.id).gte('item_date', todayMadrid()).order('item_date')
  if (result.error) throw result.error
  const groups = groupCalendarDays((result.data || []).filter((row) => normalizeBrotherhoodCalendarText(row.event_status) !== 'cancelled')).filter((row) => dateRangeMatchesMonth(row.startDate, row.endDate, month))
  if (!groups.length) return missing(`No hay cultos futuros publicados${month ? ' para el mes solicitado' : ''} de ${brotherhood.name} en la Agenda Cofrade.`, brotherhood)
  return answer({
    text: `${brotherhood.name} tiene ${groups.length} ${groups.length === 1 ? 'culto futuro publicado' : 'cultos futuros publicados'} en la Agenda Cofrade${month ? ' para el mes consultado' : ''}.`,
    path: ['Hermandad', 'Agenda Cofrade', 'Próximos cultos'], brotherhood,
    items: groups.slice(0, 20).map((row) => ({ label: row.title, meta: [row.subtype, rangeLabel(row.startDate, row.endDate), row.time ? String(row.time).slice(0, 5) : '', row.place, row.status].filter(Boolean).join(' · '), href: href(brotherhood) })),
    links: [{ label: 'Abrir la Agenda Cofrade', href: '/agenda-cofrade?categoria=devotions#agenda' }],
    evidence: [{ key: `calendar-cults-${brotherhood.id}`, label: 'Agenda Cofrade · Cultos', detail: `${groups.length} ocurrencias futuras` }],
    followUps: ['¿Qué cultos tiene durante todo el año?', '¿Qué acontecimientos históricos tiene?'],
  })
}

async function cults(supabase, brotherhood) {
  const cultResult = await supabase.from('cults').select('id, cult_type, title, cult_date, time_text, recurrence_label, display_order').eq('brotherhood_entity_id', brotherhood.id).eq('status', 'published').order('display_order')
  if (cultResult.error) throw cultResult.error
  const rows = cultResult.data || []
  if (!rows.length) return missing(`No hay cultos publicados de ${brotherhood.name} en esta capa de Hilo Cofrade.`, brotherhood)
  const occurrenceResult = await supabase.from('cult_occurrences').select('cult_id, year, start_date, end_date, event_status, status').in('cult_id', rows.map((row) => row.id)).eq('status', 'published').order('start_date', { ascending: false })
  if (occurrenceResult.error) throw occurrenceResult.error
  const byCult = new Map()
  ;(occurrenceResult.data || []).forEach((row) => { if (!byCult.has(row.cult_id)) byCult.set(row.cult_id, row) })
  return answer({
    text: `${brotherhood.name} tiene ${rows.length} ${rows.length === 1 ? 'culto publicado' : 'cultos publicados'} en su ficha estructurada.`,
    path: ['Hermandad', 'Cultos', 'Ciclo anual'], brotherhood,
    items: rows.map((row) => { const occurrence = byCult.get(row.id); return { label: row.title, meta: [row.cult_type, row.recurrence_label, occurrence ? rangeLabel(occurrence.start_date, occurrence.end_date) : row.cult_date ? formatDate(row.cult_date) : '', occurrence?.event_status, row.time_text].filter(Boolean).join(' · '), href: href(brotherhood) } }),
    evidence: [{ key: `brotherhood-cults-${brotherhood.id}`, label: 'Cultos publicados', detail: `${rows.length} cultos estructurados` }],
    followUps: ['¿Cuáles son los próximos?', '¿Qué acontecimientos históricos tiene?'],
  })
}

async function history(supabase, brotherhood) {
  const result = await supabase.from('events').select('entity_id, event_type, event_date, event_date_text, event_category, event_status, location_text').eq('brotherhood_entity_id', brotherhood.id).order('event_date')
  if (result.error) throw result.error
  const historical = (result.data || []).filter((row) => normalizeBrotherhoodCalendarText(row.event_category) === 'historical')
  if (!historical.length) return missing(`No hay acontecimientos históricos estructurados de ${brotherhood.name}.`, brotherhood)
  const entities = await supabase.from('entities').select('id, name, status').in('id', historical.map((row) => row.entity_id)).eq('status', 'published')
  if (entities.error) throw entities.error
  const names = new Map((entities.data || []).map((entity) => [entity.id, entity.name]))
  const rows = historical.filter((row) => names.has(row.entity_id))
  return answer({
    text: `${brotherhood.name} tiene ${rows.length} ${rows.length === 1 ? 'acontecimiento histórico publicado' : 'acontecimientos históricos publicados'} en Hilo Cofrade.`,
    path: ['Hermandad', 'Historia', 'Acontecimientos'], brotherhood,
    items: rows.map((row) => ({ label: names.get(row.entity_id), meta: [row.event_date ? formatDate(row.event_date) : row.event_date_text, row.event_type, row.location_text, row.event_status].filter(Boolean).join(' · '), href: href(brotherhood) })),
    evidence: [{ key: `brotherhood-history-${brotherhood.id}`, label: 'Acontecimientos históricos publicados', detail: `${rows.length} hitos` }],
    followUps: ['¿Qué tiene próximamente?', '¿Qué cultos tiene?'],
  })
}

export async function askHiloCofradeBrotherhoodCalendarV5(question, context = null) {
  const intent = brotherhoodCalendarV5Intent(question, context)
  if (!intent) return null
  const supabase = await createClient()
  try {
    const brotherhood = await resolveBrotherhood(supabase, question, context)
    if (!brotherhood) return null
    if (intent.kind === 'brotherhood_upcoming') return upcoming(supabase, brotherhood, question)
    if (intent.kind === 'brotherhood_cults') return cults(supabase, brotherhood)
    if (intent.kind === 'brotherhood_history') return history(supabase, brotherhood)
    return null
  } catch (error) {
    console.error('[Hilo Cofrade] Error en calendario relacional V5', { question: String(question || '').slice(0, 320), kind: intent.kind, error: error instanceof Error ? error.message : String(error) })
    return null
  }
}
