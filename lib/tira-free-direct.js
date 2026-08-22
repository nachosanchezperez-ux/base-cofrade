export function normalizeFreeDirectText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function dedicationTypeLabel(value = '') {
  const type = normalizeFreeDirectText(value).replace(/\s+/g, '_')
  if (!type) return ''
  if (type === 'dedicated_to') return 'Dedicada a'
  if (type === 'associated_with') return 'Vinculada a'
  if (type === 'in_honor_of') return 'En honor de'
  return String(value || '').trim().replace(/_/g, ' ')
}

export function freeDirectIntent(question = '', contextEntityType = '') {
  const q = normalizeFreeDirectText(question)
  if (!q) return null

  const dedication = /\b(dedicad[ao]s?|dedicatoria|a quien esta dedicad[ao]|a que esta dedicad[ao])\b/.test(q)
  if (dedication) return 'march_dedication'

  const premiere = /\b(cuando se estreno|cuando fue estrenad[ao]|donde se estreno|quien estreno|estreno de|fecha de estreno|primera interpretacion)\b/.test(q)
  if (premiere) return 'march_premiere'

  const compositionDate = /\b(de que ano es|que ano es|en que ano se compuso|cuando se compuso|cuando fue compuest[ao]|fecha de composicion|ano de composicion|de cuando es)\b/.test(q)
  if (compositionDate) return 'march_composition_date'

  const musicType = /\b(que tipo de marcha|tipo de marcha|que clase de marcha|modalidad de marcha)\b/.test(q)
  if (musicType) return 'march_type'

  if (contextEntityType === 'march') {
    if (/^a quien\b|^a que\b/.test(q)) return 'march_dedication'
    if (/^cuando\b|^en que ano\b|^de que ano\b|^de cuando\b/.test(q)) return 'march_composition_date'
  }

  return null
}
