// Temporada de Adviento y Navidad para la Agenda (24/11/2026): del primer
// domingo de Adviento (el domingo entre el 27 de noviembre y el 3 de diciembre)
// a la Epifanía (6 de enero). Se calcula cada año: la URL /agenda-cofrade/adviento
// es permanente y sirve para todas las temporadas.
import { addAgendaDays } from './municipality-temporal.js'

function dateKey(value = '') {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? String(value) : ''
}

export function firstSundayOfAdvent(year) {
  const christmas = new Date(Date.UTC(year, 11, 25, 12))
  const weekday = christmas.getUTCDay()
  // Cuarto domingo antes de Navidad.
  const lastSunday = addAgendaDays(`${year}-12-25`, weekday === 0 ? -7 : -weekday)
  return addAgendaDays(lastSunday, -21)
}

// Temporada a la que pertenece «hoy»: de noviembre a diciembre, la de ese año;
// en enero, la del año anterior. Visible desde el 1 de noviembre (anuncio).
export function adventSeason(today = '') {
  const key = dateKey(today)
  if (!key) return null
  const [year, month] = key.split('-').map(Number)
  const seasonYear = month === 1 ? year - 1 : year
  const start = firstSundayOfAdvent(seasonYear)
  const end = `${seasonYear + 1}-01-06`
  return {
    year: seasonYear,
    start,
    end,
    // Desde el 1 de noviembre se anuncia; hasta la Epifanía, se vive.
    visible: key >= `${seasonYear}-11-01` && key <= end,
    keyDays: [
      { date: `${seasonYear}-12-08`, label: 'La Inmaculada', caption: '8 de diciembre' },
      { date: `${seasonYear}-12-18`, label: 'La Esperanza', caption: '18 de diciembre · Expectación' },
      { date: `${seasonYear}-12-25`, label: 'Navidad', caption: '25 de diciembre' },
      { date: end, label: 'Epifanía', caption: '6 de enero' },
    ],
  }
}
