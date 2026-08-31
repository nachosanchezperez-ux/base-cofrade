'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './glory-detail.module.css'

export default function GloryHeroMedia({
  src,
  alt,
  credit,
  crestPath,
  brotherhoodName,
  dateParts,
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasImage = Boolean(src) && !imageFailed

  if (hasImage) {
    return (
      <>
        <Image
          className={styles.heroImageBackdrop}
          src={src}
          alt=""
          fill
          aria-hidden="true"
          sizes="(max-width: 820px) calc(100vw - 32px), 36vw"
          quality={55}
          onError={() => setImageFailed(true)}
        />
        <Image
          className={styles.heroImage}
          src={src}
          alt={alt || brotherhoodName}
          fill
          priority
          sizes="(max-width: 820px) calc(100vw - 32px), 36vw"
          quality={90}
          onError={() => setImageFailed(true)}
        />
        {credit ? <small>{credit}</small> : null}
      </>
    )
  }

  if (crestPath) {
    return (
      <Image
        className={styles.crest}
        src={crestPath}
        alt={`Escudo de ${brotherhoodName}`}
        width={380}
        height={380}
        priority
      />
    )
  }

  return (
    <div className={styles.datePoster} aria-hidden="true">
      <strong>{dateParts?.day}</strong>
      <span>{dateParts?.month}</span>
      <small>{dateParts?.year}</small>
    </div>
  )
}
