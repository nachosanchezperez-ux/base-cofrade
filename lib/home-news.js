// Titulares de «El Hilo se mueve» para la portada. Módulo puro: recibe las
// noticias ya construidas por getPublicHiloMovements (más recientes primero) y
// devuelve solo lo que pinta la Home, en un objeto pequeño y serializable.
import { HILO_TOPIC_LABELS, hiloDayLabel, selectHiloMovements } from './hilo-movements.js'

export const HOME_NEWS_LIMIT = 3

export function buildHomeNews(items = [], limit = HOME_NEWS_LIMIT) {
  // Variedad: no más de una noticia por Hermandad o banda en la portada.
  return selectHiloMovements(Array.isArray(items) ? items : [], { limit, diverse: true, fresh: true }).map((item) => ({
    id: String(item.id),
    href: item.href,
    title: item.title,
    summary: item.summary || '',
    kind: item.kind || '',
    topic: HILO_TOPIC_LABELS[item.topic] || '',
    brotherhood: item.protagonist?.label || item.brotherhood?.label || '',
    municipality: item.municipality || '',
    date: item.announcedOn || item.documentedOn || '',
    dateLabel: hiloDayLabel(item.announcedOn || item.documentedOn || ''),
    crestPath: item.crestPath || '',
    // Lo que Hilo Cofrade añade a la noticia: el enlace a sus fichas.
    discover: item.discover?.href ? { label: item.discover.label, href: item.discover.href } : null,
  }))
}

// Fecha relativa en días de calendario de Madrid: «Hoy», «Ayer», «Hace 3 días».
// A partir de una semana se muestra la fecha corta («5 oct»).
const SHORT_MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export function homeNewsDayLabel(date = '', today = '') {
  const valid = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value))
  if (!valid(date) || !valid(today)) return ''
  const days = Math.round((Date.parse(`${today}T12:00:00Z`) - Date.parse(`${date}T12:00:00Z`)) / 86400000)
  if (days <= 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  const day = new Date(`${date}T12:00:00Z`)
  return `${day.getUTCDate()} ${SHORT_MONTHS[day.getUTCMonth()]}`
}
