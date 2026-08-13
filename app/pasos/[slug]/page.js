import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import SectionTitle from '@/components/SectionTitle';
import { getPasoBySlug, hermandades } from '@/lib/data';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageTitle,
  seoDescription,
} from '@/lib/seo';

export function generateStaticParams(){
  return hermandades.flatMap((h)=>h.pasos.map((p)=>({slug:p.slug})));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = getPasoBySlug(slug);

  if (!result) {
    return {
      title: 'Paso no encontrado',
      robots: { index: false, follow: false },
    };
  }

  const { paso, hermandad } = result;
  const title = paso.nombre;
  const description = seoDescription(
    `Ficha de ${paso.nombre}, de ${hermandad.nombrePopular}: imágenes que procesionan, configuración, patrimonio, autorías y evolución histórica.`
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
    },
    twitter: {
      title: pageTitle(title),
      description,
    },
  };
}

export default async function PasoDetailPage({params}){
  const {slug}=await params;
  const result=getPasoBySlug(slug);
  if(!result) notFound();
  const {paso,hermandad}=result;
  const imagenes=paso.imagenes.map((id)=>hermandad.imagenes.find((i)=>i.id===id)).filter(Boolean);
  const canonicalPath = `/pasos/${paso.slug}`;

  return (
    <main className="brotherhood-page" style={{
      '--brotherhood-primary': hermandad.colores?.primario || '#153B69',
      '--brotherhood-secondary': hermandad.colores?.secundario || '#A71930',
      '--brotherhood-light': hermandad.colores?.claro || '#FFFFFF'
    }}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Hermandades', path: '/hermandades' },
        { name: hermandad.nombrePopular, path: `/hermandades/${hermandad.slug}` },
        { name: paso.nombre, path: canonicalPath },
      ])} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${absoluteUrl(canonicalPath)}#work`,
        url: absoluteUrl(canonicalPath),
        name: paso.nombre,
        description: paso.descripcion,
        isPartOf: {
          '@type': 'Organization',
          name: hermandad.nombreOficial || hermandad.nombrePopular,
        },
      }} />
      <section className="step-detail-hero">
        <div className="shell">
          <div className="brotherhood-breadcrumb">
            <span className="breadcrumb-accent" />
            <Link href="/hermandades">Hermandades</Link>
            <span className="breadcrumb-arrow">→</span>
            <Link href={`/hermandades/${hermandad.slug}`}>{hermandad.nombrePopular}</Link>
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
            <div className="step-photo-placeholder">Fotografía del paso</div>
          </div>
        </div>
      </section>

      <section className="section"><div className="shell content-grid">
        <div>
          <SectionTitle eyebrow="Configuración actual" title="Datos del paso" />
          <div className="step-facts">
            <div><small>Hermandad</small><strong>{hermandad.nombrePopular}</strong></div>
            <div><small>Tipo</small><strong>{paso.tipo}</strong></div>
            <div><small>Capataz actual</small><strong>{paso.capatazActual || 'Pendiente de incorporar'}</strong></div>
            <div><small>Acompañamiento musical</small><strong>{paso.acompanamientoActual || 'Pendiente de incorporar'}</strong></div>
          </div>
        </div>
        <aside className="brotherhood-summary-card">
          <span className="eyebrow">Imágenes que procesionan</span>
          <div className="step-images-list">
            {imagenes.map((imagen)=>(
              <Link key={imagen.slug} href={`/imagenes/${imagen.slug}`}>{imagen.nombre}<span>{imagen.autor} · {imagen.fecha}</span></Link>
            ))}
          </div>
        </aside>
      </div></section>

      <section className="section brotherhood-soft"><div className="shell">
        <SectionTitle eyebrow="Próximamente" title="Patrimonio y evolución" description="Esta ficha irá incorporando diseño, talla, dorado, orfebrería, bordados, restauraciones, reformas, capataces y acompañamientos musicales históricos." />
      </div></section>
    </main>
  );
}
