import Link from 'next/link';
import Image from 'next/image';
import { cache } from 'react';
import BrotherhoodAgendaSection from '@/components/BrotherhoodAgendaSection';
import BrotherhoodCultsSection from '@/components/BrotherhoodCultsSection';
import BrotherhoodCrewEventsSection from '@/components/BrotherhoodCrewEventsSection';
import BrotherhoodHeritageUpdates from '@/components/BrotherhoodHeritageUpdates';
import BrotherhoodHistoryTimeline from '@/components/BrotherhoodHistoryTimeline';
import BrotherhoodMusicalHeritage from '@/components/BrotherhoodMusicalHeritage';
import MusicalRepertoiresSection from '@/components/MusicalRepertoiresSection';
import BrotherhoodOverviewV2 from '@/components/BrotherhoodOverviewV2';
import BrotherhoodViaCrucisSection from '@/components/BrotherhoodViaCrucisSection';
import BrotherhoodOutingsSection from '@/components/BrotherhoodOutingsSection';
import BrotherhoodProgramHero from '@/components/BrotherhoodProgramHero';
import BrotherhoodSimpecadosSection from '@/components/BrotherhoodSimpecadosSection';
import {
  BrotherhoodConceptualTitulars,
  BrotherhoodOwnBands,
} from '@/components/BrotherhoodRelationalExtras';
import EntitySectionNav from '@/components/EntitySectionNav';
import RelationalThread from '@/components/RelationalThread';
import FestivalPostersSection from '@/components/FestivalPostersSection';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import OfficialLinks from '@/components/OfficialLinks';
import SectionTitle from '@/components/SectionTitle';
import SourcesBlock from '@/components/SourcesBlock';
import { holyWeekDay } from '@/lib/brotherhood-directory';
import { brotherhoodUpcomingAgenda } from '@/lib/brotherhood-agenda';
import { agendaMunicipalityHref } from '@/lib/agenda-relations';
import { getStepPhotoFraming } from '@/lib/step-photo-framing';
import { getBrotherhoodMusicalHeritage } from '@/lib/supabase/brotherhood-musical-heritage';
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade';
import { getCrewEventsByBrotherhoodId } from '@/lib/supabase/crew-events';
import { getMusicalRepertoires } from '@/lib/supabase/musical-repertoires';
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
  brotherhoodPublicTypeLabel,
  pageTitle,
} from '@/lib/seo';

export const revalidate = 900;
const getHermandad = cache(getHermandadPageBySlug);

function normalizeProcessionalText(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function stepCountText(count) {
  return count > 0 ? `${count} ${count === 1 ? 'paso' : 'pasos'}` : '';
}

function isGloryStep(step) {
  return normalizeProcessionalText(step?.tipo).includes('gloria');
}

function isSacramentalStep(step) {
  const type = normalizeProcessionalText(step?.tipo);
  return type.includes('custodia') || type.includes('sacramental') || type.includes('eucarist');
}

function gloryOutingForHeader(outings = []) {
  const candidates = outings.filter((outing) => (
    normalizeProcessionalText([outing?.tipo, outing?.nombre].filter(Boolean).join(' ')).includes('gloria')
  ));

  return candidates.find((outing) => (
    outing?.estado === 'recurring' || normalizeProcessionalText(outing?.caracter) === 'anual'
  )) || candidates[0] || null;
}

function outingDateForHeader(outing) {
  if (!outing) return '';

  const liturgicalDay = publicText(outing.diaLiturgico);
  if (liturgicalDay) return liturgicalDay;

  const moment = publicText(outing.momento);
  return moment ? moment.split(' · ')[0].trim() : '';
}

export function generateStaticParams() {
  // Generate on first request and retain ISR; never query Supabase at build time.
  return [];
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
      h.simpecados,
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
      card: 'summary_large_image',
      title: pageTitle(title),
      description,
    },
  };
}

export default async function HermandadDetailPage({ params }) {
  const { slug } = await params;
  const h = await getHermandad(slug);
  if (!h) notFound();

  const canonicalPath = `/hermandades/${h.slug}`;
  const municipalityHubHref = agendaMunicipalityHref(h.localidad);
  const coverEntityTypes = new Map([
    [h.id, 'brotherhood'],
    ...h.imagenes.map((imagen) => [imagen.id, 'image']),
    ...h.pasos.map((paso) => [paso.id, 'step']),
    ...(h.participacionesConsejo || []).map((participacion) => [participacion.id, 'event']),
  ]);
  const [entityCoverMedia, musicalHeritage, authoritativeCrestPath, musicalRepertoires, crewEvents, agendaData] = await Promise.all([
    getPublishedEntityCoverMediaMap(
      [...coverEntityTypes.keys()],
      { entityTypesById: coverEntityTypes }
    ),
    getBrotherhoodMusicalHeritage(h.id, {
      imageIds: h.imagenes.map((imagen) => imagen.id),
      currentAccompaniments: h.acompanamientoActual,
    }),
    getPublishedBrotherhoodCrestPath(h.id),
    getMusicalRepertoires({ brotherhoodEntityId: h.id }),
    getCrewEventsByBrotherhoodId(h.id),
    getAgendaCofrade().catch((error) => {
      console.error('[Hilo Cofrade] Agenda relacionada omitida temporalmente en la ficha de Hermandad', { slug: h.slug, error });
      return { items: [], today: '' };
    }),
  ]);
  const upcomingAgendaItems = brotherhoodUpcomingAgenda({
    agendaItems: agendaData.items,
    crewEvents,
    brotherhoodHref: canonicalPath,
  });
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
  const isGloria = tiposHermandad.includes('Gloria');
  const brotherhoodTypeLabel = brotherhoodPublicTypeLabel(h);
  const steps = h.pasos || [];
  const stepById = new Map(steps.map((step) => [step.id, step]));
  const relationalCurrentAccompaniments = (h.acompanamientoActual || []).filter((item) => (
    publicText(item.banda) && publicText(item.bandaSlug)
  ));
  const brotherhoodThreadItems = [
    ...(h.imagenes || [])
      .filter((imagen) => imagen.fichaDisponible && imagen.slug)
      .map((imagen) => ({
        kind: 'Imagen',
        relation: 'Titular',
        title: imagen.nombre,
        href: `/imagenes/${imagen.slug}`,
        context: [imagen.tipo, imagen.autor, imagen.fecha].map(publicText).filter(Boolean).join(' · '),
      })),
    ...steps
      .filter((step) => step.fichaDisponible && step.slug)
      .map((step) => ({
        kind: 'Paso',
        relation: 'Paso procesional',
        title: step.nombre,
        href: `/pasos/${step.slug}`,
        context: [step.tipo, step.ejecucion].map(publicText).filter(Boolean).join(' · '),
      })),
    ...relationalCurrentAccompaniments.map((item) => ({
      kind: 'Banda',
      relation: publicText(item.posicion) || 'Acompañamiento actual',
      title: publicText(item.banda),
      href: `/bandas/${item.bandaSlug}`,
      context: [
        stepById.get(item.pasoId)?.nombre,
        publicText(item.salida),
        publicText(item.periodo),
      ].filter(Boolean).join(' · '),
    })),
    ...musicalHeritage
      .filter((item) => item.workType === 'Marcha procesional' && item.slug)
      .slice(-4)
      .map((item) => ({
        kind: 'Marcha',
        relation: 'Patrimonio musical',
        title: item.name,
        href: `/marchas/${item.slug}`,
        context: [
          String(item.year || ''),
          publicText(item.musicType),
          item.composers?.map((author) => author.name).filter(Boolean).join(' · '),
        ].filter(Boolean).join(' · '),
      })),
  ];
  const explicitGlorySteps = steps.filter(isGloryStep);
  const holyWeekSteps = isPenitencia
    ? steps.filter((step) => !isGloryStep(step) && !isSacramentalStep(step))
    : [];
  const glorySteps = isPenitencia
    ? explicitGlorySteps
    : explicitGlorySteps.length > 0
      ? explicitGlorySteps
      : steps.filter((step) => !isSacramentalStep(step));
  const gloryOuting = isGloria ? gloryOutingForHeader(h.salidas) : null;
  const gloryDate = isGloria
    ? outingDateForHeader(gloryOuting) || (!isPenitencia ? publicText(h.diaSalida) : '')
    : '';
  const holyWeekFact = isPenitencia ? {
    label: 'Semana Santa',
    value: [holyWeekDay(h) || publicText(h.diaSalida), stepCountText(holyWeekSteps.length)]
      .filter(Boolean)
      .join(' · '),
  } : null;
  const gloryFact = isGloria && gloryDate ? {
    label: 'Gloria',
    value: [gloryDate, stepCountText(glorySteps.length)].filter(Boolean).join(' · '),
  } : null;
  const penitentialFacts = [
    holyWeekFact,
    gloryFact,
    {
      label: h.datosJornada?.ano ? `Nazarenos · ${h.datosJornada.ano}` : 'Nazarenos',
      value: h.datosJornada?.totalNazarenos,
    },
    { label: 'Tiempo en Carrera Oficial', value: h.datosJornada?.tiempoCarreraOficial },
  ].filter((item) => item?.value);
  const gloryFacts = [
    gloryFact,
    { label: 'Fundación', value: publicText(h.fundacion) },
    { label: 'Titulares', value: h.imagenes?.length ? String(h.imagenes.length) : '' },
  ].filter((item) => item?.value);
  const heroFacts = isPenitencia ? penitentialFacts : gloryFacts;
  const heroFactLabels = new Set(heroFacts.map((fact) => fact.label));
  const hasPracticalOverview = Boolean(
    publicText(h.sedeDetalle?.nombre)
    || (tiposHermandad.length > 1)
    || (publicText(h.fundacion) && !heroFactLabels.has('Fundación'))
    || (publicText(h.datosJornada?.totalHermanos) && !heroFactLabels.has('Hermanos'))
    || (h.imagenes?.length && !heroFactLabels.has('Titulares'))
  );
  const description = brotherhoodSeoDescription(h);
  const organizationJsonLdId = `${absoluteUrl(canonicalPath)}#organization`;
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationJsonLdId,
    url: absoluteUrl(canonicalPath),
    name: h.nombreOficial || h.nombrePopular,
    alternateName: h.nombrePopular,
    ...(h.enlacesOficiales?.length ? {
      sameAs: h.enlacesOficiales.map((link) => link.url),
    } : {}),
    ...(authoritativeCrestPath ? {
      logo: absoluteUrl(authoritativeCrestPath),
    } : {}),
    ...(heroMedia?.path ? {
      image: absoluteUrl(heroMedia.path),
    } : {}),
    ...(h.localidad ? {
      address: {
        '@type': 'PostalAddress',
        addressLocality: h.localidad,
        addressRegion: h.provincia || 'Sevilla',
        addressCountry: 'ES',
      },
    } : {}),
  };
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
      '@id': organizationJsonLdId,
    },
    mainEntity: {
      '@id': organizationJsonLdId,
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
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={pageJsonLd} />

      <BrotherhoodProgramHero
        entityType={brotherhoodTypeLabel}
        title={h.nombrePopular}
        officialName={h.nombreOficial}
        locality={publicText(h.localidad)}
        localityHref={municipalityHubHref}
        seat={publicText(h.sede)}
        breadcrumbItems={[
          { label: 'Hermandades', href: '/hermandades' },
          publicText(h.localidad) ? { label: publicText(h.localidad), href: municipalityHubHref || undefined } : null,
          { label: h.nombrePopular },
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
        hasPracticalOverview && { href: '#resumen', label: 'Resumen' },
        h.imagenes?.length > 0 && { href: '#titulares', label: 'Titulares' },
        h.cronologia?.length > 0 && { href: '#historia', label: 'Historia' },
        (musicalHeritage.length > 0 || fallbackMusicalHeritage.length > 0) && { href: '#musica', label: 'Música' },
        h.patrimonio?.length > 0 && { href: '#patrimonio', label: 'Patrimonio' },
        upcomingAgendaItems.length > 0
          ? { href: '#agenda', label: 'Agenda' }
          : h.cultos?.length > 0
            ? { href: '#cultos', label: 'Cultos' }
            : null,
      ]} />

      <BrotherhoodOverviewV2
        brotherhood={h}
        heroFactLabels={heroFacts.map((fact) => fact.label)}
      />

      <BrotherhoodAgendaSection items={upcomingAgendaItems} />



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

      <MusicalRepertoiresSection items={musicalRepertoires} context="brotherhood" />

      <BrotherhoodHistoryTimeline items={h.cronologia || []} />

      <BrotherhoodViaCrucisSection items={h.viaCrucisCofradias} />

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
              {item.guantes ? <div><dt>Guantes</dt><dd>{item.guantes}</dd></div> : null}
            </dl></div>
          </article>
        ))}</div>
      </div></section>}

      <BrotherhoodOutingsSection outings={h.salidas} />

      <BrotherhoodCrewEventsSection events={crewEvents} />

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

        <BrotherhoodHeritageUpdates
          items={h.estrenos}
          currentYear={Number(agendaData.today?.slice(0, 4)) || new Date().getUTCFullYear()}
          sourcesHref={h.fuentesFicha?.length ? '#fuentes' : undefined}
        />
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

      <RelationalThread
        currentLabel="Hermandad"
        currentName={h.nombrePopular}
        currentMeta={[brotherhoodTypeLabel, publicText(h.localidad)].filter(Boolean).join(' · ')}
        items={brotherhoodThreadItems}
        priorityProfile="hermandad"
        eyebrow="Descubre el hilo"
        title="Conexiones de esta Hermandad"
        description="Continúa por sus Titulares, pasos, bandas y marchas documentadas. Cada relación abre una nueva ficha sin perder el contexto de la Hermandad de origen."
      />

      <OfficialLinks links={h.enlacesOficiales} />
      <SourcesBlock sources={h.fuentesFicha} />
    </div>
  );
}