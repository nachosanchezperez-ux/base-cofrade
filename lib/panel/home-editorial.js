import 'server-only'

import { createClient } from '@/lib/supabase/server'

const EDITORIAL_TYPES = new Set(['fact', 'curiosity'])
const OVERRIDE_TYPES = new Set(['ephemeris', 'fact', 'curiosity', 'march'])

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

export function madridDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const get = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

function entityOption(entity, label = '') {
  return { id: entity.id, name: entity.name, slug: entity.slug || '', meta: [label || entity.entity_type, entity.status].filter(Boolean).join(' · ') }
}

export async function getHomeEditorialPanelData({ date = '' } = {}) {
  const supabase = await createClient()
  const selectedDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : madridDateKey()
  const [
    overridesResult,
    editorialResult,
    entitiesResult,
    eventsResult,
    marchesResult,
  ] = await Promise.all([
    supabase.from('daily_overrides').select('*').eq('publish_date', selectedDate).order('sort_order'),
    supabase.from('editorial_content').select('*').in('content_type', [...EDITORIAL_TYPES]).neq('status', 'archived').order('updated_at', { ascending: false }),
    supabase.from('entities').select('id, entity_type, name, slug, status').in('entity_type', ['brotherhood', 'image', 'step', 'band', 'agent', 'heritage_asset']).neq('status', 'archived').order('name'),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'event').neq('status', 'archived').order('name'),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'march').neq('status', 'archived').order('name'),
  ])

  const overrides = rows(overridesResult, 'No se pudo cargar la programación manual de la Home')
  const editorial = rows(editorialResult, 'No se pudieron cargar los contenidos editoriales')
  const entities = rows(entitiesResult, 'No se pudieron cargar las entidades relacionables')
  const events = rows(eventsResult, 'No se pudieron cargar los Acontecimientos')
  const marches = rows(marchesResult, 'No se pudieron cargar las Marchas')

  const editorialIds = editorial.map((item) => item.id)
  const links = editorialIds.length
    ? rows(
        await supabase.from('editorial_content_links').select('*').in('editorial_content_id', editorialIds).order('is_primary', { ascending: false }),
        'No se pudieron cargar las relaciones editoriales'
      )
    : []
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))

  return {
    selectedDate,
    overrideTypes: [...OVERRIDE_TYPES],
    overrides,
    overrideByType: new Map(overrides.map((item) => [item.content_type, item])),
    editorial: editorial.map((item) => ({
      ...item,
      links: links
        .filter((link) => link.editorial_content_id === item.id)
        .map((link) => ({ ...link, entity: entityById.get(link.entity_id) || null }))
        .filter((link) => link.entity),
    })),
    entityOptions: entities.map((entity) => entityOption(entity)),
    eventOptions: events.map((event) => entityOption(event, 'Acontecimiento')),
    marchOptions: marches.map((march) => entityOption(march, 'Marcha')),
  }
}
