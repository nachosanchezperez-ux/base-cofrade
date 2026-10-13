import styles from './FichaFigures.module.css'

// Cifras grandes y enlazadas (Tarea 09). Solo pinta valores presentes:
// nunca muestra un cero ni un dato estimado.
export default function FichaFigures({ items = [], label = 'En cifras' }) {
  const visible = items.filter((item) => item && item.value !== undefined && item.value !== null && String(item.value).trim() !== '' && String(item.value) !== '0')
  if (visible.length < 2) return null

  return (
    <section className={styles.figures} aria-label={label}>
      <div className={`shell ${styles.inner}`}>
        <ul className={styles.list} data-count={visible.length}>
          {visible.map((item) => {
            const content = <>
              <span className={styles.value}>{item.value}</span>
              <span className={styles.label}>{item.label}</span>
            </>
            return (
              <li key={item.label}>
                {item.href ? <a href={item.href} className={styles.item}>{content}</a> : <span className={styles.item}>{content}</span>}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
