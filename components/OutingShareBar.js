'use client'

import { useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics/client'
import { whatsappShareHref } from '@/lib/share'
import { CalendarPlusIcon, ImageDownIcon, MessageCircleIcon, NavigationIcon, Share2Icon } from './icons/LucideIcons'
import styles from './BrotherhoodChapterOuting.module.css'

// Acciones de la salida destacada: calendario, imagen para estados, WhatsApp,
// compartir y cómo llegar. La imagen se comparte como archivo cuando el móvil
// lo permite (estados de WhatsApp, historias de Instagram) y, si no, se abre
// para guardarla.
export default function OutingShareBar({ share, calendarHref = '', storyHref = '', storyName = 'salida.png', directionsHref = '', analytics = {} }) {
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)
  const track = (method, extra = {}) => trackEvent('share', { method, content_type: 'procesion_gloria', item_name: share?.title || '', ...analytics, ...extra })

  async function shareStory(href = storyHref, name = storyName) {
    if (!href || busy) return
    setBusy(true)
    try {
      const blob = await fetch(href).then((response) => {
        if (!response.ok) throw new Error(String(response.status))
        return response.blob()
      })
      const file = new File([blob], name, { type: blob.type || 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: share?.title || '', text: share?.url || '' })
        track('story_image')
        return
      }
      const url = URL.createObjectURL(file)
      const link = Object.assign(document.createElement('a'), { href: url, download: name })
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 10000)
      track('story_image_download')
    } catch (error) {
      if (error?.name !== 'AbortError') window.open(href, '_blank', 'noopener')
    } finally {
      setBusy(false)
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: share.title, text: share.body, url: share.url })
        track('native')
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(share.text)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2500)
      track('copy')
    } catch {
      window.prompt('Copia el enlace para compartirlo', share.url)
    }
  }

  return (
    <div className={styles.shareBar} role="group" aria-label={`Acciones: ${share?.title || 'salida'}`}>
      {calendarHref ? (
        <a className={`${styles.action} ${styles.actionMain}`} href={calendarHref} onClick={() => trackEvent('calendar_add', { calendar_scope: 'event', content_type: 'procesion_gloria', item_name: share?.title || '', ...analytics })} data-analytics-skip-entity="true">
          <CalendarPlusIcon size={22} />
          <span>Añadir al calendario</span>
        </a>
      ) : null}
      {storyHref ? (
        <div className={styles.storyGroup}>
          <button type="button" className={`${styles.action} ${styles.actionStory}`} onClick={() => shareStory()} disabled={busy} aria-busy={busy}>
            <ImageDownIcon size={22} />
            <span>{busy ? 'Preparando la imagen…' : 'Imagen para tus estados'}</span>
          </button>
          <button type="button" className={styles.storySquare} onClick={() => shareStory(`${storyHref}?formato=cuadrado`, storyName.replace(/\.png$/, '-cuadrada.png'))} disabled={busy}>
            Versión cuadrada para publicaciones
          </button>
        </div>
      ) : null}
      <div className={styles.actionRow}>
        <a className={`${styles.action} ${styles.actionWhatsapp}`} href={whatsappShareHref(share.text)} target="_blank" rel="noopener noreferrer" onClick={() => track('whatsapp')} data-analytics-skip-entity="true">
          <MessageCircleIcon size={20} />
          <span>WhatsApp</span>
        </a>
        <button type="button" className={styles.action} onClick={nativeShare}>
          <Share2Icon size={20} />
          <span>{copied ? 'Copiado' : 'Compartir'}</span>
        </button>
        {directionsHref ? (
          <a className={styles.action} href={directionsHref} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('directions', { content_type: 'procesion_gloria', ...analytics })}>
            <NavigationIcon size={20} />
            <span>Cómo llegar</span>
          </a>
        ) : null}
      </div>
    </div>
  )
}
