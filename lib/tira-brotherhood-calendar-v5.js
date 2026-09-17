export function normalizeBrotherhoodCalendarText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const MONTHS = [
  ['enero', 1], ['febrero', 2], ['marzo', 3], ['abril', 4], ['mayo', 5], ['junio', 6],
  ['julio', 7], ['agosto', 8], ['septiembre', 9], ['setiembre', 9], ['octubre', 10],
  ['noviembre', 11], ['diciembre', 12],
]

export function brotherhoodCalendarMonth(question = '') {
  const q = normalizeBrotherhoodCalendarText(question)
  return MONTHS.find(([label]) => q.includes(label))?.[1] || null
}

export function brotherhoodCalendarV5Intent(question = '', context = null) {
  const q = normalizeBrotherhoodCalendarText(question)
  if (!q) return null
  const brotherhoodContext = context?.entityType === 'brotherhood'

  const history = /\b(historia|historico|historicos|historica|historicas|hito|hitos|acontecimiento|acontecimientos|efemeride|efemerides)\b/.test(q)
  if (history) return { kind: 'brotherhood_history' }

  const cults = /\b(culto|cultos|quinario|quinarios|triduo|triduos|novena|novenas|besamanos|besapies|funcion|funciones|misa|misas|eucaristia|eucaristias)\b/.test(q)
  const upcoming = /\b(proxim|queda|quedan|siguiente|siguientes|futuro|futuros|anunciad|pendiente|pendientes|por celebrar)\w*/.test(q)
    || /\b(que tiene ahora|que tiene proximamente|que viene|lo proximo)\b/.test(q)
  const temporal = /\b(este mes|esta semana|hoy|manana)\b/.test(q) || Boolean(brotherhoodCalendarMonth(q))

  if (upcoming || (cults && temporal)) return { kind: 'brotherhood_upcoming' }
  if (cults) return { kind: 'brotherhood_cults' }
  if (brotherhoodContext && /^(y )?(los |sus )?(proximos|siguientes|que queda|que viene)/.test(q)) return { kind: 'brotherhood_upcoming' }
  if (brotherhoodContext && /^(y )?(su )?historia/.test(q)) return { kind: 'brotherhood_history' }
  return null
}

export function dateRangeMatchesMonth(startDate = '', endDate = '', month) {
  if (!month || !startDate) return true
  const start = new Date(`${startDate}T00:00:00Z`)
  const end = new Date(`${endDate || startDate}T00:00:00Z`)
  if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) return false
  const year = start.getUTCFullYear()
  const monthStart = new Date(Date.UTC(year, month - 1, 1))
  const monthEnd = new Date(Date.UTC(year, month, 0))
  return start <= monthEnd && end >= monthStart
}
