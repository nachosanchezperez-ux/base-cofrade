import Image from 'next/image'
import Link from 'next/link'
import HomeMarchPlayer from '@/components/HomeMarchPlayer'
import styles from './HomeTodayV2.module.css'
import polishStyles from './HomeResponsivePolish.module.css'

function isSvg(path = '') {
  return String(path).toLowerCase().endsWith('.svg')
}

function CardVisual({ visual, featured = false }) {
  if (!visual?.path) return null
  const photo = visual.kind === 'photo'

  return (
    <div
      className={`${styles.visual} ${photo ? styles.visualPhoto : styles.visualIdentity} ${featured ? styles.featureVisual : ''} ${polishStyles.todayVisual}`}
      title={photo && visual.credit ? visual.credit : undefined}
      data-home-visual-kind={visual.kind || 'identity'}
    >
      <Image
        src={visual.path}
        alt={visual.alt || ''}
        fill
        sizes={photo ? featured ? '(max-width: 859px) 100vw, 52vw' : '(max-width: 859px) 96px, 112px' : '78px'}
        className={photo ? styles.visualPhotoImage : styles.visualIdentityImage}
        style={photo && visual.focusPosition ? { objectPosition: visual.focusPosition } : undefined}
        unoptimized={isSvg(visual.path)}
      />
    </div>
  )
}

function RelationshipTrail({ value }) {
  const parts = String(value || '').split('→').map((part) => part.trim()).filter(Boolean)
  if (!parts.length) return null

  return (
    <span className={styles.kicker} aria-label={`Recorrido: ${parts.join(', ')}`}>
      {parts.map((part, index) => (
        <span className={styles.kickerStep} key={`${part}-${index}`}>
          {index ? <span className={styles.kickerArrow} aria-hidden="true">→</span> : null}
          <span>{part}</span>
        </span>
      ))}
    </span>
  )
}

function MusicVisual({ march }) {
  return (
    <div className={styles.musicVisual}>
      {march.coverImagePath ? (
        <Image
          src={march.coverImagePath}
          alt={march.coverImageAlt || ''}
          fill
          sizes="(max-width: 859px) 74px, 112px"
          className={styles.musicCover}
          unoptimized={isSvg(march.coverImagePath)}
        />
      ) : (
        <span aria-hidden="true">♪</span>
      )}
    </div>
  )
}

export default function HomeTodayV2({ today, content }) {
  const featured = content?.ephemeris || content?.editorial || content?.fact || null
  const secondaryCards = [
    content?.fact !== featured ? content?.fact : null,
    content?.discovery,
  ].filter(Boolean)
  const hasContent = Boolean(featured) || secondaryCards.length > 0 || Boolean(content?.march)
  if (!hasContent) return null

  const renderCard = (card, { isFeatured = false } = {}) => (
    <article
      className={`${styles.card} ${isFeatured ? styles.featureCard : styles.compactCard} ${polishStyles.todayCard} ${card.kind === 'discovery' ? styles.discoveryCard : ''} ${card.visual?.path ? `${styles.cardWithVisual} ${polishStyles.todayCardWithVisual}` : ''}`}
      key={`${card.kind}-${card.id}`}
    >
      <span className={`${styles.icon} ${polishStyles.todayIcon}`} aria-hidden="true">{card.icon}</span>
      <div className={styles.copy}>
        <div className={styles.topline}>
          <span className={styles.type}>{card.label}</span>
          <RelationshipTrail value={card.kicker} />
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
      <CardVisual visual={card.visual} featured={isFeatured} />
    </article>
  )

  return (
    <section className={`${styles.section} ${polishStyles.todaySection}`} id="hoy">
      <div className="shell">
        <header className={`${styles.header} ${polishStyles.todayHeader}`}>
          <span className={styles.date}>{today}</span>
          <h2>Hoy en Hilo Cofrade</h2>
          <p>Una selección diaria para descubrir historias, relaciones, datos y música de la enciclopedia.</p>
        </header>

        {featured || secondaryCards.length ? (
          <div className={`${styles.editorialGrid} ${polishStyles.todayGrid}`}>
            {featured ? renderCard(featured, { isFeatured: true }) : null}
            {secondaryCards.length ? (
              <div className={styles.sideColumn}>
                {secondaryCards.map((card) => renderCard(card))}
              </div>
            ) : null}
          </div>
        ) : null}

        {content?.march ? (
          <article className={`${styles.musicCard} ${polishStyles.todayMusic}`}>
            <MusicVisual march={content.march} />
            <div className={`${styles.musicCopy} ${polishStyles.todayMusicCopy}`}>
              <span className={styles.type}>Marcha del día</span>
              <h3>{content.march.title}</h3>
              <p className={styles.musicByline}>
                {content.march.composer ? <strong>{content.march.composer}</strong> : null}
                {content.march.year ? <> · {content.march.year}</> : null}
                {content.march.dedicatee ? <> · Dedicada a <strong>{content.march.dedicatee}</strong></> : null}
              </p>
              {content.march.performedBy || content.march.releaseTitle ? (
                <div className={styles.musicContext}>
                  {content.march.performedBy ? (
                    <span>
                      <small>Interpretación</small>
                      {content.march.bandHref ? <Link href={content.march.bandHref}>{content.march.performedBy}</Link> : <strong>{content.march.performedBy}</strong>}
                    </span>
                  ) : null}
                  {content.march.releaseTitle ? (
                    <span>
                      <small>Grabación</small>
                      <strong>{content.march.releaseTitle}</strong>
                    </span>
                  ) : null}
                </div>
              ) : null}
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
              {content.march.releaseHref ? (
                <Link className={styles.musicLink} href={content.march.releaseHref}>Ver la discografía →</Link>
              ) : content.march.bandHref ? (
                <Link className={styles.musicLink} href={content.march.bandHref}>Conocer la formación →</Link>
              ) : null}
            </div>
          </article>
        ) : null}
      </div>
    </section>
  )
}
