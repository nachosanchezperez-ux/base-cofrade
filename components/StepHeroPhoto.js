'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function StepHeroPhoto({ src, alt, credit }) {
  const [hasError, setHasError] = useState(false);
  const hasImage = Boolean(src) && !hasError;

  if (!hasImage) {
    return <div className="step-photo-placeholder">Fotografía del paso</div>;
  }

  return (
    <figure className="step-hero-photo">
      <Image
        className="step-hero-photo-backdrop"
        src={src}
        alt=""
        fill
        priority
        sizes="(max-width: 900px) 100vw, 46vw"
        aria-hidden="true"
      />
      <Image
        className="step-hero-photo-image"
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 900px) 100vw, 46vw"
        onError={() => setHasError(true)}
      />
      {credit ? <figcaption>{credit}</figcaption> : null}
    </figure>
  );
}
