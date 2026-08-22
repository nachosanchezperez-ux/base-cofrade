import Link from 'next/link';
import Image from 'next/image';
import { cache } from 'react';
import CofradeTypeBadges from '@/components/CofradeTypeBadges';
import BrotherhoodMusicalHeritage from '@/components/BrotherhoodMusicalHeritage';
import {
  BrotherhoodConceptualTitulars,
  BrotherhoodOwnBands,
} from '@/components/BrotherhoodRelationalExtras';
import EntitySectionNav from '@/components/EntitySectionNav';
import FestivalPostersSection from '@/components/FestivalPostersSection';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import OfficialLinks from '@/components/OfficialLinks';
import RelationalEntityHero from '@/components/RelationalEntityHero';
import SectionTitle from '@/components/SectionTitle';
import SourcesBlock from '@/components/SourcesBlock';
import { hermandades } from '@/lib/data';
import { getStepPhotoFraming } from '@/lib/step-photo-framing';
import { getBrotherhoodMusicalHeritage } from '@/lib/supabase/brotherhood-musical-heritage';
import { getHermandadPageBySlug } from '@/lib/supabase/brotherhoods';
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  brotherhoodSeoDescription,
  brotherhoodSeoTitle,
  pageTitle,
} from '@/lib/seo';

export const dynamic = 'force-dynamic';
const getHermandad = cache(getHermandadPageBySlug);
const councilParticipationPhotoCreditBySlug = {
  'via-crucis-hermandades-1985-baratillo': 'Fotografía · Hermandad',
};

export function generateStaticParams() {
  return hermandades.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const h = await getHermandad(slug);

  if (!h) {
    return {
      title: 'Hermandad no encontrada',
      robots: { index: false, follow: false },
    };
  }

  const title = brotherhoodSeoTitle(h);
  const description = brotherhoodSeoDescription(h);
  const canonical = `/hermandades/${h.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: pageTitle(title),
      description,
      url: canonical,
    },
    twitter: {
      title: pageTitle(title),
      description,
    },
  };
}

export default async function HermandadDetailPage({ params }) {
  const { slug } = await params;
  const h = await getHermandad(slug);
  if (!h) notFound();

  const [entityCoverMedia, musicalHeritage] = await Promise.all([
    getPublishedEntityCoverMediaMap(
      [
        h.id,
        ...h.imagenes.map((imagen) => imagen.id),
        ...h.pasos.map((paso) => paso.id),
        ...(h.participacionesConsejo || []).map((participacion) => participacion.id),
      ]
    ),
    getBrotherhoodMusicalHeritage(h.id),
  ]);
  const heroMedia = entityCoverMedia.get(h.id)
    || h.imagenes.map((imagen) => entityCoverMedia.get(imagen.id)).find(Boolean)
    || null;
  const imagenMap = new Map(h.imagenes.map((imagen) => [imagen.id, imagen]));
  const tiposHermandad = h.tipos || [];
  const esHermandadDePenitencia = tiposHermandad.includes('Penitencia');
  const acompanamientoMusicalCopy = esHermandadDePenitencia
    ? {
      eyebrow: 'Semana Santa',
      description: 'Las formaciones que ponen música al discurrir de la Hermandad durante la estación de penitencia.',
    }
    : {
      eyebrow: 'Música procesional',
      description: 'El acompañamiento musical actual se documenta según las salidas y los actos de culto propios de la Hermandad.',
    };
  const canonicalPath = `/hermandades/${h.slug}`;
  const description = brotherhoodSeoDescription(h);
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absoluteUrl(canonicalPath)}#webpage`,
    url: absoluteUrl(canonicalPath),
    name: pageTitle(brotherhoodSeoTitle(h)),
    description,
    inLanguage: 'es',
    isPartOf: {
      '@id': `${absoluteUrl('/')}#website`,
    },
    about: {
      '@type': 'Organization',
      name: h.nombreOficial || h.nombrePopular,
      alternateName: h.nombrePopular,
      ...(h.enlacesOficiales?.length ? {
        sameAs: h.enlacesOficiales.map((link) => link.url),
      } : {}),
      ...(h.localidad ? {
        address: {
          '@type': 'PostalAddress',
          addressLocality: h.localidad,
          addressRegion: h.provincia || 'Sevilla',
          addressCountry: 'ES',
        },
      } : {}),
    },
  };

  return (
    <main className="brotherhood-page" style={{
      '--brotherhood-primary': h.colores?.primario || '#153B69',
      '--brotherhood-secondary': h.colores?.secundario || '#A71930',
      '--brotherhood-light': h.colores?.claro || '#FFFFFF',
      '--brotherhood-dark': h.colores?.oscuro || '#0D2949',
      '--brotherhood-on-secondary': h.colores?.sobreSecundario || '#FFFFFF'
    }}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Hermandades', path: '/hermandades' },
        { name: h.nombrePopular, path: canonicalPath },
      ])} />
      <JsonLd data={pageJsonLd} />
      <RelationalEntityHero
        variant="brotherhood"
        entityType="Hermandad"
        title={h.nombrePopular}
        subtitle={h.nombreOficial}
        breadcrumbItems={[
          { label: 'Hermandades', href: '/hermandades' },
          { label: h.localidad || 'Ficha' },
        ]}
        badges={[...(h.tipos || []), h.localidad]}
        facts={[
          { label: 'Fundación', value: h.fundacion },
          { label: 'Sede canónica', value: h.sede },
          { label: 'Día de salida', value: h.diaSalida },
        ]}
        media={{
          photoSrc: heroMedia?.path || '',
          photoAlt: heroMedia?.alt || `Titular de ${h.nombrePopular}`,
          credit: heroMedia?.credit || '',
          initials: h.escudoIniciales || h.nombrePopular.slice(0, 2).toUpperCase(),
          crestSrc: h.escudoPath || '',
          crestAlt: `Escudo de ${h.nombrePopular}`,
        }}
      />

      <EntitySectionNav items={[
        { href: '#resumen', label: 'Resumen' },
        { href: '#titulares', label: 'Titulares' },
        { href: '#pasos', label: 'Pasos' },
        (h.imagenes?.length > 0 || h.pasos?.length > 0) && { href: '#tira-del-hilo', label: 'Tira del hilo' },
        h.acompanamientoActual?.length > 0 && { href: '#acompanamiento-musical', label: 'Acompañamiento' },
        (musicalHeritage.length > 0 || h.patrimonioMusical?.length > 0) && { href: '#musica', label: 'Patrimonio musical' },
        h.cronologia?.length > 0 && { href: '#historia', label: 'Historia' },
        h.habitos?.length > 0 && { href: '#tunica', label: 'Túnica' },
        h.salidas?.length > 0 && { href: '#salidas', label: 'Salidas' },
        h.cultos?.length > 0 && { href: '#cultos', label: 'Cultos' },
        h.cartelesFiestas?.length > 0 && { href: '#carteles', label: 'Carteles' },
        (h.patrimonio?.length > 0 || h.estrenos?.length > 0) && { href: '#patrimonio', label: 'Patrimonio' },
        h.acompanamientos?.length > 0 && { href: '#acompanamientos', label: 'Histórico musical' },
        h.noticias?.length > 0 && { href: '#noticias', label: 'Noticias' },
        h.curiosidades?.length > 0 && { href: '#curiosidades', label: 'Curiosidades' },
        h.enlacesOficiales?.length > 0 && { href: '#enlaces-oficiales', label: 'Web y redes' },
        h.fuentesFicha?.length > 0 && { href: '#fuentes', label: 'Fuentes' },
      ]} />

      <section className="section" id="resumen"><div className="shell content-grid">
        <div>
          <SectionTitle eyebrow="De un vistazo" title={h.nombrePopular} />
          <p className="body-large">{h.resumen}</p><p>{h.historia}</p>

          {h.participacionesConsejo?.length > 0 && (
            <div className="council-participations">
              {h.participacionesConsejo.map((participacion) => {
                const eventMedia = entityCoverMedia.get(participacion.id);
                const imagePath = eventMedia?.path || participacion.imagen;
                const imageCredit = councilParticipationPhotoCreditBySlug[participacion.slug]
                  || participacion.imagenCredito
                  || eventMedia?.credit;

                return (
                  <article className="council-participation-card" key={participacion.id}>
                    {imagePath ? (
                      <figure className="council-participation-visual">
                        <Image
                          className="council-participation-photo"
                          src={imagePath}
                          alt={eventMedia?.alt || participacion.titulo}
                          fill
                          sizes="(max-width: 560px) calc(100vw - 40px), (max-width: 900px) 42vw, 360px"
                        />
                        {imageCredit ? <figcaption>{imageCredit}</figcaption> : null}
                      </figure>
                    ) : (
                      <div className="council-participation-photo council-photo-placeholder">
                        <span>Fotografía</span><small>{participacion.ano}</small>
                      </div>
                    )}
                    <div className="council-participation-copy">
                      <div className="council-participation-meta">
                        <span>{participacion.categoria}</span><strong>{participacion.ano}</strong>
                      </div>
                      <h3>{participacion.titulo}</h3>
                      <p className="council-participation-protagonists">{participacion.protagonistas}</p>
                      <p>{participacion.resumen}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
        <aside className="brotherhood-summary-card key-data-card">
          <div className="key-data-heading">
            <span className="eyebrow">Datos clave</span>
            {h.datosJornada && <span className="key-data-year">{h.datosJornada.ano}</span>}
          </div>

          <div className="key-data-identity" data-type-count={Math.min(tiposHermandad.length, 3)}>
            <div className="key-data-types">
              <small>{tiposHermandad.length === 1 ? 'Tipo' : 'Tipos'}</small>
              <CofradeTypeBadges tipos={tiposHermandad} compact />
            </div>
            <div className="key-data-day">
              <small>Día de salida</small>
              <strong>{h.diaSalida}</strong>
            </div>
          </div>

          {h.datosJornada && (
            <div className="key-data-metrics key-data-metrics-four">
              <div>
                <strong>{h.datosJornada.ordenJornada}</strong>
                <span>Orden en la jornada</span>
              </div>
              <div>
                <strong>{h.datosJornada.totalHermanos || h.datosJornada.totalCortejo}</strong>
                <span>{h.datosJornada.totalHermanos ? 'Hermanos' : 'Cortejo'}</span>
              </div>
              <div>
                <strong>{h.datosJornada.totalNazarenos}</strong>
                <span>Nazarenos</span>
              </div>
              <div className="key-data-time">
                <strong className="career-time">{h.datosJornada.tiempoCarreraOficial}</strong>
                <span>Carrera Oficial</span>
              </div>
            </div>
          )}

          <div className="key-data-location">
            <div>
              <small>Sede</small>
              <strong>{h.sede}</strong>
            </div>
            <div>
              <small>Localidad</small>
              <strong>{h.localidad}</strong>
            </div>
          </div>

        </aside>
      </div></section>

      <section className="section brotherhood-soft" id="titulares"><div className="shell">
        <SectionTitle eyebrow="Titularidad" title="Sagrados Titulares" description="Imágenes e identidades devocionales que conforman la titularidad documentada de la Hermandad." />
        <div className="image-grid">{h.imagenes.map((imagen) => {
          const coverMedia = entityCoverMedia.get(imagen.id);
          const card = (
            <>
              {coverMedia?.path ? (
                <div className="portrait-placeholder brotherhood-portrait has-image">
                  <Image
                    className="brotherhood-portrait-image"
                    src={coverMedia.path}
                    alt={coverMedia.alt || `Fotografía de ${imagen.nombre}`}
                    fill
                    sizes="(max-width: 620px) calc(100vw - 40px), (max-width: 980px) 50vw, 25vw"
                  />
                  {coverMedia.credit ? (
                    <small className="brotherhood-portrait-credit">
                      {coverMedia.credit}
                    </small>
                  ) : null}
                </div>
              ) : (
                <div className="portrait-placeholder brotherhood-portrait"><span>{imagen.iniciales}</span></div>
              )}
              <div className="image-card-body">
                <span className="eyebrow">{imagen.tipo}</span>
                <h3>{imagen.nombre}</h3>
                <p className="image-card-authorship">{imagen.autor} · {imagen.fecha}</p>
                {imagen.descripcion && <p className="image-card-description">{imagen.descripcion}</p>}
                {(imagen.tecnica || imagen.material || imagen.dimensiones) && (
                  <div className="image-card-details">
                    {imagen.tecnica && <span>{imagen.tecnica}</span>}
                    {imagen.material && <span>{imagen.material}</span>}
                    {imagen.dimensiones && <span>{imagen.dimensiones}</span>}
                  </div>
                )}
                {imagen.iconografia && (
                  <details className="image-iconography">
                    <summary>Iconografía <span>＋</span></summary>
                    <p>{imagen.iconografia}</p>
                  </details>
                )}
                {