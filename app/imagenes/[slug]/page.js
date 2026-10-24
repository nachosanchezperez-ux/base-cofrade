import Link from 'next/link';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import EntitySectionNav from '@/components/EntitySectionNav';
import EntityLastUpdated from '@/components/EntityLastUpdated';
import EntityMediaGallery from '@/components/EntityMediaGallery';
import ImageHeroV2 from '@/components/ImageHeroV2';
import ImageRestorationsSection from '@/components/ImageRestorationsSection';
import { imageRestorationCards, buildImageChronology } from '@/lib/image-restoration-display';
import { heritageDirectoryTypePath, heritageTypeForValue } from '@/lib/heritage-directory';
import { agendaMunicipalityHref } from '@/lib/agenda-relations';
import JsonLd from '@/components/JsonLd';
import { imagePageRelationCopy } from '@/lib/brotherhood-image-relations';
import SourcesBlock from '@/components/SourcesBlock';
import { getPublishedEntityMedia } from '@/lib/supabase/entity-media';
import { getPublishedImageDresser } from '@/lib/supabase/image-dresser';
import { getImagenPageBySlug } from '@/lib/supabase/public-entity-pages';
import {
  meetsPublicEditorialMinimum,
  publicEditorialRobots,
  publicText,
} from '@/lib/supabase/public-entity-page';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  contextualEntitySeoTitle,
  entityHeadingContext,
  pageTitle,
  seoDescription,
} from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = 900;

const getImagen = cache(getImagenPageBySlug);
const getEntityMedia = cache(getPublishedEntityMedia);

function selectEditorialHero(items = []) {
  return items.find((item) => item.relationType === 'hero')
    || items.find((item) => item.isCover)
    || null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getImagen(slug);

  if (!result) {
    return {
      title: 'Imagen no encontrada',
      robots: { index: false, follow: false },
    };
  }

  const { imagen, hermandad } = result;
  const media = await getEntityMedia(imagen.id);
  const coverMedia = selectEditorialHero(media);
  const title = contextualEntitySeoTitle(imagen.nombre, {
    context: hermandad?.nombrePopular,
    locality: hermandad?.localidad,
  });
  const description = seoDescription(
    imagen.descripcion,
    hermandad
      ? `Ficha de ${imagen.nombre}, ${imagePageRelationCopy(imagen.relacionHermandad).phrase} ${hermandad.nombrePopular}: autoría, datación, historia, restauraciones, cronología y fuentes documentales.`
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
  const result = await getImagen(slug);

  if (!result) notFound();

  const { imagen, hermandad, pasos = [] } = result;
  const municipalityHubHref = hermandad?.localidad
    ? agendaMunicipalityHref(hermandad.localidad)
    : '';
  const [entityMedia, dresser] = await Promise.all([
    getEntityMedia(imagen.id),
    getPublishedImageDresser(imagen.id),
  ]);
  const explicitHeroMedia = entityMedia.find((item) => item.relationType === 'hero') || null;
  const portraitMedia = entityMedia.find((item) => item.isCover) || null;
  const coverMedia = explicitHeroMedia || portraitMedia;
  const galleryMedia = entityMedia.filter((item) => !item.isCover && item.relationType !== 'hero');
  const primaryStep = pasos.find((paso) => paso.slug) || pasos[0] || null;
  const canonicalPath = `/imagenes/${imagen.slug}`;
  const directoryType = heritageTypeForValue(imagen.tipo, 'imagenes');
  const restorationCards = imageRestorationCards(imagen.restauraciones);
  const imageAuthors = (imagen.autores || []).filter((author) => publicText(author?.label));
  const linkedAuthors = imageAuthors.filter((author) => author.slug);
  // The hero fact and JSON-LD accept a single creator link; only use it when it
  // is unambiguous (one author, named plainly rather than "Atribuido a …").
  const singleLinkedAuthor = imageAuthors.length === 1
    && linkedAuthors.length === 1
    && linkedAuthors[0].label === linkedAuthors[0].name
    ? linkedAuthors[0]
    : null;
  // La autoría aparece una sola vez: en la cabecera si cabe en un único dato
  // (texto o un solo enlace); en el resumen si hay que enlazar a varios autores.
  const heroShowsAuthor = Boolean(publicText(imagen.autor)) && (singleLinkedAuthor || !linkedAuthors.length);
  const summaryShowsAuthor = Boolean(publicText(imagen.autor)) && !heroShowsAuthor;
  const cronologia = buildImageChronology(imagen, restorationCards);
  // Sin cronología propia ni restauraciones, la única entrada sería la datación,
  // que ya figura en la cabecera.
  const hasOwnChronology = (Array.isArray(imagen.cronologia) && imagen.cronologia.some(Boolean))
    || restorationCards.length > 0;
  const showChronology = cronologia.length > 0 && hasOwnChronology;
  const otrasImagenes = hermandad?.imagenes?.filter(
    (otraImagen) => otraImagen.slug && otraImagen.slug !== imagen.slug
  ) || [];
  const otherSteps = pasos.filter((paso) => paso.slug && paso !== primaryStep);
  const hasImageOverview = Boolean(
    municipalityHubHref
    || publicText(imagen.descripcion)
    || publicText(imagen.estadoActual)
    || summaryShowsAuthor
    || publicText(imagen.tipologia || imagen.tipo)
    || dresser?.name
    || imagen.sustituidaPor
    || imagen.sustituyoA?.length
    || otherSteps.length
    || otrasImagenes.length
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
        '@type': 'WebPage',
        '@id': `${absoluteUrl(canonicalPath)}#webpage`,
        url: absoluteUrl(canonicalPath),
        name: imagen.nombre,
        isPartOf: { '@id': `${absoluteUrl('/')}#website` },
        mainEntity: { '@id': `${absoluteUrl(canonicalPath)}#artwork` },
        about: [
          { '@id': `${absoluteUrl(canonicalPath)}#artwork` },
          ...(hermandad ? [{
            '@type': 'Organization',
            '@id': `${absoluteUrl(`/hermandades/${hermandad.slug}`)}#organization`,
            url: absoluteUrl(`/hermandades/${hermandad.slug}`),
            name: hermandad.nombreOficial || hermandad.nombrePopular,
          }] : []),
        ],
      }} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'VisualArtwork',
        '@id': `${absoluteUrl(canonicalPath)}#artwork`,
        url: absoluteUrl(canonicalPath),
        mainEntityOfPage: absoluteUrl(canonicalPath),
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
            ...(singleLinkedAuthor ? { url: absoluteUrl(`/autores/${singleLinkedAuthor.slug}`) } : {}),
          },
        } : {}),

      }} />
      <ImageHeroV2
        entityType={hermandad ? imagePageRelationCopy(imagen.relacionHermandad).entityType : 'Imagen'}
        title={imagen.nombre}
        titleContext={entityHeadingContext(imagen.nombre, { context: hermandad?.nombrePopular, locality: hermandad?.localidad })}
        breadcrumbItems={[
          { label: 'Imágenes', href: '/imagenes' },
          { label: imagen.nombre },
        ]}
        relation={hermandad ? {
          label: imagePageRelationCopy(imagen.relacionHermandad).relationLabel,
          name: hermandad.nombrePopular,
          href: `/hermandades/${hermandad.slug}`,
          crestSrc: hermandad.escudoPath || '',
        } : null}
        facts={[
          heroShowsAuthor ? {
            label: 'Autoría',
            value: publicText(imagen.autor),
            href: singleLinkedAuthor ? `/autores/${singleLinkedAuthor.slug}` : undefined,
          } : null,
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
        galleryMedia.length > 0 && { href: '#galeria', label: 'Galería' },
        imagen.restauraciones?.length > 0 && { href: '#restauraciones', label: 'Restauraciones' },
        imagen.acontecimientos?.length > 0 && { href: '#hitos', label: 'Hitos' },
        showChronology && { href: '#cronologia', label: 'Cronología' },
        imagen.fuentes?.length > 0 && { href: '#fuentes', label: 'Fuentes' },
      ]} />

      {hasImageOverview ? <section className="section image-overview-v2" id="resumen">
        <div className="shell image-overview-grid-v2">
          <div className="image-overview-copy-v2">
            <span className="eyebrow">De un vistazo</span>
            <h2>La imagen</h2>
            <EntityLastUpdated value={imagen.updatedAt} />
            {publicText(imagen.descripcion) ? <p style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>
              {publicText(imagen.descripcion)}
            </p> : null}
            {publicText(imagen.estadoActual) && publicText(imagen.estadoActual) !== publicText(imagen.descripcion) ? <p style={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere' }}>
              {publicText(imagen.estadoActual)}
            </p> : null}
          </div>

          <div className="image-facts-v2">
            {municipalityHubHref ? <article>
              <small>Localidad</small>
              <Link href={municipalityHubHref}>Guía cofrade de {hermandad.localidad}</Link>
            </article> : null}

            {summaryShowsAuthor ? <article>
              <small>{imageAuthors.length === 1 ? 'Autor' : 'Autores'}</small>
              <strong>
                {imageAuthors.map((author, index) => <span key={author.label}>
                  {index > 0 ? ' · ' : null}
                  {author.slug ? <Link href={`/autores/${author.slug}`} prefetch={false}>{author.label}</Link> : author.label}
                </span>)}
              </strong>
            </article> : null}

            {dresser?.name ? <article>
              <small>Vestidor actual</small>
              <strong>{dresser.name}</strong>
            </article> : null}

            {imagen.sustituidaPor ? <article>
              <small>Sustituida por{imagen.sustituidaPor.fecha ? ` · ${imagen.sustituidaPor.fecha}` : ''}</small>
              <Link href={`/imagenes/${imagen.sustituidaPor.slug}`}>{imagen.sustituidaPor.nombre}</Link>
            </article> : null}

            {imagen.sustituyoA?.length ? <article>
              <small>Sustituyó a</small>
              {imagen.sustituyoA.map((anterior) => (
                <Link key={anterior.slug} href={`/imagenes/${anterior.slug}`}>{anterior.nombre}</Link>
              ))}
            </article> : null}

            {otherSteps.length ? <article>
              <small>También procesiona en</small>
              {otherSteps.map((paso) => (
                <Link key={paso.slug} href={`/pasos/${paso.slug}`}>{paso.nombre}</Link>
              ))}
            </article> : null}

            {otrasImagenes.length ? <article>
              <small>{otrasImagenes.length === 1 ? 'Otra imagen de la hermandad' : 'Otras imágenes de la hermandad'}</small>
              {otrasImagenes.map((otraImagen) => (
                <Link key={otraImagen.slug} href={`/imagenes/${otraImagen.slug}`}>{otraImagen.nombre}</Link>
              ))}
            </article> : null}

            {publicText(imagen.tipologia || imagen.tipo) ? <article>
              <small>Tipología</small>
              <strong>{publicText(imagen.tipologia || imagen.tipo)}</strong>
              {directoryType ? <Link href={heritageDirectoryTypePath('imagenes', directoryType.slug)}>Ver {directoryType.label.toLowerCase()} →</Link> : null}
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

      <EntityMediaGallery items={galleryMedia} id="galeria" />

      <ImageRestorationsSection items={restorationCards} />

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

      {showChronology && (
        <section className="section image-timeline-section-v2" id="cronologia">
          <div className="shell">
            <span className="eyebrow">Evolución</span>
            <h2 className="image-section-title-v2">Cronología</h2>

            <div className="image-timeline-v2">
              {cronologia.map((item, index) => (
                <article key={`${item.fecha}-${item.titulo}-${index}`} id={item.anchor} style={item.anchor ? { scrollMarginTop: 150 } : undefined}>
                  <strong>{item.fecha}</strong>
                  <h3>{item.titulo}</h3>
                  {item.texto ? <p>{item.texto}</p> : null}
                  {item.href ? <a className="text-link" href={item.href}>{item.enlace} <span aria-hidden="true">→</span></a> : null}
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
