'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function EntityHeroPortrait({ src, alt, credit, initials }) {
  const [hasError, setHasError] = useState(false);
  const hasImage = Boolean(src) && !hasError;

  return (
    <figure className={`image-detail-photo-v2 ${hasImage ? 'has-image' : 'is-fallback'}`}>
      {hasImage ? (
        <div className="image-detail-photo-media-v2">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 980px) 100vw, 52vw"
            onError={() => setHasError(true)}
          />
        </div>
      ) : (
        <div className="image-detail-photo-fallback-v2">
          <span>{initials}</span>
          <small>Fotografía del titular</small>
        </div>
      )}

      {hasImage && credit ? <figcaption>{credit}</figcaption> : null}
    </figure>
  );
}
