export const HOLY_WEEK_OUTING_ORDER = [
  'Viernes de Dolores',
  'Sábado de Pasión',
  'Domingo de Ramos',
  'Lunes Santo',
  'Martes Santo',
  'Miércoles Santo',
  'Jueves Santo',
  'Madrugada',
  'Viernes Santo',
  'Sábado Santo',
  'Domingo de Resurrección',
]

export function splitCurrentAccompaniments(items = []) {
  return items.reduce((groups, item) => {
    const target = HOLY_WEEK_OUTING_ORDER.includes(item.outingType)
      ? groups.holyWeek
      : groups.glories
    target.push(item)
    return groups
  }, { holyWeek: [], glories: [] })
}

export function partitionAccompanimentsBySeason(currentItems = [], historicalItems = [], currentYear) {
  const seasonYear = Number(currentYear)
  const hasValidSeason = Number.isInteger(seasonYear)
  const endedItems = hasValidSeason
    ? currentItems.filter((item) => item.yearTo && item.yearTo < seasonYear)
    : []

  return {
    current: hasValidSeason
      ? currentItems.filter((item) => !item.yearTo || item.yearTo >= seasonYear)
      : [...currentItems],
    historical: [...historicalItems, ...endedItems],
  }
}

export function sortHolyWeekAccompaniments(items = []) {
  return [...items].sort((a, b) => {
    const aIndex = HOLY_WEEK_OUTING_ORDER.indexOf(a.outingType)
    const bIndex = HOLY_WEEK_OUTING_ORDER.indexOf(b.outingType)
    return aIndex - bIndex
  })
}

export function sortGloryAccompaniments(items = []) {
  return [...items].sort((a, b) => (
    (a.municipality || '').localeCompare(b.municipality || '', 'es')
    || (a.brotherhoodName || '').localeCompare(b.brotherhoodName || '', 'es')
  ))
}

export function resolveAccompanimentLocation(period = {}, brotherhood = null, municipality = null) {
  return {
    brotherhoodTypes: brotherhood?.brotherhood_types || [],
    municipality: municipality?.name || period.public_municipality_name || '',
    municipalitySlug: municipality?.slug || period.public_municipality_slug || '',
    province: municipality?.province || period.public_province || '',
  }
}

export function groupGloryAccompaniments(items = []) {
  const ordered = sortGloryAccompaniments(items)
  const groups = [
    {
      key: 'sevilla-capital',
      label: 'Sevilla capital',
      detail: 'Acompañamientos en la ciudad de Sevilla',
      items: ordered.filter((item) => item.municipalitySlug === 'sevilla'),
    },
    {
      key: 'provincia-sevilla',
      label: 'Provincia de Sevilla',
      detail: 'Acompañamientos en los municipios de la provincia',
      items: ordered.filter((item) => item.municipalitySlug !== 'sevilla' && item.province === 'Sevilla'),
    },
    {
      key: 'otros-ambitos',
      label: 'Otros ámbitos',
      detail: 'Acompañamientos fuera de la provincia de Sevilla',
      items: ordered.filter((item) => item.municipalitySlug && item.province && item.province !== 'Sevilla'),
    },
    {
      key: 'por-documentar',
      label: 'Localidad por documentar',
      detail: 'Acompañamientos pendientes de ubicación',
      items: ordered.filter((item) => !item.municipalitySlug),
    },
  ]

  return groups.filter((group) => group.items.length > 0)
}

export function summarizeGloryTypes(items = []) {
  const labels = new Map([
    ['Procesión de gloria', 'Procesiones de gloria'],
    ['Procesión eucarística', 'Procesiones eucarísticas'],
    ['Procesión extraordinaria', 'Procesiones extraordinarias'],
  ])
  const counts = new Map()

  items.forEach((item) => {
    const type = item.outingType || 'Otra salida procesional'
    counts.set(type, (counts.get(type) || 0) + 1)
  })

  return [...counts.entries()]
    .map(([type, count]) => ({ type, label: labels.get(type) || type, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'es'))
}
