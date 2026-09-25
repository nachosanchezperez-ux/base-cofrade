import Link from 'next/link'
import styles from './ContextAgendaSection.module.css'

function itemTime(item) {
  return item.timeText || item.startTime || 'Hora por confirmar'
}

export default function ContextAgendaSection({
  id = 'agenda',
  eyebrow = 'Agenda',
  title = 'Próximas citas',
  description = '',
  items = [],
  links = [],
  maxItems = 8,
  showMunicipality = true,
}) {
  const visible = (Array.isArray(items) ? items : []).slice(0, maxItems)
  if (!visible.length) return null

  return (
    <section className={styles.section} id={id}>
      <div className="shell">
        <header className={styles.header}>
          <div>
            <span>{eyebrow}</span>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <strong>{items.length} {items.length === 1 ? 'cita' : 'citas'}</strong>
        </header>

        <div className={styles.grid}>
          {visible.map((item) => (
            <article className={styles.card} key={item.key || item.href || item.id}>
              <time className={styles.date} dateTime={item.date || undefined}>
                <strong>{item.dateInfo?.day || '—'}</strong>
                <span>{item.dateInfo?.month || 'FECHA'}</span>
                <small>{item.dateInfo?.year || ''}</small>
              </time>
              <div className={styles.copy}>
                <div className={styles.topline}>
                  <span>{item.categoryLabel || item.calendarLabel || 'Acto'}</span>
                  {item.calendarLabel ? <small>{item.calendarLabel}</small> : null}
                </div>
                <h3>{item.href ? <Link href={item.href}>{item.title}</Link> : item.title}</h3>
                {item.context ? <p className={styles.context}>{item.context}</p> : null}
                {item.summary ? <p className={styles.summary}>{item.summary}</p> : null}
                <div className={styles.facts}>
                  <span><small>Hora</small><strong>{itemTime(item)}</strong></span>
                  {showMunicipality && item.municipality ? (
                    <span><small>Localidad</small>{item.municipalityHref ? <Link href={item.municipalityHref}>{item.municipality}</Link> : <strong>{item.municipality}</strong>}</span>
                  ) : null}
                  {item.place ? <span><small>Lugar</small><strong>{item.place}</strong></span> : null}
                </div>
                <div className={styles.actions}>
                  {item.href ? <Link href={item.href}>{item.actionLabel || 'Abrir acto'} <span aria-hidden="true">→</span></Link> : null}
                  {item.brotherhoodHref ? <Link href={item.brotherhoodHref}>Ver Hermandad</Link> : null}
                  {item.calendarHref && item.calendarHref !== item.href ? <Link href={item.calendarHref}>Ver {item.calendarLabel || 'calendario'}</Link> : null}
                </div>
              </div>
            </article>
          ))}
        </div>

        {links.length ? (
          <nav className={styles.links} aria-label="Seguir explorando">
            <span>Seguir explorando</span>
            {links.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
          </nav>
        ) : null}
      </div>
    </section>
  )
}
