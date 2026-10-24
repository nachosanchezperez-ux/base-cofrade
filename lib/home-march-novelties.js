const DEFAULT_WINDOW_HOURS = 48

function timestamp(value) {
  const parsed = value ? new Date(value).getTime() : 0
  return Number.isFinite(parsed) ? parsed : 0
}

function listLabel(names = []) {
  const clean = names.filter(Boolean)
  if (!clean.length) return ''
  if (clean.length === 1) return clean[0]
  if (clean.length === 2) return `${clean[0]} y ${clean[1]}`
  return `${clean.slice(0, -1).join(', ')} y ${clean.at(-1)}`
}

function dedicateesOfAll(marches = [], dedications = []) {
  const ids = new Set(marches.map((row) => row.id))
  const byDedicatee = new Map()
  for (const row of Array.isArray(dedications) ? dedications : []) {
    if (!row?.dedicatee_entity_id || !ids.has(row.march_entity_id)) continue
    if (!byDedicatee.has(row.dedicatee_entity_id)) byDedicatee.set(row.dedicatee_entity_id, new Set())
    byDedicatee.get(row.dedicatee_entity_id).add(row.march_entity_id)
  }
  return [...byDedicatee].filter(([, marchIds]) => marchIds.size === ids.size).map(([id]) => id)
}

export function buildRecentMarchPublicationThread(
  rows = [],
  { now = new Date(), windowHours = DEFAULT_WINDOW_HOURS, dedications = [] } = {}
) {
  const nowMs = now instanceof Date ? now.getTime() : timestamp(now)
  if (!Number.isFinite(nowMs)) return null

  const cutoff = nowMs - (Math.max(1, Number(windowHours) || DEFAULT_WINDOW_HOURS) * 60 * 60 * 1000)
  const recent = (Array.isArray(rows) ? rows : [])
    .filter((row) => row?.id && row?.name && row?.slug && row?.status === 'published' && row?.entity_type === 'march')
    .filter((row) => {
      const created = timestamp(row.created_at)
      return created >= cutoff && created <= nowMs
    })
    .sort((first, second) => timestamp(second.created_at) - timestamp(first.created_at))

  if (!recent.length) return null

  const newest = recent[0]
  const count = recent.length
  const previewNames = recent.slice(0, 3).map((row) => row.name)
  const remaining = Math.max(0, count - previewNames.length)
  const preview = listLabel(previewNames)

  if (count === 1) {
    return {
      id: `march-publications:${newest.id}:march_publications`,
      activityKind: 'march_publications',
      activityStatus: 'NUEVO',
      label: 'Marcha → nueva incorporación',
      title: newest.name,
      metric: 'Nueva ficha publicada',
      summary: 'Una nueva marcha se incorpora al catálogo y queda disponible para conectarse con sus autores, dedicatorias, bandas, grabaciones y crucetas.',
      path: ['Marcha', 'Autores', 'Crucetas'],
      href: `/marchas/${newest.slug}`,
      cta: 'Abrir la marcha →',
      latestAt: newest.created_at,
    }
  }

  return {
    id: `march-publications:${newest.id}:march_publications`,
    activityKind: 'march_publications',
    activityStatus: 'NUEVO',
    label: 'Marchas → nuevas incorporaciones',
    title: `${count} nuevas marchas`,
    metric: `${count} fichas incorporadas`,
    summary: `El catálogo suma ${preview}${remaining ? ` y ${remaining} más` : ''}, ya disponibles para seguir sus autores, dedicatorias, bandas, grabaciones y crucetas.`,
    path: ['Marchas', 'Nuevas incorporaciones', 'Autores + crucetas'],
    href: '/marchas',
    cta: 'Explorar nuevas marchas →',
    // Títulos sueltos para la portada: un título puede llevar comas («De Rosario, de Esperanza»).
    marchNames: previewNames,
    marchCount: count,
    // Hermandades a las que están dedicadas todas estas marchas: la portada
    // las cuenta dentro de su patrimonio musical en vez de anunciarlas aparte.
    marchDedicateeIds: dedicateesOfAll(recent, dedications),
    latestAt: newest.created_at,
  }
}
