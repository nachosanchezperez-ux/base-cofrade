'use client'

import Link from 'next/link'
import useFollowedBrotherhoods from '@/components/useFollowedBrotherhoods'
import styles from './FollowBrotherhoodButton.module.css'

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Botón «Seguir» de la ficha de Hermandad. Sin registro: se guarda en el móvil.
export default function FollowBrotherhoodButton({ slug, name, municipality = '' }) {
  const { followed, toggle } = useFollowedBrotherhoods()
  if (!slug) return null
  const isFollowing = followed.some((item) => item.slug === slug)

  return (
    <div className={styles.follow}>
      <button
        type="button"
        className={`${styles.button} ${isFollowing ? styles.active : ''}`}
        aria-pressed={isFollowing}
        onClick={() => toggle({ slug, name, municipality }, 'ficha_hermandad')}
      >
        <StarIcon filled={isFollowing} />
        <span>{isFollowing ? 'Siguiendo' : 'Seguir hermandad'}</span>
      </button>
      <p className={styles.hint} aria-live="polite">
        {isFollowing
          ? <>Sus citas aparecerán primero en <Link href="/agenda-cofrade?mis=1">tu Agenda</Link>.</>
          : 'Guárdala en este móvil, sin registrarte.'}
      </p>
    </div>
  )
}
