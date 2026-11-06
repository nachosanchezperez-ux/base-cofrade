import Link from 'next/link'
import OutingShareBar from './OutingShareBar'
import OutingDayStatus from './OutingDayStatus'
import { ChevronRightIcon, ChurchIcon, ClockIcon, FlagIcon, MusicIcon, PlusIcon, RouteIcon } from './icons/LucideIcons'
import BrotherhoodOutingMap from './BrotherhoodOutingMap'
import { bandSegments, outingCardTitle, outingDateParts, outingRouteStops, splitRouteStreets } from '@/lib/brotherhood-featured-outing'
import { outingActionLinks } from '@/lib/outing-actions'
import styles from './BrotherhoodChapterOuting.module.css'

// Salida destacada del capítulo Procesión, pensada para consultarla en la
// calle: cuándo sale y cuándo entra, quién la acompaña y por dónde pasa. El
// recorrido es una línea con los templos de salida y entrada como extremos;
// en recorridos largos, el tramo central se pliega sin romper la línea. Solo
// se muestran datos documentados: sin hora, «Por confirmar».

// Franja de las bandas que no hacen todo el recorrido: marca dónde empieza y
// dónde termina su tramo sobre la propia línea.
function bandMarks(segments, index) {
  const starts = segments.filter((band) => band.start === index && band.start > 0)
  const ends = segments.filter((band) => band.end === index)
  const inside = segments.some((band) => index >= band.start && index <= band.end)
  return { starts, ends, inside }
}

function BandChips({ starts, ends }) {
  if (!starts.length && !ends.length) return null
  return <span className={styles.bandChips}>
    {starts.map((band) => <em key={`s-${band.id}`} className={styles.bandChip}><MusicIcon size={13} strokeWidth={2.4} /> Desde aquí, {band.name}</em>)}
    {ends.map((band) => <em key={`e-${band.id}`} className={`${styles.bandChip} ${styles.bandChipEnd}`}><FlagIcon size={13} strokeWidth={2.4} /> Hasta aquí, {band.name}</em>)}
  </span>
}

function Street({ name, marks }) {
  return <li className={`${styles.street} ${marks.inside ? styles.inBand : ''}`}>
    <span>{name}</span>
    <BandChips starts={marks.starts} ends={marks.ends} />
  </li>
}

function Time({ label, value, place }) {
  return <div className={styles.time}>
    <small><ClockIcon size={14} strokeWidth={2.4} /> {label}</small>
    <strong className={value ? '' : styles.pending}>{value || 'Por confirmar'}</strong>
    {place ? <span><ChurchIcon size={14} /> {place}</span> : null}
  </div>
}

export default function BrotherhoodChapterOuting({ outing, names = [] }) {
  if (!outing) return null
  const date = outingDateParts(outing.date)
  const route = outingRouteStops(outing.routeSummary, { origin: outing.origin, destination: outing.destination })
  const sameTemple = route.origin && route.destination && route.origin === route.destination
  const music = outing.processionalMusic?.length ? outing.processionalMusic : (outing.music || [])
  const segments = bandSegments(music, route)
  const segmentById = new Map(segments.map((band) => [band.id, band]))
  // El final de un tramo de banda queda siempre a la vista, fuera del plegable.
  const lastSegmentStreet = Math.max(0, ...segments.map((band) => Math.min(band.end, route.streets.length)))
  const streets = splitRouteStreets(route.streets, { head: Math.max(4, lastSegmentStreet) })
  const marksAt = (index) => bandMarks(segments, index)
  const originMarks = marksAt(0)
  const destinationMarks = marksAt(route.streets.length + 1)
  const hiddenOffset = streets.head.length + 1
  const tailOffset = streets.head.length + streets.hidden.length + 1
  const { upcoming, calendarHref, storyHref, storyName, directionsHref, share } = outingActionLinks(outing)
  const status = outing.isCancelled ? 'Suspendida' : outing.isUpcoming ? 'Próxima salida' : 'Última salida'

  return <section className={styles.outing} id="salida" aria-labelledby="salida-titulo">
    <div className="shell">
      <div className={styles.card}>
        <header className={styles.head}>
          {date ? <p className={styles.date} aria-label={`${date.weekday} ${date.day} ${date.month} ${date.year}`}>
            <span>{date.weekday}</span>
            <strong>{date.day}</strong>
            <span>{date.month}</span>
          </p> : null}
          <div className={styles.headText}>
            <p className={styles.status}>
              {status}
              {outing.isUpcoming && outing.urgencyLabel ? <span className={styles.urgency}>{outing.urgencyLabel}</span> : null}
            </p>
            <h2 className={styles.title} id="salida-titulo">{outingCardTitle(outing.title, { names, fallback: outing.outingType || 'Procesión de Gloria' })}</h2>
            <OutingDayStatus outing={{ date: outing.date, departureTime: outing.departureTime, returnTime: outing.returnTime }} />
          </div>
        </header>

        <div className={styles.times}>
          <Time label="Salida" value={outing.departureTime} place={route.origin} />
          <Time label="Entrada" value={outing.returnTime} place={sameTemple ? '' : route.destination} />
        </div>

        {music.length ? <ul className={styles.bands} aria-label="Acompañamiento musical">
          {music.map((band) => <li key={band.id || band.name}>
            <span className={`${styles.bandIcon} ${segmentById.get(band.id || band.name) ? styles.bandIconSegment : ''}`} aria-hidden="true"><MusicIcon size={18} /></span>
            <span className={styles.bandText}>
              {band.context ? <small>{band.context}{segmentById.get(band.id || band.name) ? ` · hasta ${segmentById.get(band.id || band.name).endLabel}` : ''}</small> : null}
              {band.href ? <Link href={band.href} prefetch={false}>{band.name}</Link> : <strong>{band.name}</strong>}
            </span>
          </li>)}
        </ul> : null}

        {route.streets.length ? <div className={styles.route}>
          <h3 className={styles.routeTitle}><RouteIcon size={20} /> Recorrido <small>{route.streets.length} calles</small></h3>
          <BrotherhoodOutingMap points={outing.routePoints || []} segments={segments} title={outing.title} />
          <ol className={styles.line}>
            <li className={`${styles.stop} ${styles.endpoint} ${originMarks.inside ? styles.inBand : ''}`}>
              <b>{outing.departureTime || 'Salida'}</b>
              <span>{route.origin || 'Salida'}</span>
              <BandChips starts={segments.filter((band) => band.start === 0)} ends={[]} />
            </li>
            {streets.head.map((name, index) => <Street key={`h-${index}`} name={name} marks={marksAt(index + 1)} />)}
            {streets.hidden.length ? <li className={styles.fold}>
              <details>
                <summary><span>{streets.hidden.length} calles más</span><b aria-hidden="true"><PlusIcon size={16} strokeWidth={2.6} /></b></summary>
                <ol className={styles.foldList}>
                  {streets.hidden.map((name, index) => <Street key={`m-${index}`} name={name} marks={marksAt(hiddenOffset + index)} />)}
                </ol>
              </details>
            </li> : null}
            {streets.tail.map((name, index) => <Street key={`t-${index}`} name={name} marks={marksAt(tailOffset + index)} />)}
            <li className={`${styles.stop} ${styles.endpoint} ${destinationMarks.inside ? styles.inBand : ''}`}>
              <b>{outing.returnTime || 'Entrada'}</b>
              <span>{route.destination || 'Entrada'}</span>
              <BandChips starts={[]} ends={destinationMarks.ends.filter((band) => band.start > 0)} />
            </li>
          </ol>
        </div> : outing.routeSummary ? <p className={styles.routeText}>{outing.routeSummary}</p> : null}

        {outing.publicNotes ? <details className={styles.notes}>
          <summary><span>Más detalles de la salida</span><b aria-hidden="true"><PlusIcon size={18} /></b></summary>
          <p>{outing.publicNotes}</p>
        </details> : null}

        <div className={styles.actions}>
          <OutingShareBar
            share={share}
            calendarHref={calendarHref}
            storyHref={storyHref}
            storyName={storyName}
            directionsHref={directionsHref}
            analytics={{ placement: 'ficha_salida' }}
          />
        </div>

        {outing.detailHref ? <a className={styles.agenda} href={outing.detailHref}>Ver en la Agenda <ChevronRightIcon size={18} /></a> : null}
      </div>
    </div>
  </section>
}
