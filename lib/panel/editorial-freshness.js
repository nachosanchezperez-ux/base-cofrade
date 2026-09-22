import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  EDITORIAL_FRESHNESS_TYPES,
  editorialFreshnessStatus,
  freshnessCutoffs,
} from '@/lib/editorial-freshness'

const PAGE_SIZE = 100
const PRIORITY_LEVELS = ['urgent', 'high', 'medium', 'normal']
const SORTS = ['priority', 'review', 'updated', 'name']

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result
}

function countQuery(supabase) {
  return supabase
    .from('entities')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .in('entity_type', EDITORIAL_FRESHNESS_TYPES)
}

function priorityCountQuery(supabase) {
  return supabase
    .from('entity_editorial_priority')
    .select('*', { count: 'exact', head: true })
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

export async function getPanelEditorialFreshnessSummary(now = new Date()) {
  const supabase = await createClient()
  const [total, unreviewed, fresh, due, stale] = await Promise.all([
    countQuery(supabase),
    applyFreshness(countQuery(supabase), 'unreviewed', now),
    applyFreshness(countQuery(supabase), 'fresh', now),
    applyFreshness(countQuery(supabase), 'due', now),
    applyFreshness(countQuery(supabase), 'stale', now),
  ])

  return {
    total: assertQuery(total, 'No se pudo contar la cola editorial').count || 0,
    unreviewed: assertQuery(unreviewed, 'No se pudo contar las fichas sin revisar').count || 0,
    fresh: assertQuery(fresh, 'No se pudo contar las fichas al día').count || 0,
    due: assertQuery(due, 'No se pudo contar las fichas próximas a revisión').count || 0,
    stale: assertQuery(stale, 'No se pudo contar las fichas vencidas').count || 0,
  }
}

export async function getPanelEditorialPrioritySummary() {
  const supabase = await createClient()
  const [urgent, high, medium, normal] = await Promise.all(
    PRIORITY_LEVELS.map((level) => priorityCountQuery(supabase).eq('priority_level', level))
  )

  return {
    urgent: assertQuery(urgent, 'No se pudo contar la prioridad urgente').count || 0,
    high: assertQuery(high, 'No se pudo contar la prioridad alta').count || 0,
    medium: assertQuery(medium, 'No se pudo contar la prioridad media').count || 0,
    normal: assertQuery(normal, 'No se pudo contar la prioridad normal').count || 0,
  }
}

export async function getPanelEditorialFreshness({
  query = '',
  entityType = '',
  freshness = '',
  priority = '',
  sort = 'priority',
  page = 1,
  now = new Date(),
} = {}) {
  const supabase = await createClient()
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1)
  const safeSort = SORTS.includes(sort) ? sort : 'priority'
  const from = (safePage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let request = supabase
    .from('entity_editorial_priority')
    .select(
      'id, entity_type, name, slug, status, updated_at, content_updated_at, editorial_reviewed_at, relation_count, source_count, next_activity_date, future_activity_count, update_age_days, review_age_days, priority_score, priority_level',
      { count: 'exact' }
    )

  if (query) request = request.ilike('name', `%${query}%`)
  if (EDITORIAL_FRESHNESS_TYPES.includes(entityType)) request = request.eq('entity_type', entityType)
  if (PRIORITY_LEVELS.includes(priority)) request = request.eq('priority_level', priority)
  request = applyFreshness(request, freshness, now)

  if (safeSort === 'priority') {
    request = request
      .order('priority_score', { ascending: false })
      .order('next_activity_date', { ascending: true, nullsFirst: false })
      .order('relation_count', { ascending: false })
      .order('name')
  } else if (safeSort === 'review') {
    request = request
      .order('editorial_reviewed_at', { ascending: true, nullsFirst: true })
      .order('priority_score', { ascending: false })
      .order('name')
  } else if (safeSort === 'updated') {
    request = request
      .order('updated_at', { ascending: false })
      .order('priority_score', { ascending: false })
      .order('name')
  } else {
    request = request.order('name')
  }

  const result = assertQuery(
    await request.range(from, to),
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
    sort: safeSort,
  }
}
