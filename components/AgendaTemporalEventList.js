import Link from 'next/link'
import styles from './AgendaTemporalEventList.module.css'

function itemTime(item) {
  if (item.timeText) return item.timeText
  if (item.startTime && item.endTime) return `${item.startTime}–${item.endTime}`
  return item.startTime || 'Hora por confirmar'
}

function dayLabel(item) {
  return item.dateInfo?.weekdayLabel || item.dateInfo?.label || item.date || 'Fecha por confirmar'
}

function groupByDate(items = []) {
  const groups = []
  const byDate = new Map()

  for (const item of items) {
    const key = item.date || 'sin-fecha'
    if (!byDate.has(key)) {
      const group = {
        key,
        label: dayLabel(item),
        day: item.dateInfo?.day || '',
        month: item.dateInfo?.month || '',
        items: [],
      }
      byDate.set(key, group)
      groups.push(group)
    }
    byDate.get(key).items.push(item)
  }

  return groups
}

function categoryLabel(item) {
  return item.categoryLabel || item.calendarLabel || item.categoryName || 'Acto'
}

export default function AgendaTemporalEventList({ landing }) {
  const groups = groupByDate(landing.items)

  return (
    <section className={styles.section} id="agenda-del-periodo" aria-labelledby="agenda-periodo-title">
      <div className="shell">
        <header className={styles.header}>
          <div>
            <span>{landing.period === 'today' ? 'Hoy' : landing.period === 'tomorrow' ? 'Mañana' : 'Fin de semana'}</span>
            <h2 id="agenda-periodo-title">Todas las citas</h2>
            <p>Hora, acto, localidad y lugar en una cronología pensada para consultar rápido desde el móvil o el ordenador.</p>
          </div>
          <strong>{landing.items.length} {landing.items.length === 1 ? 'cita' : 'citas'}</strong>
        </header>

        <div className={styles.groups}>
          {groups.map((group) => (
            <section className={styles.dayGroup} key={group.key} aria-labelledby={`agenda-dia-${group.key}`}>
              <header className={styles.dayHeading}>
                <time dateTime={group.key !== 'sin-fecha' ? group.key : undefined}>
                  <strong>{group.day || '—'}</strong>
                  <span>{group.month || 'FECHA'}</span>
                </time>
                <div>
                  <span>Jornada</span>
                  <h3 id={`agenda-dia-${group.key}`}>{group.label}</h3>
                  <small>{group.items.length} {group.items.length === 1 ? 'cita' : 'citas'}</small>
                </div>
              </header>

              <div className={styles.list}>
                {group.items.map((item) => (
                  <article className={styles.row} key={item.key || item.href || item.id}>
                    <div className={styles.time}>
                      <small>Hora</small>
                      <strong>{itemTime(item)}</strong>
                    </div>

                    <div className={styles.copy}>
                      <div className={styles.topline}>
                        <span>{categoryLabel(item)}</span>
                        {item.calendarLabel ? <small>{item.calendarLabel}</small> : null}
                      </div>
                      <h4>{item.href ? <Link href={item.href}>{item.title}</Link> : item.title}</h4>
                      <div className={styles.meta}>
                        {item.municipality ? (
                          item.municipalityHref
                            ? <Link className={styles.municipality} href={item.municipalityHref}>{item.municipality}</Link>
                            : <strong className={styles.municipality}>{item.municipality}</strong>
                        ) : null}
                        {item.place ? <span className={styles.place}>{item.place}</span> : null}
                        {item.organizer ? <span className={styles.organizer}>{item.organizer}</span> : null}
                      </div>
                      {item.summary ? <p>{item.summary}</p> : null}
                    </div>

                    <div className={styles.actions}>
                      {item.href ? <Link className={styles.primary} href={item.href}>{item.actionLabel || 'Ver cita'} <span aria-hidden="true">→</span></Link> : null}
                      {item.brotherhoodHref ? <Link href={item.brotherhoodHref}>Hermandad</Link> : null}
                      {item.municipalityHref ? <Link href={item.municipalityHref}>Guía local</Link> : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <nav className={styles.footer} aria-label="Seguir explorando la Agenda Cofrade">
          <span>Seguir explorando</span>
          <Link href="/agenda-cofrade">Agenda completa</Link>
          <Link href="/procesiones-de-gloria">Glorias</Link>
          <Link href="/extraordinarias">Extraordinarias</Link>
        </nav>
      </div>
    </section>
  )
}
