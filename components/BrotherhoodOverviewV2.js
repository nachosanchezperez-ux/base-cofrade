import Link from 'next/link'
import CofradeTypeBadges from '@/components/CofradeTypeBadges'
import { publicText } from '@/lib/supabase/public-entity-page'
import styles from './BrotherhoodOverviewV2.module.css'
import scheduleStyles from './BrotherhoodOverviewSchedule.module.css'
import balanceStyles from './BrotherhoodOverviewBalance.module.css'

function verifiedLabel(value = '') {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function directionsUrl(seat) {
  if (!seat) return ''
  const hasCoordinates = Number.isFinite(seat.latitud) && Number.isFinite(seat.longitud)
  const query = hasCoordinates
    ? `${seat.latitud},${seat.longitud}`
    : [seat.nombre, seat.direccion, seat.localidad, seat.provincia].filter(Boolean).join(', ')
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : ''
}

function periodLabel(item) {
  if (item.desde && item.hasta) return `${item.desde}–${item.hasta}`
  if (item.desde) return `Desde ${item.desde}`
  if (item.hasta) return `Hasta ${item.hasta}`
  return 'Periodo documentado'
}

function scheduleKind(value = '') {
  const line = String(value).toLocaleLowerCase('es')
  if (/misa|eucarist/.test(line)) return 'mass'
  if (/despacho|secretar|mayordom|oficina/.test(line)) return 'office'
  if (/exposici|adoraci|rosario|culto/.test(line)) return 'devotion'
  if (/apertura|visita/.test(line)) return 'opening'
  return 'note'
}

function scheduleEntries(value = '') {
  return String(value)
    .split(/\.\s+(?=[A-ZÁÉÍÓÚÑ])/)
    .map((entry) => entry.trim().replace(/\.$/, ''))
    .filter(Boolean)
    .map((entry, index) => {
      const separator = entry.indexOf(':')
      const startsWithTime = /^\d{1,2}:\d{2}/.test(entry)
      const hasDays = !startsWithTime && separator > 0 && separator < 52
      const detail = hasDays ? entry.slice(separator + 1).trim() : entry

      return {
        id: `${index}-${entry}`,
        days: hasDays ? entry.slice(0, separator).trim() : '',
        detail,
      }
    })
}

function scheduleLineParts(line = '') {
  const parts = String(line)
    .split(/\s+·\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length < 2) return { label: '', value: line }

  const hasSeasonAfterMass = /^(misa|misas|eucarist)/i.test(parts[0])
    && /^(invierno|verano|estival|curso)/i.test(parts[1])
  const labelLength = hasSeasonAfterMass ? 2 : 1
  const label = parts.slice(0, labelLength).join(' · ')
  let value = parts.slice(labelLength).join(' · ')
  const repeatedSeparator = value.indexOf(':')

  if (repeatedSeparator > 0) {
    const repeatedLabel = value.slice(0, repeatedSeparator).trim()
    const labelRoot = label.split(/\s+·\s+/)[0]
    const matchesFullLabel = repeatedLabel.localeCompare(label, 'es', { sensitivity: 'base' }) === 0
    const matchesLabelRoot = repeatedLabel.localeCompare(labelRoot, 'es', { sensitivity: 'base' }) === 0

    if (matchesFullLabel || matchesLabelRoot) {
      value = value.slice(repeatedSeparator + 1).trim()
    }
  }

  return { label, value }
}

function scheduleLines(value = '') {
  return String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parsed = scheduleLineParts(line)

      return {
        id: `${index}-${line}`,
        kind: scheduleKind(line),
        label: parsed.label,
        value: parsed.value,
        entries: scheduleEntries(parsed.value),
      }
    })
}

function highlightedSchedule(value = '') {
  return String(value)
    .split(/(\b\d{1,2}:\d{2}(?:[–-]\d{1,2}:\d{2})?\b|\bcerrad[oa]s?\b)/gi)
    .filter(Boolean)
    .map((part, index) => {
      if (/^\d{1,2}:\d{2}(?:[–-]\d{1,2}:\d{2})?$/.test(part)) {
        return <strong className={scheduleStyles.time} key={`${index}-${part}`}>{part}</strong>
      }

      if (/^cerrad[oa]s?$/i.test(part)) {
        return <strong className={scheduleStyles.closed} key={`${index}-${part}`}>{part}</strong>
      }

      return part
    })
}

function fallbackScheduleLabel(kind) {
  if (kind === 'mass') return 'Misas'
  if (kind === 'office') return 'Despacho'
  if (kind === 'devotion') return 'Cultos'
  if (kind === 'opening') return 'Apertura'
  return 'Horario'
}

function MapPinIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

function ClockIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

function ScheduleIcon({ kind }) {
  if (kind === 'mass') {
    return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v16M7.5 9h9" /></svg>
  }

  if (kind === 'office') {
    return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="7" width="16" height="12" rx="2" /><path d="M9 7V5h6v2M4 12h16" /></svg>
  }

  if (kind === 'devotion') {
    return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3.5" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></svg>
  }

  if (kind === 'opening') return <ClockIcon />

  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" /></svg>
}

function ArrowUpRightIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

export default function BrotherhoodOverviewV2({ brotherhood, heroFactLabels = [] }) {
  const seat = brotherhood.sedeDetalle
  const types = brotherhood.tipos || []
  const members = publicText(brotherhood.datosJornada?.totalHermanos)
  const titularCount = brotherhood.imagenes?.length || 0
  const mapUrl = directionsUrl(seat)
  const verified = verifiedLabel(seat?.horarioVerificadoEn)
  const templeSchedule = scheduleLines(seat?.horarioApertura)
  const historicalSeats = seat?.sedesHistoricas || []
  const hasHistoricalSeats = historicalSeats.length > 0
  const heroFacts = new Set(heroFactLabels)

  const identityFacts = [
    publicText(brotherhood.fundacion) ? { label: 'Fundación', value: publicText(brotherhood.fundacion) } : null,
    members ? { label: 'Hermanos', value: members } : null,
    titularCount ? { label: 'Titulares', value: String(titularCount) } : null,
  ].filter((fact) => fact && !heroFacts.has(fact.label))
  const showIdentity = identityFacts.length > 0 || types.length > 1 || hasHistoricalSeats
  const showSeat = Boolean(publicText(seat?.nombre))

  if (!showIdentity && !showSeat) return null

  return (
    <section className={styles.section} id="resumen">
      <div className={`shell ${styles.shell}`}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Información práctica</span>
          <h2>{showSeat ? 'Sede y visita' : 'Datos principales'}</h2>
        </header>

        <div className={`${styles.grid} ${showIdentity && showSeat ? balanceStyles.balancedGrid : styles.gridSingle}`}>
          {showIdentity ? (
            <article className={`${styles.identityCard} ${balanceStyles.equalCard}`}>
              <div className={styles.cardTopline}>
                <span>{hasHistoricalSeats ? 'Historia y datos' : 'Datos complementarios'}</span>
                {types.length > 1 ? <CofradeTypeBadges tipos={types} compact /> : null}
              </div>

              {identityFacts.length ? (
                <dl className={`${styles.identityFacts} ${balanceStyles.identityFactsBalanced}`} data-count={identityFacts.length}>
                  {identityFacts.map((fact) => (
                    <div key={fact.label}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {hasHistoricalSeats ? (
                <details className={`${styles.seatHistory} ${balanceStyles.seatHistoryBalanced}`} open>
                  <summary>
                    Historia de sus sedes
                    <span>{historicalSeats.length} {historicalSeats.length === 1 ? 'sede' : 'sedes'}</span>
                  </summary>
                  <div>
                    {historicalSeats.map((item) => (
                      <article key={item.id}>
                        <small>{periodLabel(item)}</small>
                        <strong>{item.nombre}</strong>
                        {item.direccion ? <p>{item.direccion}</p> : null}
                      </article>
                    ))}
                  </div>
                </details>
              ) : null}
            </article>
          ) : null}

          {showSeat ? (
            <article className={`${styles.seatCard} ${balanceStyles.equalCard} ${balanceStyles.seatBalanced}`} aria-label="Sede canónica, horarios y visita">
              <div className={styles.cardTopline}>
                <span>Sede canónica</span>
                {seat.tipo ? <small>{String(seat.tipo).replaceAll('_', ' ')}</small> : null}
              </div>

              <div className={styles.seatIdentity}>
                <span className={styles.pin} aria-hidden="true"><MapPinIcon /></span>
                <div>
                  <h3>{publicText(seat.nombre)}</h3>
                  {publicText(seat.direccion) ? <p>{publicText(seat.direccion)}</p> : null}
                </div>
              </div>

              {seat.horarioApertura ? (
                <div className={scheduleStyles.hours}>
                  <div className={scheduleStyles.hero}>
                    <span className={scheduleStyles.clock} aria-hidden="true"><ClockIcon /></span>
                    <div className={scheduleStyles.heroCopy}>
                      <small>Sede · Horarios del templo</small>
                      <strong>Planifica tu visita</strong>
                    </div>
                    {verified ? <span className={scheduleStyles.verified}>Revisado · {verified}</span> : null}
                  </div>

                  <div className={scheduleStyles.list}>
                    {templeSchedule.map((item) => (
                      <div className={`${scheduleStyles.row} ${item.kind === 'note' ? scheduleStyles.noteRow : ''}`} key={item.id}>
                        <b className={`${scheduleStyles.label} ${item.label ? '' : scheduleStyles.labelMuted}`}>
                          {item.label || fallbackScheduleLabel(item.kind)}
                        </b>
                        <div className={scheduleStyles.entries}>
                          {item.entries.map((entry) => (
                            <div className={`${scheduleStyles.entry} ${entry.days ? '' : scheduleStyles.entryNoDays}`} key={entry.id}>
                              {entry.days ? <span className={scheduleStyles.days}>{entry.days}</span> : null}
                              <span className={scheduleStyles.detail}>{highlightedSchedule(entry.detail)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={scheduleStyles.footer}>
                    <span className={scheduleStyles.footerIcon} aria-hidden="true"><ScheduleIcon kind="note" /></span>
                    <p>Comprueba los cultos extraordinarios antes de desplazarte.</p>
                  </div>
                </div>
              ) : null}

              <div className={`${styles.seatActions} ${balanceStyles.seatActionsBalanced}`}>
                {mapUrl ? <a href={mapUrl} target="_blank" rel="noreferrer">Cómo llegar <ArrowUpRightIcon className={styles.actionIcon} /></a> : null}
                {!publicText(seat.direccion) && seat.localidad ? <span>{seat.localidad}{seat.provincia && seat.provincia !== seat.localidad ? ` · ${seat.provincia}` : ''}</span> : null}
              </div>

              {seat.hermandadesCompartidas?.length > 0 ? (
                <div className={styles.shared}>
                  <small>También en esta sede</small>
                  <div>
                    {seat.hermandadesCompartidas.map((item) => (
                      <Link href={`/hermandades/${item.slug}`} key={item.id}>{item.nombre} <span aria-hidden="true">→</span></Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ) : null}
        </div>
      </div>
    </section>
  )
}