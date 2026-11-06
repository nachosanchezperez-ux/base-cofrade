import Link from 'next/link'
import { outingCardTitle, outingDateParts, outingRouteStops, splitRouteStreets } from '@/lib/brotherhood-featured-outing'
import styles from './BrotherhoodChapterOuting.module.css'

// Salida destacada del capítulo Procesión, pensada para consultarla en la
// calle: cuándo sale y cuándo entra, quién la acompaña y por dónde pasa. El
// recorrido es una línea con los templos de salida y entrada como extremos;
// en recorridos largos, el tramo central se pliega sin romper la línea. Solo
// se muestran datos documentados: sin hora, «Por confirmar».

function Street({ name }) {
  return <li className={styles.street}><span>{name}</span></li>
}

function Time({ label, value, place }) {
  return <div className={styles.time}>
    <small>{label}</small>
    <strong className={value ? '' : styles.pending}>{value || 'Por confirmar'}</strong>
    {place ? <span>{place}</span> : null}
  </div>
}

export default function BrotherhoodChapterOuting({ outing, names = [] }) {
  if (!outing) return null
  const date = outingDateParts(outing.date)
  const route = outingRouteStops(outing.routeSummary, { origin: outing.origin, destination: outing.destination })
  const streets = splitRouteStreets(route.streets)
  const sameTemple = route.origin && route.destination && route.origin === route.destination
  const music = outing.processionalMusic?.length ? outing.processionalMusic : (outing.music || [])
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
          </div>
        </header>

        <div className={styles.times}>
          <Time label="Salida" value={outing.departureTime} place={route.origin} />
          <Time label="Entrada" value={outing.returnTime} place={sameTemple ? '' : route.destination} />
        </div>

        {music.length ? <ul className={styles.bands} aria-label="Acompañamiento musical">
          {music.map((band) => <li key={band.id || band.name}>
            <span className={styles.bandIcon} aria-hidden="true">♪</span>
            <span className={styles.bandText}>
              {band.context ? <small>{band.context}</small> : null}
              {band.href ? <Link href={band.href} prefetch={false}>{band.name}</Link> : <strong>{band.name}</strong>}
            </span>
          </li>)}
        </ul> : null}

        {route.streets.length ? <div className={styles.route}>
          <h3 className={styles.routeTitle}>Recorrido <small>{route.streets.length} calles</small></h3>
          <ol className={styles.line}>
            <li className={`${styles.stop} ${styles.endpoint}`}>
              <b>{outing.departureTime || 'Salida'}</b>
              <span>{route.origin || 'Salida'}</span>
            </li>
            {streets.head.map((name, index) => <Street key={`h-${index}`} name={name} />)}
            {streets.hidden.length ? <li className={styles.fold}>
              <details>
                <summary><span>{streets.hidden.length} calles más</span><b aria-hidden="true">+</b></summary>
                <ol className={styles.foldList}>
                  {streets.hidden.map((name, index) => <Street key={`m-${index}`} name={name} />)}
                </ol>
              </details>
            </li> : null}
            {streets.tail.map((name, index) => <Street key={`t-${index}`} name={name} />)}
            <li className={`${styles.stop} ${styles.endpoint}`}>
              <b>{outing.returnTime || 'Entrada'}</b>
              <span>{route.destination || 'Entrada'}</span>
            </li>
          </ol>
        </div> : outing.routeSummary ? <p className={styles.routeText}>{outing.routeSummary}</p> : null}

        {outing.publicNotes ? <details className={styles.notes}>
          <summary><span>Más detalles de la salida</span><b aria-hidden="true">+</b></summary>
          <p>{outing.publicNotes}</p>
        </details> : null}

        {outing.detailHref ? <a className={styles.agenda} href={outing.detailHref}>Ver en la Agenda <span aria-hidden="true">›</span></a> : null}
      </div>
    </div>
  </section>
}
