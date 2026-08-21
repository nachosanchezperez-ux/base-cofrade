import Image from 'next/image';
import SectionTitle from '@/components/SectionTitle';

function paragraphs(text = '') {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

const POSTER_SERIES = [
  { key: 'fiestas', eyebrow: '8 de septiembre', title: 'Carteles de las Fiestas Mayores' },
  { key: 'romeria', eyebrow: 'Romería', title: 'Carteles de la Romería y Besamanos' },
  { key: 'otros', eyebrow: 'Archivo gráfico', title: 'Otros carteles' },
];

function normalizedPosterType(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function posterSeries(posters = []) {
  const groups = posters.reduce((result, poster) => {
    const type = normalizedPosterType(poster.tipo);
    const key = type.includes('romeria')
      ? 'romeria'
      : type.includes('fiestas')
        ? 'fiestas'
        : 'otros';

    result[key].push(poster);
    return result;
  }, { fiestas: [], romeria: [], otros: [] });

  return POSTER_SERIES
    .map((series) => ({ ...series, posters: groups[series.key] }))
    .filter((series) => series.posters.length);
}

export default function FestivalPostersSection({ posters = [] }) {
  if (!posters.length) return null;

  return (
    <section className="section festival-posters-section" id="carteles">
      <div className="shell">
        <SectionTitle
          eyebrow="Memoria gráfica"
          title="Carteles de la Hermandad"
          description="Un archivo anual de las obras que anuncian sus Fiestas Mayores, romerías y celebraciones, y conservan su memoria visual."
        />

        <div className="festival-posters-series">
          {posterSeries(posters).map((series) => (
            <div className="festival-posters-group" key={series.key}>
              <div className="heritage-subheading festival-posters-group-heading">
                <span className="eyebrow">{series.eyebrow}</span>
                <h3>{series.title}</h3>
              </div>
              <div className="festival-posters-list">
                {series.posters.map((poster) => {
            const author = poster.agentes?.[0]?.nombre || poster.imagen?.autor || '';
            const technicalDetails = [poster.tecnica, poster.materiales, poster.dimensiones].filter(Boolean);

            return (
              <article className="festival-poster" key={poster.id}>
                <figure className="festival-poster-visual">
                  <div className="festival-poster-artwork">
                    {poster.imagen ? (
                      <Image
                        src={poster.imagen.src}
                        alt={poster.imagen.alt}
                        fill
                        sizes="(max-width: 820px) calc(100vw - 64px), (max-width: 1199px) 42vw, 470px"
                      />
                    ) : (
                      <span className="festival-poster-placeholder">Cartel · {poster.fecha}</span>
                    )}
                  </div>
                  {author ? <figcaption>Obra · {author}</figcaption> : null}
                </figure>

                <div className="festival-poster-copy">
                  <div className="festival-poster-meta">
                    <span>{poster.tipo}</span>
                    {poster.fecha ? <strong>{poster.fecha}</strong> : null}
                  </div>

                  <h3>{poster.nombre}</h3>
                  <p className="festival-poster-lead">{poster.resumen || poster.descripcion}</p>

                  <dl className="festival-poster-facts">
                    {author ? <div><dt>Autor</dt><dd>{author}</dd></div> : null}
                    {poster.procedencia ? <div><dt>Presentación</dt><dd>{poster.procedencia}</dd></div> : null}
                    {poster.dimensiones ? <div><dt>Formato</dt><dd>{poster.dimensiones}</dd></div> : null}
                    {poster.tecnica ? <div><dt>Técnica</dt><dd>{poster.tecnica}</dd></div> : null}
                  </dl>

                  {poster.descripcion && poster.descripcion !== poster.resumen ? <p>{poster.descripcion}</p> : null}

                  {technicalDetails.length ? (
                    <p className="festival-poster-tech">{technicalDetails.join(' · ')}</p>
                  ) : null}

                  {(poster.explicacionAutor || poster.iconografia || poster.contexto || poster.origen) ? (
                    <details className="festival-poster-statement">
                      <summary>Leer la explicación y las claves de la obra <span>＋</span></summary>
                      <div>
                        {(poster.iconografia || poster.contexto || poster.origen) ? (
                          <div className="festival-poster-reading">
                            {poster.contexto ? <div><small>Contexto</small><p>{poster.contexto}</p></div> : null}
                            {poster.iconografia ? <div><small>Claves de la obra</small><p>{poster.iconografia}</p></div> : null}
                            {poster.origen ? <div><small>Lectura simbólica</small><p>{poster.origen}</p></div> : null}
                          </div>
                        ) : null}
                        {paragraphs(poster.explicacionAutor).map((paragraph, index) => (
                          <p key={`${poster.id}-statement-${index}`}>{paragraph}</p>
                        ))}
                      </div>
                    </details>
                  ) : null}
                </div>
              </article>
            );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
