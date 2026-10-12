// Titulares de «El Hilo se mueve» para la portada. Módulo puro: recibe las
// noticias ya construidas por getPublicHiloMovements (más recientes primero) y
// devuelve solo lo que pinta la Home, en un objeto pequeño y serializable.
import { HILO_TOPIC_LABELS, hiloDayLabel, selectHiloMovements } from './hilo-movements.js'

export const HOME_NEWS_LIMIT = 3

export function buildHomeNews(items = [], limit = HOME_NEWS_LIMIT) {
  // Variedad: no más de una noticia por Hermandad en la portada.
  return selectHiloMovements(Array.isArray(items) ? items : [], { limit, diverse: true }).map((item) => ({
    id: String(item.id),
    href: item.href,
    title: item.title,
    summary: item.summary || '',
    kind: item.kind || '',
    topic: HILO_TOPIC_LABELS[item.topic] || '',
    brotherhood: item.brotherhood?.label || '',
    municipality: item.municipality || '',
    date: item.announcedOn || item.documentedOn || '',
    dateLabel: hiloDayLabel(item.announcedOn || item.documentedOn || ''),
    crestPath: item.crestPath || '',
  }))
}
