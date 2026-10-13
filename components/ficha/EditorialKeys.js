import { guideChapters } from '../BrotherhoodEditorialGuide'
import ShareFact from './ShareFact'
import styles from './EditorialKeys.module.css'

// «Las claves de…» (Tarea 09): la guía editorial ya publicada en Hilo Cofrade,
// presentada como piezas cortas y compartibles. No genera texto nuevo: cada
// tarjeta es un capítulo de la guía; la entradilla de la guía va en la portada.
function firstSentences(text = '', limit = 220) {
  const compact = String(text).replace(/\s+/g, ' ').trim()
  if (compact.length <= limit) return compact
  const cut = compact.slice(0, limit)
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '))
  return lastStop > 80 ? cut.slice(0, lastStop + 1) : `${cut.replace(/\s+\S*$/, '')}…`
}

export default function EditorialKeys({ guide, name }) {
  const chapters = guideChapters(guide?.body).filter((chapter) => chapter.title && chapter.paragraphs.length)
  if (!chapters.length) return null

  return (
    <section className={styles.section} id="conoce-hermandad" aria-labelledby="claves-titulo">
      <div className="shell">
        <header className={styles.head}>
          <span className={styles.kicker}>{chapters.length} claves para entenderla</span>
          <h2 id="claves-titulo">{guide.title || `Conoce ${name}`}</h2>
        </header>
        <ol className={styles.cards}>
          {chapters.map((chapter, index) => {
            const lead = firstSentences(chapter.paragraphs[0])
            const rest = chapter.paragraphs.join(' ').replace(/\s+/g, ' ').trim().slice(lead.replace(/…$/, '').length).trim()
            return (
              <li key={chapter.id} className={styles.card} id={`clave-${chapter.id}`}>
                <span className={styles.number} aria-hidden="true">{index + 1}</span>
                <h3>{chapter.title}</h3>
                <p>{lead}</p>
                {rest ? (
                  <details className={styles.more}>
                    <summary>Seguir leyendo</summary>
                    <p>{rest}</p>
                  </details>
                ) : null}
                <footer className={styles.foot}>
                  <span>{name}</span>
                  <ShareFact className={styles.share} title={`${name} · ${chapter.title}`} text={`${chapter.title}: ${lead}`} />
                </footer>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
