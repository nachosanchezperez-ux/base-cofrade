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
      description: 'La configuración musical de la cofradía se organiza por Cruz de Guía, Paso de Misterio y Paso de Palio.',
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
        h.acompanamientoActual?.length > 0 && { href: '#acompanamiento-musical', label: 'Acompañamiento' },
        (musicalHeritage.length > 0 || h.patrimonioMusical?.length > 0) && { href: '#musica', label: 'Patrimonio musical' },
        h.cronologia?.length > 0 && { href: '#historia', label: 'Historia' },
        h.habitos?.length > 0 && { href: '#tunica', label: 'Túnica' },
        h.salidas?.length > 0 && { href: '#salidas', label: 'Salidas' },
        h.cultos?.length > 0 && { href: '#cultos', label: 'Cultos' },
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
                {imagen.fichaDisponible && <span className="text-link">Descubrir titular →</span>}
              </div>
            </>
          );

          return imagen.fichaDisponible ? (
            <Link href={`/imagenes/${imagen.slug}`} className="image-card brotherhood-image-card" key={imagen.id}>{card}</Link>
          ) : (
            <article className="image-card brotherhood-image-card" key={imagen.id}>{card}</article>
          );
        })}</div>
        <BrotherhoodConceptualTitulars brotherhoodId={h.id} />
      </div></section>

      <section className="section" id="pasos"><div className="shell">
        <SectionTitle eyebrow={`${h.pasos.length} pasos`} title="Pasos procesionales" description="Imágenes, diseño, talla, orfebrería, bordados, reformas y evolución histórica." />
        <div className="processional-grid">{h.pasos.map((paso, index) => (
          <article className="processional-card" key={paso.id}>
            {entityCoverMedia.get(paso.id)?.path ? (
              <div className="processional-photo has-image">
                <Image
                  className="processional-photo-image"
                  src={entityCoverMedia.get(paso.id).path}
                  alt={entityCoverMedia.get(paso.id).alt || `Fotografía de ${paso.nombre}`}
                  fill
                  sizes="(max-width: 900px) calc(100vw - 40px), 50vw"
                  style={{ objectPosition: getStepPhotoFraming(paso.slug).card }}
                />
                {entityCoverMedia.get(paso.id).credit ? (
                  <small className="processional-photo-credit">
                    {entityCoverMedia.get(paso.id).credit}
                  </small>
                ) : null}
              </div>
            ) : (
              <div className="processional-photo"><span>0{index + 1}</span><small>Fotografía del paso</small></div>
            )}
            <div className="processional-body"><span className="pill">{paso.tipo}</span><h3>{paso.nombre}</h3><p>{paso.descripcion}</p>
              {(paso.capatazActual || paso.acompanamientoActual) && (
                <div className="step-current-data">
                  <div><small>Capataz actual</small><strong>{paso.capatazActual || 'Pendiente de incorporar'}</strong></div>
                  <div><small>Acompañamiento musical</small><strong>{paso.acompanamientoActual || 'Pendiente de incorporar'}</strong></div>
                </div>
              )}
              {(paso.ejecucion || paso.sistemaPortadores || paso.materiales) && (
                <div className="step-technical-data">
                  {paso.ejecucion && <div><small>Ejecución</small><strong>{paso.ejecucion}</strong></div>}
                  {paso.sistemaPortadores && <div><small>Sistema de portadores</small><strong>{paso.sistemaPortadores}</strong></div>}
                  {paso.materiales && <div className="step-technical-wide"><small>Materiales</small><strong>{paso.materiales}</strong></div>}
                </div>
              )}
              {paso.estadoActual && <p className="step-current-state">{paso.estadoActual}</p>}
              <div className="related-row"><small>Imágenes que procesionan</small><div>{paso.imagenes.map((id) => {
                const imagen = imagenMap.get(id);
                if (!imagen) return null;
                return imagen.fichaDisponible
                  ? <Link key={id} href={`/imagenes/${imagen.slug}`}>{imagen.nombre}</Link>
                  : <span className="related-name" key={id}>{imagen.nombre}</span>;
              })}</div></div>
              {paso.fichaDisponible && <Link href={`/pasos/${paso.slug}`} className="text-link">Ver ficha del paso →</Link>}
            </div>
          </article>
        ))}</div>
      </div></section>

      <BrotherhoodOwnBands brotherhoodId={h.id} />

      {h.acompanamientoActual?.length > 0 && <section className="section brotherhood-soft" id="acompanamiento-musical"><div className="shell">
        <SectionTitle eyebrow={acompanamientoMusicalCopy.eyebrow} title="Acompañamiento musical" description={acompanamientoMusicalCopy.description} />
        <div className="current-music-grid">
          {h.acompanamientoActual.map((a) => (
            <article className="current-music-card" key={a.id}>
              <span className="current-music-position">{a.posicion}</span>
              <h3>{a.bandaSlug ? <Link href={`/bandas/${a.bandaSlug}`}>{a.banda}</Link> : a.banda || 'Pendiente de incorporar'}</h3>
              <p>{a.tipo || ''}</p>
              {a.observaciones && <small>{a.observaciones}</small>}
            </article>
          ))}
        </div>
      </div></section>}

      {musicalHeritage.length > 0 ? (
        <BrotherhoodMusicalHeritage items={musicalHeritage} />
      ) : h.patrimonioMusical?.length > 0 ? (
        <section className="section music-section" id="musica"><div className="shell">
          <SectionTitle eyebrow="Sonidos propios" title="Patrimonio Musical" description="Marchas dedicadas a la Hermandad y a sus titulares, conectadas con sus autores y registros audiovisuales." />
          <div className="music-list">{h.patrimonioMusical.map((m) => (
            <article key={m.id}><div className="music-index">♪</div><div><h3>{m.nombre}</h3><p>{m.autor}</p></div><strong>{m.ano}</strong>
            {m.youtube ? <a href={m.youtube} target="_blank" rel="noreferrer" className="music-play">YouTube ↗</a> : <span className="music-pending">Enlace pendiente</span>}</article>
          ))}</div>
        </div></section>
      ) : null}

      {h.cronologia?.length > 0 && <section className="section history-section" id="historia"><div className="shell">
        <SectionTitle eyebrow="Cronología" title="Historia" description="Una línea temporal para recorrer los grandes hitos y conectarlos con titulares, pasos y acontecimientos." />
        <div className="history-timeline">{h.cronologia.map((item) => (
          <article key={`${item.fecha}-${item.titulo}`}><div className="history-year">{item.fecha}</div><div className="history-line"><span /></div>
            <div className="history-copy"><h3>{item.titulo}</h3><p>{item.texto}</p>{item.estado && <small>{item.estado}</small>}</div>
          </article>
        ))}</div>
      </div></section>}


      {h.habitos?.length > 0 && <section className="section brotherhood-dark" id="tunica"><div className="shell">
        <SectionTitle eyebrow="Estación de penitencia" title="Túnica" description="Descripción documentada de la indumentaria nazarena de la Hermandad." />
        <div className="habit-grid">{h.habitos.map((item, index) => (
          <article className={`habit-card brotherhood-habit ${index === 0 ? 'habit-red' : 'habit-white'}`} key={item.id}>
            <div className="habit-visual">
              {item.imagenPath ? (
                <Image
                  className="habit-image"
                  src={item.imagenPath}
                  alt={item.imagenAlt || `Túnica de nazareno: ${item.nombre}`}
                  width={1024}
                  height={1536}
                  sizes="(max-width: 620px) 68vw, 240px"
                />
              ) : (
                <div className="habit-swatch"><span /></div>
              )}
            </div>
            <div className="habit-copy"><h3>{item.nombre}</h3><dl>
              <div><dt>Túnica</dt><dd>{item.tunica}</dd></div><div><dt>Antifaz</dt><dd>{item.antifaz}</dd></div>
              <div><dt>Cíngulo</dt><dd>{item.cordon}</dd></div><div><dt>Botonadura</dt><dd>{item.botonadura}</dd></div>
              {item.escudo && <div><dt>Escudo</dt><dd>{item.escudo}</dd></div>}
              <div><dt>Calzado</dt><dd>{item.calzado}</dd></div>
            </dl></div>
          </article>
        ))}</div>
      </div></section>}

      {h.salidas?.length > 0 && <section className="section brotherhood-white" id="salidas"><div className="shell">
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
      </div></section>}

      {h.cultos?.length > 0 && <section className="section brotherhood-soft" id="cultos"><div className="shell">
        <SectionTitle eyebrow="Vida de hermandad" title="Cultos" description="Calendario de los principales cultos y celebraciones de la corporación." />
        <div className="bc-cult-grid">{h.cultos.map((c) => {
          const fecha = c.fechaCorta || c.referencia;
          const fechaExacta = /^(\d{1,2})\s+([A-ZÁÉÍÓÚÑ]+)$/i.exec(fecha || '');
          const esRelativa = Boolean(c.fechaDetalle);

          return (
            <article className="bc-cult-item" key={c.id}>
              <div className={`bc-cult-date ${
                fechaExacta
                  ? 'bc-cult-date--exact'
                  : esRelativa
                    ? 'bc-cult-date--relative'
                    : 'bc-cult-date--period'
              }`}>
                <span className="bc-cult-bindings" aria-hidden="true"><i /><i /></span>

                {fechaExacta ? (
                  <>
                    <strong className="bc-cult-day">{fechaExacta[1]}</strong>
                    <span className="bc-cult-month">
                      {fechaExacta[2] === 'MAR' ? 'MARZO' : fechaExacta[2] === 'AGO' ? 'AGOSTO' : fechaExacta[2]}
                    </span>
                  </>
                ) : esRelativa ? (
                  <>
                    <strong className="bc-cult-main">{fecha}</strong>
                    <span className="bc-cult-sub">{c.fechaDetalle}</span>
                  </>
                ) : (
                  <>
                    <strong className="bc-cult-main">{fecha}</strong>
                    <span className="bc-cult-period-mark" aria-hidden="true" />
                  </>
                )}
              </div>

              <div className="bc-cult-copy">
                <h3>{c.nombre}</h3>
                <p>{c.tipo}</p>
                {c.descripcion && <small>{c.descripcion}</small>}
              </div>
            </article>
          );
        })}</div>
      </div></section>}

      {(h.patrimonio?.length > 0 || h.estrenos?.length > 0) && <section className="section heritage-section" id="patrimonio"><div className="shell">
        <SectionTitle eyebrow="Memoria material" title="Patrimonio" description="Obras, enseres y espacios documentados como piezas vivas: su historia, sus autores y las intervenciones que han definido su aspecto." />

        {h.patrimonio?.length > 0 && (
          <div className="heritage-catalog">
            {h.patrimonio.map((pieza, index) => (
              <article className={`heritage-work ${pieza.destacado ? 'heritage-work-featured' : ''}`} key={pieza.id}>
                <div className={`heritage-work-visual ${pieza.imagen ? 'has-image' : ''}`}>
                  {pieza.imagen ? (
                    <>
                      <Image
                        src={pieza.imagen.src}
                        alt={pieza.imagen.alt}
                        fill
                        sizes="(max-width: 820px) calc(100vw - 40px), (max-width: 1199px) calc(50vw - 32px), 565px"
                      />
                      {(pieza.imagen.pie || pieza.imagen.autor) && <small>{[pieza.imagen.pie, pieza.imagen.autor].filter(Boolean).join(' · ')}</small>}
                    </>
                  ) : (
                    <div className="heritage-work-placeholder" aria-hidden="true">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{pieza.tipo}</strong>
                    </div>
                  )}
                </div>

                <div className="heritage-work-copy">
                  <div className="heritage-work-meta">
                    <span>{pieza.tipo}</span>
                    {pieza.fecha && <strong>{pieza.fecha}</strong>}
                  </div>
                  <h3>{pieza.nombre}</h3>
                  <p className="heritage-work-lead">{pieza.resumen || pieza.descripcion}</p>

                  {(pieza.bendicion || pieza.procedencia) && (
                    <dl className="heritage-work-facts">
                      {pieza.bendicion && <div><dt>Bendición</dt><dd>{pieza.bendicion}</dd></div>}
                      {pieza.procedencia && <div><dt>Procedencia</dt><dd>{pieza.procedencia}</dd></div>}
                    </dl>
                  )}

                  {pieza.agentes?.length > 0 && (
                    <div className="heritage-work-agents">
                      <small>Autores y responsables</small>
                      <div>{pieza.agentes.map((agente) => <span key={`${pieza.id}-${agente.id}-${agente.rol}`}><strong>{agente.nombre}</strong><em>{agente.rol}</em></span>)}</div>
                    </div>
                  )}

                  {(pieza.descripcion || pieza.iconografia || pieza.contexto || pieza.origen || pieza.tecnica || pieza.materiales || pieza.dimensiones) && (
                    <details className="heritage-work-details">
                      <summary>Conocer la pieza <span>＋</span></summary>
                      <div className="heritage-work-story">
                        {pieza.descripcion && pieza.descripcion !== pieza.resumen && <p>{pieza.descripcion}</p>}
                        {pieza.contexto && <div><small>Contexto histórico</small><p>{pieza.contexto}</p></div>}
                        {pieza.iconografia && <div><small>Diseño e iconografía</small><p>{pieza.iconografia}</p></div>}
                        {pieza.origen && <div><small>Origen y evolución</small><p>{pieza.origen}</p></div>}
                        {(pieza.tecnica || pieza.materiales || pieza.dimensiones) && <p className="heritage-work-tech">{[pieza.tecnica, pieza.materiales, pieza.dimensiones].filter(Boolean).join(' · ')}</p>}
                      </div>
                    </details>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {h.estrenos?.length > 0 && (
          <div className="heritage-timeline-block">
            <div className="heritage-subheading"><span className="eyebrow">Evolución documentada</span><h3>Estrenos y restauraciones</h3></div>
            <div className="release-grid">{h.estrenos.map((e) => (
              <article className="release-card" key={e.id}><span className="release-year">{e.ano}</span><span className="pill">{e.tipo}</span><h3>{e.titulo}</h3><p>{e.descripcion}</p><small>{e.autoria}</small></article>
            ))}</div>
          </div>
        )}
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

      {h.curiosidades?.length > 0 && <section className="section brotherhood-soft" id="curiosidades"><div className="shell">
        <SectionTitle eyebrow="¿Sabías que…?" title="Curiosidades" description="Datos singulares y divulgativos que solo se publicarán cuando estén documentados." />
        {h.curiosidades.map((c) => <div className="curiosity-card brotherhood-curiosity" key={c.id}><span className="curiosity-mark">?</span><div><span className="eyebrow">{c.categoria}</span><h3>{c.titulo}</h3><p>{c.texto}</p></div></div>)}
      </div></section>}

      <OfficialLinks links={h.enlacesOficiales} />
      <SourcesBlock sources={h.fuentesFicha} />
    </main>
  );
}
