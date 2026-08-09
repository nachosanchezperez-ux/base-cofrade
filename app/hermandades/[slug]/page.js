import Link from 'next/link';
import CofradeTypeBadges from '@/components/CofradeTypeBadges';
import { notFound } from 'next/navigation';
import SectionTitle from '@/components/SectionTitle';
import { getHermandadBySlug, hermandades } from '@/lib/data';

export function generateStaticParams() {
  return hermandades.map((item) => ({ slug: item.slug }));
}

export default async function HermandadDetailPage({ params }) {
  const { slug } = await params;
  const h = getHermandadBySlug(slug);
  if (!h) notFound();
  const imagenMap = new Map(h.imagenes.map((imagen) => [imagen.id, imagen]));
  const carreraOficialParts = h.datosJornada?.tiempoCarreraOficial?.match(/^(.*?\bh)\s+(.+)$/i);

  return (
    <main className="brotherhood-page" style={{
      '--brotherhood-primary': h.colores?.primario || '#153B69',
      '--brotherhood-secondary': h.colores?.secundario || '#A71930',
      '--brotherhood-light': h.colores?.claro || '#FFFFFF'
    }}>
      <section className="brotherhood-hero">
        <div className="shell">
          <div className="brotherhood-breadcrumb">
            <span className="breadcrumb-accent" />
            <Link href="/hermandades">Hermandades</Link>
            <span className="breadcrumb-arrow">→</span>
            <strong>{h.nombrePopular}</strong>
          </div>
          <div className="brotherhood-hero-grid">
            <div>
              <div className="tag-row">
                {h.tipos.map((tipo) => <span className="pill brotherhood-pill" key={tipo}>{tipo}</span>)}
                <span className="pill brotherhood-pill-outline">{h.localidad}</span>
                <span className="pill brotherhood-pill-outline">{h.diaSalida}</span>
              </div>
              <span className="brotherhood-kicker">Hermandad</span>
              <h1>{h.nombrePopular}</h1>
              <p className="official-name">{h.nombreOficial}</p>
            </div>
            <div className="brotherhood-visual">
              <div className="hero-photo-placeholder"><span>Fotografía principal</span><small>Espacio preparado para imagen</small></div>
              <div className="crest-placeholder brotherhood-crest"><span>EB</span><small>Escudo</small></div>
            </div>
          </div>
          <div className="brotherhood-facts">
            <div><small>Fundación</small><strong>{h.fundacion}</strong></div>
            <div><small>Sede canónica</small><strong>{h.sede}</strong></div>
            <div><small>Titulares</small><strong>{h.imagenes.length}</strong></div>
            <div><small>Pasos</small><strong>{h.pasos.length}</strong></div>
          </div>
        </div>
      </section>

      <nav className="section-nav brotherhood-nav">
        <div className="shell brotherhood-nav-shell">
          <span className="brotherhood-nav-label">Explorar ficha</span>
          <div className="brotherhood-nav-list nav-scroll">
            <a href="#resumen">Resumen</a>
            <a href="#titulares">Titulares</a>
            <a href="#pasos">Pasos</a>
            <a href="#historia">Historia</a>
            <a href="#tunica">Túnica</a>
            <a href="#salidas">Salidas</a>
            <a href="#cultos">Cultos</a>
            {h.estrenos?.length > 0 && <a href="#estrenos">Novedades</a>}
            {h.patrimonioMusical?.length > 0 && <a href="#musica">Patrimonio musical</a>}
            {h.acompanamientos?.length > 0 && <a href="#acompanamientos">Acompañamientos</a>}
            {h.noticias?.length > 0 && <a href="#noticias">Noticias</a>}
            <a href="#curiosidades">Curiosidades</a>
          </div>
        </div>
      </nav>

      <section className="section" id="resumen"><div className="shell content-grid">
        <div>
          <SectionTitle eyebrow="De un vistazo" title={h.nombrePopular} />
          <p className="body-large">{h.resumen}</p><p>{h.historia}</p>

          {h.participacionesConsejo?.length > 0 && (
            <div className="council-participations">
              {h.participacionesConsejo.map((participacion) => (
                <article className="council-participation-card" key={participacion.id}>
                  {participacion.imagen ? (
                    <img className="council-participation-photo" src={participacion.imagen} alt={participacion.titulo} />
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
              ))}
            </div>
          )}
        </div>
        <aside className="brotherhood-summary-card key-data-card">
          <div className="key-data-heading">
            <span className="eyebrow">Datos clave</span>
            {h.datosJornada && <span className="key-data-year">{h.datosJornada.ano}</span>}
          </div>

          <div className="key-data-identity">
            <div>
              <small>Tipo</small>
              <CofradeTypeBadges tipos={h.tipos} compact />
            </div>
            <div>
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
                <strong>{h.datosJornada.totalHermanos}</strong>
                <span>Hermanos</span>
              </div>
              <div>
                <strong>{h.datosJornada.totalNazarenos}</strong>
                <span>Nazarenos</span>
              </div>
              <div className="key-data-time">
                <strong className="career-time">
                  {carreraOficialParts ? (
                    <>
                      <span>{carreraOficialParts[1]}</span>
                      <span>{carreraOficialParts[2]}</span>
                    </>
                  ) : h.datosJornada.tiempoCarreraOficial}
                </strong>
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
        <SectionTitle eyebrow={`${h.imagenes.length} titulares`} title="Sagrados Titulares" description="Cada titular tendrá una ficha propia con autoría, historia, restauraciones, acontecimientos y salidas extraordinarias." />
        <div className="image-grid">{h.imagenes.map((imagen) => (
          <Link href={`/imagenes/${imagen.slug}`} className="image-card brotherhood-image-card" key={imagen.id}>
            <div className="portrait-placeholder brotherhood-portrait"><span>{imagen.iniciales}</span></div>
            <div className="image-card-body"><span className="eyebrow">{imagen.tipo}</span><h3>{imagen.nombre}</h3><p>{imagen.autor} · {imagen.fecha}</p><span className="text-link">Descubrir titular →</span></div>
          </Link>
        ))}</div>
      </div></section>

      <section className="section" id="pasos"><div className="shell">
        <SectionTitle eyebrow={`${h.pasos.length} pasos`} title="Pasos procesionales" description="Imágenes, diseño, talla, orfebrería, bordados, reformas y evolución histórica." />
        <div className="processional-grid">{h.pasos.map((paso, index) => (
          <article className="processional-card" key={paso.id}>
            <div className="processional-photo"><span>0{index + 1}</span><small>Fotografía del paso</small></div>
            <div className="processional-body"><span className="pill">{paso.tipo}</span><h3>{paso.nombre}</h3><p>{paso.descripcion}</p>
              <div className="step-current-data">
                <div><small>Capataz actual</small><strong>{paso.capatazActual || 'Pendiente de incorporar'}</strong></div>
                <div><small>Acompañamiento musical</small><strong>{paso.acompanamientoActual || 'Pendiente de incorporar'}</strong></div>
              </div>
              <div className="related-row"><small>Imágenes que procesionan</small><div>{paso.imagenes.map((id) => {
                const imagen = imagenMap.get(id); return imagen ? <Link key={id} href={`/imagenes/${imagen.slug}`}>{imagen.nombre}</Link> : null;
              })}</div></div>
              <Link href={`/pasos/${paso.slug}`} className="text-link">Ver ficha del paso →</Link>
            </div>
          </article>
        ))}</div>
      </div></section>

      {h.acompanamientoActual?.length > 0 && <section className="section brotherhood-soft" id="acompanamiento-musical"><div className="shell">
        <SectionTitle eyebrow="Semana Santa" title="Acompañamiento musical" description="La configuración musical de la cofradía se organiza por Cruz de Guía, Paso de Misterio y Paso de Palio." />
        <div className="current-music-grid">
          {h.acompanamientoActual.map((a) => (
            <article className="current-music-card" key={a.id}>
              <span className="current-music-position">{a.posicion}</span>
              <h3>{a.banda || 'Pendiente de incorporar'}</h3>
              <p>{a.tipo || ''}</p>
              {a.observaciones && <small>{a.observaciones}</small>}
            </article>
          ))}
        </div>
      </div></section>}

      <section className="section history-section" id="historia"><div className="shell">
        <SectionTitle eyebrow="Cronología" title="Historia" description="Una línea temporal para recorrer los grandes hitos y conectarlos con titulares, pasos y acontecimientos." />
        <div className="history-timeline">{h.cronologia.map((item) => (
          <article key={`${item.fecha}-${item.titulo}`}><div className="history-year">{item.fecha}</div><div className="history-line"><span /></div>
            <div className="history-copy"><h3>{item.titulo}</h3><p>{item.texto}</p>{item.estado && <small>{item.estado}</small>}</div>
          </article>
        ))}</div>
      </div></section>


      <section className="section brotherhood-dark" id="tunica"><div className="shell">
        <SectionTitle eyebrow="Estación de penitencia" title="Túnica" description="El azul identifica la túnica; rojo y blanco distinguen los cortejos de los dos pasos." />
        <div className="habit-grid">{h.habitos.map((item, index) => (
          <article className={`habit-card brotherhood-habit ${index === 0 ? 'habit-red' : 'habit-white'}`} key={item.id}>
            <div className="habit-swatch"><span /></div><div><h3>{item.nombre}</h3><dl>
              <div><dt>Túnica</dt><dd>{item.tunica}</dd></div><div><dt>Antifaz</dt><dd>{item.antifaz}</dd></div>
              <div><dt>Cordón</dt><dd>{item.cordon}</dd></div><div><dt>Botonadura</dt><dd>{item.botonadura}</dd></div><div><dt>Calzado</dt><dd>{item.calzado}</dd></div>
            </dl></div>
          </article>
        ))}</div>
      </div></section>

      <section className="section brotherhood-white" id="salidas"><div className="shell">
        <SectionTitle eyebrow="En la calle" title="Salidas" description="Estación de penitencia, procesiones, rosarios, vía crucis y traslados forman parte del histórico de salidas de cada hermandad." />
        <div className="outing-grid">{h.salidas.map((s) => (
          <article className={`outing-card ${s.ediciones?.length ? 'outing-card-featured' : ''}`} key={s.id}>
            <div className="outing-type">
              <span>{s.tipo}</span>
              {s.caracter && <small>{s.caracter}</small>}
            </div>

            <div className="outing-content">
              <h3>{s.nombre}</h3>
              {s.titulares && <p className="outing-subject">{s.titulares}</p>}
              {s.momento && <p>{s.momento}</p>}
              {s.destino && <small className="outing-destination">{s.destino}</small>}

              {s.movimientos?.length > 0 && (
                <div className="outing-movements">
                  {s.movimientos.map((movimiento) => (
                    <div className="outing-movement" key={`${s.id}-${movimiento.sentido}`}>
                      <strong>{movimiento.sentido}</strong>
                      <p>{movimiento.momento}</p>
                      {movimiento.destino && <small>{movimiento.destino}</small>}
                    </div>
                  ))}
                </div>
              )}

              {s.ediciones?.map((edicion) => (
                <div className="route-edition" key={`${s.id}-${edicion.ano}`}>
                  <div className="route-edition-head">
                    <span>Recorrido · {edicion.ano}</span>
                    <div className="route-times">
                      <div><small>Salida</small><strong>{edicion.salida}</strong></div>
                      <span className="route-line" />
                      <div><small>Entrada</small><strong>{edicion.entrada}</strong></div>
                    </div>
                  </div>

                  <details className="route-details">
                    <summary>Ver recorrido completo <span>＋</span></summary>
                    <div className="route-path">
                      {edicion.recorrido.map((calle, index) => (
                        <span
                          className={calle.toLowerCase() === 'carrera oficial' ? 'route-official' : ''}
                          key={`${edicion.ano}-${calle}-${index}`}
                        >
                          {calle}
                        </span>
                      ))}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </article>
        ))}</div>
      </div></section>

      <section className="section brotherhood-soft" id="cultos"><div className="shell">
        <SectionTitle eyebrow="Vida de hermandad" title="Cultos" description="Calendario de los principales cultos y celebraciones de la corporación." />
        <div className="cult-calendar">{h.cultos.map((c) => (
          <article key={c.id}>
            <div className={`cult-date ${
              (c.fechaCorta || c.referencia).length > 13
                ? 'cult-date-long'
                : (c.fechaCorta || c.referencia).length > 8
                  ? 'cult-date-medium'
                  : 'cult-date-short'
            }`}>
              <span className="cult-date-label">Fecha</span>
              <strong>{c.fechaCorta || c.referencia}</strong>
              <small>{c.tipo}</small>
            </div>
            <div className="cult-copy">
              <h3>{c.nombre}</h3>
              <p>{c.referencia}</p>
            </div>
          </article>
        ))}</div>
      </div></section>

      {h.estrenos?.length > 0 && <section className="section brotherhood-white" id="estrenos"><div className="shell">
        <SectionTitle eyebrow="Actualidad patrimonial" title="Novedades · Estrenos" description="Estrenos, restauraciones y novedades incorporadas por la Hermandad. Este módulo solo aparece cuando existen registros." />
        <div className="release-grid">{h.estrenos.map((e) => (
          <article className="release-card" key={e.id}><span className="release-year">{e.ano}</span><span className="pill">{e.tipo}</span><h3>{e.titulo}</h3><p>{e.descripcion}</p><small>{e.autoria}</small></article>
        ))}</div>
      </div></section>}

      {h.patrimonioMusical?.length > 0 && <section className="section music-section" id="musica"><div className="shell">
        <SectionTitle eyebrow="Sonidos propios" title="Patrimonio Musical" description="Marchas dedicadas a la Hermandad y a sus titulares, conectadas con sus autores y registros audiovisuales." />
        <div className="music-list">{h.patrimonioMusical.map((m) => (
          <article key={m.id}><div className="music-index">♪</div><div><h3>{m.nombre}</h3><p>{m.autor}</p></div><strong>{m.ano}</strong>
          {m.youtube ? <a href={m.youtube} target="_blank" rel="noreferrer" className="music-play">YouTube ↗</a> : <span className="music-pending">Enlace pendiente</span>}</article>
        ))}</div>
      </div></section>}

      {h.acompanamientos?.length > 0 && <section className="section brotherhood-soft" id="acompanamientos"><div className="shell">
        <SectionTitle eyebrow="Memoria sonora" title="Acompañamientos Musicales Históricos" description="Una cronología por paso para conocer qué formaciones musicales han acompañado a la Hermandad." />
        <div className="music-history-grid">{h.acompanamientos.map((a) => (
          <article key={a.id}><span className="music-period">{a.periodo}</span><h3>{a.banda}</h3><p>{a.paso}</p><small>{a.tipo}</small></article>
        ))}</div>
      </div></section>}

      {h.noticias?.length > 0 && <section className="section brotherhood-white" id="noticias"><div className="shell">
        <SectionTitle eyebrow="Última hora" title="Noticias relacionadas" description="Actualidad vinculada directamente con la Hermandad, sus titulares, patrimonio y vida corporativa." />
        <div className="news-grid">{h.noticias.map((n) => (
          <article className="news-card" key={n.id}><div className="news-image-placeholder">Noticia</div><div><small>{n.fecha} · {n.categoria}</small><h3>{n.titulo}</h3><p>{n.extracto}</p>{n.url ? <a href={n.url} target="_blank" rel="noreferrer" className="text-link">Leer noticia ↗</a> : <span className="text-link muted-link">Enlace pendiente</span>}</div></article>
        ))}</div>
      </div></section>}

      <section className="section brotherhood-soft" id="curiosidades"><div className="shell">
        <SectionTitle eyebrow="¿Sabías que…?" title="Curiosidades" description="Datos singulares y divulgativos que solo se publicarán cuando estén documentados." />
        {h.curiosidades.map((c) => <div className="curiosity-card brotherhood-curiosity" key={c.id}><span className="curiosity-mark">?</span><div><span className="eyebrow">{c.categoria}</span><h3>{c.titulo}</h3><p>{c.texto}</p></div></div>)}
      </div></section>

      {h.fuentesFicha?.length > 0 && (
        <section className="section sources-section" id="fuentes">
          <div className="shell">
            <div className="sources-heading">
              <div>
                <span className="eyebrow">Documentación</span>
                <h2>Fuentes</h2>
              </div>
              <p>Referencias utilizadas para documentar y actualizar los datos de esta ficha.</p>
            </div>

            <div className="sources-list">
              {h.fuentesFicha.map((fuente) => (
                <a className="source-row" href={fuente.url} target="_blank" rel="noreferrer" key={fuente.id}>
                  <span className="source-capirote" aria-hidden="true"></span>
                  <div className="source-copy">
                    <strong>{fuente.nombre}</strong>
                    <p>{fuente.descripcion}</p>
                  </div>
                  <span className="source-arrow">↗</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
