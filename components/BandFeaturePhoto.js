'use client'

import Image from 'next/image'
import { useState } from 'react'
import EntityVisualFallback from '@/components/EntityVisualFallback'
import styles from '@/app/bandas/bandas.module.css'

export default function BandFeaturePhoto({
  src,
  alt,
  credit = '',
  name,
  logoPath = '',
}) {
  const [photoFailed, setPhotoFailed] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const showPhoto = Boolean(src) && !photoFailed
  const showLogo = Boolean(logoPath) && !logoFailed

  return (
    <figure className={styles.featurePhoto}>
      <div>
        {showPhoto ? (
          <Image
            src={src}
            alt={alt || `Fotografía representativa de ${name}`}
            fill
            sizes="(max-width: 900px) calc(100vw - 32px), 52vw"
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <div className={styles.featurePhotoFallback} aria-label={`Identidad visual de ${name}`}>
            {showLogo ? (
              <Image
                className={styles.featurePhotoLogo}
                src={logoPath}
                alt={`Logotipo de ${name}`}
                width={220}
                height={220}
                sizes="220px"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <EntityVisualFallback className={styles.featurePhotoInitials} />
            )}
            <small>Identidad visual de la formación</small>
          </div>
        )}
      </div>
      <figcaption>
        <span>La formación</span>
        <strong>{name}</strong>
        {showPhoto && credit ? <small>{credit}</small> : null}
      </figcaption>
    </figure>
  )
}
