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
  focusPosition = '',
}) {
  const [photoError, setPhotoError] = useState(false);
  const [crestError, setCrestError] = useState(false);
  const hasPhoto = Boolean(photoSrc) && !photoError;
  const hasCrest = Boolean(crestSrc) && !crestError;

  return (
    <figure className={`${styles.media} ${styles[`media_${variant}`]}`}>
      <div className={styles.mediaFrame}>
        {hasPhoto ? (
          <Image
            className={styles.photo}
            src={photoSrc}
            alt={photoAlt}
            fill
            preload
            style={focusPosition ? { objectPosition: focusPosition } : undefined}
            sizes={variant === 'image'
              ? '(max-width: 980px) min(100vw - 40px, 560px), 440px'
              : '(max-width: 980px) min(100vw - 40px, 680px), 520px'}
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

        {hasPhoto ? <span className={styles.photoShade} aria-hidden="true" /> : null}
      </div>

      {hasPhoto && hasCrest ? (
        <span className={styles.crestOverlay}>
          <Image
            src={crestSrc}
            alt=""
            width={92}
            height={108}
            sizes="92px"
            onError={() => setCrestError(true)}
          />
        </span>
      ) : null}

      {hasPhoto && credit ? <figcaption>{credit}</figcaption> : null}
    </figure>
  );
}
