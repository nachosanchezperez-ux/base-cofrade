'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './BandDiscographySection.module.css'

export default function BandReleaseCover({ src = '', alt = '', year = '' }) {
  const [directSrc, setDirectSrc] = useState('')
  const [failedSrc, setFailedSrc] = useState('')
  const useDirect = directSrc === src
  const hasFailed = failedSrc === src

  if (!src || hasFailed) {
    return (
      <div className={styles.coverPlaceholder} role="img" aria-label={alt}>
        <span>{year || 'HC'}</span>
      </div>
    )
  }

  return (
    <Image
      key={useDirect ? `${src}-direct` : `${src}-optimized`}
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 760px) 64px, 84px"
      unoptimized={useDirect}
      onError={() => {
        if (useDirect) {
          setFailedSrc(src)
          return
        }

        setDirectSrc(src)
      }}
    />
  )
}
