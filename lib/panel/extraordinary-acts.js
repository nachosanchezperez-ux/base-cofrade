import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { normalizeExtraordinaryKind } from '@/lib/agenda-extraordinary'

// Panel · Actos extraordinarios (#agenda-prioridad). Próximos actos de la
// Agenda (salidas y ocurrencias de cultos) con su marca. Tres lecturas en
// paralelo y una de nombres: nunca una consulta por acto.
const MISSING_COLUMN = '42703'
const PAST_DAYS = 2
const FUTURE_DAYS = 400

function madridDate(offsetDays = 0) {
  const date = new Date(Date.now() + offsetDays * 86400000)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

function fold(value) {
  return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

async function readWithMark(build, columns) {
  const marked = await build(`${columns}, extraordinary_kind`)
  if (!marked.error) return { rows: marked.data || [], available: true }
  if (marked.error.code !== MISSING_COLUMN) throw new Error(marked.error.message)
  const plain = await build(columns)
  if (plain.error) throw new Error(plain.error.message)
  return { rows: plain.data || [], available: false }
}

export async function getExtraordinaryActsPanelData({ q = '', onlyMarked = false } = {}) {
  const supabase = await createClient()
  const from = madridDate(-PAST_DAYS)
  const to = madridDate(FUTURE_DAYS)

  const [outings, occurrences] = await Promise.all([
    readWithMark((columns) => supabase.from('outings').select(columns)
      .gte('outing_date', from).lte('outing_date', to).neq('status', 'archived')
      .order('outing_date').limit(1000),
    'id, title, outing_type, character, outing_date, departure_time, status, event_status, brotherhood_entity_id'),
    readWithMark((columns) => supabase.from('cult_occurrences').select(columns)
      .gte('start_date', from).lte('start_date', to)
      .order('start_date').limit(1000),
    'id, cult_id, start_date, title_override, event_status'),
  ])

  const cultIds = [...new Set(occurrences.rows.map((row) => row.cult_id).filter(Boolean))]
  const cults = cultIds.length
    ? await supabase.from('cults').select('id, title, cult_type, time_text, brotherhood_entity_id').in('id', cultIds)
    : { data: [] }
  if (cults.error) throw new Error(cults.error.message)
  const cultById = new Map((cults.data || []).map((row) => [row.id, row]))

  const entityIds = [...new Set([
    ...outings.rows.map((row) => row.brotherhood_entity_id),
    ...(cults.data || []).map((row) => row.brotherhood_entity_id),
  ].filter(Boolean))]
  const entities = entityIds.length
    ? await supabase.from('entities').select('id, name, slug').in('id', entityIds)
    : { data: [] }
  if (entities.error) throw new Error(entities.error.message)
  const entityById = new Map((entities.data || []).map((row) => [row.id, row]))

  const acts = [
    ...outings.rows.map((row) => ({
      table: 'outing',
      id: row.id,
      date: row.outing_date || '',
      time: String(row.departure_time || '').slice(0, 5),
      title: row.title || row.outing_type || 'Salida',
      type: row.character === 'extraordinary' ? `${row.outing_type || 'Salida'} · extraordinaria` : (row.outing_type || 'Salida'),
      brotherhood: entityById.get(row.brotherhood_entity_id)?.name || '',
      isDraft: row.status !== 'published',
      isCancelled: row.event_status === 'cancelled',
      kind: normalizeExtraordinaryKind(row.extraordinary_kind),
    })),
    ...occurrences.rows.map((row) => {
      const cult = cultById.get(row.cult_id) || {}
      return {
        table: 'occurrence',
        id: row.id,
        date: row.start_date || '',
        time: String(cult.time_text || '').match(/\d{1,2}:\d{2}/)?.[0] || '',
        title: row.title_override || cult.title || cult.cult_type || 'Culto',
        type: cult.cult_type || 'Culto',
        brotherhood: entityById.get(cult.brotherhood_entity_id)?.name || '',
        isDraft: false,
        isCancelled: row.event_status === 'cancelled',
        kind: normalizeExtraordinaryKind(row.extraordinary_kind),
      }
    }),
  ]

  const needle = fold(q).trim()
  const visible = acts
    .filter((act) => !onlyMarked || act.kind)
    .filter((act) => !needle || fold(`${act.title} ${act.brotherhood} ${act.type}`).includes(needle))
    .sort((a, b) => `${a.date}|${a.kind ? 0 : 1}|${a.time || '23:59'}`.localeCompare(`${b.date}|${b.kind ? 0 : 1}|${b.time || '23:59'}`))

  return {
    available: outings.available && occurrences.available,
    acts: visible.slice(0, 300),
    total: visible.length,
    markedCount: acts.filter((act) => act.kind).length,
  }
}
