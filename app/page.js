import Link from 'next/link';
import { hermandades } from '@/lib/data';

export default function HomePage() {
  const featured = hermandades[0];

  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Enciclopedia digital cofrade</span>
            <h1>Todo está relacionado.</h1>
            <p>
              Hermandades, titulares, pasos, patrimonio, música, cultos y acontecimientos
              conectados en una única base de conocimiento interactiva.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/hermandades">
                Explorar hermandades
              </Link>
              <a className="button button-ghost" href="#prototipo">
                Ver el prototipo
              </a>
            </div>
          </div>
          <div className="hero-panel" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="network-node node-main">BC</div>
            <div className="network-node node-a">H</div>
            <div className="network-node node-b">I</div>
            <div className="network-node node-c">P</div>
            <div className="network-node node-d">M</div>
          </div>
        </div>
      </section>

      <section className="section stats-strip">
        <div className="shell stat-grid">
          <div><strong>1</strong><span>Hermandad piloto</span></div>
          <div><strong>4</strong><span>Imágenes relacionadas</span></div>
          <div><strong>2</strong><span>Pasos procesionales</span></div>
          <div><strong>v0.1</strong><span>Prototipo funcional</span></div>
        </div>
      </section>

      <section className="section" id="prototipo">
        <div className="shell split-heading">
          <div>
            <span className="eyebrow">Primera ficha</span>
            <h2>Empezamos por El Baratillo.</h2>
          </div>
          <p>
            Esta primera versión valida la navegación y la jerarquía de contenidos antes de
            conectar la aplicación a Supabase.
          </p>
        </div>

        <div className="shell featured-card">
          <div className="featured-symbol">EB</div>
          <div className="featured-main">
            <div className="tag-row">
              {featured.tipos.map((tipo) => <span className="pill" key={tipo}>{tipo}</span>)}
              <span className="pill pill-muted">{featured.localidad}</span>
            </div>
            <h3>{featured.nombrePopular}</h3>
            <p>{featured.resumen}</p>
            <div className="featured-facts">
              <span><small>Sede</small>{featured.sede}</span>
              <span><small>Fundación</small>{featured.fundacion}</span>
              <span><small>Salida</small>{featured.diaSalida}</span>
            </div>
          </div>
          <Link className="arrow-link" href={`/hermandades/${featured.slug}`}>
            Abrir ficha <span>→</span>
          </Link>
        </div>
      </section>

      <section className="section section-soft">
        <div className="shell">
          <span className="eyebrow">La idea</span>
          <h2 className="wide-title">Una ficha es solo el comienzo.</h2>
          <div className="concept-grid">
            <article><span>01</span><h3>Hermandad</h3><p>La puerta de entrada a su identidad, historia y actividad.</p></article>
            <article><span>02</span><h3>Imágenes</h3><p>Cada titular tendrá biografía, restauraciones y acontecimientos propios.</p></article>
            <article><span>03</span><h3>Pasos</h3><p>Patrimonio, autores, reformas y composición conectados entre sí.</p></article>
            <article><span>04</span><h3>Relaciones</h3><p>Autores, bandas y obras podrán recorrerse transversalmente.</p></article>
          </div>
        </div>
      </section>
    </>
  );
}
