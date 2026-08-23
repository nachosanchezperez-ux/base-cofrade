'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function entityId(pathname, type) {
  const match = pathname.match(new RegExp(`^/panel/${type}/([^/]+)$`))
  return match?.[1] || ''
}

function destinationFor(pathname, label) {
  const brotherhoodId = entityId(pathname, 'hermandades')
  if (brotherhoodId) {
    const routes = {
      Canales: `${pathname}/canales`,
      Cultos: `${pathname}/cultos`,
      Patrimonio: `${pathname}/patrimonio`,
      Multimedia: `/panel/multimedia?entity=${brotherhoodId}`,
    }
    return routes[label] || ''
  }

  const imageId = entityId(pathname, 'imagenes')
  if (imageId) {
    const routes = {
      Multimedia: `/panel/multimedia?entity=${imageId}`,
      Hermandades: '/panel/relaciones',
      Pasos: '/panel/relaciones/imagen-paso',
      Fuentes: `/panel/fuentes?entity=${imageId}`,
    }
    return routes[label] || ''
  }

  const stepId = entityId(pathname, 'pasos')
  if (stepId) {
    const routes = {
      Responsables: `${pathname}/responsables`,
      Música: `${pathname}/musica`,
      Patrimonio: `${pathname}/patrimonio`,
      Multimedia: `/panel/multimedia?entity=${stepId}`,
    }
    return routes[label] || ''
  }

  const bandId = entityId(pathname, 'bandas')
  if (bandId) {
    const routes = {
      Dirección: `${pathname}/direccion`,
      Acompañamientos: `${pathname}/acompanamientos`,
      Estrenos: `${pathname}/estrenos`,
      Extraordinarias: `${pathname}/extraordinarias`,
    }
    return routes[label] || ''
  }

  const extraordinaryId = entityId(pathname, 'extraordinarias')
  if (extraordinaryId) {
    const routes = {
      'Foto principal': `${pathname}#fotografia`,
      Cartel: `${pathname}#cartel`,
      Galería: `${pathname}#galeria`,
      Horarios: `${pathname}/horarios`,
      Música: `${pathname}/musica`,
      Fuentes: `${pathname}/fuentes`,
    }
    return routes[label] || ''
  }

  return ''
}

function enhanceMetric(card, pathname) {
  if (!(card instanceof HTMLElement) || card.dataset.panelMetricEnhanced === 'true') return
  const label = card.querySelector(':scope > span')?.textContent?.trim() || ''
  const href = destinationFor(pathname, label)
  if (!href) return

  card.dataset.panelMetricEnhanced = 'true'
  card.classList.add('panelMetricLink')

  const arrow = document.createElement('span')
  arrow.className = 'panelMetricArrow'
  arrow.setAttribute('aria-hidden', 'true')
  arrow.textContent = '→'
  card.appendChild(arrow)

  const overlay = document.createElement('a')
  overlay.href = href
  overlay.className = 'panelMetricOverlay'
  overlay.setAttribute('aria-label', `Abrir ${label}`)
  card.appendChild(overlay)
}

export default function PanelMetricNavigation() {
  const pathname = usePathname()

  useEffect(() => {
    let frame = null

    function scan() {
      document.querySelectorAll('[data-panel-main] [class*="metricCard"]').forEach((card) => enhanceMetric(card, pathname))
    }

    function queueScan() {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(scan)
    }

    const main = document.querySelector('[data-panel-main]')
    const observer = main ? new MutationObserver(queueScan) : null
    observer?.observe(main, { childList: true, subtree: true })
    queueScan()

    return () => {
      observer?.disconnect()
      window.cancelAnimationFrame(frame)
      document.querySelectorAll('[data-panel-main] .panelMetricOverlay, [data-panel-main] .panelMetricArrow').forEach((node) => node.remove())
      document.querySelectorAll('[data-panel-main] [data-panel-metric-enhanced="true"]').forEach((card) => {
        card.classList.remove('panelMetricLink')
        delete card.dataset.panelMetricEnhanced
      })
    }
  }, [pathname])

  return null
}
