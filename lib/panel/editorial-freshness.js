import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  EDITORIAL_FRESHNESS_TYPES,
  editorialFreshnessStatus,
  freshnessCutoffs,
} from '@/lib/editorial-freshness'

const PAGE_SIZE = 100

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result
}

function baseQuery(supabase, select = 'id') {
  return supabase
    .from('entities')
    .select(select, { count: 'exact' })
    .eq('status', 'published')
    .in('entity_type', EDITORIAL_FRESHNESS_TYPES)
}

function applyFreshness(query, freshness, now = new Date()) {
  const cutoffs = freshnessCutoffs(now)
  if (freshness === 'unreviewed') return query.is('editorial_reviewed_at', null)
  if (freshness === 'fresh') return query.gte('editorial_reviewed_at', cutoffs.fresh)
  if (freshness === 'due') {
    return query
      .gte('editorial_reviewed_at', cutoffs.stale)
      .lt('editorial_reviewed_at', cutoffs.fresh)
  }
  if (freshness === 'stale') return query.lt('editorial_reviewed_at', cutoffs.stale)
  return query
}

async function countFreshness(supabase, freshness, now) {
  const result = await applyFreshness(
    baseQuery(supabase, '*').select('*', { count: 'exact', head: true }),
    freshness,
    now,
  )
  return assertQuery(result, `No se pudo contar el estado editorial ${freshness}`).count || 0
}

export async function getPanelEditorialFreshnessSummary(now = new Date()) {
  const supabase = await createClient()
  const [total, unreviewed, fresh, due, stale] = await Promise.all([
    baseQuery(supabase, '*').select('*', { count: 'exact', head: true }),
    applyFreshness(baseQuery(supabase, '*').select('*', { count: 'exact', head: true }), 'unreviewed', now),
    applyFreshness(baseQuery(supabase, '*').select('*', { count: 'exact', head: true }), 'fresh', now),
    applyFreshness(baseQuery(supabase, '*').select('*', { count: 'exact', head: true }), 'due', now),
    applyFreshness(baseQuery(supabase, '*').select('*', { count: 'exact', head: true }), 'stale', now),
  ])

  return {
    total: assertQuery(total, 'No se pudo contar la cola editorial').count || 0,
    unreviewed: assertQuery(unreviewed, 'No se pudo contar las fichas sin revisar').count || 0,
    fresh: assertQuery(fresh, 'No se pudo contar las fichas al día').count || 0,
    due: assertQuery(due, 'No se pudo contar las fichas próximas a revisión').count || 0,
    stale: assertQuery(stale, 'No se pudo contar las fichas vencidas').count || 0,
  }
}

export async function getPanelEditorialFreshness({
  query = '',
  entityType = '',
  freshness = '',
  page = 1,
  now = new Date(),
} = {}) {
  const supabase = await createClient()
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1)
  const from = (safePage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let request = supabase
    .from('entities')
    .select('id, entity_type, name, slug, status, updated_at, content_updated_at, editorial_reviewed_at', { count: 'exact' })
    .eq('status', 'published')
    .in('entity_type', EDITORIAL_FRESHNESS_TYPES)

  if (query) request = request.ilike('name', `%${query}%`)
  if (EDITORIAL_FRESHNESS_TYPES.includes(entityType)) request = request.eq('entity_type', entityType)
  request = applyFreshness(request, freshness, now)

  if (freshness === 'fresh') {
    request = request.order('editorial_reviewed_at', { ascending: false, nullsFirst: false })
  } else {
    request = request.order('editorial_reviewed_at', { ascending: true, nullsFirst: true })
  }

  const result = assertQuery(
    await request.order('name').range(from, to),
    'No se pudo cargar la cola de frescura editorial'
  )
  const total = result.count || 0

  return {
    items: (result.data || []).map((item) => ({
      ...item,
      freshness: editorialFreshnessStatus(item.editorial_reviewed_at, now),
    })),
    total,
    page: safePage,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  }
}
