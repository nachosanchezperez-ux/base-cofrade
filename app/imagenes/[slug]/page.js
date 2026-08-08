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

export default async function ImagenPage({ params }) {
  const { slug } = await params;
  const result = getImagenBySlug(slug);
  if (!result) notFound();
  const { imagen, hermandad } = result;

  return (
    <section className="section page-top image-detail-page">
      <div className="shell">
        <div className="breadcrumbs"><Link href={`/hermandades/${hermandad.slug}`}>{hermandad.nombrePopular}</Link><span>/</span>Imágenes</div>
        <div className="image-detail-grid">
          <div className="large-portrait"><span>{imagen.iniciales}</span></div>
          <div>
            <span className="eyebrow">{imagen.tipo} · Titular</span>
            <h1 className="page-title image-title">{imagen.nombre}</h1>
            <p className="page-lead">{imagen.descripcion}</p>
            <div className="image-facts">
              <div><small>Hermandad</small><Link href={`/hermandades/${hermandad.slug}`}>{hermandad.nombrePopular}</Link></div>
              <div><small>Autor</small><strong>{imagen.autor}</strong></div>
              <div><small>Fecha</small><strong>{imagen.fecha}</strong></div>
              <div><small>ID interno</small><strong>{imagen.id}</strong></div>
            </div>
          </div>
        </div>

        <div className="placeholder-modules">
          <article><span>Próximo módulo</span><h2>Restauraciones</h2><p>Año, restaurador, intervención, documentación y fuentes.</p></article>
          <article><span>Próximo módulo</span><h2>Acontecimientos</h2><p>Vía Crucis, Pregón de las Glorias, extraordinarias y otros hitos.</p></article>
          <article><span>Próximo módulo</span><h2>Cronología</h2><p>La biografía de la imagen generada automáticamente a partir de sus registros.</p></article>
        </div>
      </div>
    </section>
  );
}
