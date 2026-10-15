'use client'

import { useSearchParams } from 'next/navigation'
import AgendaCofradeDirectoryV4 from '@/components/AgendaCofradeDirectoryV4'
import { agendaInitialStateFromParams } from '@/lib/agenda-cofrade-url-state'

export default function AgendaCofradeDirectoryFromUrl({ items, today, initialNowIso }) {
  const searchParams = useSearchParams()
  const { stateKey, ...initialState } = agendaInitialStateFromParams((name) => searchParams.get(name))

  return (
    <AgendaCofradeDirectoryV4
      key={stateKey}
      items={items}
      today={today}
      initialNowIso={initialNowIso}
      {...initialState}
    />
  )
}
