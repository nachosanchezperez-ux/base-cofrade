import styles from './ImageRestorationsSection.module.css';

export default function ImageRestorationsSection({ items = [] }) {
  if (!items.length) return null;

  return (
    <section className="section brotherhood-soft" id="restauraciones">
      <div className="shell">
        <span className="eyebrow">Patrimonio</span>
        <h2 className="image-section-title-v2">Restauraciones</h2>
        <div className={styles.list}>
          {items.map((item) => (
            <article className={styles.card} key={item.id} id={item.anchor}>
              <header className={styles.header}>
                {item.anio ? <strong className={styles.year}>{item.anio}</strong> : null}
                <div className={styles.heading}>
                  <h3>{item.tipo}</h3>
                  {item.fase ? <span className={styles.phase}>{item.fase}</span> : null}
                </div>
              </header>

              <dl className={styles.facts}>
                {item.fecha ? <div><dt>Periodo</dt><dd>{item.fecha}</dd></div> : null}
                {item.responsable ? <div><dt>Responsable</dt><dd>{item.responsable}</dd></div> : null}
                {item.disciplina ? <div><dt>Disciplina</dt><dd>{item.disciplina}</dd></div> : null}
              </dl>

              {item.resumen ? <p className={styles.summary}>{item.resumen}</p> : null}

              {item.detalle.length ? (
                <details className={styles.details}>
                  <summary>Ver trabajos realizados</summary>
                  <div className={styles.detailBody}>
                    {item.detalle.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  </div>
                </details>
              ) : null}

              <a className={styles.timelineLink} href={`#${item.timelineAnchor}`}>
                Ver en la cronología <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
