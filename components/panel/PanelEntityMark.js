import styles from './PanelEntityMark.module.css'

function getFallbackLabel(name) {
  return String(name || '').trim().slice(0, 2).toLocaleUpperCase('es') || '—'
}

export default function PanelEntityMark({ src = '', name = '' }) {
  return (
    <span className={`${styles.mark} ${src ? styles.markWithImage : ''}`}>
      {src ? (
        <img
          className={styles.image}
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span aria-hidden="true">{getFallbackLabel(name)}</span>
      )}
    </span>
  )
}
