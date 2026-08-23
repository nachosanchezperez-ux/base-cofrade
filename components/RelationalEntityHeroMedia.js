'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './RelationalEntityHero.module.css';
import focusStyles from './RelationalEntityHeroMedia.module.css';
import polishStyles from './RelationalEntityHeroPolish.module.css';

function resolveCreditHref(photoSrc = '') {
  try {
    const url = new URL(photoSrc);
    if (url.hostname !== 'upload.wikimedia.org') return '';
    const fileName = decodeURIComponent(url.pathname.split('/').filter(Boolean).at(-1) || '');
    return fileName ? `https://commons.wikimedia.org/wiki/File:${fileName}` : '';
  } catch {
    return '';
  }
}

export default function RelationalEntityHeroMedia({
  variant = 'image',
  photoSrc = '',
  photoAlt = '',
  credit = '',
  initials = '',
  crestSrc = '',
  crestAlt = '',
  focusPosition = '',
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
  const [detectedPortrait, setDetectedPortrait] = useState(false);
  const hasPhoto = Boolean(photoSrc) && !photoError;
  const hasCrest = Boolean(crestSrc) && !crestError;
  const hasDimensions = Number(width) > 0 && Number(height) > 0;
  const isPortrait = hasDimensions
    ? Number(height) > Number(width) * 1.12
    : detectedPortrait;
  const autoContain = variant === 'step' && isPortrait;
  const resolvedFit = fitMode === 'auto' ? (autoContain ? 'contain' : 'cover') : fitMode;
  const usePortraitStepLayout = variant === 'step' && resolvedFit === 'contain' && isPortrait;
  const fallbackLabel = variant === 'band' ? 'Logotipo de la banda' : 'Escudo de la hermandad';
  const creditHref = resolveCreditHref(photoSrc);

  const desktopFocus = focusPosition || `${focusX ?? 50}% ${focusY ?? 50}%`;
  const mobileFocus = `${mobileFocusX ?? focusX ?? 50}% ${mobileFocusY ?? focusY ?? 50}%`;
  const figureStyle = {
    '--hero-desktop-focus': desktopFocus,
    '--hero-mobile-focus': mobileFocus,
    ...(usePortraitStepLayout ? { maxWidth: '440px' } : {}),
  };
  const photoStyle = {
    zIndex: 1,
    visibility: 'visible',
    opacity: 1,
    objectFit: resolvedFit,
  };

  return (
    <figure
      className={`${styles.media} ${styles[`media_${variant}`] || ''} ${polishStyles.media} ${polishStyles[`media_${variant}`] || ''}`}
      style={figureStyle}
    >
      <div
        className={`${styles.mediaFrame} ${polishStyles.mediaFrame}`}
        style={usePortraitStepLayout ? { aspectRatio: '2 / 3' } : undefined}
      >
        {hasPhoto ? (
          <Image
            className={`${styles.photo} ${focusStyles.focusedPhoto}`}
            src={photoSrc}
            alt={photoAlt}
            fill
            preload
            style={photoStyle}
            sizes={variant === 'image'
              ? '(max-width: 980px) min(100vw - 40px, 560px), 500px'
              : '(max-width: 980px) min(100vw - 40px, 720px), 700px'}
            onLoad={(event) => {
              if (variant !== 'step' || hasDimensions) return;
              const image = event.currentTarget;
              setDetectedPortrait(image.naturalHeight > image.naturalWidth * 1.12);
            }}
            onError={() => setPhotoError(true)}
          />
        ) : hasCrest ? (
          <div className={styles.crestFallback}>
            <Image
              className={styles.crestFallbackImage}
              src={crestSrc}
              alt={crestAlt}
              width={220}
              height={260}
              sizes="220px"
              preload
              onError={() => setCrestError(true)}
            />
            <small>{fallbackLabel}</small>
          </div>
        ) : (
          <div className={styles.initialsFallback}>
            <span>{initials || 'HC'}</span>
            <small>Imagen pendiente de incorporar</small>
          </div>
        )}

        {hasPhoto ? (
          <span className={`${styles.photoShade} ${polishStyles.photoShade}`} style={{ zIndex: 2 }} aria-hidden="true" />
        ) : null}
      </div>

      {hasPhoto && credit ? (
        <figcaption>
          {creditHref ? (
            <a href={creditHref} target="_blank" rel="noreferrer">{credit}</a>
          ) : credit}
        </figcaption>
      ) : null}
    </figure>
  );
}
