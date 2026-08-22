'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './RelationalEntityHero.module.css';
import focusStyles from './RelationalEntityHeroMedia.module.css';

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
    <figure className={`${styles.media} ${styles[`media_${variant}`]}`} style={figureStyle}>
      <div className={styles.mediaFrame} style={usePortraitStepLayout ? { aspectRatio: '2 / 3' } : undefined}>
        {hasPhoto ? (
          <Image
            className={`${styles.photo} ${focusStyles.focusedPhoto}`}
            src={photoSrc}
            alt={photoAlt}
            fill
            preload
            style={photoStyle}
            sizes={variant === 'image'
              ? '(max-width: 980px) min(100vw - 40px, 560px), 470px'
              : '(max-width: 980px) min(100vw - 40px, 720px), 640px'}
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
            <small>Escudo de la hermandad</small>
          </div>
        ) : (
          <div className={styles.initialsFallback}>
            <span>{initials || 'HC'}</span>
            <small>Imagen pendiente de incorporar</small>
          </div>
        )}

        {hasPhoto ? <span className={styles.photoShade} style={{ zIndex: 2 }} aria-hidden="true" /> : null}
      </div>

      {variant !== 'brotherhood' && hasPhoto && hasCrest ? (
        <span className={styles.crestOverlay}>
          <Image src={crestSrc} alt="" width={92} height={108} sizes="92px" onError={() => setCrestError(true)} />
        </span>
      ) : null}

      {hasPhoto && credit ? <figcaption>{credit}</figcaption> : null}
    </figure>
  );
}
