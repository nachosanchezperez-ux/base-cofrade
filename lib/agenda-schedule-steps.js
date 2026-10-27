import { madridNow, daysUntil } from './agenda-clock.js'

// Horarios por tramos de una cita (#agenda-hoy): Salida, Carrera oficial,
// Entrada… a partir de `item.schedule` (outing_schedule_items). Módulo puro.

const text = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

function clock(row = {}) {
  const time = text(row.time).slice(0, 5)
  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return time
  // Una frase aproximada se conserva literalmente; no es una hora confirmada.
  const match = text(row.timeText).match(/^([01]?\d|2[0-3])[:.]([0-5]\d)(?:\s*h\.?)?$/i)
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
    if (!label || (!time && !text(row.timeText)) || seen.has(label.toLocaleLowerCase('es'))) continue
    if (row.date && item.date && row.date !== item.date) continue
    seen.add(label.toLocaleLowerCase('es'))
    steps.push(time ? { label, time } : { label, time: text(row.timeText), approximate: true })
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
    if (step.approximate) return false
    const [hours, minutes] = step.time.split(':').map(Number)
    return hours * 60 + minutes >= nowMinutes
  }) || null
}

// Próximo tramo de una salida que puede continuar después de medianoche.
// No vuelve a ofrecer la salida de ayer ni interpreta estimaciones como horas.
export function nextScheduleStepAt(item = {}, now = new Date()) {
  const { today, minutes } = madridNow(now)
  const elapsedDays = daysUntil(today, item.date)
  if (elapsedDays === null) return null
  const current = elapsedDays * 1440 + minutes
  let previous = -1
  let offset = 0
  const seen = new Set()
  for (const row of Array.isArray(item.schedule) ? item.schedule : []) {
    const time = clock(row)
    const label = text(row.label)
    if (!time || !label) continue
    const [hours, mins] = time.split(':').map(Number)
    const minute = hours * 60 + mins
    const explicitDay = row.date ? daysUntil(row.date, item.date) : null
    if (explicitDay !== null) offset = explicitDay * 1440
    else if (minute + offset < previous) offset += 1440
    const moment = minute + offset
    previous = moment
    const key = `${moment}:${label.toLocaleLowerCase('es')}`
    if (seen.has(key)) continue
    seen.add(key)
    if (moment >= current) return { label, time }
  }
  return null
}
