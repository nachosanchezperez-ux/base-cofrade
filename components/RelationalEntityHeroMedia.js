'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './RelationalEntityHero.module.css';

export default function RelationalEntityHeroMedia({
  variant = 'image',
  photoSrc = '',
  photoAlt = '',
  credit = '',
  initials = '',
  crestSrc = '',
  crestAlt = '',
  width = null,
  height = null,
  focusX = 50,
  focusY = 50,
  mobileFocusX = focusX,
  mobileFocusY = focusY,
  fitMode = 'auto',
}) {
  const [photoError, setPhotoError] = useState(false);
  const [crestError, setCrestError] = useState(false);
  const [detectedPortrait, setDetectedPortrait] = useState(null);
  const hasPhoto = Boolean(photoSrc) && !photoError;
  const hasCrest = Boolean(crestSrc) && !crestError;
  const hasDimensions = Number(width) > 0 && Number(height) > 0;
  const isPortrait = hasDimensions
    ? Number(height) > Number(width) * 1.12
    : detectedPortrait === true;
  const resolvedFit = fitMode === 'auto'
    ? variant === 'step' && isPortrait ? 'contain' : 'cover'
    : fitMode;

  return (
    <figure
      className={`${styles.media} ${styles[`media_${variant}`]}`}
      data-fit={resolvedFit}
      data-orientation={isPortrait ? 'portrait' : 'landscape'}
      style={{
        '--hero-focus-x': `${focusX}%`,
        '--hero-focus-y': `${focusY}%`,
        '--hero-mobile-focus-x': `${mobileFocusX ?? focusX}%`,
        '--hero-mobile-focus-y': `${mobileFocusY ?? focusY}%`,
      }}
    >
      <div className={styles.mediaFrame}>
        {hasPhoto ? (
          <Image
            className={styles.photo}
            src={photoSrc}
            alt={photoAlt}
            fill
            preload
            sizes={variant === 'image'
              ? '(max-width: 980px) min(100vw - 40px, 560px), 470px'
              : '(max-width: 980px) min(100vw - 40px, 760px), 650px'}
            onLoad={(event) => {
              if (fitMode === 'auto' && !hasDimensions) {
                setDetectedPortrait(event.currentTarget.naturalHeight > event.currentTarget.naturalWidth * 1.12);
              }
            }}
            onError={() => setPhotoError(true)}
          />
        ) : hasCrest ? (
          <div className={styles.crestFallback}>
            <Image className={styles.crestFallbackImage} src={crestSrc} alt={crestAlt} width={220} height={260} sizes="220px" preload onError={() => setCrestError(true)} />
            <small>Escudo de la hermandad</small>
          </div>
        ) : (
          <div className={styles.initialsFallback}>
            <span>{initials || 'HC'}</span>
            <small>Imagen pendiente de incorporar</small>
          </div>
        )}
        {hasPhoto ? <span className={styles.photoShade} aria-hidden="true" /> : null}
      </div>
      {hasPhoto && credit ? <figcaption>{credit}</figcaption> : null}
    </figure>
  );
}
