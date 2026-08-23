import Image from 'next/image';
import SectionTitle from '@/components/SectionTitle';
import styles from './BrotherhoodSimpecadosSection.module.css';

function aspectRatio(image) {
  if (!image?.width || !image?.height) return '3 / 4';
  return `${image.width} / ${image.height}`;
}

export default function BrotherhoodSimpecadosSection({ items = [] }) {
  if (!items.length) return null;

  return (
    <section className={`section ${styles.section}`} id="simpecados">
      <div className="shell">
        <SectionTitle
          eyebrow="Patrimonio devocional"
          title="Los Simpecados de la Hermandad"
          description="Piezas con identidad propia, documentadas por separado para conocer su autoría, historia, uso y presencia en los cultos y celebraciones de la corporación."
        />

        <div className={styles.grid}>
          {items.map((item, index) => {
            const image = item.imagen;
            const authors = item.agentes || [];

            return (
              <article className={styles.card} key={item.id}>
                <figure
                  className={styles.visual}
                  style={{ '--simpecado-ratio': aspectRatio(image) }}
                >
                  {image ? (
                    <Image
                      className={styles.image}
                      src={image.src}
                      alt={image.alt || item.nombre}
                      fill
                      sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 44vw, 470px"
                    />
                  ) : (
                    <div className={styles.placeholder} aria-hidden="true">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>Simpecado</strong>
                    </div>
                  )}
                  {image && (image.pie || image.autor) ? (
                    <figcaption>{[image.pie, image.autor].filter(Boolean).join(' · ')}</figcaption>
                  ) : null}
                </figure>

                <div className={styles.copy}>
                  <div className={styles.meta}>
                    <span>{item.tipo}</span>
                    {item.fecha ? <strong>{item.fecha}</strong> : null}
                  </div>
                  <h3>{item.nombre}</h3>
                  <p className={styles.lead}>{item.resumen || item.descripcion}</p>

                  {(item.bendicion || item.procedencia) ? (
                    <dl className={styles.facts}>
                      {item.bendicion ? <div><dt>Bendición</dt><dd>{item.bendicion}</dd></div> : null}
                      {item.procedencia ? <div><dt>Procedencia</dt><dd>{item.procedencia}</dd></div> : null}
                    </dl>
                  ) : null}

                  {authors.length ? (
                    <div className={styles.authors}>
                      <small>Autoría y ejecución</small>
                      <div>
                        {authors.map((author) => (
                          <span key={`${item.id}-${author.id}-${author.rol}`}>
                            <strong>{author.nombre}</strong>
                            {author.rol ? <em>{author.rol}</em> : null}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {(item.descripcion || item.contexto || item.iconografia || item.origen || item.tecnica || item.materiales || item.dimensiones) ? (
                    <details className={styles.details}>
                      <summary>Conocer este Simpecado <span>＋</span></summary>
                      <div>
                        {item.descripcion && item.descripcion !== item.resumen ? <p>{item.descripcion}</p> : null}
                        {item.contexto ? <section><small>Contexto histórico</small><p>{item.contexto}</p></section> : null}
                        {item.iconografia ? <section><small>Diseño e iconografía</small><p>{item.iconografia}</p></section> : null}
                        {item.origen ? <section><small>Origen y evolución</small><p>{item.origen}</p></section> : null}
                        {(item.tecnica || item.materiales || item.dimensiones) ? (
                          <p className={styles.technical}>{[item.tecnica, item.materiales, item.dimensiones].filter(Boolean).join(' · ')}</p>
                        ) : null}
                      </div>
                    </details>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
