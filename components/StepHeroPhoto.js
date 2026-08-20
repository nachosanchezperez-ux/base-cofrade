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
