import Image from 'next/image';
import SectionTitle from '@/components/SectionTitle';
import styles from './BrotherhoodViaCrucisSection.module.css';

export default function BrotherhoodViaCrucisSection({ items = [] }) {
  if (!items.length) return null;

  return (
    <section className={`section brotherhood-white ${styles.section}`} id="via-crucis-cofradias">
      <div className="shell">
        <SectionTitle
          eyebrow="Participación institucional"
          title="Vía Crucis de las Cofradías"
          description="Participaciones documentadas de la Hermandad en el Vía Crucis cuaresmal de las hermandades de penitencia de Sevilla."
        />

        <div className={styles.list}>
          {items.map((item) => (
            <article className={styles.card} key={item.id}>
              <div className={styles.year} aria-label={`Edición ${item.ano || ''}`}>
                <small>Edición</small>
                <strong>{item.ano || '—'}</strong>
              </div>

              {item.imagen?.src ? (
                <figure className={styles.visual}>
                  <Image
                    src={item.imagen.src}
                    alt={item.imagen.alt || item.titulo}
                    fill
                    sizes="(max-width: 760px) calc(100vw - 40px), 360px"
                  />
                  {item.imagen.credito ? <figcaption>{item.imagen.credito}</figcaption> : null}
                </figure>
              ) : null}

              <div className={styles.copy}>
                <span className={styles.kicker}>Vía Crucis de las Cofradías de Sevilla</span>
                <h3>{item.titulo}</h3>
                {item.protagonistas ? (
                  <p className={styles.protagonists}>{item.protagonistas}</p>
                ) : null}
                {item.resumen ? <p className={styles.summary}>{item.resumen}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
