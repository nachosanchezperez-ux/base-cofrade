import Link from 'next/link';
import { notFound } from 'next/navigation';
import SectionTitle from '@/components/SectionTitle';
import { getHermandadBySlug, hermandades } from '@/lib/data';

export function generateStaticParams() {
  return hermandades.map((item) => ({ slug: item.slug }));
}

export default async function HermandadDetailPage({ params }) {
  const { slug } = await params;
  const hermandad = getHermandadBySlug(slug);
  if (!hermandad) notFound();
  const imagenMap = new Map(hermandad.imagenes.map((imagen) => [imagen.id, imagen]));

  return (
    <main className="brotherhood-page" style={{
      '--brotherhood-primary': hermandad.colores?.primario || '#153B69',
      '--brotherhood-secondary': hermandad.colores?.secundario || '#A71930',
      '--brotherhood-light': hermandad.colores?.claro || '#FFFFFF'
    }}>
      <section className="brotherhood-hero">
        <div className="shell">
          <div className="breadcrumbs"><Link href="/hermandades">Hermandades</Link><span>/</span>{hermandad.nombrePopular}</div>
          <div className="brotherhood-hero-grid">
            <div>
              <div className="tag-row">
                {hermandad.tipos.map((tipo) => <span className="pill brotherhood-pill" key={tipo}>{tipo}</span>)}
                <span className="pill brotherhood-pill-outline">{hermandad.localidad}</span>
                <span className="pill brotherhood-pill-outline">{hermandad.diaSalida}</span>
              </div>
              <span className="brotherhood-kicker">Hermandad</span>
              <h1>{hermandad.nombrePopular}</h1>
              <p className="official-name">{hermandad.nombreOficial}</p>
            </div>
            <div className="brotherhood-visual">
              <div className="hero-photo-placeholder"><span>Fotografía principal</span><small>Espacio preparado para imagen</small></div>
              <div className="crest-placeholder brotherhood-crest"><span>EB</span><small>Escudo</small></div>
            </div>
          </div>
          <div className="brotherhood-facts">
            <div><small>Fundación</small><strong>{hermandad.fundacion}</strong></div>
            <div><small>Sede canónica</small><strong>{hermandad.sede}</strong></div>
            <div><small>Titulares</small><strong>{hermandad.imagenes.length}</strong></div>
            <div><small>Pasos</small><strong>{hermandad.pasos.length}</strong></div>
          </div>
        </div>
      </section>

      <nav className="section-nav brotherhood-nav"><div className="shell nav-scroll">
        <a href="#resumen">Resumen</a><a href="#titulares">Titulares</a><a href="#pasos">Pasos</a>
        <a href="#historia">Historia</a><a href="#habito">Hábito</a><a href="#salidas">Salidas</a>
        <a href="#cultos">Cultos</a><a href="#curiosidades">Curiosidades</a>
      </div></nav>

      <section className="section" id="resumen"><div className="shell content-grid">
        <div><SectionTitle eyebrow="De un vistazo" title="El Baratillo" /><p className="body-large">{hermandad.resumen}</p><p>{hermandad.historia}</p></div>
        <aside className="brotherhood-summary-card"><span className="eyebrow">Ficha esencial</span><dl>
          <div><dt>Tipo</dt><dd>{hermandad.tipos.join(' · ')}</dd></div><div><dt>Día</dt><dd>{hermandad.diaSalida}</dd></div>
          <div><dt>Sede</dt><dd>{hermandad.sede}</dd></div><div><dt>Localidad</dt><dd>{hermandad.localidad}</dd></div>
        </dl></aside>
      </div></section>

      <section className="section brotherhood-soft" id="titulares"><div className="shell">
        <SectionTitle eyebrow={`${hermandad.imagenes.length} titulares`} title="Sagrados Titulares" description="Cada titular tendrá una ficha propia con autoría, historia, restauraciones, acontecimientos y salidas extraordinarias." />
        <div className="image-grid">{hermandad.imagenes.map((imagen) => (
          <Link href={`/imagenes/${imagen.slug}`} className="image-card brotherhood-image-card" key={imagen.id}>
            <div className="portrait-placeholder brotherhood-portrait"><span>{imagen.iniciales}</span></div>
            <div className="image-card-body"><span className="eyebrow">{imagen.tipo}</span><h3>{imagen.nombre}</h3><p>{imagen.autor} · {imagen.fecha}</p><span className="text-link">Descubrir titular →</span></div>
          </Link>
        ))}</div>
      </div></section>

      <section className="section" id="pasos"><div className="shell">
        <SectionTitle eyebrow={`${hermandad.pasos.length} pasos`} title="Pasos procesionales" description="Imágenes, diseño, talla, orfebrería, bordados, reformas y evolución histórica." />
        <div className="processional-grid">{hermandad.pasos.map((paso, index) => (
          <article className="processional-card" key={paso.id}>
            <div className="processional-photo"><span>0{index + 1}</span><small>Fotografía del paso</small></div>
            <div className="processional-body"><span className="pill">{paso.tipo}</span><h3>{paso.nombre}</h3><p>{paso.descripcion}</p>
              <div className="related-row"><small>Imágenes que procesionan</small><div>{paso.imagenes.map((id) => {
                const imagen = imagenMap.get(id); return imagen ? <Link key={id} href={`/imagenes/${imagen.slug}`}>{imagen.nombre}</Link> : null;
              })}</div></div>
              <span className="text-link muted-link">Ficha del paso · Próximamente</span>
            </div>
          </article>
        ))}</div>
      </div></section>

      <section className="section history-section" id="historia"><div className="shell">
        <SectionTitle eyebrow="Cronología" title="Historia" description="Una línea temporal para recorrer los grandes hitos y conectarlos con titulares, pasos y acontecimientos." />
        <div className="history-timeline">{hermandad.cronologia.map((hito) => (
          <article key={`${hito.fecha}-${hito.titulo}`}><div className="history-year">{hito.fecha}</div><div className="history-line"><span /></div>
            <div className="history-copy"><h3>{hito.titulo}</h3><p>{hito.texto}</p>{hito.estado && <small>{hito.estado}</small>}</div>
          </article>
        ))}</div>
      </div></section>

      <section className="section brotherhood-dark" id="habito"><div className="shell">
        <SectionTitle eyebrow="Estación de penitencia" title="Hábito nazareno" description="El azul identifica el hábito; rojo y blanco distinguen los cortejos de los dos pasos." />
        <div className="habit-grid">{hermandad.habitos.map((habito, index) => (
          <article className={`habit-card brotherhood-habit ${index === 0 ? 'habit-red' : 'habit-white'}`} key={habito.id}>
            <div className="habit-swatch"><span /></div><div><h3>{habito.nombre}</h3><dl>
              <div><dt>Túnica</dt><dd>{habito.tunica}</dd></div><div><dt>Antifaz</dt><dd>{habito.antifaz}</dd></div>
              <div><dt>Cordón</dt><dd>{habito.cordon}</dd></div><div><dt>Botonadura</dt><dd>{habito.botonadura}</dd></div><div><dt>Calzado</dt><dd>{habito.calzado}</dd></div>
            </dl></div>
          </article>
        ))}</div>
      </div></section>

      <section className="section" id="salidas"><div className="shell two-column-sections">
        <div><SectionTitle eyebrow="En la calle" title="Salidas" /><div className="timeline-list brotherhood-timeline">{hermandad.salidas.map((salida) => (
          <article key={salida.id}><span className="timeline-dot" /><div><small>{salida.tipo} · {salida.caracter}</small><h3>{salida.nombre}</h3><p>{salida.referencia} · {salida.periodicidad}</p></div></article>
        ))}</div></div>
        <div id="cultos"><SectionTitle eyebrow="Vida de hermandad" title="Cultos" /><div className="compact-list brotherhood-cults">{hermandad.cultos.map((culto) => (
          <article key={culto.id}><span>{culto.tipo}</span><div><h3>{culto.nombre}</h3><p>{culto.referencia}</p></div></article>
        ))}</div></div>
      </div></section>

      <section className="section brotherhood-soft" id="curiosidades"><div className="shell">
        <SectionTitle eyebrow="¿Sabías que…?" title="Curiosidades" description="Datos singulares y divulgativos que solo se publicarán cuando estén documentados." />
        {hermandad.curiosidades.map((c) => <div className="curiosity-card brotherhood-curiosity" key={c.id}><span className="curiosity-mark">?</span><div><span className="eyebrow">{c.categoria}</span><h3>{c.titulo}</h3><p>{c.texto}</p></div></div>)}
      </div></section>
    </main>
  );
}
