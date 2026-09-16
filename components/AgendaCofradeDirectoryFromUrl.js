'use client'

import { useSearchParams } from 'next/navigation'
import AgendaCofradeDirectoryV4 from '@/components/AgendaCofradeDirectoryV4'

const CATEGORIES = new Set(['all', 'processions', 'transfers', 'rosaries', 'devotions', 'concerts'])
const PERIODS = new Set(['today', 'weekend', 'upcoming', 'archive'])
const TERRITORIES = new Set(['all', 'capital', 'province'])

function allowedValue(searchParams, name, allowed, fallback) {
  const value = searchParams.get(name) || fallback
  return allowed.has(value) ? value : fallback
}

export default function AgendaCofradeDirectoryFromUrl({ items, today }) {
  const searchParams = useSearchParams()
  const initialCategory = allowedValue(searchParams, 'categoria', CATEGORIES, 'all')
  const initialPeriod = allowedValue(searchParams, 'periodo', PERIODS, 'upcoming')
  const initialTerritory = allowedValue(searchParams, 'territorio', TERRITORIES, 'all')
  const stateKey = `${initialCategory}:${initialPeriod}:${initialTerritory}`

  return (
    <AgendaCofradeDirectoryV4
      key={stateKey}
      items={items}
      today={today}
      initialCategory={initialCategory}
      initialPeriod={initialPeriod}
      initialTerritory={initialTerritory}
    />
  )
}
