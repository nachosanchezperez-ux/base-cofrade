import { agendaMunicipalitySlug } from '@/lib/agenda-cofrade-location'

// Estado inicial de la Agenda a partir de la URL (?categoria, ?periodo, ?territorio,
// ?municipio). Lo usa la página en el servidor y el envoltorio de cliente.
export const AGENDA_CATEGORIES = new Set(['all', 'processions', 'transfers', 'rosaries', 'romeries', 'devotions', 'concerts'])
export const AGENDA_PERIODS = new Set(['today', 'tomorrow', 'weekend', 'upcoming'])
export const AGENDA_TERRITORIES = new Set(['all', 'capital', 'province'])

function allowedValue(getParam, name, allowed, fallback) {
  const raw = getParam(name)
  const value = (Array.isArray(raw) ? raw[0] : raw) || fallback
  return allowed.has(value) ? value : fallback
}

// getParam(name) devuelve el valor del parámetro: searchParams.get en el cliente o
// la lectura del objeto searchParams de la página en el servidor.
export function agendaInitialStateFromParams(getParam) {
  const initialCategory = allowedValue(getParam, 'categoria', AGENDA_CATEGORIES, 'all')
  const initialPeriod = allowedValue(getParam, 'periodo', AGENDA_PERIODS, 'upcoming')
  const rawMunicipality = getParam('municipio')
  const requestedMunicipality = agendaMunicipalitySlug((Array.isArray(rawMunicipality) ? rawMunicipality[0] : rawMunicipality) || '')
  const initialTerritory = requestedMunicipality
    ? 'province'
    : allowedValue(getParam, 'territorio', AGENDA_TERRITORIES, 'all')
  const initialMunicipality = initialTerritory === 'province' ? requestedMunicipality : ''

  return {
    initialCategory,
    initialPeriod,
    initialTerritory,
    initialMunicipality,
    stateKey: `${initialCategory}:${initialPeriod}:${initialTerritory}:${initialMunicipality}`,
  }
}
