'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import HomeMarchPlayer from '@/components/HomeMarchPlayer'
import styles from './HomeTodayV2.module.css'
import polishStyles from './HomeResponsivePolish.module.css'
import mobileFixStyles from './HomeTodayMobileFix.module.css'
import dynamicStyles from './HomeTodayDynamic.module.css'
import gameStyles from './HiddenThreadTeaser.module.css'

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
    ? [content?.editorial, content?.fact]
    : [content?.fact, content?.editorial]
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
    <span className={`${styles.kicker} ${mobileFixStyles.relationshipTrail}`} aria-label={`Recorrido: ${parts.join(', ')}`}>
      {parts.map((part, index) => (
        <span className={styles.kickerStep} key={`${part}-${index}`}>
          <span>{part}</span>
          {/* El separador va al final del paso, para que nunca abra una línea. */}
          {index < parts.length - 1 ? <span className={styles.kickerArrow} aria-hidden="true">·</span> : null}
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

export default function HomeTodayV2({ today, content, embedded = false }) {
  const serial = dailySerial(today)
  const editorial = rotatingEditorial(content, serial)
  const dailyCards = uniqueCards([
    content?.ephemeris,
    editorial,
    content?.discovery,
    content?.discoverySecondary,
  ])
  const featured = content?.ephemeris
    || (dailyCards.length ? dailyCards[serial % dailyCards.length] : null)
  // Incrustado en la portada de 5 bloques: una sola tarjeta del día y la marcha.
  const secondaryCards = embedded ? [] : dailyCards.filter((card) => card !== featured)
  const featureRight = Boolean(featured && secondaryCards.length && !(serial % 2))
  const hasContent = dailyCards.length > 0 || Boolean(content?.march)
  if (!hasContent) return null
  // Incrustado en «Descubre Hilo Cofrade»: sin sección ni fondo propios.
  const Wrapper = embedded ? 'div' : 'section'

  const renderCard = (card, { isFeatured = false } = {}) => (
    <article
      className={`${styles.card} ${isFeatured ? `${styles.featureCard} ${mobileFixStyles.featureCard} ${dynamicStyles.featureCardSlot}` : `${styles.compactCard} ${polishStyles.todayCard}`} ${card.kind === 'discovery' ? `${styles.discoveryCard} ${mobileFixStyles.discoveryCard}` : ''} ${card.visual?.path ? `${styles.cardWithVisual} ${isFeatured ? '' : polishStyles.todayCardWithVisual}` : ''}`}
      data-home-card-kind={card.kind || 'card'}
      key={`${card.kind}-${card.id}`}
    >
      {card.kind !== 'discovery' ? (
        <span className={`${styles.icon} ${polishStyles.todayIcon} ${isFeatured ? mobileFixStyles.featureIcon : ''}`} aria-hidden="true">{card.icon}</span>
      ) : null}
      <div className={`${styles.copy} ${isFeatured ? mobileFixStyles.featureCopy : ''}`}>
        <div className={styles.topline}>
          <span className={styles.type}>{card.label}</span>
          <RelationshipTrail value={card.kicker} />
        </div>
        {card.visual?.kind === 'context-crest' && card.visual.contextName ? (
          <span className={styles.context}>En {card.visual.contextName}</span>
        ) : null}
        {/* Toda la tarjeta es el enlace (el título se extiende sobre ella), sin una
            llamada «Descubrir →» repetida en cada tarjeta. */}
        <h3>{card.href ? <Link className={styles.cardLink} href={card.href}>{card.title}</Link> : card.title}</h3>
        {card.summary ? <p>{card.summary}</p> : null}
      </div>
      <CardVisual visual={card.visual} featured={isFeatured} />
    </article>
  )

  return (
    <Wrapper
      className={embedded ? `${styles.embedded}` : `${styles.section} ${polishStyles.todaySection}`}
      id="descubre-hoy"
      data-daily-layout={featureRight ? 'lead-right' : 'lead-left'}
    >
      <div className={embedded ? undefined : 'shell'}>
        {embedded ? (
          <header className={styles.embeddedHeader}>
            <h3>Hoy en Hilo Cofrade</h3>
            <span className={styles.date}>{today}</span>
          </header>
        ) : (
          <header className={`${styles.header} ${polishStyles.todayHeader}`}>
            <span className={styles.date}>{today}</span>
            <h2>Descubre hoy en Hilo Cofrade</h2>
          </header>
        )}

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
          <article className={`${styles.musicCard} ${polishStyles.todayMusic}`} data-home-weight={embedded ? 'secondary' : undefined}>
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
                variant={embedded ? 'default' : 'inverse'}
              />
              {content.march.releaseHref ? (
                <Link className={styles.musicLink} href={content.march.releaseHref}>Ver la discografía</Link>
              ) : content.march.bandHref ? (
                <Link className={styles.musicLink} href={content.march.bandHref}>Conocer la formación</Link>
              ) : null}
            </div>
          </article>
        ) : null}

        <aside className={`${gameStyles.teaser} ${embedded ? gameStyles.teaserFeature : ''}`} aria-label="El hilo escondido, juego cofrade del día">
          {embedded ? <span className={gameStyles.teaserIcon} aria-hidden="true">?</span> : null}
          <div className={gameStyles.teaserCopy}>
            <span>Un reto cofrade cada día</span>
            <strong>El hilo escondido: ¿adivinas la palabra de hoy?</strong>
          </div>
          <Link className={gameStyles.teaserLink} href="/juegos/el-hilo-escondido">
            Jugar ahora
          </Link>
        </aside>
      </div>
    </Wrapper>
  )
}
