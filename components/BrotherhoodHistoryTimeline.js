import SectionTitle from '@/components/SectionTitle'
import styles from './BrotherhoodHistoryTimeline.module.css'

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

export default function BrotherhoodHistoryTimeline({ items = [] }) {
  if (!items.length) return null

  const preview = previewIndexes(items.length).map((index) => items[index])

  return (
    <section className="section history-section" id="historia">
      <div className="shell">
        <SectionTitle
          eyebrow="Cronología"
          title="Historia"
          description="Una línea temporal para recorrer los grandes hitos y conectarlos con titulares, pasos y acontecimientos."
        />

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
                <small>{items.length} hitos documentados</small>
                <b aria-hidden="true">＋</b>
              </summary>

              <div className="history-timeline">
                {items.map((item) => (
                  <article key={`${item.fecha}-${item.titulo}`}>
                    <div className="history-year">{item.fecha}</div>
                    <div className="history-line"><span /></div>
                    <div className="history-copy">
                      <h3>{item.titulo}</h3>
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
                  <h3>{item.titulo}</h3>
                  <p>{item.texto}</p>
                  {item.estado ? <small>{item.estado}</small> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
