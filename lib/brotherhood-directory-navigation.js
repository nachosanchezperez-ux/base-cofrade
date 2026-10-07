import {
  DIRECTORY_TYPES,
  directoryPeriod,
  displayName,
  hasDirectoryType,
  normalizeDirectoryValue,
  sortBrotherhoods,
} from './brotherhood-directory.js'
import { brotherhoodDirectoryRoutes } from './brotherhood-public-index.js'

// Send only navigation counts to the client, using the same editorial boundary
// as the linked directories. Search still receives the full public collection.
export function buildBrotherhoodDirectoryNavigation(indexableBrotherhoods = []) {
  return {
    counts: Object.fromEntries(DIRECTORY_TYPES.map((type) => [
      type.key,
      indexableBrotherhoods.filter((item) => hasDirectoryType(item, type.key)).length,
    ])),
    routes: Object.fromEntries(brotherhoodDirectoryRoutes(indexableBrotherhoods)
      .map((route) => [route.href, route.count])),
  }
}

export function filterDirectoryBrotherhoods(brotherhoods = [], {
  query = '', territory = 'todos', municipality = 'todos', typeKey = '', period = null,
} = {}) {
  const search = normalizeDirectoryValue(query)

  return sortBrotherhoods(brotherhoods.filter((item) => {
    const locality = normalizeDirectoryValue(item.localidad)
    const isCapital = locality === 'sevilla'
    const matchesTerritory = territory === 'todos'
      || (territory === 'capital' && isCapital)
      || (territory === 'provincia' && !isCapital)
    const matchesMunicipality = municipality === 'todos' || locality === municipality
    const matchesType = !typeKey || hasDirectoryType(item, typeKey)
    const matchesPeriod = period === null || directoryPeriod(item, typeKey) === period
    const haystack = normalizeDirectoryValue([
      displayName(item), item.nombreOficial, item.localidad, item.barrio, item.sede, item.diaSalida,
    ].filter(Boolean).join(' '))

    return matchesTerritory && matchesMunicipality && matchesType && matchesPeriod
      && (!search || haystack.includes(search))
  }))
}
