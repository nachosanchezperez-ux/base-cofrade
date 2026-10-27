'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { subscribeAgendaClock } from '@/lib/agenda-clock-refresh'

export default function AgendaClockRefresh() {
  const router = useRouter()
  useEffect(() => subscribeAgendaClock(() => router.refresh(), window, document), [router])
  return null
}
