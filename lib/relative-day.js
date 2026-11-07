// «Hoy», «Mañana» o «En 3 días» para una fecha (YYYY-MM-DD) respecto a hoy en
// Madrid. Fechas pasadas o sin formato: '' (quien llama decide el texto).
export function madridDateKey(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

export function daysUntil(date = '', today = madridDateKey()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{4}-\d{2}-\d{2}$/.test(today)) return null
  return Math.round((Date.parse(`${date}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86400000)
}

export function relativeDayLabel(date = '', today = madridDateKey(), { maxDays = Infinity } = {}) {
  const days = daysUntil(date, today)
  if (days === null || days < 0 || days > maxDays) return ''
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Mañana'
  return `En ${days} días`
}
