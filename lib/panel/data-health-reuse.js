import 'server-only'

import { createClient } from '@/lib/supabase/server'

export async function getHealthSourceReuseCandidates(entityIds = []) {
  const ids = [...new Set((entityIds || []).map((value) => String(value || '').trim()).filter(Boolean))]
  if (!ids.length) return new Map()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('source_links')
    .select('entity_id, source_id, scope, sources(id, name, url, source_type)')
    .in('entity_id', ids)
    .like('scope', 'relation:%')

  if (error) throw new Error(`No se pudieron cargar las Fuentes reutilizables: ${error.message}`)

  const result = new Map()
  for (const row of data || []) {
    const source = Array.isArray(row.sources) ? row.sources[0] : row.sources
    if (!source?.id || !row.entity_id) continue
    const list = result.get(row.entity_id) || []
    if (!list.some((item) => item.id === source.id)) {
      list.push({
        id: source.id,
        name: source.name,
        url: source.url,
        sourceType: source.source_type,
        relationScope: row.scope,
      })
    }
    result.set(row.entity_id, list)
  }

  for (const list of result.values()) {
    list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'es'))
  }

  return result
}
