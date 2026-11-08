// Textos de las imágenes para compartir del programa de mano 2027.
//
// Excepción razonada a la regla de las imágenes de sección (sin fechas, porque
// WhatsApp y X guardan la vista previa días): aquí las fechas son las de la
// Semana Santa de 2027, fijas, y nunca quedan desfasadas.
import { SECTION_SOCIAL_THEMES } from './section-social-copy.js'

const KICKER = 'Semana Santa de Sevilla 2027 · Programa de mano'

// Títulos en una o dos líneas para que quepan a tamaño legible en móvil.
const DAY_TITLES = {
  'viernes-de-dolores': ['Viernes', 'de Dolores'],
  'sabado-de-pasion': ['Sábado', 'de Pasión'],
  'domingo-de-ramos': ['Domingo', 'de Ramos'],
  'lunes-santo': ['Lunes', 'Santo'],
  'martes-santo': ['Martes', 'Santo'],
  'miercoles-santo': ['Miércoles', 'Santo'],
  'jueves-santo': ['Jueves', 'Santo'],
  madrugada: ['Madrugada'],
  'viernes-santo': ['Viernes', 'Santo'],
  'sabado-santo': ['Sábado', 'Santo'],
  'domingo-de-resurreccion': ['Domingo de', 'Resurrección'],
}

function longDate(isoDate) {
  const date = new Date(`${isoDate}T12:00:00Z`)
  const text = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' }).format(date)
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function holyWeekSocialConfig(day = null) {
  const colors = SECTION_SOCIAL_THEMES.dark
  if (!day) {
    return {
      kicker: 'Programa de mano',
      title: ['Semana Santa', 'de Sevilla 2027'],
      subtitle: 'Del 19 al 28 de marzo de 2027',
      colors,
      alt: 'Hilo Cofrade · Semana Santa de Sevilla 2027 · Programa de mano, del 19 al 28 de marzo de 2027',
    }
  }
  const subtitle = day.id === 'madrugada' ? 'Noche del 25 al 26 de marzo de 2027' : longDate(day.date)
  return {
    kicker: KICKER,
    title: DAY_TITLES[day.id] || [day.name],
    subtitle,
    colors,
    alt: `Hilo Cofrade · ${KICKER} · ${day.name}, ${subtitle.charAt(0).toLowerCase()}${subtitle.slice(1)}`,
  }
}
