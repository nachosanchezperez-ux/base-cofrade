import Link from 'next/link';
import Image from 'next/image';
import { cache } from 'react';
import BrotherhoodCultsSection from '@/components/BrotherhoodCultsSection';
import BrotherhoodMusicalHeritage from '@/components/BrotherhoodMusicalHeritage';
import BrotherhoodOverviewV2 from '@/components/BrotherhoodOverviewV2';
import BrotherhoodProgramHero from '@/components/BrotherhoodProgramHero';
import BrotherhoodSimpecadosSection from '@/components/BrotherhoodSimpecadosSection';
import {
  BrotherhoodConceptualTitulars,
  BrotherhoodOwnBands,
} from '@/components/BrotherhoodRelationalExtras';
import EntitySectionNav from '@/components/EntitySectionNav';
import FestivalPostersSection from '@/components/FestivalPostersSection';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import OfficialLinks from '@/components/OfficialLinks';
import SectionTitle from '@/components/SectionTitle';
import SourcesBlock from '@/components/SourcesBlock';
import { hermandades } from '@/lib/data';
import { getStepPhotoFraming } from '@/lib/step-photo-framing';
import { getBrotherhoodMusicalHeritage } from '@/lib/supabase/brotherhood-musical-heritage';
import { getHermandadPageBySlug } from '@/lib/supabase/brotherhood-page';
import { getPublishedBrotherhoodCrestPath } from '@/lib/supabase/brotherhood-public-authority';
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media';
import {
  meetsPublicEditorialMinimum,
  publicEditorialRobots,
  publicText,
} from '@/lib/supabase/public-entity-page';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  brotherhoodSeoDescription,
  brotherhoodSeoTitle,
  pageTitle,
} from '@/lib/seo';
import outingVideoStyles from './outing-video.module.css';

export const dynamic = 'force-dynamic';
const getHermandad = cache(getHermandadPageBySlug);

function normalizeOutingLabel(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim();
}

function outingCharacterLabel(outing) {
  const character = String(outing?.caracter || '').trim();
  if (!character) return '';

  const type = normalizeOutingLabel(outing?.tipo);
  const normalizedCharacter = normalizeOutingLabel(character);
  return type.includes(normalizedCharacter) ? '' : character;
}

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
  const editoriallyReady = meetsPublicEditorialMinimum({
    identity: h.nombrePopular || h.nombreOficial,
    type: (h.tipos || []).join(' · '),
    context: h.localidad,
    summary: h.resumen,
    relations: [
      h.imagenes,
      h.pasos,
      h.cronologia,
      h.acompanamientoActual,
      h.patrimonio,
      h.cultos,
    ],
    sources: h.fuentesFicha || [],
    publicValues: h,
  });

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

  const [entityCoverMedia, musicalHeritage, authoritativeCrestPath] = await Promise.all([
    getPublishedEntityCoverMediaMap(
      [
        h.id,
        ...h.imagenes.map((imagen) => imagen.id),
        ...h.pasos.map((paso) => paso.id),
        ...(h.participacionesConsejo || []).map((participacion) => participacion.id),
      ]
    ),
    getBrotherhoodMusicalHeritage(h.id),
    getPublishedBrotherhoodCrestPath(h.id),
  ]);
  const heroMedia = entityCoverMedia.get(h.id)
    || h.imagenes.map((imagen) => entityCoverMedia.get(imagen.id)).find(Boolean)
    || null;
  const imagenMap = new Map(h.imagenes.map((imagen) => [imagen.id, imagen]));
  const fallbackMusicalHeritage = (h.patrimonioMusical || []).filter((item) => (
    publicText(item.nombre) && publicText(item.autor)
  ));
  const documentedCurrentAccompaniments = (h.acompanamientoActual || []).filter((item) => (
    publicText(item.banda) && publicText(item.posicion || item.tipo)
  ));
  const documentedHistoricalAccompaniments = (h.acompanamientos || []).filter((item) => (
    publicText(item.banda) && publicText(item.paso || item.tipo || item.periodo)
  ));
  const tiposHermandad = h.tipos || [];
  const isPenitencia = tiposHermandad.includes('Penitencia');
  const brotherhoodTypeLabel = isPenitencia
    ? 'Hermandad de Penitencia'
    : tiposHermandad.includes('Gloria')
      ? 'Hermandad de Gloria'
      : tiposHermandad.includes('Sacramental')
        ? 'Hermandad Sacramental'
        : 'Hermandad';
  const penitentialFacts = [
    { label: 'Salida', value: publicText(h.diaSalida) },
    {
      label: h.datosJornada?.ano ? `Nazarenos · ${h.datosJornada.ano}` : 'Nazarenos',
      value: h.datosJornada?.totalNazarenos,
    },
    { label: 'Tiempo en Carrera Oficial', value: h.datosJornada?.tiempoCarreraOficial },
    { label: 'Pasos', value: h.pasos?.length ? String(h.pasos.length) : '' },
  ].filter((item) => item.value);
  const gloryFacts = [
    { label: 'Fundación', value: publicText(h.fundacion) },
    { label: 'Salida', value: publicText(h.diaSalida) },
    { label: 'Titulares', value: h.imagenes?.length ? String(h.imagenes.length) : '' },
    { label: 'Pasos', value: h.pasos?.length ? String(h.pasos.length) : '' },
  ].filter((item) => item.value);
  const heroFacts = isPenitencia ? penitentialFacts : gloryFacts;
  const heroFactLabels = new Set(heroFacts.map((fact) => fact.label));
  const hasPracticalOverview = Boolean(
    publicText(h.sedeDetalle?.nombre)
    || (tiposHermandad.length > 1)
    || (publicText(h.fundacion) && !heroFactLabels.has('Fundación'))
    || (publicText(h.datosJornada?.totalHermanos) && !heroFactLabels.has('Hermanos'))
    || (h.imagenes?.length && !heroFactLabels.has('Titulares'))
  );
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
    <div className="brotherhood-page" style={{
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

      <BrotherhoodProgramHero
        entityType={brotherhoodTypeLabel}
        title={h.nombrePopular}
        officialName={h.nombreOficial}
        locality={publicText(h.localidad)}
        seat={publicText(h.sede)}
        breadcrumbItems={[
          { label: 'Hermandades', href: '/hermandades' },
          { label: h.localidad || 'Ficha' },
        ]}
        facts={heroFacts}
        media={{
          photoSrc: heroMedia?.path || '',
          photoAlt: heroMedia?.alt || `Fotografía de ${h.nombrePopular}`,
          credit: heroMedia?.credit || '',
          width: heroMedia?.width,
          height: heroMedia?.height,
          focusX: heroMedia?.focusX,
          focusY: heroMedia?.focusY,
          mobileFocusX: heroMedia?.mobileFocusX,
          mobileFocusY: heroMedia?.mobileFocusY,
          focusPosition: heroMedia?.focusPosition,
          fitMode: heroMedia?.fitMode,
          crestSrc: authoritativeCrestPath,
          crestAlt: `Escudo de ${h.nombrePopular}`,
        }}
      />

      <EntitySectionNav items={[
        hasPracticalOverview && { href: '#resumen', label: 'Información' },
        h.imagenes?.length > 0 && { href: '#titulares', label: 'Titulares' },
        h.pasos?.length > 0 && { href: '#pasos', label: 'Pasos' },
        (h.imagenes?.length > 0 || h.pasos?.length > 0) && { href: '#tira-del-hilo', label: 'Tira del hilo' },
        documentedCurrentAccompaniments.length > 0 && { href: '#acompanamiento-musical', label: 'Acompañamiento' },
        (musicalHeritage.length > 0 || fallbackMusicalHeritage.length > 0) && { href: '#musica', label: 'Patrimonio musical' },
        h.cronologia?.length > 0 && { href: '#historia', label: 'Historia' },
        h.habitos?.length > 0 && { href: '#tunica', label: 'Túnica' },
        h.salidas?.length > 0 && { href: '#salidas', label: 'Salidas' },
        h.cultos?.length > 0 && { href: '#cultos', label: 'Cultos' },
        h.simpecados?.length > 0 && { href: '#simpecados', label: 'Simpecados' },
        h.cartelesFiestas?.length > 0 && { href: '#carteles', label: 'Carteles' },
        h.patrimonio?.length > 0 && { href: '#patrimonio', label: 'Patrimonio' },
        h.estrenos?.length > 0 && { href: '#estrenos', label: 'Estrenos' },
        documentedHistoricalAccompaniments.length > 0 && { href: '#acompanamientos', label: 'Histórico musical' },
        h.noticias?.length > 0 && { href: '#noticias', label: 'Noticias' },
        h.curiosidades?.length > 0 && { href: '#curiosidades', label: 'Curiosidades' },
        h.enlacesOficiales?.length > 0 && { href: '#enlaces-de-interes', label: 'Web y redes' },
        h.fuentesFicha?.length > 0 && { href: '#fuentes', label: 'Fuentes' },
      ]} />

      <BrotherhoodOverviewV2
        brotherhood={h}
        heroFactLabels={heroFacts.map((fact) => fact.label)}
      />

      {h.participacionesConsejo?.length > 0 && (
        <section className="section"><div className="shell">
          <div className="council-participations">
            {h.participacionesConsejo.map((participacion) => {
              const eventMedia = entityCoverMedia.get(participacion.id);
              const imagePath = eventMedia?.path || participacion.imagen;
              const imageCredit = eventMedia?.credit || participacion.imagenCredito;

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
        </div></section>
      )}

      {h.imagenes?.length > 0 && (
      <section className="section brotherhood-soft" id="titulares"><div className="shell">
        <SectionTitle eyebrow="Titularidad" title="Sagrados Titulares" description="Imágenes e identidades devocionales que conforman la titularidad documentada de la Hermandad." />
        <div className="image-grid">{h.imagenes.map((imagen) => {
          const coverMedia = entityCoverMedia.get(imagen.id);
          const authorship = [imagen.autor, imagen.fecha].filter(Boolean).join(' · ');
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
                {authorship ? <p className="image-card-authorship">{authorship}</p> : null}
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
      )}

      {h.pasos?.length > 0 && (
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
              {(publicText(paso.capatazActual) || publicText(paso.acompanamientoActual)) && (
                <div className="step-current-data">
                  {publicText(paso.capatazActual) ? <div><small>Capataz actual</small><strong>{publicText(paso.capatazActual)}</strong></div> : null}
                  {publicText(paso.acompanamientoActual) ? <div><small>Acompañamiento musical</small><strong>{publicText(paso.acompanamientoActual)}</strong></div> : null}
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
              {(paso.imagenesDetalle?.length || paso.imagenes?.length) ? <div className="related-row"><small>Imágenes que procesionan</small><div>{(
                paso.imagenesDetalle?.length
                  ? paso.imagenesDetalle
                  : paso.imagenes.map((id) => imagenMap.get(id)).filter(Boolean)
              ).map((imagen) => (
                imagen.fichaDisponible
                  ? <Link key={imagen.id} href={`/imagenes/${imagen.slug}`}>{imagen.nombre}</Link>
                  : <span className="related-name" key={imagen.id}>{imagen.nombre}</span>
              ))}</div></div> : null}
              {paso.fichaDisponible && <Link href={`/pasos/${paso.slug}`} className="text-link">Ver ficha del paso →</Link>}
            </div>
          </article>
        ))}</div>
      </div></section>
      )}

      <BrotherhoodOwnBands brotherhoodId={h.id} />

      {musicalHeritage.length > 0 ? (
        <BrotherhoodMusicalHeritage items={musicalHeritage} />
      ) : fallbackMusicalHeritage.length > 0 ? (
        <section className="section music-section" id="musica"><div className="shell">
          <SectionTitle eyebrow="Sonidos propios" title="Patrimonio Musical" description="Marchas dedicadas a la Hermandad y a sus titulares, conectadas con sus autores y registros audiovisuales." />
          <div className="music-list">{fallbackMusicalHeritage.map((m) => (
            <article key={m.id}><div className="music-index">♪</div><div><h3>{m.nombre}</h3><p>{m.autor}</p></div><strong>{m.ano}</strong>
            {m.youtube ? <a href={m.youtube} target="_blank" rel="noreferrer" className="music-play">YouTube ↗</a> : null}</article>
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
        <div className="outing-grid">{h.salidas.map((s) => {
          const guideHref = s.slug ? `/extraordinarias/${s.slug}` : '';
          const hasEmbeddedInteraction = Boolean(s.video || s.ediciones?.length || s.movimientos?.length);
          const isWholeCardLink = Boolean(guideHref) && !hasEmbeddedInteraction;
          const OutingCard = isWholeCardLink ? Link : 'article';
          const characterLabel = outingCharacterLabel(s);

          return (
          <OutingCard
            className={`outing-card ${s.ediciones?.length ? 'outing-card-featured' : ''} ${s.video ? outingVideoStyles.cardWithVideo : ''} ${guideHref ? 'outing-card-related' : ''}`}
            key={s.id}
            {...(isWholeCardLink ? {
              href: guideHref,
              'aria-label': `Ver guía de ${s.nombre}`,
            } : {})}
          >
            <div className="outing-type">
              <span>{s.tipo}</span>
              {characterLabel && <small>{characterLabel}</small>}
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

              {s.video && (
                <aside className={outingVideoStyles.video} aria-label={`Vídeo oficial de ${s.nombre}`}>
                  <div className={outingVideoStyles.heading}>
                    <div>
                      <span>Archivo audiovisual</span>
                      <strong>{s.video.titulo}</strong>
                    </div>
                    {s.video.autor && <small>Canal oficial · {s.video.autor}</small>}
                  </div>
                  <div className={outingVideoStyles.frame}>
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(s.video.id)}?rel=0`}
                      title={s.video.titulo}
                      loading="lazy"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <a href={s.video.url} target="_blank" rel="noreferrer">Ver en el canal de la Hermandad ↗</a>
                </aside>
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

              {guideHref && (
                isWholeCardLink
                  ? <span className="outing-guide-link">Ver guía <span aria-hidden="true">→</span></span>
                  : <Link className="outing-guide-link" href={guideHref}>Ver guía <span aria-hidden="true">→</span></Link>
              )}
            </div>
          </OutingCard>
          );
        })}</div>
      </div></section>}

      <BrotherhoodCultsSection cults={h.cultos} />

      <BrotherhoodSimpecadosSection items={h.simpecados} />

      <FestivalPostersSection posters={h.cartelesFiestas} />

      {(h.patrimonio?.length > 0 || h.estrenos?.length > 0) && <section className="section heritage-section" id="patrimonio"><div className="shell">
        <SectionTitle eyebrow="Memoria material" title="Patrimonio" description="Obras, enseres y espacios documentados como piezas vivas: su historia, sus autores y las intervenciones que han definido su aspecto." />

        {h.patrimonio?.length > 0 && (
          <details className="heritage-catalog-disclosure" open={h.patrimonio.length <= 3}>
            <summary><span>Explorar catálogo patrimonial</span><strong>{h.patrimonio.length} {h.patrimonio.length === 1 ? 'pieza' : 'piezas'}</strong><b aria-hidden="true">＋</b></summary>
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
          </details>
        )}

        {h.estrenos?.length > 0 && (
          <div className="heritage-timeline-block" id="estrenos">
            <div className="heritage-subheading"><span className="eyebrow">Evolución documentada</span><h3>Estrenos y restauraciones</h3></div>
            <div className="release-grid">{h.estrenos.map((e) => (
              <article className={`release-card ${e.imagen ? 'has-image' : ''}`} key={e.id}>
                <figure className="release-card-visual">
                  {e.imagen ? (
                    <Image
                      src={e.imagen.src}
                      alt={e.imagen.alt}
                      fill
                      sizes={h.estrenos.length === 1
                        ? '(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) calc(100vw - 48px), 1158px'
                        : '(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) calc(50vw - 32px), 370px'}
                    />
                  ) : <div className="release-card-placeholder" aria-hidden="true">{e.ano}</div>}
                  <div className="release-card-badges"><span>{e.tipo}</span><strong>{e.ano}</strong></div>
                  {e.imagen?.credito && <figcaption>{e.imagen.credito}</figcaption>}
                </figure>
                <div className="release-card-copy">
                  {(e.disciplina || e.elemento) && <span className="release-card-eyebrow">{e.disciplina || e.elemento}</span>}
                  <h3>{e.titulo}</h3>
                  {(e.fecha || e.elemento) && <dl className="release-card-facts">
                    {e.fecha && <div><dt>Fecha</dt><dd><time dateTime={e.fechaIso}>{e.fecha}</time></dd></div>}
                    {e.elemento && <div><dt>Intervención</dt><dd>{e.elemento}</dd></div>}
                  </dl>}
                  <p className="release-card-description">{e.descripcion}</p>
                  {e.agentes?.length > 0 ? (
                    <details className="release-card-team">
                      <summary><span>Equipo responsable</span><strong>{e.agentes.length} {e.agentes.length === 1 ? 'persona' : 'personas'}</strong><b aria-hidden="true">＋</b></summary>
                      <ul>{e.agentes.map((agente) => <li key={`${e.id}-${agente.id}`}><strong>{agente.nombre}</strong>{agente.rol && <span>{agente.rol}</span>}</li>)}</ul>
                    </details>
                  ) : <small className="release-card-authorship">{e.autoria}</small>}
                </div>
              </article>
            ))}</div>
          </div>
        )}
      </div></section>}

      {documentedHistoricalAccompaniments.length > 0 && <section className="section brotherhood-soft" id="acompanamientos"><div className="shell">
        <SectionTitle eyebrow="Memoria sonora" title="Acompañamientos Musicales Históricos" description="Una cronología por paso para conocer qué formaciones musicales han acompañado a la Hermandad." />
        <div className="music-history-grid">{documentedHistoricalAccompaniments.map((a) => (
          <article key={a.id}>{publicText(a.periodo) ? <span className="music-period">{publicText(a.periodo)}</span> : null}<h3>{publicText(a.banda)}</h3>{publicText(a.paso) ? <p>{publicText(a.paso)}</p> : null}{publicText(a.tipo) ? <small>{publicText(a.tipo)}</small> : null}</article>
        ))}</div>
      </div></section>}

      {h.noticias?.length > 0 && <section className="section brotherhood-white" id="noticias"><div className="shell">
        <SectionTitle eyebrow="Última hora" title="Noticias relacionadas" description="Actualidad vinculada directamente con la Hermandad, sus titulares, patrimonio y vida corporativa." />
        <div className="news-grid">{h.noticias.map((n) => (
          <article className="news-card" key={n.id}><div className="news-image-placeholder">Noticia</div><div><small>{n.fecha} · {n.categoria}</small><h3>{n.titulo}</h3><p>{n.extracto}</p>{n.url ? <a href={n.url} target="_blank" rel="noreferrer" className="text-link">Leer noticia ↗</a> : null}</div></article>
        ))}</div>
      </div></section>}

      {h.curiosidades?.length > 0 && <section className="section brotherhood-soft" id="curiosidades"><div className="shell">
        <SectionTitle eyebrow="¿Sabías que…?" title="Curiosidades" description="Datos singulares y divulgativos que solo se publicarán cuando estén documentados." />
        {h.curiosidades.map((c) => <div className="curiosity-card brotherhood-curiosity" key={c.id}><span className="curiosity-mark">?</span><div><span className="eyebrow">{c.categoria}</span><h3>{c.titulo}</h3><p>{c.texto}</p></div></div>)}
      </div></section>}

      <OfficialLinks links={h.enlacesOficiales} />
      <SourcesBlock sources={h.fuentesFicha} />
    </div>
  );
}
