import Image from 'next/image'
import Link from 'next/link'
import styles from './MusicalRepertoiresSection.module.css'

function dateLabel(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(new Date(`${value}T12:00:00`))
}

function metricLabel(count, singular, plural) {
  return count === 1 ? singular : plural
}

export default function MusicalRepertoiresSection({ items = [], context = 'brotherhood' }) {
  if (!items.length) return null

  const first = items[0]
  const title = context === 'band' ? 'Crucetas interpretadas' : 'Crucetas musicales'
  const description = context === 'band'
    ? 'Los repertorios que la formación ha confirmado después de cada procesión.'
    : 'Las marchas que sonaron en cada procesión, documentadas por la formación musical.'

  return (
    <section
      className={styles.section}
      id="crucetas-musicales"
      style={{
        '--repertoire-primary': first.colors.primary,
        '--repertoire-accent': first.colors.accent,
      }}
    >
      <div className={`shell ${styles.shell}`}>
        <header className={styles.heading}>
          <span>Archivo sonoro</span>
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </header>

        <div className={styles.list}>
          {items.map((item) => (
            <article className={styles.card} key={item.id}>
              <div className={styles.year} aria-hidden="true">{item.year}</div>
              <div className={styles.cardTop}>
                <div className={styles.identity}>
                  {item.band.logoPath ? (
                    <Image
                      src={item.band.logoPath}
                      alt=""
                      width={112}
                      height={112}
                      sizes="112px"
                    />
                  ) : <span aria-hidden="true">♪</span>}
                </div>
                <div className={styles.status}>
                  <i aria-hidden="true" />
                  Repertorio interpretado
                </div>
              </div>

              <div className={styles.copy}>
                <span>{dateLabel(item.date)}</span>
                <h3>{item.outing.title}</h3>
                <p>{item.band.name}</p>
              </div>

              <div className={styles.metrics}>
                <div>
                  <strong>{item.worksCount}</strong>
                  <span>{metricLabel(item.worksCount, 'obra distinta', 'obras distintas')}</span>
                </div>
                <div>
                  <strong>{item.performancesCount}</strong>
                  <span>{metricLabel(item.performancesCount, 'interpretación', 'interpretaciones')}</span>
                </div>
              </div>

              <div className={styles.relations}>
                {context !== 'brotherhood' && item.brotherhood.href ? (
                  <Link href={item.brotherhood.href}><small>Hermandad</small><strong>{item.brotherhood.name}</strong></Link>
                ) : null}
                {context !== 'band' && item.band.href ? (
                  <Link href={item.band.href}><small>Banda</small><strong>{item.band.name}</strong></Link>
                ) : null}
              </div>

              <Link className={styles.open} href={item.href}>
                Consultar el repertorio completo <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
