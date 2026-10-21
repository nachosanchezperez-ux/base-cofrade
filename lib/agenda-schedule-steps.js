// Horarios por tramos de una cita (#agenda-hoy): Salida, Carrera oficial,
// Entrada… a partir de `item.schedule` (outing_schedule_items). Módulo puro.

const text = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

function clock(row = {}) {
  const time = text(row.time).slice(0, 5)
  if (/^\d{2}:\d{2}$/.test(time)) return time
  const match = text(row.timeText).match(/\b(\d{1,2})[:.](\d{2})\b/)
  return match ? `${match[1].padStart(2, '0')}:${match[2]}` : ''
}

// Tramos con hora, en su orden, sin repetir etiqueta. Solo del día del acto
// (o sin fecha propia), para no mezclar el regreso del día siguiente.
export function agendaScheduleSteps(item = {}, { max = 4 } = {}) {
  const rows = Array.isArray(item.schedule) ? item.schedule : []
  const seen = new Set()
  const steps = []
  for (const row of rows) {
    const label = text(row.label)
    const time = clock(row)
    if (!label || !time || seen.has(label.toLocaleLowerCase('es'))) continue
    if (row.date && item.date && row.date !== item.date) continue
    seen.add(label.toLocaleLowerCase('es'))
    steps.push({ label, time })
    if (steps.length >= max) break
  }
  return steps
}

export function madridMinutes(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now)
  const value = (type) => Number(parts.find((part) => part.type === type)?.value || 0)
  return value('hour') * 60 + value('minute')
}

// El próximo tramo a partir de ahora (mismo día), o null.
export function nextScheduleStep(item = {}, nowMinutes = 0) {
  return agendaScheduleSteps(item, { max: 12 }).find((step) => {
    const [hours, minutes] = step.time.split(':').map(Number)
    return hours * 60 + minutes >= nowMinutes
  }) || null
}
