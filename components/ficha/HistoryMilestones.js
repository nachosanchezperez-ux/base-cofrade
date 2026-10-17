import styles from './HistoryMilestones.module.css'

// Historia en fechas (Tarea 09). La primera fecha se destaca como origen.
// items: [{ year, text }] de la cronología documentada o de milestonesFromText.
export default function HistoryMilestones({ items = [], title = 'Historia', kicker = 'En fechas', id = 'historia' }) {
  if (items.length < 3) return null
  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-titulo`}>
      <div className="shell">
        <header className={styles.head}>
          <span className={styles.kicker}>{kicker}</span>
          <h2 id={`${id}-titulo`}>{title}</h2>
        </header>
        <ol className={styles.list}>
          {items.map((item, index) => (
            <li key={`${item.year}-${index}`} className={index === 0 ? styles.origin : undefined}>
              <b>{item.year}</b>
              <span>{item.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
