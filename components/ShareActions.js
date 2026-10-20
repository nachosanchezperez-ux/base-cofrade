'use client'

import { useEffect, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics/client'
import { whatsappShareHref } from '@/lib/share'
import styles from './ShareActions.module.css'

// Icono genérico de mensaje (no reproduce el logotipo de la aplicación).
function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 3v3M17 3v3M4 8h16M5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5ZM12 11v6M9 14h6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    </svg>
  )
}

// Botones de compartir: WhatsApp directo y el menú del móvil (o copiar el
// enlace en ordenador). `share` sale de lib/share.js: { title, body, text, url }.
// `calendarHref` (opcional) añade «Calendario»: descarga el .ics del acto, que el
// móvil abre en su aplicación de calendario.
// `calendarFirst` (tarjetas de la Agenda): «Añadir al calendario» pasa a ser la
// acción principal, la primera y con texto; WhatsApp y Compartir quedan como
// iconos con nombre accesible para que la fila quepa en una línea en el móvil.
// `iconsOnly` (filas de las listas de periodo): solo WhatsApp y Compartir, como
// iconos con nombre accesible; el calendario va aparte (CalendarAddLink).
export function CalendarAddLink({ href, title = '', contentType = 'agenda', analytics = {}, className = '' }) {
  if (!href) return null
  return (
    <a
      className={`${styles.calendar} ${styles.calendarLead} ${styles.calendarStandalone} ${className}`}
      href={href}
      aria-label={`Añadir al calendario: ${title}`}
      onClick={() => trackEvent('calendar_add', { calendar_scope: 'event', content_type: contentType, item_name: title, ...analytics })}
      data-analytics-skip-entity="true"
    >
      <CalendarIcon />
      <span>Calendario</span>
    </a>
  )
}

export default function ShareActions({ share, contentType = 'agenda', analytics = {}, compact = false, className = '', calendarHref = '', calendarFirst = false, iconsOnly = false }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (!share?.url || !share?.text) return null

  function track(method) {
    trackEvent('content_share', {
      share_method: method,
      content_type: contentType,
      item_name: share.title,
      ...analytics,
    })
  }

  function flagCopied() {
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 2500)
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(share.text)
      flagCopied()
      track('copy')
    } catch {
      window.prompt('Copia el enlace para compartirlo', share.url)
    }
  }

  async function handleShare() {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: share.title, text: share.body, url: share.url })
        track('native')
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }
    await copyLink()
  }

  const calendarLead = Boolean(calendarHref && calendarFirst && !iconsOnly)
  const icons = calendarLead || iconsOnly
  const calendarLink = calendarHref && !iconsOnly ? (
    <a
      className={`${styles.calendar} ${calendarLead ? styles.calendarLead : ''}`}
      href={calendarHref}
      aria-label={`Añadir al calendario: ${share.title}`}
      onClick={() => trackEvent('calendar_add', { calendar_scope: 'event', content_type: contentType, item_name: share.title, ...analytics })}
      data-analytics-skip-entity="true"
    >
      <CalendarIcon />
      <span>{calendarLead ? 'Añadir al calendario' : 'Calendario'}</span>
    </a>
  ) : null
  const nativeLabel = copied ? 'Copiado' : 'Compartir'

  return (
    <div className={`${styles.share} ${compact ? styles.compact : ''} ${icons ? styles.calendarFirst : ''} ${className}`} role="group" aria-label={`Compartir: ${share.title}`}>
      {calendarLead ? calendarLink : null}
      <a
        className={`${styles.whatsapp} ${icons ? styles.iconOnly : ''}`}
        href={whatsappShareHref(share.text)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('whatsapp')}
        data-analytics-skip-entity="true"
        aria-label={icons ? 'Compartir por WhatsApp' : undefined}
        title={icons ? 'WhatsApp' : undefined}
      >
        <MessageIcon />
        {icons ? null : <span>WhatsApp</span>}
      </a>
      <button
        type="button"
        className={`${styles.native} ${icons ? styles.iconOnly : ''}`}
        onClick={handleShare}
        aria-label={icons ? nativeLabel : undefined}
        title={icons ? nativeLabel : undefined}
      >
        {icons && copied ? <CheckIcon /> : <ShareIcon />}
        {icons ? null : <span>{nativeLabel}</span>}
      </button>
      {calendarLead ? null : calendarLink}
      <span className="sr-only" aria-live="polite">{copied ? 'Texto y enlace copiados' : ''}</span>
    </div>
  )
}
