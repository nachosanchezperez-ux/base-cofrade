'use client'

import { useMemo, useState } from 'react'
import styles from './ProcessionRoute.module.css'

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('es')
}

function samePlace(first, second) {
  const left = normalizeText(first)
  const right = normalizeText(second)
  if (!left || !right) return false
  return left === right || left.includes(right) || right.includes(left)
}

function roleLabel(role) {
  if (role === 'turnaround') return 'Punto de giro'
  return ''
}

function visiblePoints(leg, route) {
  const points = [...(leg.points || [])]
  if (points.length <= 2) return points

  const isOutbound = leg.id === 'outbound'
  const isReturn = leg.id === 'return'
  let start = 0
  let end = points.length

  if (route.circuit) {
    if (isOutbound && samePlace(points[0]?.label, route.baseLocation)) start += 1
    if (isReturn && samePlace(points.at(-1)?.label, route.baseLocation)) end -= 1
  } else {
    if (isOutbound && samePlace(points[0]?.label, route.origin)) start += 1
    if (isOutbound && samePlace(points.at(-1)?.label, route.destination)) end -= 1
    if (isReturn && samePlace(points[0]?.label, route.destination)) start += 1
    if (isReturn && samePlace(points.at(-1)?.label, route.origin)) end -= 1
  }

  const trimmed = points.slice(start, end)
  return trimmed.length ? trimmed : points
}

function RouteLeg({ leg, route }) {
  const points = visiblePoints(leg, route)

  return (
    <article className={styles.legCard}>
      <header className={styles.legHead}>
        <h3>{leg.label}</h3>
      </header>

      <ol className={styles.routeList}>
        {points.map((point) => {
          const badge = roleLabel(point.role)
          return (
            <li className={styles.routePoint} data-role={point.role} key={point.id}>
              <span className={styles.node} aria-hidden="true" />
              <div className={styles.pointCopy}>
                <div className={styles.pointTop}>
                  <strong>{point.label}</strong>
                  {badge ? <span className={styles.pointBadge}>{badge}</span> : null}
                </div>
                {point.detail ? <small>{point.detail}</small> : null}
                {point.annotations?.length ? (
                  <div className={styles.annotations}>
                    {point.annotations.map((annotation, index) => (
                      <span
                        className={styles.annotation}
                        data-type={annotation.type || 'note'}
                        key={`${point.id}-${annotation.type}-${annotation.label}-${index}`}
                      >
                        {annotation.time ? <b>{annotation.time}</b> : null}
                        {annotation.label ? <span>{annotation.label}</span> : null}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    </article>
  )
}

function PlaceSummary({ route }) {
  if (route.circuit) {
    return (
      <div className={styles.placeSummary} data-circuit="true">
        <div className={styles.placeCard}>
          <span>Salida y entrada</span>
          <strong>{route.baseLocation || route.origin || route.destination || 'Lugar por documentar'}</strong>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.placeSummary} data-circuit="false">
      {route.origin ? (
        <div className={styles.placeCard}>
          <span>Salida</span>
          <strong>{route.origin}</strong>
        </div>
      ) : null}
      {route.destination ? (
        <div className={styles.placeCard}>
          <span>Destino</span>
          <strong>{route.destination}</strong>
        </div>
      ) : null}
    </div>
  )
}

export default function ProcessionRoute({ route }) {
  const legs = route?.legs || []
  const [activeId, setActiveId] = useState(legs[0]?.id || '')
  const activeLeg = useMemo(
    () => legs.find((leg) => leg.id === activeId) || legs[0] || null,
    [legs, activeId]
  )

  if (!route) return null

  return (
    <div className={styles.routeViewer}>
      {(route.origin || route.destination) ? <PlaceSummary route={route} /> : null}

      {legs.length ? (
        <>
          <div className={styles.desktopRoutes} data-count={legs.length}>
            {legs.map((leg) => <RouteLeg leg={leg} route={route} key={leg.id} />)}
          </div>

          <div className={styles.mobileRoutes}>
            {legs.length > 1 ? (
              <div className={styles.segmented} role="tablist" aria-label="Tramos del recorrido">
                {legs.slice(0, 2).map((leg) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeLeg?.id === leg.id}
                    data-active={activeLeg?.id === leg.id}
                    onClick={() => setActiveId(leg.id)}
                    key={leg.id}
                  >
                    {leg.label}
                  </button>
                ))}
              </div>
            ) : null}
            {activeLeg ? <RouteLeg leg={activeLeg} route={route} /> : null}
          </div>
        </>
      ) : route.summary ? (
        <p className={styles.summaryFallback}>{route.summary}</p>
      ) : null}
    </div>
  )
}
