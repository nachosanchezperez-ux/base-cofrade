'use client'

import { useMemo, useState } from 'react'
import styles from './ProcessionRoute.module.css'

function normalizedLabel(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function sameLabel(first, second) {
  const left = normalizedLabel(first)
  const right = normalizedLabel(second)
  return Boolean(left && right && left === right)
}

function roleLabel(role, legId, circuit) {
  if (role === 'start') return legId === 'return' && circuit ? 'Punto de giro' : 'Salida'
  if (role === 'turnaround') return 'Punto de giro'
  if (role === 'end') {
    if (circuit || legId === 'return') return 'Entrada'
    return 'Llegada'
  }
  return ''
}

function RouteLeg({ leg, route, dense = false }) {
  const lastIndex = leg.points.length - 1
  const visiblePoints = leg.points.filter((point, index) => {
    const hasAnnotations = Boolean(point.annotations?.length)
    if (hasAnnotations) return true

    if (index === 0 && route.origin && sameLabel(point.label, route.origin)) return false
    if (leg.id === 'return' && index === 0 && route.destination && sameLabel(point.label, route.destination)) return false

    const endLabel = route.circuit ? route.origin : route.destination
    if (index === lastIndex && endLabel && sameLabel(point.label, endLabel)) return false
    if (leg.id === 'return' && index === lastIndex && route.origin && sameLabel(point.label, route.origin)) return false

    return true
  })

  return (
    <article className={styles.legCard} data-dense={dense ? 'true' : undefined}>
      <header className={styles.legHead}>
        <div>
          <span>{visiblePoints.length} {visiblePoints.length === 1 ? 'punto' : 'puntos'}</span>
          <h3>{leg.label}</h3>
        </div>
      </header>

      <ol className={styles.routeList}>
        {visiblePoints.map((point, index) => {
          const isSingleLegCircuitEntry = route.circuit
            && route.legs.length === 1
            && index === visiblePoints.length - 1
          const visualRole = isSingleLegCircuitEntry ? 'end' : point.role
          const badge = roleLabel(visualRole, leg.id, route.circuit)

          return (
            <li className={styles.routePoint} data-role={visualRole} key={point.id}>
              <span className={styles.node} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div className={styles.pointCopy}>
                <div className={styles.pointTop}>
                  <strong>{point.label}</strong>
                  {badge ? <span className={styles.pointBadge}>{badge}</span> : null}
                </div>
                {point.detail ? <small>{point.detail}</small> : null}
                {point.annotations?.length ? (
                  <div className={styles.annotations}>
                    {point.annotations.map((annotation, annotationIndex) => (
                      <span
                        className={styles.annotation}
                        data-type={annotation.type || 'note'}
                        key={`${point.id}-annotation-${annotationIndex}`}
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

function RouteTabs({ legs, activeLeg, setActiveId, label = 'Tramos del recorrido' }) {
  if (legs.length < 2) return null

  return (
    <div className={styles.segmented} role="tablist" aria-label={label}>
      {legs.map((leg) => (
        <button
          type="button"
          role="tab"
          aria-selected={activeLeg?.id === leg.id}
          data-active={activeLeg?.id === leg.id}
          onClick={() => setActiveId(leg.id)}
          key={leg.id}
        >
          {leg.label}
          <small>{leg.points.length}</small>
        </button>
      ))}
    </div>
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

function JourneyPhases({ phases = [] }) {
  if (!phases.length) return null

  return (
    <section className={styles.phases} aria-label="Desarrollo de la jornada">
      <div className={styles.phasesHead}>
        <span>Jornada</span>
        <strong>{phases.length} {phases.length === 1 ? 'fase' : 'fases'}</strong>
      </div>
      <div className={styles.phaseGrid}>
        {phases.map((phase, index) => (
          <article className={styles.phase} key={phase.id}>
            <span className={styles.phaseIndex}>{String(index + 1).padStart(2, '0')}</span>
            <div>
              {phase.eyebrow ? <small>{phase.eyebrow}</small> : null}
              <h4>{phase.title}</h4>
              {phase.time ? <strong>{phase.time}</strong> : null}
              {phase.summary ? <p>{phase.summary}</p> : null}
              {phase.places.length ? <span>{phase.places.join(' → ')}</span> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
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

  const totalPoints = route.totalPoints || legs.reduce((total, leg) => total + leg.points.length, 0)
  const isLong = totalPoints >= 20
  const desktopTabbed = isLong && legs.length > 1

  return (
    <div className={styles.routeViewer} data-long={isLong ? 'true' : undefined}>
      {(route.origin || route.destination) ? <PlaceSummary route={route} /> : null}

      {(legs.length || route.phases?.length) ? (
        <div className={styles.routeOverview}>
          <div>
            <span>Itinerario</span>
            <strong>{totalPoints || '—'} {totalPoints === 1 ? 'punto documentado' : 'puntos documentados'}</strong>
          </div>
          <small>{legs.length > 1 ? `${legs.length} tramos` : legs.length === 1 ? 'Secuencia completa' : 'Jornada estructurada'}</small>
        </div>
      ) : null}

      {route.phases?.length ? <JourneyPhases phases={route.phases} /> : null}

      {legs.length ? (
        <>
          {desktopTabbed ? (
            <div className={styles.desktopTabbedRoutes}>
              <RouteTabs legs={legs} activeLeg={activeLeg} setActiveId={setActiveId} label="Elegir tramo del recorrido" />
              {activeLeg ? <RouteLeg leg={activeLeg} route={route} dense /> : null}
            </div>
          ) : (
            <div className={styles.desktopRoutes} data-count={legs.length}>
              {legs.map((leg) => <RouteLeg leg={leg} route={route} dense={isLong} key={leg.id} />)}
            </div>
          )}

          <div className={styles.mobileRoutes}>
            <RouteTabs legs={legs} activeLeg={activeLeg} setActiveId={setActiveId} />
            {activeLeg ? <RouteLeg leg={activeLeg} route={route} dense={isLong} /> : null}
          </div>
        </>
      ) : route.summary ? (
        <p className={styles.summaryFallback}>{route.summary}</p>
      ) : null}

      {route.mapReady ? (
        <div className={styles.mapHint}>
          <strong>Recorrido preparado para mapa</strong>
          <span>Los puntos georreferenciados permiten activar una vista cartográfica complementaria.</span>
        </div>
      ) : null}
    </div>
  )
}
