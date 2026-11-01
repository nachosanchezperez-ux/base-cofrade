import { publicSourceScope } from '@/lib/public-source-scope'
import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'
import { outingMusicSection } from '@/lib/outing-music-sections'
import { getOutingTemporalState } from '@/lib/outing-temporal-state'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function relationOne(value) {
  if (Array.isArray(value)) return value[0] || null
  return value || null
}

function timeLabel(value) {
  return value ? String(value).slice(0, 5) : ''
}

function entityHref(entity) {
  if (!entity?.slug || entity.status !== 'published') return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function assetPublicUrl(supabase, storagePath = '') {
  if (!storagePath) return ''
  if (storagePath.startsWith('/')) return storagePath
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) return storagePath
  return supabase.storage.from('hilo-media').getPublicUrl(storagePath).data.publicUrl || ''
}

function journeyPhases(route) {
  if (!route || typeof route !== 'object' || !Array.isArray(route.phases)) return []

  return route.phases
    .map((phase, index) => ({
      id: String(phase?.id || `phase-${index + 1}`),
      eyebrow: String(phase?.eyebrow || ''),
      title: String(phase?.title || '¶»§q«^