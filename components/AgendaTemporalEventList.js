import Link from 'next/link'
import ShareActions, { CalendarAddLink } from '@/components/ShareActions'
import AgendaEventThread from '@/components/AgendaEventThread'
import { agendaItemShare } from '@/lib/share'
import { agendaEventAnchor, scheduleTimeHint } from '@/lib/agenda-event-presentation'
import { agendaThreadLinks } from '@/lib/agenda-event-relations'
import styles from './AgendaTemporalEventList.module.css'

function itemTime(item) {
  if (item.timeText) return item.timeText
  if (item.startTime && item.endTime) return `${item.startTime}–${item.endTime}`
  return item.startTime || scheduleTimeHint(item.schedule) || 'Hora por confirmar'
}

function dayLabel(item) {
  return item.temporalDateInfo?.weekdayLabel || item.dateInfo?.weekdayLabel || item.dateInfo?.label || item.temporalDate || item.date || 'Fecha por confirmar'
}

function groupByDate(items = []) {
  const groups = []
  const byDate = new Map()

  for (const item of items) {
    const key = item.temporalDate || item.date || 'sin-fecha'
    const info = item.temporalDateInfo || item.dateInfo || {}
    if (!byDate.has(key)) {
      const group = {
        key,
        label: dayLabel(item),
        day: info.day || '',
        month: info.month || '',
        items: [],
      }
      byDate.set(key, group)
      groups.push(group)
    }
    byDate.get(key).items.push(item)
  }

  return groups
}

// En los conciertos `actionLabel` es «Ver banda»: la acción principal abre la cita.
function primaryLabel(item) {
  return item.category === 'concerts' ? 'Ver cita' : item.actionLabel || 'Ver cita'
}

function categoryLabel(item) {
  return item.categoryLabel || item.calendarLabel || item.categoryName || 'Acto'
}

export default function AgendaTemporalEventList({ landing }) {
  const groups = groupByDate(landing.items)
  // Actos distintos: el de varios días se lista en cada uno de sus días.
  const count = landing.count ?? landing.items.length

  return (
    <section className={styles.section} id="agenda-del-periodo" aria-labelledby="agenda-periodo-title">
      <div className="shell">
        <header className={styles.header}>
          <div>
            <span>{landing.period === 'today' ? 'Hoy' : landing.period === 'tomorrow' ? 'Mañana' : 'Fin de semana'}</span>
            <h2 id="agenda-periodo-title">{landing.listHeading || 'Todos los actos cofrades'}</h2>
          </div>
          <strong>{count} {count === 1 ? 'acto' : 'actos'}</strong>
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
                  <article
                    className={styles.row}
                    data-category={item.category || 'other'}
                    key={item.displayKey || item.key || item.href || item.id}
                  >
                    <div className={styles.time}>
                      <span className="sr-only">Hora: </span>
                      <strong>{itemTime(item)}</strong>
                    </div>

                    <div className={styles.copy}>
                      <div className={styles.topline}>
                        <span>{categoryLabel(item)}</span>
                        <ShareActions
                          compact
                          iconsOnly
                          className={styles.shareIcons}
                          share={agendaItemShare(item)}
                          contentType="agenda"
                          analytics={{ event_type: item.category, municipality: item.municipality, agenda_period: landing.period }}
                        />
                      </div>
                      <h4>{item.eventHref ? <Link href={item.eventHref}>{item.title}</Link> : item.title}</h4>
                      <div className={styles.meta}>
                        {item.municipality ? (
                          item.municipalityHref
                            ? <Link className={styles.municipality} href={item.municipalityHref} aria-label={`Guía local de ${item.municipality}`}>{item.municipality}</Link>
                            : <strong className={styles.municipality}>{item.municipality}</strong>
                        ) : null}
                        {item.place ? <span className={styles.place}>{item.place}</span> : null}
                        {/* Si la entidad tiene ficha, su nombre ya va enlazado en el hilo. */}
                        {item.organizer && !agendaThreadLinks(item).some((link) => link.kind === 'brotherhood' || link.kind === 'band')
                          ? <span className={styles.organizer}>{item.organizer}</span>
                          : null}
                      </div>
                      {item.summary ? <p>{item.summary}</p> : null}
                      <AgendaEventThread item={item} compact />
                    </div>
                    <div className={styles.actions}>
                      {item.eventHref ? <Link className={styles.primary} href={item.eventHref}>{primaryLabel(item)} <span aria-hidden="true">→</span></Link> : null}
                      <CalendarAddLink
                        href={item.date ? `/calendario/acto/${agendaEventAnchor(item)}.ics` : ''}
                        title={item.title}
                        contentType="agenda"
                        analytics={{ event_type: item.category, municipality: item.municipality, agenda_period: landing.period }}
                      />
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
          <Link href="/igualas-y-ensayos">Igualás y ensayos</Link>
        </nav>
      </div>
    </section>
  )
}
