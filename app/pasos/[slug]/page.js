import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import SectionTitle from '@/components/SectionTitle';
import StepHeroPhoto from '@/components/StepHeroPhoto';
import { getPublishedEntityCoverMedia } from '@/lib/supabase/entity-media';
import { getPasoPageBySlug } from '@/lib/supabase/public-entity-pages';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageTitle,
  seoDescription,
} from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getPasoPageBySlug(slug);

  if (!result) {
    return {
      title: 'Paso no encontrado',
      robots: { index: false, follow: false },
    };
  }

  const { paso, hermandad } = result;
  const coverMedia = await getPublishedEntityCoverMedia(paso.id);
  const title = paso.nombre;
  const description = seoDescription(
    hermandad
      ? `Ficha de ${paso.nombre}, de ${hermandad.nombrePopular}: imágenes que procesionan, configuración, patrimonio, autorías y evolución histórica.`
      : `Ficha de ${paso.nombre}: imágenes que procesionan, configuración y evolución patrimonial documentada.`
  );
  const canonical = `/pasos/${paso.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: pageTitle(title),
      description,
      url: canonical,
      ...(coverMedia?.path ? {
        images: [{
          url: coverMedia.path,
          alt: coverMedia.alt || `Fotografía de ${paso.nombre}`,
        }],
      } : {}),
    },
    twitter: {
      title: pageTitle(title),
      description,
      ...(coverMedia?.path ? {
        images: [{
          url: coverMedia.path,
          alt: coverMedia.alt || `Fotografía de ${paso.nombre}`,
        }],
      } : {}),
    },
  };
}

export default async function PasoDetailPage({params}){
  const {slug}=await params;
  const result=await getPasoPageBySlug(slug);
  if(!result) notFound();
  const {paso,hermandad,imagenes=[]}=result;
  const coverMedia = await getPublishedEntityCoverMedia(paso.id);
  const canonicalPath = `/pasos/${paso.slug}`;
  const breadcrumbs = hermandad
    ? [
        { name: 'Inicio', path: '/' },
        { name: 'Hermandades', path: '/hermandades' },
        { name: hermandad.nombrePopular, path: `/hermandades/${hermandad.slug}` },
        { name: paso.nombre, path: canonicalPath },
      ]
    : [
        { name: 'Inicio', path: '/' },
        { name: 'Pasos', path: '/pasos' },
        { name: paso.nombre, path: canonicalPath },
      ];

  return (
    <main className="brotherhood-page" style={{
      '--brotherhood-primary': hermandad?.colores?.primario || '#153B69',
      '--brotherhood-secondary': hermandad?.colores?.secundario || '#A71930',
      '--brotherhood-light': hermandad?.colores?.claro || '#FFFFFF'
    }}>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${absoluteUrl(canonicalPath)}#work`,
        url: absoluteUrl(canonicalPath),
        name: paso.nombre,
        description: paso.descripcion,
        ...(coverMedia?.path ? { image: absoluteUrl(coverMedia.path) } : {}),
        ...(hermandad ? {
          isPartOf: {
            '@type': 'Organization',
            name: hermandad.nombreOficial || hermandad.nombrePopular,
          },
        } : {}),
      }} />
      <section className="step-detail-hero">
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
              <Link href="/pasos">Pasos</Link>
            )}
            <span className="breadcrumb-arrow">→</span>
            <strong>{paso.tipo}</strong>
          </div>
          <div className="step-detail-grid">
            <div className="step-detail-copy">
              <span className="step-kicker">Ficha del paso</span>
              <span className="pill brotherhood-pill">{paso.tipo}</span>
              <h1>{paso.nombre}</h1>
              <p>{paso.descripcion}</p>
            </div>
            <StepHeroPhoto
              key={coverMedia?.path || paso.id}
              src={coverMedia?.path || ''}
              alt={coverMedia?.alt || `Fotografía de ${paso.nombre}`}
              credit={coverMedia?.credit || ''}
            />
          </div>
        </div>
      </section>

      <section className="section"><div className="shell content-grid">
        <div>
          <SectionTitle eyebrow="Configuración actual" title="Datos del paso" />
          <div className="step-facts">
            <div>
              <small>Hermandad</small>
              <strong>{hermandad?.nombrePopular || 'Sin vinculación publicada'}</strong>
            </div>
            <div><small>Tipo</small><strong>{paso.tipo}</strong></div>
            <div><small>Ejecución</small><strong>{paso.ejecucion || 'Pendiente de incorporar'}</strong></div>
            <div><small>Sistema de portadores</small><strong>{paso.sistemaPortadores || 'Pendiente de incorporar'}</strong></div>
          </div>
        </div>
        <aside className="brotherhood-summary-card">
          <span className="eyebrow">Imágenes que procesionan</span>
          <div className="step-images-list">
            {imagenes.length ? imagenes.map((imagen)=>(
              <Link key={imagen.slug} href={`/imagenes/${imagen.slug}`}>{imagen.nombre}<span>{[imagen.autor, imagen.fecha].filter(Boolean).join(' · ') || 'Datos por documentar'}</span></Link>
            )) : <strong>Sin imágenes publicadas vinculadas</strong>}
          </div>
        </aside>
      </div></section>

      <section className="section brotherhood-soft"><div className="shell">
        <SectionTitle eyebrow="Próximamente" title="Patrimonio y evolución" description="Esta ficha irá incorporando diseño, talla, dorado, orfebrería, bordados, restauraciones, reformas, capataces y acompañamientos musicales históricos." />
      </div></section>
    </main>
  );
}
