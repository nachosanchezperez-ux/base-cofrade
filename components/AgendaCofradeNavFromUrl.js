'use client'

import { useSearchParams } from 'next/navigation'
import AgendaCofradeNav from '@/components/AgendaCofradeNav'

const NAV_CATEGORIES = new Set(['rosaries', 'devotions', 'concerts'])

export default function AgendaCofradeNavFromUrl() {
  const searchParams = useSearchParams()
  const requestedCategory = searchParams.get('categoria') || 'all'
  const initialCategory = NAV_CATEGORIES.has(requestedCategory) ? requestedCategory : 'all'

  return <AgendaCofradeNav initialCategory={initialCategory} />
}
