import Image from 'next/image';
import SectionTitle from '@/components/SectionTitle';
import styles from './BrotherhoodCultsSection.module.css';

const MONTH_NAMES = {
  ENE: 'ENERO',
  FEB: 'FEBRERO',
  MAR: 'MARZO',
  ABR: 'ABRIL',
  MAY: 'MAYO',
  JUN: 'JUNIO',
  JUL: 'JULIO',
  AGO: 'AGOSTO',
  SEP: 'SEPTIEMBRE',
  OCT: 'OCTUBRE',
  NOV: 'NOVIEMBRE',
  DIC: 'DICIEMBRE',
};

function CultDate({ cult }) {
  const fecha = cult.fechaCorta || cult.referencia;
  const fechaExacta = /^(\d{1,2})\s+([A-ZÁÉÍÓÚÑ]+)$/i.exec(fecha || '');
  const esRelativa = Boolean(cult.fechaDetalle);

  return (
    <div className={`${styles.date} ${
      fechaExacta
        ? styles.dateExact
        : esRelativa
          ? styles.dateRelative
          : styles.datePeriod
    }`}>
      <span className={styles.bindings} aria-hidden="true"><i /><i /></span>

      {fechaExacta ? (
        <>
          <strong className={styles.day}>{fechaExacta[1]}</strong>
          <span className={styles.month}>{MONTH_NAMES[fechaExacta[2].toUpperCase()] || fechaExacta[2]}</span>
        </>
      ) : esRelativa ? (
        <>
          <strong className={styles.mainDate}>{fecha}</strong>
          <span className={styles.subDate}>{cult.fechaDetalle}</span>
        </>
      ) : (
        <>
          <strong className={styles.mainDate}>{fecha}</strong>
          <span className={styles.periodMark} aria-hidden="true" />
        </>
      )}
    </div>
  );
}

export default function BrotherhoodCultsSection({ cults = [] }) {
  if (!cults.length) return null;

  return (
    <section className={`section brotherhood-soft ${styles.section}`} id="cultos">
      <div className="shell">
        <SectionTitle
          eyebrow="Vida de hermandad"
          title="Cultos principales"
          description="El calendario devocional de la Hermandad, acompañado por su archivo fotográfico cuando existe una imagen documentada y autorizada."
        />

        <div className={styles.grid}>
          {cults.map((cult) => {
            const image = cult.imagen;
            const imageStyle = image ? {
              '--cult-focus': image.focusPosition || '50% 50%',
              '--cult-mobile-focus': image.mobileFocusPosition || image.focusPosition || '50% 50%',
              '--cult-fit': image.fitMode === 'contain' ? 'contain' : 'cover',
            } : undefined;

            return (
              <article className={`${styles.card} ${image ? styles.withImage : styles.withoutImage}`} key={cult.id}>
                {image ? (
                  <figure className={styles.visual} style={imageStyle}>
                    <Image
                      className={styles.photo}
                      src={image.src}
                      alt={image.alt || `Fotografía de ${cult.nombre}`}
                      fill
                      sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 50vw, 560px"
                    />
                    {image.autor ? <figcaption>{image.autor}</figcaption> : null}
                  </figure>
                ) : null}

                <div className={styles.body}>
                  <CultDate cult={cult} />
                  <div className={styles.copy}>
                    <span className={styles.type}>{cult.tipo}</span>
                    <h3>{cult.nombre}</h3>
                    {cult.descripcion ? <p>{cult.descripcion}</p> : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
