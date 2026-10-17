import { guideChapters } from '../BrotherhoodEditorialGuide'
import { splitLead, yearOf } from '@/lib/brotherhood-magazine'
import ShareFact from './ShareFact'
import styles from './EditorialKeys.module.css'

// «Las claves» (Tarea 09): la guía editorial ya publicada, presentada como
// tarjetas tipo historia que se deslizan en el móvil. Cada tarjeta es un
// capítulo de la guía; no se genera texto nuevo. Si el capítulo nombra un año,
// ese año (tal cual aparece en el texto) se destaca en grande.
export default function EditorialKeys({ guide, name }) {
  const chapters = guideChapters(guide?.body).filter((chapter) => chapter.title && chapter.paragraphs.length)
  if (!chapters.length) return null

  return (
    <section className={styles.section} id="conoce-hermandad" aria-labelledby="claves-titulo">
      <div className="shell">
        <div className={styles.head}>
          <span className={styles.kicker}>{chapters.length} claves para entenderla</span>
          <h2 id="claves-titulo">{guide.title || `Conoce ${name}`}</h2>
          {chapters.length > 1 ? <p className={styles.hint} aria-hidden="true">Desliza para verlas todas <span>→</span></p> : null}
        </div>
        <ol className={styles.cards} tabIndex={0} aria-label={`Claves de ${name}`}>
          {chapters.map((chapter, index) => {
            const { lead, rest } = splitLead(chapter.paragraphs.join(' '))
            const year = yearOf(chapter.title) || yearOf(lead)
            return (
              <li key={chapter.id} className={styles.card} id={`clave-${chapter.id}`}>
                <span className={styles.number}>{index + 1}<small>/{chapters.length}</small></span>
                {year ? <span className={styles.year} aria-hidden="true">{year}</span> : null}
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
