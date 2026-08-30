import Link from 'next/link';
import { notFound } from 'next/navigation';
import EntitySectionNav from '@/components/EntitySectionNav';
import EntityMediaGallery from '@/components/EntityMediaGallery';
import ImageHeroV2 from '@/components/ImageHeroV2';
import JsonLd from '@/components/JsonLd';
import RelationalThread from '@/components/RelationalThread';
import SourcesBlock from '@/components/SourcesBlock';
import { getPublishedEntityMedia } from '@/lib/supabase/entity-media';
import { getImagenPageBySlug } from '@/lib/supabase/public-entity-pages';
import {
  meetsPublicEditorialMinimum,
  publicEditorialRobots,
  publicText,
} from '@/lib/supabase/public-entity-page';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageTitle,
  seoDescription,
} from '@/lib/seo';

function selectEditorialHero(items = []) {
  return items.find((item) => item.relationType === 'hero')
    || items.find((item) => item.isCover)
    || null;
}

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
  const media = await getPublishedEntityMedia(imagen.id);
  const coverMedia = selectEditorialHero(media);
  const title = imagen.nombre;
  const description = seoDescription(
    imagen.descripcion,
    hermandad
      ? `Ficha de ${imagen.nombre}, titular de ${hermandad.nombrePopular}: autoría, datación, historia, restauraciones, cronología y fuentes documentales.`
      : `Ficha de ${imagen.nombre}: autoría, datación, descripción material y fuentes documentales.`
  );
  const canonical = `/imagenes/${imagen.slug}`;
  const editoriallyReady = meetsPublicEditorialMinimum({
    identity: imagen.nombre,
    type: imagen.tipologia || imagen.tipo,
    context: hermandad?.localidad || hermandad?.nombrePopular,
    summary: imagen.descripcion,
    relations: [hermandad?.id, result.pasos, imagen.restauraciones, imagen.acontecimientos],
    sources: imagen.fuentes || [],
    publicValues: imagen,
  });
  const socialImage = coverMedia?.path
    ? [{ url: coverMedia.path, alt: coverMedia.alt || `Fotografía de ${imagen.nombre}` }]
    : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    robots: publicEditorialRobots(editoriallyReady),
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

  const { imagen, hermandad, pasos = [] } = result;
  const entityMedia = await getPublishedEntityMedia(imagen.id);
  const explicitHeroMedia = entityMedia.find((item) => item.relationType === 'hero') || null;
  const portraitMedia = entityMedia.find((item) => item.isCover) || null;
  const coverMedia = explicitHeroMedia || portraitMedia;
  const galleryMedia = entityMedia.filter((item) => !item.isCover && item.relationType !== 'hero');
  const primaryStep = pasos.find((paso) => paso.slug) || pasos[0] || null;
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
  const relationalItems = [
    ...(hermandad ? [{
      kind: 'Hermandad',
      relation: 'Pertenece a',
      title: hermandad.nombrePopular,
      href: `/hermandades/${hermandad.slug}`,
      context: 'Ficha matriz de la corporación',
    }] : []),
    ...pasos.map((paso) => ({
      kind: 'Paso',
      relation: 'Procesiona en',
      title: paso.nombre,
      href: `/pasos/${paso.slug}`,
      context: paso.tipo || 'Paso procesional relacionado',
    })),
    ...otrasImagenes.map((otraImagen) => ({
      kind: 'Imagen',
      relation: 'Comparte hermandad',
      title: otraImagen.nombre,
      href: `/imagenes/${otraImagen.slug}`,
      context: [otraImagen.tipo, otraImagen.fecha].filter(Boolean).join(' · '),
    })),
  ];
  const hasRelatedEntities = relationalItems.length > 0;
  const hasImageOverview = Boolean(
    hermandad
    || publicText(imagen.autor)
    || publicText(imagen.fecha)
    || publicText(imagen.tipologia || imagen.tipo)
    || imagen.coronacionCanonica
  );
  const breadcrumbs = [
    { name: 'Inicio', path: '/' },
    { name: 'Imágenes', path: '/imagenes' },
    { name: imagen.nombre, path: canonicalPath },
  ];

  return (
    <div
      className="brotherhood-page image-detail-v2"
      style={{
        '--brotherhood-primary': hermandad?.colores?.primario || '#153B69',
        '--brotherhood-secondary': hermandad?.colores?.secundario || '#A71930',
        '--brotherhood-light': hermandad?.colores?.claro || '#FFFFFF',
        '--brotherhood-dark': hermandad?.colores?.oscuro || '#0D2949',
        '--brotherhood-on-secondary': hermandad?.colores?.sobreSecundario || '#FFFFFF'
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
        ...(entityMedia.length ? {
          image: [...new Set(entityMedia.map((item) => absoluteUrl(item.path)))],
        } : {}),
        ...(imagen.material ? { artMedium: imagen.material } : {}),
        ...(publicText(imagen.autor) && !/desconocido|anónimo/i.test(imagen.autor) ? {
          creator: {
            '@type': 'Person',
            name: imagen.autor,
          },
        } : {}),
      }} />
      <ImageHeroV2
        entityType={hermandad ? 'Imagen titular' : 'Imagen'}
        title={imagen.nombre}
        breadcrumbItems={[
          { label: 'Imágenes', href: '/imagenes' },
          { label: 'Ficha' },
        ]}
        relation={hermandad ? {
          label: 'Titular de',
          name: hermandad.nombrePopular,
          href: `/hermandades/${hermandad.slug}`,
          crestSrc: hermandad.escudoPath || '',
        } : null}
        facts={[
          publicText(imagen.autor) ? { label: 'Autoría', value: publicText(imagen.autor) } : null,
          publicText(imagen.fecha) ? { label: 'Datación', value: publicText(imagen.fecha) } : null,
          primaryStep ? {
            label: 'Procesiona en',
            value: primaryStep.nombre,
            href: primaryStep.slug ? `/pasos/${primaryStep.slug}` : undefined,
          } : null,
        ]}
        media={{
          photoSrc: coverMedia?.path || '',
          photoAlt: coverMedia?.alt || `Fotografía de ${imagen.nombre}`,
          credit: coverMedia?.credit || '',
          initials: imagen.iniciales,
          width: coverMedia?.width,
          height: coverMedia?.height,
          focusX: coverMedia?.focusX,
          focusY: coverMedia?.focusY,
          mobileFocusX: coverMedia?.mobileFocusX,
          mobileFocusY: coverMedia?.mobileFocusY,
          fitMode: coverMedia?.fitMode,
        }}
      />

      <EntitySectionNav items={[
        hasImageOverview && { href: '#resumen', label: 'Resumen' },
        hasRelatedEntities && { href: '#tira-del-hilo', label: 'Tira del hilo' },
        galleryMedia.length > 0 && { href: '#galeria', label: 'Galería' },
        imagen.restauraciones?.length > 0 && { href: '#restauraciones', label: 'Restauraciones' },
        imagen.acontecimientos?.length > 0 && { href: '#hitos', label: 'Hitos' },
        cronologia.length > 0 && { href: '#cronologia', label: 'Cronología' },
        imagen.fuentes?.length > 0 && { href: '#fuentes', label: 'Fuentes' },
      ]} />

      {hasImageOverview ? <section className="section image-overview-v2" id="resumen">
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
            {hermandad ? <article>
              <small>Hermandad</small>
              <Link href={`/hermandades/${hermandad.slug}`}>
                {hermandad.nombrePopular}
              </Link>
            </article> : null}

            {publicText(imagen.autor) ? <article>
              <small>Autor</small>
              <strong>{publicText(imagen.autor)}</strong>
            </article> : null}

            {publicText(imagen.fecha) ? <article>
              <small>Fecha</small>
              <strong>{publicText(imagen.fecha)}</strong>
            </article> : null}

            {publicText(imagen.tipologia || imagen.tipo) ? <article>
              <small>Tipología</small>
              <strong>{publicText(imagen.tipologia || imagen.tipo)}</strong>
            </article> : null}

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
      </section> : null}

      <RelationalThread
        currentName={imagen.nombre}
        currentMeta={[imagen.tipologia || imagen.tipo, imagen.fecha].filter(Boolean).join(' · ')}
        items={relationalItems}
        priorityProfile="imagen"
        title="Desde esta imagen, sigue tirando del hilo"
        description="Salta a su Hermandad, al paso donde procesiona o a otras imágenes vinculadas. La relación permanece visible para que la navegación tenga siempre contexto."
      />

      <EntityMediaGallery items={galleryMedia} id="galeria" />

      {imagen.restauraciones?.length > 0 && (
        <section className="section brotherhood-soft" id="restauraciones">
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
        <section className="section" id="hitos">
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
        <section className="section image-timeline-section-v2" id="cronologia">
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

      <SourcesBlock sources={imagen.fuentes} />
    </div>
  );
}
