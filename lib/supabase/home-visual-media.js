import 'server-only'

import { createClient } from '@/lib/supabase/public-server'

const PUBLIC_RIGHTS_STATUSES = ['owned', 'authorized', 'licensed', 'public_domain']

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function publicPath(supabase, value = '') {
  if (!value || value.startsWith('/') || /^https?:\/\//i.test(value)) return value
  return supabase.storage.from('hilo-media').getPublicUrl(value).data.publicUrl
}

function entityHref(entity) {
  if (!entity?.slug) return ''
  if (entity.entity_type === 'brotherhood') return `/hermandades/${entity.slug}`
  if (entity.entity_type === 'image') return `/imagenes/${entity.slug}`
  if (entity.entity_type === 'step') return `/pasos/${entity.slug}`
  if (entity.entity_type === 'band') return `/bandas/${entity.slug}`
  return ''
}

function safePercent(value, fallback = 50) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : fallback
}

export async function getHomeVisualMediaMap(entityIds = []) {
  const ids = [...new Set((entityIds || []).filter(Boolean))]
  if (!ids.length) return new Map()

  try {
    const supabase = createClient()
    const entities = assertRows(
      await supabase
        .from('entities')
        .select('id, entity_type, name, slug')
        .in('id', ids)
        .eq('status', 'published'),
      'No se pudieron consultar las entidades visuales de la Home'
    )
    if (!entities.length) return new Map()

    const entityById = new Map(entities.map((entity) => [entity.id, entity]))
    const publishedIds = entities.map((entity) => entity.id)

    const relations = assertRows(
      await supabase
        .from('entity_media')
        .select('entity_id, media_asset_id, sort_order, focus_x, focus_y, mobile_focus_x, mobile_focus_y, fit_mode')
        .in('entity_id', publishedIds)
        .eq('is_cover', true)
        .order('sort_order', { ascending: true }),
      'No se pudieron consultar las portadas visuales de la Home'
    )

    const mediaIds = [...new Set(relations.map((row) => row.media_asset_id).filter(Boolean))]
    const mediaRows = mediaIds.length
      ? assertRows(
          await supabase
            .from('media_assets')
            .select('id, storage_path, title, alt_text, author_name, source_name, rights_status')
            .in('id', mediaIds)
            .eq('media_type', 'image')
            .in('rights_status', PUBLIC_RIGHTS_STATUSES),
          'No se pudieron consultar los recursos visuales públicos de la Home'
        )
      : []

    const mediaById = new Map(mediaRows.map((row) => [row.id, row]))
    const visualByEntity = new Map()

    for (const relation of relations) {
      if (visualByEntity.has(relation.entity_id)) continue
      const entity = entityById.get(relation.entity_id)
      const media = mediaById.get(relation.media_asset_id)
      if (!entity || !media?.storage_path) continue

      const focusX = safePercent(relation.focus_x)
      const focusY = safePercent(relation.focus_y)
      const sourceName = media.source_name || ''
      const creditName = media.author_name || (/^hermandad\b/i.test(sourceName) ? sourceName : '')
      visualByEntity.set(entity.id, {
        entityId: entity.id,
        entityType: entity.entity_type,
        name: entity.name,
        href: entityHref(entity),
        path: publicPath(supabase, media.storage_path),
        alt: media.alt_text || media.title || entity.name,
        credit: creditName ? `Fotografía • ${creditName}` : '',
        kind: 'photo',
        fitMode: relation.fit_mode || 'cover',
        focusPosition: `${focusX}% ${focusY}%`,
      })
    }

    const missingBrotherhoodIds = entities
      .filter((entity) => entity.entity_type === 'brotherhood' && !visualByEntity.has(entity.id))
      .map((entity) => entity.id)
    const missingBandIds = entities
      .filter((entity) => entity.entity_type === 'band' && !visualByEntity.has(entity.id))
      .map((entity) => entity.id)

    const [brotherhoodRows, bandRows] = await Promise.all([
      missingBrotherhoodIds.length
        ? assertRows(
            await supabase.from('brotherhoods').select('entity_id, crest_path').in('entity_id', missingBrotherhoodIds),
            'No se pudieron consultar los escudos de la Home'
          )
        : [],
      missingBandIds.length
        ? assertRows(
            await supabase.from('bands').select('entity_id, logo_path').in('entity_id', missingBandIds),
            'No se pudieron consultar los logotipos de la Home'
          )
        : [],
    ])

    for (const row of brotherhoodRows) {
      if (!row.crest_path || visualByEntity.has(row.entity_id)) continue
      const entity = entityById.get(row.entity_id)
      if (!entity) continue
      visualByEntity.set(entity.id, {
        entityId: entity.id,
        entityType: entity.entity_type,
        name: entity.name,
        href: entityHref(entity),
        path: publicPath(supabase, row.crest_path),
        alt: `Escudo de ${entity.name}`,
        credit: '',
        kind: 'crest',
        fitMode: 'contain',
        focusPosition: '50% 50%',
      })
    }

    for (const row of bandRows) {
      if (!row.logo_path || visualByEntity.has(row.entity_id)) continue
      const entity = entityById.get(row.entity_id)
      if (!entity) continue
      visualByEntity.set(entity.id, {
        entityId: entity.id,
        entityType: entity.entity_type,
        name: entity.name,
        href: entityHref(entity),
        path: publicPath(supabase, row.logo_path),
        alt: `Logotipo de ${entity.name}`,
        credit: '',
        kind: 'logo',
        fitMode: 'contain',
        focusPosition: '50% 50%',
      })
    }

    return visualByEntity
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron resolver los recursos visuales de la Home', {
      error: error instanceof Error ? error.message : String(error),
    })
    return new Map()
  }
}
