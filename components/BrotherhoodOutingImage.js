'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './BrotherhoodOutingsSection.module.css'

function OutingImageFallback({ outing, primary }) {
  return (
    <div className={`${styles.imageFallback} ${primary ? styles.primaryFallback : ''}`} aria-hidden="true">
      <span>{String(outing?.tipo || 'Salida').slice(0, 1)}</span>
      <i />
      <b>{outing?.caracter || 'Memoria procesional'}</b>
    </div>
  )
}

export default function BrotherhoodOutingImage({ outing, primary = false }) {
  const [failed, setFailed] = useState(false)

  if (!outing?.imagen?.src || failed) {
    return <OutingImageFallback outing={outing} primary={primary} />
  }

  return (
    <figure className={styles.image}>
      <Image
        src={outing.imagen.src}
        alt={outing.imagen.alt || `Fotografía de ${outing.nombre}`}
        fill
        sizes={primary
          ? '(max-width: 820px) calc(100vw - 32px), (max-width: 1280px) 52vw, 690px'
          : '(max-width: 720px) calc(100vw - 32px), 420px'}
        onError={() => setFailed(true)}
      />
      {outing.imagen.credito ? <figcaption>Fotografía · {outing.imagen.credito}</figcaption> : null}
    </figure>
  )
}
