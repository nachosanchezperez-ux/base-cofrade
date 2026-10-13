import styles from './HistoryMilestones.module.css'

// Historia en fechas (Tarea 09). Usa la cronología documentada; si la ficha
// solo tiene el texto de historia, lo divide en frases que contienen un año,
// sin reescribirlas. La primera fecha se destaca como origen.
const YEAR = /\b(1[2-9]\d{2}|20\d{2})\b/

export function milestonesFromText(text = '') {
  const sentences = String(text)
    .replace(/\s+/g, ' ')
    .split(/(?<=[.;])\s+(?=[A-ZÁÉÍÓÚÑ0-9])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
  const parts = sentences.flatMap((sentence) => {
    const pieces = sentence.split(/;\s+|,\s+(?:y\s+)?(?=(?:en\s+)?(?:1[2-9]\d{2}|20\d{2})\b)|\s+y\s+(?=en\s+(?:1[2-9]\d{2}|20\d{2})\b)/)
    const withYear = pieces.filter((piece) => YEAR.test(piece))
    return withYear.length > 1 ? pieces : [sentence]
  })
  const items = []
  for (const part of parts) {
    const year = part.match(YEAR)?.[1]
    if (!year) continue
    const clean = part.replace(/^[,;\s]+/, '').replace(/[,;\s]+$/, '')
    const sentence = clean.charAt(0).toUpperCase() + clean.slice(1)
    items.push({ year, text: /[.!?]$/.test(sentence) ? sentence : `${sentence}.` })
  }
  return items
}

export default function HistoryMilestones({ items = [], title = 'Historia', kicker = 'En fechas', id = 'historia' }) {
  if (items.length < 2) return null
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
