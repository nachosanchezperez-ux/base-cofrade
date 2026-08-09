import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getImagenBySlug, hermandades } from '@/lib/data';

export function generateStaticParams() {
  return hermandades.flatMap((hermandad) =>
    hermandad.imagenes.map((imagen) => ({ slug: imagen.slug }))
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = getImagenBySlug(slug);

  return result ? { title: result.imagen.nombre } : {};
}

export default async function ImagenPage({ params }) {
  const { slug } = await params;
  const result = getImagenBySlug(slug);

  if (!result) notFound();

  const { imagen, hermandad } = result;

  const cronologia = imagen.cronologia?.length
    ? imagen.cronologia
    : [{
        fecha: imagen.fecha,
        titulo: 'Datación',
        texto: 'Fecha asociada actualmente a la ficha de esta imagen.'
      }];

  return (
    <main
      className="brotherhood-page image-detail-v2"
      style={{
        '--brotherhood-primary': hermandad.colores?.primario || '#153B69',
        '--brotherhood-secondary': hermandad.colores?.secundario || '#A71930',
        '--brotherhood-light': hermandad.colores?.claro || '#FFFFFF'
      }}
    >
      <section className="image-detail-hero-v2">
        <div className="shell">
          <div className="brotherhood-breadcrumb">
            <span className="breadcrumb-accent" />
            <Link href="/hermandades">Hermandades</Link>
            <span className="breadcrumb-arrow">→</span>
            <strong>{hermandad.nombrePopular}</strong>
          </div>

          <div className="image-detail-hero-grid-v2">
            <div className="image-detail-hero-copy-v2">
              <h1>{imagen.nombre}</h1>
              <p>
                Imagen titular de {hermandad.nombrePopular}. Su ficha reúne
                autoría, historia, restauraciones, acontecimientos y evolución.
              </p>
            </div>

            <div className="image-detail-photo-v2">
              <span>{imagen.iniciales}</span>
              <small>Fotografía del titular</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section image-overview-v2">
        <div className="shell image-overview-grid-v2">
          <div className="image-overview-copy-v2">
            <span className="eyebrow">De un vistazo</span>
            <h2>La imagen</h2>
            <p>
              Cada titular mantiene una ficha propia conectada con su hermandad,
              autoría, paso procesional, restauraciones y acontecimientos históricos.
            </p>
          </div>

          <div className="image-facts-v2">
            <article>
              <small>Hermandad</small>
              <Link href={`/hermandades/${hermandad.slug}`}>
                {hermandad.nombrePopular}
              </Link>
            </article>

            <article>
              <small>Autor</small>
              <strong>{imagen.autor || 'Pendiente de incorporar'}</strong>
            </article>

            <article>
              <small>Fecha</small>
              <strong>{imagen.fecha || 'Pendiente de incorporar'}</strong>
            </article>

            <article>
              <small>Tipología</small>
              <strong>{imagen.tipologia || imagen.tipo || 'Pendiente de incorporar'}</strong>
            </article>

            {imagen.coronacionCanonica && (
              <article className="image-coronation-v2">
                <small>Coronación canónica</small>

                <div className="image-coronation-events-v2">
                  <div className="image-coronation-event-v2">
                    <span>{imagen.coronacionCanonica.acto.titulo}</span>
                    <strong>{imagen.coronacionCanonica.acto.fecha}</strong>
                    <p>{imagen.coronacionCanonica.acto.texto}</p>
                  </div>

                  <div className="image-coronation-event-v2">
                    <span>{imagen.coronacionCanonica.reconocimiento.titulo}</span>
                    <strong>{imagen.coronacionCanonica.reconocimiento.fecha}</strong>
                    <p>{imagen.coronacionCanonica.reconocimiento.texto}</p>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="section brotherhood-soft image-life-v2">
        <div className="shell">
          <span className="eyebrow">Historia material y devocional</span>
          <h2 className="image-section-title-v2">Vida de la imagen</h2>

          <div className="image-life-grid-v2">
            <article>
              <span className="eyebrow">Patrimonio</span>
              <h3>Restauraciones</h3>
              <p>
                Intervenciones ordenadas por año, restaurador, descripción de los
                trabajos y documentación relacionada.
              </p>
              <small>Pendiente de incorporar</small>
            </article>

            <article>
              <span className="eyebrow">Acontecimientos</span>
              <h3>Hitos destacados</h3>
              <p>
                Salidas extraordinarias, Vía Crucis, Pregón de las Glorias,
                aniversarios y otros acontecimientos vinculados al titular.
              </p>
              <small>Pendiente de incorporar</small>
            </article>
          </div>
        </div>
      </section>

      <section className="section image-timeline-section-v2">
        <div className="shell">
          <span className="eyebrow">Evolución</span>
          <h2 className="image-section-title-v2">Cronología</h2>

          <div className="image-timeline-v2">
            {cronologia.map((item, index) => (
              <article key={`${item.fecha}-${item.titulo}-${index}`}>
                <strong>{item.fecha}</strong>
                <h3>{item.titulo}</h3>
                <p>{item.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {imagen.fuentes?.length > 0 && (
        <section className="section sources-section" id="fuentes">
          <div className="shell">
            <div className="sources-heading">
              <div>
                <span className="eyebrow">Documentación</span>
                <h2>Fuentes</h2>
              </div>
            </div>

            <div className="sources-list">
              {imagen.fuentes.map((fuente) => (
                <a
                  className="source-row"
                  href={fuente.url}
                  target="_blank"
                  rel="noreferrer"
                  key={fuente.id}
                >
                  <span className="source-capirote" aria-hidden="true" />
                  <div className="source-copy">
                    <strong>{fuente.nombre}</strong>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
