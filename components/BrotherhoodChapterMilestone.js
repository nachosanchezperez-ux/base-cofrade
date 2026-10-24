import Link from 'next/link'
import styles from './BrotherhoodChapterMilestone.module.css'

// «Gran cita» de la ficha por capítulos: el hito que la Hermandad está viviendo
// (p. ej. una coronación canónica), con los actos de ese día. No sustituye a
// «Próximamente», que sigue mostrando el siguiente acto cronológico. Los datos
// salen de brotherhoodMilestone (lib/brotherhood-reading.js): solo actos con
// fecha documentados en agenda, cultos o salidas.

const DAY_FORMAT = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' })

export function milestoneDateLabel(value = '') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return ''
  const text = DAY_FORMAT.format(new Date(`${value}T12:00:00Z`))
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`
}

export default function BrotherhoodChapterMilestone({ milestone }) {
  if (!milestone) return null
  return <section className={styles.section} aria-labelledby="gran-cita-titulo">
    <p className={styles.kicker}>{milestone.kind}</p>
    <h2 className={styles.title} id="gran-cita-titulo">{milestone.name}</h2>
    <p className={styles.date}><time dateTime={milestone.date}>{milestone.dateLabel || milestoneDateLabel(milestone.date)}</time></p>
    {milestone.day?.length ? <ol className={styles.acts}>
      {milestone.day.map((item) => {
        const time = item.time
        return <li key={item.key || item.title}>
          <span className={styles.time}>{time || '—'}</span>
          {item.href ? <Link href={item.href} prefetch={false}>{item.title}</Link> : <span>{item.title}</span>}
        </li>
      })}
    </ol> : null}
  </section>
}
