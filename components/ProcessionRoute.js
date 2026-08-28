'use client'

import { useMemo, useState } from 'react'
import styles from './ProcessionRoute.module.css'

function roleLabel(role, legId, circuit) {
  if (role === 'start') return legId === 'return' && circuit ? 'Punto de giro' : 'Salida'
  if (role === 'turnaround') return 'Punto de giro'
  if (role === 'end') {
    if (circuit || legId === 'return') return 'Entrada'
    return 'Llegada'
  }
  return ''
}

function RouteLeg({ leg, route }) {
  const lastIndex = leg.points.length - 1
  const visiblePoints = leg.points.filter((point, index) => {
    if (leg.id === 'outbound' && index === 0 && route.origin) return false
    if (leg.id === 'outbound' && !route.circuit && index === lastIndex && route.destination) return false
    if (leg.id === 'return' && !route.circuit && index === 0 && route.destination) return false
    if (leg.id === 'return' && index === lastIndex && route.origin) return false
    return true
  })

  return (
    <article className={styles.legCard}>
      <header className={styles.legHead}>
        <div>
          <h3>{leg.label}</h3>
        </div>
      </header>

      <ol className={styles.routeList}>
        {visiblePoints.map((point) => {
          const badge = roleLabel(point.role, leg.id, route.circuit)
          return (
            <li className={styles.routePoint} data-role={point.role} key={point.id}>
              <span className={styles.node} aria-hidden="true" />
              <div className={styles.pointCopy}>
                <div className={styles.pointTop}>
                  <strong>{point.label}</strong>
                  {badge ? <span className={styles.pointBadge}>{badge}</span> : null}
                </div>
                {point.detail ? <small>{point.detail}</small> : null}
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
          <strong>{route.baseLocation || route.origin || route.destination || 'Lugar por confirmar'}</strong>
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

      {route.mapReady ? (
        <div className={styles.mapHint}>
          <strong>Recorrido preparado para mapa</strong>
          <span>Los puntos georreferenciados permitirán activar la vista cartográfica sin cambiar este componente.</span>
        </div>
      ) : null}
    </div>
  )
}
