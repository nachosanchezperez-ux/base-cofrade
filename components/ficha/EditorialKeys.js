import { guideChapters } from '../BrotherhoodEditorialGuide'
import { splitLead } from '@/lib/brotherhood-magazine'
import ShareFact from './ShareFact'
import styles from './EditorialKeys.module.css'

// «Las claves» (Tarea 09): la guía editorial ya publicada, presentada en
// tarjetas cortas y compartibles. Cada tarjeta es un capítulo de la guía; no
// se genera texto nuevo.
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
            const { lead, rest } = splitLead(chapter.paragraphs.join(' '))
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
