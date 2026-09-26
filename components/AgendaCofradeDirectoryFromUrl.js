'use client'

import { useSearchParams } from 'next/navigation'
import AgendaCofradeDirectoryV4 from '@/components/AgendaCofradeDirectoryV4'
import { agendaMunicipalitySlug } from '@/lib/agenda-cofrade-location'

const CATEGORIES = new Set(['all', 'processions', 'transfers', 'rosaries', 'romeries', 'devotions', 'concerts'])
const PERIODS = new Set(['today', 'tomorrow', 'weekend', 'upcoming'])
const TERRITORIES = new Set(['all', 'capital', 'province'])

function allowedValue(searchParams, name, allowed, fallback) {
  const value = searchParams.get(name) || fallback
  return allowed.has(value) ? value : fallback
}

export default function AgendaCofradeDirectoryFromUrl({ items, today, initialNowIso }) {
  const searchParams = useSearchParams()
  const initialCategory = allowedValue(searchParams, 'categoria', CATEGORIES, 'all')
  const initialPeriod = allowedValue(searchParams, 'periodo', PERIODS, 'upcoming')
  const requestedMunicipality = agendaMunicipalitySlug(searchParams.get('municipio') || '')
  const initialTerritory = requestedMunicipality
    ? 'province'
    : allowedValue(searchParams, 'territorio', TERRITORIES, 'all')
  const initialMunicipality = initialTerritory === 'province' ? requestedMunicipality : ''
  const stateKey = `${initialCategory}:${initialPeriod}:${initialTerritory}:${initialMunicipality}`

  return (
    <AgendaCofradeDirectoryV4
      key={stateKey}
      items={items}
      today={today}
      initialNowIso={initialNowIso}
      initialCategory={initialCategory}
      initialPeriod={initialPeriod}
      initialTerritory={initialTerritory}
      initialMunicipality={initialMunicipality}
    />
  )
}
