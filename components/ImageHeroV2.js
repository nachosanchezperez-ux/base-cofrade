'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './ImageHeroV2.module.css';
import roomStyles from './ImageHeroV2Room.module.css';

function Breadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
      <span className={styles.breadcrumbAccent} aria-hidden="true" />
      <ol>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !isCurrent ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>
              )}
              {!isCurrent ? <i aria-hidden="true">→</i> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function isWikimediaUpload(photoSrc = '') {
  try {
    return new URL(photoSrc).hostname === 'upload.wikimedia.org';
  } catch {
    return false;
  }
}

function ParentRelation({ relation }) {
  if (!relation?.name || !relation?.href) return null;

  return (
    <Link className={styles.relation} href={relation.href}>
      {relation.crestSrc ? (
        <span className={styles.relationCrest}>
          <Image
            src={relation.crestSrc}
            alt=""
            width={48}
            height={58}
            sizes="48px"
          />
        </span>
      ) : (
        <span className={styles.relationNode} aria-hidden="true">HC</span>
      )}
      <span className={styles.relationCopy}>
        <small>{relation.label || 'Titular de'}</small>
        <strong>{relation.name}</strong>
      </span>
      <span className={styles.relationArrow} aria-hidden="true">↗</span>
    </Link>
  );
}

export default function ImageHeroV2({
  entityType = 'Imagen',
  title,
  subtitle = '',
  breadcrumbItems = [],
  relation = null,
  facts = [],
  media = {},
}) {
  const [detectedPortrait, setDetectedPortrait] = useState(null);
  const visibleFacts = facts.filter((fact) => fact?.label && fact?.value).slice(0, 3);
  const photoSrc = media.photoSrc || '';
  const hasPhoto = Boolean(photoSrc);
  const hasDimensions = Number(media.width) > 0 && Number(media.height) > 0;
  const portraitByDimensions = hasDimensions && Number(media.height) > Number(media.width) * 1.12;
  const fitMode = media.fitMode || 'auto';
  const autoPortrait = hasDimensions ? portraitByDimensions : detectedPortrait !== false;
  const useContainedPhoto = fitMode === 'contain' || (fitMode === 'auto' && autoPortrait);
  const bypassImageOptimizer = isWikimediaUpload(photoSrc);
  const initials = media.initials || title
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    || 'HC';
  const desktopFocusX = Number(media.focusX ?? 50);
  const desktopFocusY = Number(media.focusY ?? 50);
  const mobileFocusX = Number(media.mobileFocusX ?? media.focusX ?? 50);
  const mobileFocusY = Number(media.mobileFocusY ?? media.focusY ?? 50);
  const heroStyle = {
    '--image-focus-x': `${desktopFocusX}%`,
    '--image-focus-y': `${desktopFocusY}%`,
    '--image-mobile-focus-x': `${mobileFocusX}%`,
    '--image-mobile-focus-y': `${mobileFocusY}%`,
  };

  const detectNaturalOrientation = (event) => {
    if (fitMode !== 'auto' || hasDimensions) return;
    const image = event.currentTarget;
    setDetectedPortrait(image.naturalHeight > image.naturalWidth * 1.12);
  };

  return (
    <section
      className={`${styles.hero} ${roomStyles.hero} ${hasPhoto ? styles.hasPhoto : styles.noPhoto} ${useContainedPhoto ? styles.contained : styles.covered}`}
      aria-labelledby="entity-hero-title"
      style={heroStyle}
    >
      {hasPhoto ? (
        <div className={`${styles.photoLayer} ${roomStyles.photoLayer}`} aria-hidden="true">
          {useContainedPhoto ? (
            <>
              <Image
                className={styles.photoBackdrop}
                src={photoSrc}
                alt=""
                fill
                priority
                unoptimized={bypassImageOptimizer}
                sizes="100vw"
              />
              <div className={`${styles.subjectStage} ${roomStyles.subjectStage}`}>
                <Image
                  className={`${styles.subjectPhoto} ${roomStyles.subjectPhoto}`}
                  src={photoSrc}
                  alt=""
                  fill
                  priority
                  unoptimized={bypassImageOptimizer}
                  sizes="(max-width: 780px) 100vw, 70vw"
                  onLoad={detectNaturalOrientation}
                />
              </div>
            </>
          ) : (
            <Image
              className={`${styles.coverPhoto} ${roomStyles.coverPhoto}`}
              src={photoSrc}
              alt=""
              fill
              priority
              unoptimized={bypassImageOptimizer}
              sizes="100vw"
            />
          )}
        </div>
      ) : (
        <span className={styles.initialsBackdrop} aria-hidden="true">{initials}</span>
      )}

      <span
        className={`${styles.photoVeil} ${roomStyles.photoVeil} ${useContainedPhoto ? roomStyles.containedVeil : ''}`}
        aria-hidden="true"
      />
      <span className={styles.vignette} aria-hidden="true" />
      <span className={styles.texture} aria-hidden="true" />

      <div className={`shell ${styles.shell}`}>
        <Breadcrumb items={breadcrumbItems} />

        <div className={`${styles.content} ${roomStyles.content}`}>
          <div className={styles.entityMeta}>
            <span className={styles.entityLine} aria-hidden="true" />
            <span>{entityType}</span>
          </div>

          <h1 className={roomStyles.title} id="entity-hero-title">{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}

          <ParentRelation relation={relation} />

          {visibleFacts.length ? (
            <dl className={`${styles.facts} ${roomStyles.facts}`} data-count={visibleFacts.length}>
              {visibleFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>
                    {fact.href ? <Link href={fact.href}>{fact.value}</Link> : fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>

      {hasPhoto && media.credit ? (
        <span className={`${styles.credit} ${roomStyles.credit}`}>{media.credit}</span>
      ) : null}
    </section>
  );
}
