import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import SourcesBlock from '@/components/SourcesBlock';
import { getPublishedEntityCoverMedia } from '@/lib/supabase/entity-media';
import { getImagenPageBySlug } from '@/lib/supabase/public-entity-pages';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageTitle,
  seoDescription,
} from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getImagenPageBySlug(slug);

  if (!result) {
    return {
      title: 'Imagen no encontrada',
      robots: { index: false, follow: false },
    };
  }

  const { imagen, hermandad } = result;
  const coverMedia = await getPublishedEntityCoverMedia(imagen.id);
  const title = imagen.nombre;
  const description = seoDescription(
    imagen.descripcion,
    hermandad
      ? `Ficha de ${imagen.nombre}, titular de ${hermandad.nombrePopular}: autoría, datación, historia, restauraciones, cronología y fuentes documentales.`
      : `Ficha de ${imagen.nombre}: autoría, datación, descripción material y fuentes documentales.`
  );
  const canonical = `/imagenes/${imagen.slug}`;
  const socialImage = coverMedia?.path
    ? [{ url: coverMedia.path, alt: coverMedia.alt || `Fotografía de ${imagen.nombre}` }]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: pageTitle(title),
      description,
      url: canonical,
      ...(socialImage ? { images: socialImage } : {}),
    },
    twitter: {
      title: pageTitle(title),
      description,
      ...(socialImage ? { images: socialImage } : {}),
    },
  };
}

export default async function ImagenPage({ params }) {
  const { slug } = await params;
  const result = await getImagenPageBySlug(slug);

  if (!result) notFound();

  const { imagen, hermandad } = result;
  const coverMedia = await getPublishedEntityCoverMedia(imagen.id);
  const canonicalPath = `/imagenes/${imagen.slug}`;
  const cronologia = imagen.cronologia?.length
    ? imagen.cronologia
    : imagen.fecha
      ? [{
          fecha: imagen.fecha,
          titulo: 'Datación',
          texto: 'Fecha asociada actualmente a la ficha de esta imagen.'
        }]
      : [];
  const otrasImagenes = hermandad?.imagenes?.filter(
    (otraImagen) => otraImagen.slug !== imagen.slug
  ) || [];
  const breadcrumbs = hermandad
    ? [
        { name: 'Inicio', path: '/' },
        { name: 'Hermandades', path: '/hermandades' },
        { name: hermandad.nombrePopular, path: `/hermandades/${hermandad.slug}` },
        { name: imagen.nombre, path: canonicalPath },
      ]
    : [
        { name: 'Inicio', path: '/' },
        { name: 'Imágenes', path: '/imagenes' },
        { name: imagen.nombre, path: canonicalPath },
      ];

  return (
    <main
      className="brotherhood-page image-detail-v2"
      style={{
        '--brotherhood-primary': hermandad?.colores?.primario || '#153B69',
        '--brotherhood-secondary': hermandad?.colores?.secundario || '#A71930',
        '--brotherhood-light': hermandad?.colores?.claro || '#FFFFFF'
      }}
    >
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'VisualArtwork',
        '@id': `${absoluteUrl(canonicalPath)}#artwork`,
        url: absoluteUrl(canonicalPath),
        name: imagen.nombre,
        artform: imagen.tipologia || imagen.tipo,
        ...(coverMedia?.path ? { image: absoluteUrl(coverMedia.path) } : {}),
        ...(imagen.material ? { artMedium: imagen.material } : {}),
        ...(imagen.autor && !/pendiente|desconocido|anónimo/i.test(imagen.autor) ? {
          creator: {
            '@type': 'Person',
            name: imagen.autor,
          },
        } : {}),
      }} />
      <section className="image-detail-hero-v2">
        <div className="shell">
          <div className="brotherhood-breadcrumb">
            <span className="breadcrumb-accent" />
            {hermandad ? (
              <>
                <Link href="/hermandades">Hermandades</Link>
                <span className="breadcrumb-arrow">→</span>
                <Link href={`/hermandades/${hermandad.slug}`}>{hermandad.nombrePopular}</Link>
              </>
            ) : (
              <Link href="/imagenes">Imágenes</Link>
            )}
            <span className="breadcrumb-arrow">→</span>
            <strong>{imagen.nombre}</strong>
          </div>

          <div className="image-detail-hero-grid-v2">
            <div className="image-detail-hero-copy-v2">
              <h1>{imagen.nombre}</h1>
              <p>
                {hermandad
                  ? `Imagen titular de ${hermandad.nombrePopular}. Su ficha reúne autoría, historia y evolución.`
                  : 'Ficha propia de la imagen, con su autoría, datación y datos documentados.'}
              </p>
            </div>

            {coverMedia?.path ? (
              <figure
                className="image-detail-photo-v2"
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 5',
                  minHeight: 0,
                  margin: 0,
                  overflow: 'hidden',
                  background: '#081d33',
                }}
              >
                <Image
                  src={coverMedia.path}
                  alt={coverMedia.alt || `Fotografía de ${imagen.nombre}`}
                  fill
                  priority
                  sizes="(max-width: 980px) min(620px, calc(100vw - 40px)), 38vw"
                  style={{ objectFit: 'cover', objectPosition: 'center top' }}
                />
                {coverMedia.credit ? (
                  <figcaption
                    style={{
                      position: 'absolute',
                      right: 16,
                      bottom: 16,
                      left: 16,
                      zIndex: 1,
                      width: 'fit-content',
                      maxWidth: 'calc(100% - 32px)',
                      padding: '8px 11px',
                      borderRadius: 999,
                      color: '#fff',
                      background: 'rgba(5, 18, 31, .76)',
                      backdropFilter: 'blur(10px)',
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {coverMedia.credit}
                  </figcaption>
                ) : null}
              </figure>
            ) : (
              <div className="image-detail-photo-v2">
                <span>{imagen.iniciales}</span>
                <small>Fotografía del titular</small>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section image-overview-v2">
        <div className="shell image-overview-grid-v2">
          <div className="image-overview-copy-v2">
            <span className="eyebrow">De un vistazo</span>
            <h2>La imagen</h2>
            <p>
              Cada imagen mantiene una ficha propia y puede conectarse con Hermandades,
              autorías, pasos y acontecimientos sin depender de esas relaciones para existir.
            </p>
          </div>

          <div className="image-facts-v2">
            <article>
              <small>Hermandad</small>
              {hermandad ? (
                <Link href={`/hermandades/${hermandad.slug}`}>
                  {hermandad.nombrePopular}
                </Link>
              ) : (
                <strong>Sin vinculación publicada</strong>
              )}
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

      {imagen.restauraciones?.length > 0 && (
        <section className="section brotherhood-soft">
          <div className="shell">
            <span className="eyebrow">Patrimonio</span>
            <h2 className="image-section-title-v2">Restauraciones</h2>
            <div className="image-record-list-v2">
              {imagen.restauraciones.map((restauracion, index) => (
                <article key={`${restauracion.fecha || index}-${index}`}>
                  <strong>{restauracion.fecha}</strong>
                  <h3>{restauracion.titulo}</h3>
                  <p>{restauracion.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {imagen.acontecimientos?.length > 0 && (
        <section className="section">
          <div className="shell">
            <span className="eyebrow">Acontecimientos</span>
            <h2 className="image-section-title-v2">Hitos destacados</h2>
            <div className="image-record-list-v2">
              {imagen.acontecimientos.map((acontecimiento, index) => (
                <article key={`${acontecimiento.fecha || index}-${index}`}>
                  <strong>{acontecimiento.fecha}</strong>
                  <h3>{acontecimiento.titulo}</h3>
                  <p>{acontecimiento.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {cronologia.length > 0 && (
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
      )}

      {otrasImagenes.length > 0 && (
        <section className="related-titulares-section">
          <div className="shell">
            <div className="related-titulares-head">
              <span className="eyebrow">Relaciones</span>
              <h2>Otras imágenes titulares</h2>
            </div>

            <div className="related-titulares-list">
              {otrasImagenes.map((otraImagen) => (
                <Link
                  className="related-titular"
                  href={`/imagenes/${otraImagen.slug}`}
                  key={otraImagen.id}
                >
                  <span className="related-titular-avatar">
                    {otraImagen.iniciales}
                  </span>
                  <strong>{otraImagen.nombre}</strong>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SourcesBlock sources={imagen.fuentes} />
    </main>
  );
}
