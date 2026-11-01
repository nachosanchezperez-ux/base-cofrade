import { publicSourceScope } from '@/lib/public-source-scope'
import 'server-only'
import { agendaEventDetailHref } from '@/lib/agenda-event-url-policy'

import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'
import { isProcessionalOutingMusic } from '@/lib/outing-music-sections'
import { getOutingTemporalState } from '@/lib/outing-temporal-state'

function assertRows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function dateParts(value) {
  if (!value) return { day: '', month: '', year: '', label: '', weekdayLabel: '' }

  const date = new Date(`${value}T12:00:00`)
  const day = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    timeZone: 'Europe/Madrid',
  }).format(date)
  const month = new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    timeZone: 'Europe/Madrid',
  }).format(date).replace('.', '').toUpperCase()
  const year = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date)
  const label = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date)
  const weekday = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Madrid',
  }).format(date)

  return {
    day,
    month,
    year,
    label,
    weekdayLabel: `${weekday.charAt(0).t¶»§q«^