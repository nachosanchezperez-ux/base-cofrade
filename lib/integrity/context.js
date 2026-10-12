import { madridToday, musicSeasonYear } from './model.js'

// Contexto compartido por todas las comprobaciones de una ejecución.
//
// `mode` describe con qué permisos se leyó la instantánea:
//   * public → clave publicable. RLS solo deja ver lo publicado, así que una
//              entidad ausente del mapa equivale a «no publicada» (las claves
//              foráneas garantizan que existe). Es el modo de la ejecución
//              periódica: no requiere la clave secreta.
//   * full   → clave secreta (lectura completa). Permite además las
//              comprobaciones marcadas `requires: 'full'`.
export function buildIntegrityContext(snapshot, options = {}) {
  const mode = options.mode || snapshot.mode || 'public'
  const today = options.today || madridToday()
  const seasonYear = options.seasonYear || musicSeasonYear(today)
  const entities = new Map((snapshot.entities || []).map((entity) => [entity.id, entity]))

  const isPublic = (id) => {
    if (!id) return false
    const entity = entities.get(id)
    return Boolean(entity && entity.status === 'published')
  }

  const entityName = (id, fallback = '') => entities.get(id)?.name || fallback || ''

  return {
    snapshot,
    mode,
    today,
    seasonYear,
    // Música 2027 es la temporada siguiente a la vigente.
    nextSeasonYear: seasonYear + 1,
    entities,
    isPublic,
    entityName,
    rows: (name) => snapshot[name] || [],
  }
}
