import Link from 'next/link'
import SectionTitle from '@/components/SectionTitle'
import styles from './BrotherhoodHistoryTimeline.module.css'
import { representativeHistory } from '@/lib/brotherhood-reading'
import { plural } from '@/lib/plural'

function previewIndexes(length, count = 5) {
  if (length <= count) return Array.from({ length }, (_, index) => index)

  const raw = [
    0,
    Math.round((length - 1) * 0.25),
    Math.round((length - 1) * 0.5),
    Math.round((length - 1) * 0.75),
    length - 1,
  ]

  return [...new Set(raw)].slice(0, count)
}

const CONDITION_LABELS = {
  extant: 'Se conserva',
  lost: 'Paradero desconocido',
  destroyed: 'Destruida',
}

// Subsección secundaria: imágenes que fueron titulares y ya no lo son. Nunca se mezclan con la titularidad vigente.
export function FormerTitulars({ items = [] }) {
  if (!items.length) return null
  return (
    <div className={styles.former} id="antiguas-titulares">
      <h3 className={styles.formerTitle}>Antiguas imágenes titulares</h3>
      <p className={styles.formerIntro}>Imágenes que recibieron culto como titulares de la Hermandad y fueron sustituidas. Solo se indican los datos documentados.</p>
      <ul className={styles.formerList}>
        {items.map((item) => {
          const meta = [item.periodo, item.autor, item.fecha && item.fecha !== item.periodo ? item.fecha : '', CONDITION_LABELS[item.situacion]]
            .filter(Boolean)
            .join(' · ')
          return (
            <li key={item.id}>
              <span className={styles.formerTag}>Antigua titular</span>
              {item.fichaDisponible && item.slug
                ? <Link href={`/imagenes/${item.slug}`} className={styles.formerName}>{item.nombre}</Link>
                : <strong className={styles.formerName}>{item.nombre}</strong>}
              {meta ? <small className={styles.formerMeta}>{meta}</small> : null}
              {item.nota ? <p className={styles.formerNote}>{item.nota}</p> : null}
              {item.sucesora?.slug ? (
                <p className={styles.formerSuccessor}>
                  {item.sustitucion ? `Sustituida en ${item.sustitucion} por ` : 'Sustituida por '}
                  <Link href={`/imagenes/${item.sucesora.slug}`}>{item.sucesora.nombre}</Link>
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function BrotherhoodHistoryTimeline({ items = [], introduction = '', semanticPreview = false, formerTitulars = [] }) {
  if (!items.length && !introduction && !formerTitulars.length) return null

  const preview = semanticPreview ? representativeHistory(items) : previewIndexes(items.length).map((index) => items[index])

  return (
    <section className="section history-section" id="historia">
      <div className="shell">
        <SectionTitle
          eyebrow="Cronología"
          title="Historia"
        />

        {introduction ? <p className={styles.introduction}>{introduction}</p> : null}

        {items.length > 5 ? (
          <>
            <div className={styles.preview} aria-label="Recorrido rápido por la Historia">
              {preview.map((item) => (
                <article key={`preview-${item.fecha}-${item.titulo}`}>
                  <span>{item.fecha}</span>
                  <strong>{item.titulo}</strong>
                </article>
              ))}
            </div>

            <details className={styles.disclosure}>
              <summary>
                <span>Ver cronología completa</span>
                <small>{plural(items.length, 'hito documentado', 'hitos documentados')}</small>
                <b aria-hidden="true">+</b>
              </summary>

              <div className="history-timeline">
                {items.map((item) => (
                  <article key={`${item.fecha}-${item.titulo}`}>
                    <div className="history-year">{item.fecha}</div>
                    <div className="history-line"><span /></div>
                    <div className="history-copy">
                      <h3>{item.href ? <Link href={item.href}>{item.titulo}</Link> : item.titulo}</h3>
                      <p>{item.texto}</p>
                      {item.estado ? <small>{item.estado}</small> : null}
                    </div>
                  </article>
                ))}
              </div>
            </details>
          </>
        ) : (
          <div className="history-timeline">
            {items.map((item) => (
              <article key={`${item.fecha}-${item.titulo}`}>
                <div className="history-year">{item.fecha}</div>
                <div className="history-line"><span /></div>
                <div className="history-copy">
                  <h3>{item.href ? <Link href={item.href}>{item.titulo}</Link> : item.titulo}</h3>
                  <p>{item.texto}</p>
                  {item.estado ? <small>{item.estado}</small> : null}
                </div>
              </article>
            ))}
          </div>
        )}

        <FormerTitulars items={formerTitulars} />
      </div>
    </section>
  )
}
