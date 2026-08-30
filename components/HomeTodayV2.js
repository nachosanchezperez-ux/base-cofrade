'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import HomeMarchPlayer from '@/components/HomeMarchPlayer'
import styles from './HomeTodayV2.module.css'
import polishStyles from './HomeResponsivePolish.module.css'
import mobileFixStyles from './HomeTodayMobileFix.module.css'
import dynamicStyles from './HomeTodayDynamic.module.css'

const MONTH_INDEX = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
}

function isSvg(path = '') {
  return String(path).toLowerCase().endsWith('.svg')
}

function normalized(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function dailySerial(value = '') {
  const normalizedLabel = normalized(value)
  const match = normalizedLabel.match(/(\d{1,2}) de ([a-z]+) de (\d{4})/)
  if (match && MONTH_INDEX[match[2]] !== undefined) {
    return Math.floor(Date.UTC(Number(match[3]), MONTH_INDEX[match[2]], Number(match[1])) / 86400000)
  }

  return [...normalizedLabel].reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 7)
}

function uniqueCards(cards = []) {
  const seen = new Set()
  return cards.filter((card) => {
    if (!card) return false
    const key = `${card.kind || 'card'}:${card.id || card.href || card.title}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function rotatingEditorial(content, serial) {
  if (content?.pinnedEditorialType === 'fact' && content.fact) return content.fact
  if (content?.pinnedEditorialType === 'curiosity' && content.editorial) return content.editorial

  const candidates = serial % 2
    ? [content?.fact, content?.editorial]
    : [content?.editorial, content?.fact]
  return candidates.find(Boolean) || null
}

function HomeImage({ fallback = '•', ...props }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <span className={styles.visualFallback} aria-hidden="true">{fallback}</span>
  }

  return <Image {...props} onError={() => setFailed(true)} />
}

function CardVisual({ visual, featured = false }) {
  if (!visual?.path) return null
  const photo = visual.kind === 'photo'

  return (
    <div
      className={`${styles.visual} ${photo ? styles.visualPhoto : styles.visualIdentity} ${featured ? `${styles.featureVisual} ${mobileFixStyles.featureVisual}` : polishStyles.todayVisual}`}
      title={photo && visual.credit ? visual.credit : undefined}
      data-home-visual-kind={visual.kind || 'identity'}
    >
      <HomeImage
        src={visual.path}
        alt={visual.alt || ''}
        fill
        sizes={featured ? (photo ? '(max-width: 859px) 100vw, 52vw' : '160px') : photo ? '(max-width: 859px) 96px, 112px' : '78px'}
        className={photo ? styles.visualPhotoImage : styles.visualIdentityImage}
        style={photo && visual.focusPosition ? { objectPosition: visual.focusPosition } : undefined}
        unoptimized={isSvg(visual.path)}
        fallback={visual.alt?.trim()?.charAt(0)?.toUpperCase() || '•'}
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
  const bandLogoPath = march.bandLogoPath || ''
  const visualPath = bandLogoPath || march.coverImagePath || ''
  const visualAlt = bandLogoPath
    ? march.bandLogoAlt || `Logotipo de ${march.performedBy || 'la banda intérprete'}`
    : march.coverImageAlt || ''

  return (
    <div className={styles.musicVisual}>
      {visualPath ? (
        <HomeImage
          src={visualPath}
          alt={visualAlt}
          fill
          sizes="(max-width: 859px) 74px, 112px"
          className={bandLogoPath ? styles.visualIdentityImage : styles.musicCover}
          unoptimized={isSvg(visualPath)}
          fallback="♪"
        />
      ) : (
        <span aria-hidden="true">♪</span>
      )}
    </div>
  )
}

export default function HomeTodayV2({ today, content }) {
  const serial = dailySerial(today)
  const editorial = rotatingEditorial(content, serial)
  const dailyCards = uniqueCards([
    content?.ephemeris,
    editorial,
    content?.discovery,
  ])
  const featured = content?.ephemeris
    || (dailyCards.length ? dailyCards[serial % dailyCards.length] : null)
  const secondaryCards = dailyCards.filter((card) => card !== featured)
  const featureRight = Boolean(featured && secondaryCards.length && serial % 2)
  const hasContent = dailyCards.length > 0 || Boolean(content?.march)
  if (!hasContent) return null

  const renderCard = (card, { isFeatured = false } = {}) => (
    <article
      className={`${styles.card} ${isFeatured ? `${styles.featureCard} ${mobileFixStyles.featureCard} ${dynamicStyles.featureCardSlot}` : `${styles.compactCard} ${polishStyles.todayCard}`} ${card.kind === 'discovery' ? styles.discoveryCard : ''} ${card.visual?.path ? `${styles.cardWithVisual} ${isFeatured ? '' : polishStyles.todayCardWithVisual}` : ''}`}
      key={`${card.kind}-${card.id}`}
    >
      <span className={`${styles.icon} ${polishStyles.todayIcon} ${isFeatured ? mobileFixStyles.featureIcon : ''}`} aria-hidden="true">{card.icon}</span>
      <div className={`${styles.copy} ${isFeatured ? mobileFixStyles.featureCopy : ''}`}>
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
    <section
      className={`${styles.section} ${polishStyles.todaySection}`}
      id="hoy"
      data-daily-layout={featureRight ? 'lead-right' : 'lead-left'}
    >
      <div className="shell">
        <header className={`${styles.header} ${polishStyles.todayHeader}`}>
          <span className={styles.date}>{today}</span>
          <h2>Hoy en Hilo Cofrade</h2>
          <p>Una selección que cambia cada día para descubrir historias, relaciones, datos y música de la enciclopedia.</p>
        </header>

        {featured || secondaryCards.length ? (
          <div className={`${styles.editorialGrid} ${polishStyles.todayGrid} ${featureRight ? dynamicStyles.featureRight : ''}`}>
            {featured ? renderCard(featured, { isFeatured: true }) : null}
            {secondaryCards.length ? (
              <div className={`${styles.sideColumn} ${dynamicStyles.sideColumnSlot} ${secondaryCards.length === 1 ? dynamicStyles.sideColumnSingle : ''}`}>
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
