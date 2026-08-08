import Link from 'next/link';
import { notFound } from 'next/navigation';
import SectionTitle from '@/components/SectionTitle';
import { getHermandadBySlug, hermandades } from '@/lib/data';

export function generateStaticParams() {
  return hermandades.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const hermandad = getHermandadBySlug(slug);
  if (!hermandad) return {};
  return {
    title: hermandad.nombrePopular,
    description: `${hermandad.nombrePopular} · ${hermandad.localidad} · ${hermandad.diaSalida}`,
  };
}

export default async function HermandadDetailPage({ params }) {
  const { slug } = await params;
  const hermandad = getHermandadBySlug(slug);
  if (!hermandad) notFound();

  const imagenMap = new Map(hermandad.imagenes.map((imagen) => [imagen.id, imagen]));

  return (
    <>
      <section className="detail-hero">
        <div className="shell">
          <div className="breadcrumbs"><Link href="/hermandades">Hermandades</Link><span>/</span>{hermandad.nombrePopular}</div>
          <div className="detail-hero-grid">
            <div>
              <div className="tag-row">
                {hermandad.tipos.map((tipo) => <span className="pill pill-light" key={tipo}>{tipo}</span>)}
                <span className="pill pill-outline">{hermandad.localidad}</span>
              </div>
              <h1>{hermandad.nombrePopular}</h1>
              <p className="official-name">{hermandad.nombreOficial}</p>
            </div>
            <div className="crest-placeholder"><span>EB</span><small>Escudo</small></div>
          </div>
          <div className="detail-facts">
            <div><small>Sede canónica</small><strong>{hermandad.sede}</strong></div>
            <div><small>Fundación</small><strong>{hermandad.fundacion}</strong></div>
            <div><small>Día de salida</small><strong>{hermandad.diaSalida}</strong></div>
            <div><small>Localidad</small><strong>{hermandad.localidad}</strong></div>
          </div>
        </div>
      </section>

      <nav className="section-nav" aria-label="Secciones de la ficha">
        <div className="shell nav-scroll">
          <a href="#resumen">Resumen</a>
          <a href="#titulares">Titulares</a>
          <a href="#pasos">Pasos</a>
          <a href="#habito">Hábito</a>
          <a href="#salidas">Salidas</a>
          <a href="#cultos">Cultos</a>
          <a href="#curiosidades">Curiosidades</a>
        </div>
      </nav>

      <section className="section" id="resumen">
        <div className="shell content-grid">
          <div>
            <SectionTitle eyebrow="Ficha" title="Resumen" />
            <p className="body-large">{hermandad.resumen}</p>
            <p>{hermandad.historia}</p>
          </div>
          <aside className="source-card">
            <span className="eyebrow">Estado del prototipo</span>
            <h3>Información estructurada</h3>
            <p>Los contenidos de esta v0.1 son demostrativos. En la siguiente fase se conectarán a una base real y cada dato podrá relacionarse con sus fuentes.</p>
          </aside>
        </div>
      </section>

      <section className="section section-soft" id="titulares">
        <div className="shell">
          <SectionTitle
            eyebrow={`${hermandad.imagenes.length} imágenes`}
            title="Titulares"
            description="Cada imagen dispone de identidad propia para poder construir después su cronología, restauraciones, extraordinarias y patrimonio relacionado."
          />
          <div className="image-grid">
            {hermandad.imagenes.map((imagen) => (
              <Link href={`/imagenes/${imagen.slug}`} className="image-card" key={imagen.id}>
                <div className="portrait-placeholder"><span>{imagen.iniciales}</span></div>
                <div className="image-card-body">
                  <span className="eyebrow">{imagen.tipo}</span>
                  <h3>{imagen.nombre}</h3>
                  <p>{imagen.autor} · {imagen.fecha}</p>
                  <span className="text-link">Ver ficha →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="pasos">
        <div className="shell">
          <SectionTitle eyebrow={`${hermandad.pasos.length} pasos`} title="Pasos procesionales" />
          <div className="stack-list">
            {hermandad.pasos.map((paso, index) => (
              <article className="stack-card" key={paso.id}>
                <div className="stack-index">0{index + 1}</div>
                <div>
                  <span className="pill">{paso.tipo}</span>
                  <h3>{paso.nombre}</h3>
                  <p>{paso.descripcion}</p>
                  <div className="related-row">
                    <small>Imágenes en el paso</small>
                    <div>
                      {paso.imagenes.map((id) => {
                        const imagen = imagenMap.get(id);
                        return imagen ? <Link key={id} href={`/imagenes/${imagen.slug}`}>{imagen.nombre}</Link> : null;
                      })}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark" id="habito">
        <div className="shell">
          <SectionTitle eyebrow="Estación de penitencia" title="Hábito nazareno" description="La estructura admite variantes por cortejo o paso." />
          <div className="habit-grid">
            {hermandad.habitos.map((habito) => (
              <article className="habit-card" key={habito.id}>
                <h3>{habito.nombre}</h3>
                <dl>
                  <div><dt>Túnica</dt><dd>{habito.tunica}</dd></div>
                  <div><dt>Antifaz</dt><dd>{habito.antifaz}</dd></div>
                  <div><dt>Capa</dt><dd>{habito.capa}</dd></div>
                  <div><dt>Cordón</dt><dd>{habito.cordon}</dd></div>
                  <div><dt>Botonadura</dt><dd>{habito.botonadura}</dd></div>
                  <div><dt>Calzado</dt><dd>{habito.calzado}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="salidas">
        <div className="shell two-column-sections">
          <div>
            <SectionTitle eyebrow="Actividad externa" title="Salidas" />
            <div className="timeline-list">
              {hermandad.salidas.map((salida) => (
                <article key={salida.id}>
                  <span className="timeline-dot" />
                  <div><small>{salida.tipo} · {salida.caracter}</small><h3>{salida.nombre}</h3><p>{salida.referencia} · {salida.periodicidad}</p></div>
                </article>
              ))}
            </div>
          </div>
          <div id="cultos">
            <SectionTitle eyebrow="Vida de hermandad" title="Cultos" />
            <div className="compact-list">
              {hermandad.cultos.map((culto) => (
                <article key={culto.id}><span>{culto.tipo}</span><div><h3>{culto.nombre}</h3><p>{culto.referencia}</p></div></article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-soft" id="curiosidades">
        <div className="shell">
          <SectionTitle eyebrow="Descubrir" title="Curiosidades" description="Un espacio editorial para datos singulares, siempre documentados antes de publicarse." />
          <div className="curiosity-card">
            <span className="curiosity-mark">?</span>
            <div><span className="eyebrow">{hermandad.curiosidades[0].categoria}</span><h3>{hermandad.curiosidades[0].titulo}</h3><p>{hermandad.curiosidades[0].texto}</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
