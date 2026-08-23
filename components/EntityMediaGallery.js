import Image from 'next/image';

export default function EntityMediaGallery({ items = [], id }) {
  if (!items.length) return null;

  return (
    <section className="section entity-media-gallery-section" id={id}>
      <div className="shell">
        <div className="entity-media-gallery-heading">
          <span className="eyebrow">Galería</span>
          <h2>Detalles fotográficos</h2>
          <p>Otras miradas de la imagen, conservadas con su autoría y procedencia.</p>
        </div>

        <div className={`entity-media-gallery-grid ${items.length === 1 ? 'is-single' : ''}`}>
          {items.map((item) => (
            <figure className="entity-media-gallery-card" key={`${item.id}-${item.path}`}>
              <div className="entity-media-gallery-visual">
                <Image
                  src={item.path}
                  alt={item.alt || item.title || 'Fotografía de detalle'}
                  fill
                  sizes="(max-width: 700px) calc(100vw - 40px), 520px"
                />
              </div>
              <figcaption>
                <div>
                  <strong>{item.title || 'Fotografía de detalle'}</strong>
                  {item.caption ? <p>{item.caption}</p> : null}
                </div>
                {item.credit ? (
                  item.sourceUrl ? (
                    <small>
                      <a href={item.sourceUrl} target="_blank" rel="noreferrer">{item.credit}</a>
                    </small>
                  ) : <small>{item.credit}</small>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
