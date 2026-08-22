import Link from 'next/link'
import HomeMarchPlayer from '@/components/HomeMarchPlayer'
import styles from './HomeTodayV2.module.css'

export default function HomeTodayV2({ today, content }) {
  const cards = [content?.ephemeris, content?.editorial, content?.discovery].filter(Boolean)
  const hasContent = cards.length > 0 || Boolean(content?.march)
  if (!hasContent) return null

  return (
    <section className={styles.section} id="hoy">
      <div className="shell">
        <header className={styles.header}>
          <span className={styles.date}>{today}</span>
          <h2>Hoy en Hilo Cofrade</h2>
          <p>Una selección diaria para descubrir historias, relaciones, datos y música de la enciclopedia.</p>
        </header>

        {cards.length ? (
          <div className={styles.grid}>
            {cards.map((card) => (
              <article
                className={`${styles.card} ${card.kind === 'discovery' ? styles.discoveryCard : ''}`}
                key={`${card.kind}-${card.id}`}
              >
                <span className={styles.icon} aria-hidden="true">{card.icon}</span>
                <div className={styles.copy}>
                  <div className={styles.topline}>
                    <span className={styles.type}>{card.label}</span>
                    {card.kicker ? <span className={styles.kicker}>{card.kicker}</span> : null}
                  </div>
                  <h3>{card.title}</h3>
                  {card.summary ? <p>{card.summary}</p> : null}
                  {card.href ? (
                    <Link className={styles.link} href={card.href}>{card.linkLabel}</Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {content?.march ? (
          <article className={styles.musicCard}>
            <div className={styles.musicCopy}>
              <span className={styles.type}>Marcha del día</span>
              <h3>{content.march.title}</h3>
              <p>
                {content.march.composer ? <strong>{content.march.composer}</strong> : null}
                {content.march.year ? <> · {content.march.year}</> : null}
                {content.march.dedicatee ? <> · Dedicada a <strong>{content.march.dedicatee}</strong></> : null}
              </p>
              {content.march.whyToday ? (
                <div className={styles.whyToday}>
                  <span>Por qué escucharla hoy</span>
                  <p>{content.march.whyToday}</p>
                </div>
              ) : null}
            </div>
            <div className={styles.player}>
              <HomeMarchPlayer
                videoId={content.march.videoId}
                listenUrl={content.march.listenUrl}
                title={content.march.title}
              />
            </div>
          </article>
        ) : null}
      </div>
    </section>
  )
}
