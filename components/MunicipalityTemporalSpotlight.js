import Link from 'next/link'
import styles from './MunicipalityTemporalSpotlight.module.css'

function targetHref(item) {
  return item?.href || item?.calendarHref || '/agenda-cofrade'
}

function timeLabel(item) {
  return item?.timeText || item?.startTime || 'Hora por confirmar'
}

function TemporalCard({ label, value, copy, href }) {
  return (
    <Link className={styles.metricCard} href={href}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{copy}</p>
      <small>Ver citas →</small>
    </Link>
  )
}

export default function MunicipalityTemporalSpotlight({
  hub,
  todayHref,
  tomorrowHref,
  weekendHref,
  filteredAgendaHref,
}) {
  const temporal = hub.temporal || {}
  const liveItems = temporal.liveItems || []
  const closestItems = temporal.closestItems || []

  return (
    <section className={styles.section} aria-labelledby="local-temporal-title">
      <div className="shell">
        <header className={styles.heading}>
          <div>
            <span>Qué ver en {hub.label}</span>
            <h2 id="local-temporal-title">Primero, lo más cercano en el tiempo</h2>
          </div>
          <p>La prioridad se calcula únicamente con fecha y horario documentados. No es una selección editorial manual.</p>
        </header>

        {liveItems.length ? (
          <section className={styles.live} aria-labelledby="local-live-title">
            <header>
              <span><i aria-hidden="true" /> En la calle ahora</span>
              <strong id="local-live-title">{liveItems.length} {liveItems.length === 1 ? 'cita en curso' : 'citas en curso'}</strong>
            </header>
            <div className={styles.liveGrid}>
              {liveItems.map((item) => (
                <article key={item.key || item.id}>
                  <div>
                    <small>{item.categoryLabel || item.calendarLabel}</small>
                    <h3>{item.title}</h3>
                    <p>{[item.organizer, item.place].filter(Boolean).join(' · ')}</p>
                  </div>
                  <div className={styles.liveTime}>
                    {item.startTime ? <span>Salida <strong>{item.startTime}</strong></span> : null}
                    {item.endTime ? <span>Entrada <strong>{item.endTime}</strong></span> : null}
                  </div>
                  <Link href={targetHref(item)}>Seguir →</Link>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <div className={styles.metrics}>
          <TemporalCard
            label="Ahora"
            value={liveItems.length}
            copy={liveItems.length ? 'Procesiones o rosarios en curso.' : 'Sin actos con horario en curso.'}
            href={todayHref}
          />
          <TemporalCard
            label="Hoy"
            value={(temporal.todayItems || []).length}
            copy="Todas las citas documentadas para hoy."
            href={todayHref}
          />
          <TemporalCard
            label="Mañana"
            value={(temporal.tomorrowItems || []).length}
            copy="Lo previsto para el día siguiente."
            href={tomorrowHref}
          />
          <TemporalCard
            label="Fin de semana"
            value={(temporal.weekendItems || []).length}
            copy="Citas del sábado y domingo más próximos."
            href={weekendHref}
          />
        </div>

        {closestItems.length ? (
          <section className={styles.closest} aria-labelledby="closest-title">
            <header>
              <div>
                <span>No te pierdas</span>
                <h3 id="closest-title">Las próximas citas de {hub.label}</h3>
              </div>
              <p>Orden automático por proximidad temporal.</p>
            </header>
            <div className={styles.closestGrid}>
              {closestItems.map((item, index) => (
                <article key={item.key || item.id}>
                  <div className={styles.rank}>{String(index + 1).padStart(2, '0')}</div>
                  <div className={styles.closestCopy}>
                    <div>
                      <span>{item.categoryLabel || item.calendarLabel || 'Acto'}</span>
                      <small>{item.dateInfo?.weekdayLabel || item.dateInfo?.label || item.date || ''}</small>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{[timeLabel(item), item.place, item.organizer].filter(Boolean).join(' · ')}</p>
                    <div className={styles.closestActions}>
                      <Link href={targetHref(item)}>Ver cita →</Link>
                      {item.brotherhoodHref ? <Link href={item.brotherhoodHref}>Hermandad</Link> : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  )
}
