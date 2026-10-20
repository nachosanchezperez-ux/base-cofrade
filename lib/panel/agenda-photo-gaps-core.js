// Núcleo puro del aviso «actos sin foto» (lib/panel/agenda-photo-gaps.js), sin
// Supabase ni alias, para probarlo con node --test.
import { pickAgendaPhoto } from '../agenda-event-photo.js'

function madridToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}

function addDays(date, days) {
  const value = new Date(`${date}T12:00:00Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

const OUTING_GROUPS = ['rosaries', 'extraordinary', 'glories', 'generalOutings']

// sources: { rosaries, extraordinary, glories, generalOutings, devotions, concerts }
// Devuelve [{ kind: 'outing'|'cult'|'concert', id, cultId?, title, date, organizer,
// shows: 'titular'|'crest'|'nothing' }] ordenado por fecha.
export function agendaPhotoGaps(sources = {}, { days = 15, today = '' } = {}) {
  const from = today || madridToday()
  const until = addDays(from, days)
  const seen = new Set()
  const gaps = []
  const consider = (kind, item) => {
    if (!item?.isUpcoming || !item.date || item.date < from || item.date > until) return
    const photo = pickAgendaPhoto(item)
    if (photo?.source === 'event') return
    // Un rosario extraordinario llega por dos fuentes: es la misma salida.
    const key = kind === 'cult' ? `cult:${item.cultId}:${item.date}` : `${kind}:${item.id}`
    if (seen.has(key)) return
    seen.add(key)
    gaps.push({
      kind,
      id: item.id,
      cultId: item.cultId || '',
      title: item.title || 'Acto cofrade',
      date: item.date,
      organizer: item.brotherhoodName || '',
      shows: photo?.source === 'titular' ? 'titular' : (item.crestPath || item.imagePath) ? 'crest' : 'nothing',
    })
  }
  for (const group of OUTING_GROUPS) for (const item of sources[group] || []) consider('outing', item)
  for (const item of sources.devotions || []) if (item.cultId) consider('cult', item)
  for (const item of sources.concerts || []) consider('concert', item)
  return gaps.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'es'))
}
