import Link from 'next/link'
import styles from './RelatedExtraordinaryOutings.module.css'

function dateLabel(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(new Date(`${value}T12:00:00`))
}

export default function RelatedExtraordinaryOutings({ items = [], context = 'entity' }) {
  if (!items.length) return null
  const heading = context === 'band'
    ? 'Próximas extraordinarias con esta banda'
    : 'Próximas extraordinarias de la Hermandad'

  return (
    <section className={styles.section} id="proximas-extraordinarias" aria-labelledby="proximas-extraordinarias-title">
      <div className="shell">
        <div className={styles.heading}>
          <div>
            <span>Agenda relacionada</span>
            <h2 id="proximas-extraordinarias-title">{heading}</h2>
          </div>
          <Link href="/extraordinarias">Ver calendario completo <b aria-hidden="true">→</b></Link>
        </div>
        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.id}>
              <time dateTime={item.date}>{dateLabel(item.date)}</time>
              <h3><Link href={`/extraordinarias/${item.slug}`}>{item.title}</Link></h3>
              <p>{[item.municipality, item.reason].filter(Boolean).join(' · ')}</p>
              <Link className={styles.guide} href={`/extraordinarias/${item.slug}`}>Ver guía de la extraordinaria <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
