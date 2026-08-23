import Image from 'next/image'
import Link from 'next/link'
import HomeMarchPlayer from '@/components/HomeMarchPlayer'
import styles from './HomeTodayV2.module.css'
import polishStyles from './HomeResponsivePolish.module.css'

function isSvg(path = '') {
  return String(path).toLowerCase().endsWith('.svg')
}

function CardVisual({ visual }) {
  if (!visual?.path) return null
  const photo = visual.kind === 'photo'

  return (
    <div
      className={`${styles.visual} ${photo ? styles.visualPhoto : styles.visualIdentity} ${polishStyles.todayVisual}`}
      title={photo && visual.credit ? visual.credit : undefined}
    >
      <Image
        src={visual.path}
        alt={visual.alt || ''}
        fill
        sizes={photo ? '(max-width: 859px) 96px, 112px' : '78px'}
        className={photo ? styles.visualPhotoImage : styles.visualIdentityImage}
        style={photo && visual.focusPosition ? { objectPosition: visual.focusPosition } : undefined}
        unoptimized={isSvg(visual.path)}
      />
    </div>
  )
}

export default function HomeTodayV2({ today, content }) {
  const cards = [content?.ephemeris, content?.editorial, content?.discovery].filter(Boolean)
  const hasContent = cards.length > 0 || Boolean(content?.march)
  if (!hasContent) return null

  return (
    <section className={`${styles.section} ${polishStyles.todaySection}`} id="hoy">
      <div className="shell">
        <header className={`${styles.header} ${polishStyles.todayHeader}`}>
          <span className={styles.date}>{today}</span>
          <h2>Hoy en Hilo Cofrade</h2>
          <p>Una selección diaria para descubrir historias, relaciones, datos y música de la enciclopedia.</p>
        </header>

        {cards.length ? (
          <div className={`${styles.grid} ${polishStyles.todayGrid}`}>
            {cards.map((card) => (
              <article
                className={`${styles.card} ${polishStyles.todayCard} ${card.kind === 'discovery' ? styles.discoveryCard : ''} ${card.visual?.path ? `${styles.cardWithVisual} ${polishStyles.todayCardWithVisual}` : ''}`}
                key={`${card.kind}-${card.id}`}
              >
                <span className={`${styles.icon} ${polishStyles.todayIcon}`} aria-hidden="true">{card.icon}</span>
                <div className={styles.copy}>
                  <div className={styles.topline}>
                    <span className={styles.type}>{card.label}</span>
                    {card.kicker ? <span className={styles.kicker}>{card.kicker}</span> : null}
                  </div>
                  {card.visual?.kind === 'context-crest' && card.visual.contextName ? (
                    <span className={styles.context}>En {card.visual.contextName}</span>
                  ) : null}
                  <h3>{card.title}</h3>
                  {card.summary ? <p>{card.summary}</p> : null}
                  {card.href ? (
                    <Link className={`${styles.link} ${polishStyles.todayLink}`} href={card.href}>{card.linkLabel}</Link>
                  ) : null}
                </div>
                <CardVisual visual={card.visual} />
              </article>
            ))}
          </div>
        ) : null}

        {content?.march ? (
          <article className={`${styles.musicCard} ${polishStyles.todayMusic}`}>
            <div className={styles.musicAccent} aria-hidden="true">
              <span>♪</span>
            </div>
            <div className={`${styles.musicCopy} ${polishStyles.todayMusicCopy}`}>
              <span className={styles.type}>Marcha del día</span>
              <h3>{content.march.title}</h3>
              <p>
                {content.march.composer ? <strong>{content.march.composer}</strong> : null}
                {content.march.year ? <> · {content.march.year}</> : null}
                {content.march.dedicatee ? <> · Dedicada a <strong>{content.march.dedicatee}</strong></> : null}
              </p>
              {content.march.whyToday ? (
                <div className={`${styles.whyToday} ${polishStyles.todayWhy}`}>
                  <span>Por qué escucharla hoy</span>
                  <p>{content.march.whyToday}</p>
                </div>
              ) : null}
            </div>
            <div className={`${styles.player} ${polishStyles.todayPlayer}`}>
              <HomeMarchPlayer
                videoId={content.march.videoId}
                listenUrl={content.march.listenUrl}
                title={content.march.title}
                variant="inverse"
              />
            </div>
          </article>
        ) : null}
      </div>
    </section>
  )
}
