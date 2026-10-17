'use client'

import { trackEvent } from '@/lib/analytics/client'
import { calendarSubscribeLinks } from '@/lib/agenda-ics-links'

// Suscripción a un calendario (.ics) que se actualiza solo en el móvil:
// webcal:// para iPhone, Mac y Outlook, y Google Calendar para Android.
export default function CalendarSubscribeLinks({ path, label, scope = 'brotherhood', className = '' }) {
  const links = calendarSubscribeLinks(path)
  if (!links) return null

  const track = (client) => trackEvent('calendar_add', { calendar_scope: scope, calendar_client: client, item_name: label })

  return (
    <p className={className}>
      <span>Añadir a tu calendario</span>
      <a href={links.webcal} onClick={() => track('webcal')} data-analytics-skip-entity="true">iPhone, Mac u Outlook</a>
      <a href={links.google} target="_blank" rel="noopener noreferrer" onClick={() => track('google')} data-analytics-skip-entity="true">Google Calendar</a>
    </p>
  )
}
