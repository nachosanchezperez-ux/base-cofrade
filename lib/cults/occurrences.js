const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

function dateParts(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''))
  if (!match) return null
  return { month: Number(match[2]), day: Number(match[3]) }
}

export function formatCultOccurrenceDate(startDate, endDate = startDate) {
  const start = dateParts(startDate)
  if (!start) return ''
  // Sin fecha de fin (culto de un día), solo la de inicio: nunca «8–8 NOV».
  const end = dateParts(endDate) || start
  if (!endDate || startDate === endDate) return `${start.day} ${MONTHS[start.month - 1]}`
  if (start.month === end.month) return `${start.day}–${end.day} ${MONTHS[start.month - 1]}`
  return `${start.day} ${MONTHS[start.month - 1]}–${end.day} ${MONTHS[end.month - 1]}`
}

export function formatCultOccurrenceSchedule(days = []) {
  return [...new Set(days.map((day) => {
    if (day.time_text) return day.time_text
    const match = /^(\d{2}):(\d{2})/.exec(String(day.start_time || ''))
    return match ? `${match[1]}:${match[2]} h` : ''
  }).filter(Boolean))].join(' · ')
}

export function nextCultOccurrence(occurrences = [], cultId) {
  return occurrences.find((occurrence) => occurrence.cult_id === cultId) || null
}
