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

export function sortHolyWeekAccompaniments(items = []) {
  return [...items].sort((a, b) => {
    const aIndex = HOLY_WEEK_OUTING_ORDER.indexOf(a.outingType)
    const bIndex = HOLY_WEEK_OUTING_ORDER.indexOf(b.outingType)
    return aIndex - bIndex
  })
}

export function sortGloryAccompaniments(items = []) {
  return [...items].sort((a, b) => (
    (a.brotherhoodName || '').localeCompare(b.brotherhoodName || '', 'es')
  ))
}
