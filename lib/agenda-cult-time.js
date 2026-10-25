// Hora de un culto en la lista compacta de la Agenda temporal (Hoy, Mañana,
// Fin de semana). La columna de la hora es estrecha: lleva solo la primera hora
// («19:00»); si el horario tiene más de una hora o texto («Rosario 19:00 ·
// Santa Misa 19:30»), el horario completo va debajo del título.
const TIME = /(\d{1,2})[:.](\d{2})/
const ONLY_TIME = /^\d{1,2}[:.]\d{2}$/

export function cultTimeParts(text = '') {
  const raw = String(text ?? '').replace(/\s+/g, ' ').trim()
  if (!raw || raw === 'Hora por confirmar') return { lead: '—', detail: '' }

  // «12:00 h» y «12:00» son lo mismo: sin la «h», como en el resto de la Agenda.
  const clean = raw.replace(/(\d{1,2}[:.]\d{2})\s*h\b/g, '$1').trim()
  const match = TIME.exec(clean)
  if (!match) return { lead: '—', detail: clean }

  const lead = `${match[1].padStart(2, '0')}:${match[2]}`
  return { lead, detail: ONLY_TIME.test(clean) ? '' : clean }
}
