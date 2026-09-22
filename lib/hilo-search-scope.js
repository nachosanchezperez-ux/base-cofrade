import { directorySlug } from './brotherhood-directory.js'
import {
  matchHolyWeekDay,
  matchMunicipalityName,
  normalizeFreeFactText,
} from './tira-free-facts.js'

const BAND_SCOPE = /\b(banda|bandas|formacion musical|formaciones musicales)\b/
const BROTHERHOOD_SCOPE = /\b(hermandad|hermandades|cofradia|cofradias|corporacion|corporaciones|agrupacion|agrupaciones|gloria|glorias|sacramental|sacramentales|penitencia|semana santa)\b/

function brotherhoodType(normalizedQuery = '') {
  if (/\bagrupacion(?:es)?(?: parroquial(?:es)?)?\b/.test(normalizedQuery)) return 'Agrupación Parroquial'
  if (/\bsacramental(?:es)?\b/.test(normalizedQuery)) return 'Sacramental'
  if (/\bgloria(?:s)?\b/.test(normalizedQuery)) return 'Gloria'
  if (/\bpenitencia\b/.test(normalizedQuery)) return 'Penitencia'
  return ''
}

function directoryLocalitySlug(municipality = '') {
  return normalizeFreeFactText(municipality) === 'sevilla'
    ? 'sevilla-capital'
    : directorySlug(municipality)
}

export function parseHiloSearchScope(rawQuery = '', municipalityNames = []) {
  const query = String(rawQuery || '').trim().slice(0, 80)
  const normalizedQuery = normalizeFreeFactText(query)
  if (normalizedQuery.length < 2) return null

  const municipality = matchMunicipalityName(query, municipalityNames)
  const processionDay = matchHolyWeekDay(query)
  const asksBands = BAND_SCOPE.test(normalizedQuery)
  const asksBrotherhoods = BROTHERHOOD_SCOPE.test(normalizedQuery) || Boolean(processionDay)

  if (!municipality && !processionDay && !asksBands && !asksBrotherhoods) return null

  const entityGroup = asksBands && !asksBrotherhoods
    ? 'band'
    : asksBrotherhoods && !asksBands
      ? 'brotherhood'
      : 'mixed'

  return {
    query,
    municipality,
    processionDay,
    entityGroup,
    brotherhoodType: brotherhoodType(normalizedQuery),
  }
}

function brotherhoodDirectoryItem(scope, count) {
  const genericDirectory = !scope.municipality && !scope.processionDay
  if (!count && !genericDirectory) return null

  const locality = directoryLocalitySlug(scope.municipality)
  const period = directorySlug(scope.processionDay)
  const typeConfig = {
    'Agrupación Parroquial': {
      label: 'Agrupaciones parroquiales',
      path: 'agrupaciones-parroquiales',
    },
    Sacramental: {
      label: 'Sacramentales',
      path: 'sacramentales',
    },
    Gloria: { label: 'Hermandades de gloria', path: 'gloria' },
    Penitencia: { label: 'Hermandades de penitencia', path: 'semana-santa' },
  }[scope.brotherhoodType]

  let href = '/hermandades'
  let title = 'Directorio de Hermandades'

  if (scope.processionDay && scope.municipality && locality && period) {
    href = `/hermandades/semana-santa/${locality}/${period}`
    title = `${scope.processionDay} en ${scope.municipality}`
  } else if (scope.municipality && locality && ['Agrupación Parroquial', 'Sacramental'].includes(scope.brotherhoodType)) {
    href = `/hermandades/${typeConfig.path}/${locality}`
    title = `${typeConfig.label} de ${scope.municipality}`
  } else if (scope.municipality && locality) {
    href = `/hermandades/localidad/${locality}`
    title = scope.brotherhoodType
      ? `${typeConfig?.label || 'Hermandades'} de ${scope.municipality}`
      : `Hermandades de ${scope.municipality}`
  } else if (scope.brotherhoodType && typeConfig) {
    href = `/hermandades/${typeConfig.path}`
    title = typeConfig.label
  } else if (scope.processionDay) {
    href = '/hermandades/semana-santa'
    title = `Hermandades del ${scope.processionDay}`
  }

  return {
    entityId: '',
    entityType: 'directory',
    type: 'Directorio',
    title,
    subtitle: count && !genericDirectory
      ? `${count} ${count === 1 ? 'ficha publicada' : 'fichas publicadas'}`
      : 'Todas las fichas publicadas',
    location: scope.municipality || 'Sevilla y provincia',
    descriptor: 'Listado completo y navegable',
    visual: null,
    href,
    actionLabel: 'Ver listado',
    score: 2400,
  }
}

function bandDirectoryItem(scope, count) {
  if (!count && scope.municipality) return null
  const locality = directoryLocalitySlug(scope.municipality)
  return {
    entityId: '',
    entityType: 'directory',
    type: 'Directorio',
    title: scope.municipality ? `Bandas de ${scope.municipality}` : 'Directorio de Bandas',
    subtitle: count
      ? `${count} ${count === 1 ? 'ficha publicada' : 'fichas publicadas'}`
      : 'Todas las fichas publicadas',
    location: scope.municipality || 'Sevilla y provincia',
    descriptor: 'Formaciones musicales documentadas',
    visual: null,
    href: scope.municipality && locality ? `/bandas/localidad/${locality}` : '/bandas',
    actionLabel: 'Ver listado',
    score: 2390,
  }
}

export function buildHiloDirectoryItems(scope, { brotherhoodCount = 0, bandCount = 0 } = {}) {
  if (!scope) return []
  const items = []
  if (scope.entityGroup !== 'band') items.push(brotherhoodDirectoryItem(scope, brotherhoodCount))
  if (scope.entityGroup !== 'brotherhood' && !scope.processionDay) items.push(bandDirectoryItem(scope, bandCount))
  return items.filter(Boolean)
}
