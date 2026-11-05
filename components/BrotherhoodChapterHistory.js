import Link from 'next/link'
import { FormerTitulars } from './BrotherhoodHistoryTimeline'
import { representativeHistory } from '@/lib/brotherhood-reading'
import { historyParagraphs, splitHistory } from '@/lib/brotherhood-thread'
import { plural } from '@/lib/plural'
import styles from './BrotherhoodChapterHistory.module.css'

// Historia de la ficha por capítulos: una línea de tiempo vertical con todos los
// hitos celebrados (los principales, destacados) y el relato largo plegado.
// Lo anunciado queda aparte: es agenda hasta que se celebre. Mantiene el ancla
// #historia de la ficha (enlaces existentes y extraordinarias, #1289).

function Milestone({ item, highlighted }) {
  const title = item.href ? <Link href={item.href}>{item.titulo}</Link> : item.titulo
  return <li className={`${styles.item} ${highlighted ? styles.highlighted : ''}`}>
    <span className={styles.year}>{item.fecha || '—'}</span>
    <span className={styles.dot} aria-hidden="true" />
    <div className={styles.copy}>
      {item.estado ? <small className={styles.tag}>{item.estado}</small> : null}
      {item.texto ? <details className={styles.more}>
        <summary><h3>{title}</h3><b aria-hidden="true">+</b></summary>
        <p>{item.texto}</p>
      </details> : <h3>{title}</h3>}
    </div>
  </li>
}

export default function BrotherhoodChapterHistory({ items = [], introduction = '', formerTitulars = [], today = '', announced = [], children = null }) {
  const split = splitHistory(items, today)
  const past = split.past
  // Lo anunciado: hitos futuros de la cronología y la «gran cita» de la agenda.
  const upcoming = [...split.upcoming, ...announced.filter((item) => !split.upcoming.some((other) => other.titulo === item.titulo))]
  const { lead, rest } = historyParagraphs(introduction)
  if (!past.length && !lead && !formerTitulars.length && !upcoming.length && !children) return null
  const highlighted = new Set(representativeHistory(past))

  return <section className={`section ${styles.section}`} id="historia" aria-labelledby="historia-titulo">
    <div className="shell">
      <h2 className={styles.title} id="historia-titulo">Historia{past.length ? <small>{plural(past.length, 'hito documentado', 'hitos documentados')}</small> : null}</h2>
      {past.length ? <ol className={styles.timeline}>
        {past.map((item) => <Milestone key={item.id || `${item.fecha}-${item.titulo}`} item={item} highlighted={past.length > 5 && highlighted.has(item)} />)}
      </ol> : null}

      {upcoming.length ? <div className={styles.upcoming}>
        <p className={styles.upcomingLabel}>Anunciado, aún por celebrar</p>
        <ul>{upcoming.map((item) => <li key={item.id || `${item.fecha}-${item.titulo}`}>
          <span>{item.fecha}</span>
          {item.href ? <Link href={item.href}>{item.titulo}</Link> : <strong>{item.titulo}</strong>}
        </li>)}</ul>
      </div> : null}

      {lead ? <div className={styles.story}>
        <p className={styles.lead}>{lead}</p>
        {rest.length ? <details className={styles.storyMore}>
          <summary>Seguir leyendo la historia <b aria-hidden="true">+</b></summary>
          {rest.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
        </details> : null}
      </div> : null}

      {children}

      <FormerTitulars items={formerTitulars} />
    </div>
  </section>
}
