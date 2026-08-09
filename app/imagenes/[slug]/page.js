import Link from 'next/link';

import { notFound } from 'next/navigation';

import { getImagenBySlug, hermandades } from '@/lib/data';

export function generateStaticParams() {
  return hermandades.flatMap((hermandad) => hermandad.imagenes.map((imagen) => ({ slug: imagen.slug })));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = getImagenBySlug(slug);

  return result ? { title: result.imagen.nombre } : {};
}

function getDisplayType(imagen) {
  return imagen.tipo ? imagen.tipo.toUpperCase() : 'IMAGEN';
}

export default async function ImagenPage({ params }) {
  const { slug } = await params;
  const result = getImagenBySlug(slug);

  if (!result) notFound();

  const { imagen, hermandad } = result;

  return (
    <section className="section page-top image-record-page">
      <div className="shell">
        <div className="breadcrumbs breadcrumbs--record">
          <Link href="/hermandades">Hermandades</Link>
          <span>/</span>
          <Link href={`/hermandades/${hermandad.slug}`}>{hermandad.nombrePopular}</Link>
          <span>/</span>
          <span>Imágenes</span>
        </div>

        <div className="image-record-hero">
          <div className="image-record-visual">
            <div className="image-record-portrait">
              <span className="image-record-monogram">{imagen.iniciales}</span>
            </div>
          </div>

          <div className="image-record-copy">
            <span className="eyebrow image-record-kicker">{getDisplayType(imagen)} · TITULAR</span>
            <h1 className="page-title image-record-title">{imagen.nombre}</h1>
            <p className="page-lead image-record-lead">{imagen.descripcion}</p>

            <div className="image-record-summary">
              <article>
                <small>HERMANDAD</small>
                <Link href={`/hermandades/${hermandad.slug}`}>{hermandad.nombrePopular}</Link>
              </article>

              <article>
                <small>AUTOR</small>
                <strong>{imagen.autor || 'Pendiente de incorporar'}</strong>
              </article>

              <article>
                <small>FECHA</small>
                <strong>{imagen.fecha || 'Pendiente de incorporar'}</strong>
              </article>

              <article>
                <small>TIPOLOGÍA</small>
                <strong>{imagen.tipo || 'Titular'}</strong>
              </article>
            </div>

            <div className="image-record-actions">
              <Link className="arrow-link" href={`/hermandades/${hermandad.slug}`}>
                Volver a la hermandad
              </Link>
            </div>
          </div>
        </div>

        <div className="image-record-modules">
          <article className="image-record-module">
            <span className="eyebrow">LÍNEA PATRIMONIAL</span>
            <h2>Restauraciones</h2>
            <p>Año, restaurador, intervención, documentación y fuentes vinculadas a la imagen.</p>
          </article>

          <article className="image-record-module">
            <span className="eyebrow">HITOS Y PRESENCIAS</span>
            <h2>Acontecimientos</h2>
            <p>Vía Crucis, Pregón de las Glorias, extraordinarias y otros momentos relevantes.</p>
          </article>

          <article className="image-record-module">
            <span className="eyebrow">BIOGRAFÍA VISUAL</span>
            <h2>Cronología</h2>
            <p>La historia de la imagen se organizará automáticamente a partir de registros conectados.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
