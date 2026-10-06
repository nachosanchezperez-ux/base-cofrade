const DAY_DEFINITIONS = [
  ['viernes-de-dolores', 'Viernes de Dolores'],
  ['sabado-de-pasion', 'Sábado de Pasión'],
  ['domingo-de-ramos', 'Domingo de Ramos'],
  ['lunes-santo', 'Lunes Santo'],
  ['martes-santo', 'Martes Santo'],
  ['miercoles-santo', 'Miércoles Santo'],
  ['jueves-santo', 'Jueves Santo'],
  ['madruga', 'Madrugá'],
  ['viernes-santo', 'Viernes Santo'],
  ['sabado-santo', 'Sábado Santo'],
  ['domingo-de-resurreccion', 'Domingo de Resurrección'],
]

export const SEMANA_SANTA_DAYS = DAY_DEFINITIONS.map(([slug, label], index) => ({
  slug,
  label,
  order: index,
}))

export function normalizeMusicChangeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function canonicalSemanaSantaDay(value = '') {
  const normalized = normalizeMusicChangeText(value)
  if (!normalized) return ''

  const aliases = [
    ['viernes de dolores', 'Viernes de Dolores'],
    ['sabado de pasion', 'Sábado de Pasión'],
    ['domingo de ramos', 'Domingo de Ramos'],
    ['lunes santo', 'Lunes Santo'],
    ['martes santo', 'Martes Santo'],
    ['miercoles santo', 'Miércoles Santo'],
    ['jueves santo', 'Jueves Santo'],
    ['madruga', 'Madrugá'],
    ['madrugada', 'Madrugá'],
    ['viernes santo', 'Viernes Santo'],
    ['sabado santo', 'Sábado Santo'],
    ['domingo de resurreccion', 'Domingo de Resurrección'],
  ]

  return aliases.find(([needle]) => normalized.includes(needle))?.[1] || ''
}

export function musicChangeDaySlug(value = '') {
  const canonical = canonicalSemanaSantaDay(value) || value
  return SEMANA_SANTA_DAYS.find((day) => day.label === canonical)?.slug || ''
}

export function musicChangeKind({ position = '', previousBandName = '' } = {}) {
  const normalizedPosition = normalizeMusicChangeText(position)
  if (normalizedPosition.includes('cruz de guia')) return 'cruz-guia'
  return previousBandName ? 'relevo' : 'incorporacion'
}

export function musicChangeKindLabel(kind = '') {
  if (kind === 'cruz-guia') return 'Cambio en Cruz de Guía'
  if (kind === 'incorporacion') return 'Nueva incorporación'
  return 'Relevo de banda'
}

export function musicChangePositionLabel({ stepName = '', position = '' } = {}) {
  const label = String(position || '').trim()
  const normalizedPosition = normalizeMusicChangeText(label)
  const normalizedStep = normalizeMusicChangeText(stepName)

  if (!normalizedPosition || normalizedPosition === normalizedStep) return ''
  if (!normalizedStep.startsWith('paso ')) return label

  // Only shorten an exact repetition. Keep direction and any extra context,
  // including shared accompaniments, route notes and differing public names.
  const repetitions = [
    [`tras el ${normalizedStep}`, 'Tras el paso'],
    [`detras del ${normalizedStep}`, 'Detrás del paso'],
    [`delante del ${normalizedStep}`, 'Delante del paso'],
  ]
  const subject = normalizedStep.match(/^paso(?: de (?:palio|misterio))? de(l)? (.+)$/)
  if (subject) {
    repetitions.push([
      `tras ${subject[1] ? 'el ' : ''}${subject[2]}`,
      'Tras el paso',
    ])
  }

  return repetitions.find(([text]) => text === normalizedPosition)?.[1] || label
}

export function sortMusicChanges(items = []) {
  const dayOrder = new Map(SEMANA_SANTA_DAYS.map((day) => [day.label, day.order]))
  return [...items].sort((a, b) => {
    const aOrder = dayOrder.get(a.day) ?? 999
    const bOrder = dayOrder.get(b.day) ?? 999
    if (aOrder !== bOrder) return aOrder - bOrder

    const byBrotherhood = String(a.brotherhoodName || '').localeCompare(
      String(b.brotherhoodName || ''),
      'es',
      { sensitivity: 'base' },
    )
    if (byBrotherhood) return byBrotherhood

    return String(a.position || '').localeCompare(String(b.position || ''), 'es', {
      sensitivity: 'base',
    })
  })
}
