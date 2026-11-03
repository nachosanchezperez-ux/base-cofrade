'use client'

import useFollowedBands from '@/components/useFollowedBands'
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

// Botón «Seguir banda» de la ficha de Banda. Sin registro: se guarda en el móvil.
// Sus crucetas nuevas se destacan en Novedades.
export default function FollowBandButton({ slug, name, municipality = '', placement = 'ficha_banda' }) {
  const { followed, toggle } = useFollowedBands()
  if (!slug) return null
  const isFollowing = followed.some((item) => item.slug === slug)

  return (
    <div className={styles.follow}>
      <button
        type="button"
        className={`${styles.button} ${isFollowing ? styles.active : ''}`}
        aria-pressed={isFollowing}
        onClick={() => toggle({ slug, name, municipality }, placement)}
      >
        <StarIcon filled={isFollowing} />
        <span>{isFollowing ? 'Siguiendo' : 'Seguir banda'}</span>
      </button>
      <p className={styles.hint} aria-live="polite">
        {isFollowing ? 'Sus crucetas nuevas aparecerán destacadas en Novedades.' : 'Guárdala en este móvil, sin registrarte.'}
      </p>
    </div>
  )
}
