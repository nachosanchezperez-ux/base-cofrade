import Link from 'next/link';
import BrotherhoodReadingLayout from '@/components/BrotherhoodReadingLayout';
import BrotherhoodQuickFacts from '@/components/BrotherhoodQuickFacts';
import readingStyles from '@/components/BrotherhoodReadingLayout.module.css';
import { usesBrotherhoodReading } from '@/lib/brotherhood-reading-rollout';
import Image from 'next/image';
import { cache } from 'react';
import BrotherhoodAgendaSection from '@/components/BrotherhoodAgendaSection';
import BrotherhoodCultsSection from '@/components/BrotherhoodCultsSection';
import BrotherhoodCrewEventsSection from '@/components/BrotherhoodCrewEventsSection';
import BrotherhoodHeritageUpdates from '@/components/BrotherhoodHeritageUpdates';
import BrotherhoodHistoryTimeline from '@/components/BrotherhoodHistoryTimeline';
import BrotherhoodOtherImages from '@/components/BrotherhoodOtherImages';
import BrotherhoodMusicalHeritage from '@/components/BrotherhoodMusicalHeritage';
import MusicalRepertoiresSection from '@/components/MusicalRepertoiresSection';
import BrotherhoodOverviewV2 from '@/components/BrotherhoodOverviewV2';
import BrotherhoodViaCrucisSection from '@/components/BrotherhoodViaCrucisSection';
import BrotherhoodOutingsSection from '@/components/BrotherhoodOutingsSection';
import BrotherhoodProgramHero from '@/components/BrotherhoodProgramHero';
import FollowBrotherhoodButton from '@/components/FollowBrotherhoodButton';
import BrotherhoodSimpecadosSection from '@/components/BrotherhoodSimpecadosSection';
import {
  BrotherhoodConceptualTitulars,
  BrotherhoodOwnBands,
  BrotherhoodReadingDiscovery,
} from '@/components/BrotherhoodRelationalExtras';
import EntitySectionNav from '@/components/EntitySectionNav';
import FestivalPostersSection from '@/components/FestivalPostersSection';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import OfficialLinks from '@/components/OfficialLinks';
import SectionTitle from '@/components/SectionTitle';
import SourcesBlock from '@/components/SourcesBlock';
import { holyWeekDay } from '@/lib/brotherhood-directory';
import { brotherhoodUpcomingAgenda } from '@/lib/brotherhood-agenda';
import { agendaMunicipalityHref } from '@/lib/agenda-relations';
import { brotherhoodLocalityDirectoryHref } from '@/lib/brotherhood-public-index';
import { getIndexableBrotherhoodDirectory } from '@/lib/supabase/indexable-brotherhood-directory';
import { getStepPhotoFraming } from '@/lib/step-photo-framing';
import {
  accompanimentIdsShownInSteps,
  crossGuideAccompaniments,
  crossGuideDetail,
  habitFields,
  stepAccompaniments,
} from '@/lib/brotherhood-ficha-content';
import { getAgendaCofrade } from '@/lib/supabase/agenda-cofrade';
import { getHermandadPageBySlug } from '@/lib/supabase/brotherhood-page';
import {
  getCachedBrotherhoodCoverMedia,
  getCachedBrotherhoodCrestPath,
  getCachedBrotherhoodCrewEvents,
  getCachedBrotherhoodMusicalHeritage,
  getCachedBrotherhoodRepertoires,
} from '@/lib/supabase/brotherhood-page-cached';
import {
  meetsPublicEditorialMinimum,
  publicEditorialRobots,
  publicText,
} from '@/lib/supabase/public-entity-page';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  brotherhoodFactSentence,
  brotherhoodFoundingYear,
  brotherhoodSeatJsonLd,
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

export default async function HermandadDetailPage({ params, reading: readingOverride }) {
  const { slug } = await params;
  const h = await getHermandad(slug);
  if (!h) notFound();
  const reading = readingOverride ?? usesBrotherhoodReading(h.id);

  const canonicalPath = `/hermandades/${h.slug}`;
  const municipalityHubHref = agendaMunicipalityHref(h.localidad);
  const coverEntityTypes = new Map([
    [h.id, 'brotherhood'],
    ...h.imagenes.map((imagen) => [imagen.id, 'image']),
    ...h.pasos.map((paso) => [paso.id, 'step']),
    ...(h.participacionesConsejo || []).map((participacion) => [participacion.id, 'event']),
  ]);
  const [entityCoverMedia, musicalHeritage, authoritativeCrestPath, musicalRepertoires, crewEvents, agendaData, indexableBrotherhoods] = await Promise.all([
    getCachedBrotherhoodCoverMedia(
      [...coverEntityTypes.keys()],
      Object.fromEntries(coverEntityTypes)
    ),
    getCachedBrotherhoodMusicalHeritage(h.id, {
      imageIds: h.imagenes.map((imagen) => imagen.id),
      currentAccompaniments: h.acompanamientoActual,
    }),
    getCachedBrotherhoodCrestPath(h.id),
    getCachedBrotherhoodRepertoires(h.id),
    getCachedBrotherhoodCrewEvents(h.id),
    getAgendaCofrade().catch((error) => {
      console.error('[Hilo Cofrade] Agenda relacionada omitida temporalmente en la ficha de Hermandad', { slug: h.slug, error });
      return { items: [], today: '' };
    }),
    // Directorio en caché (900 s), el mismo de /hermandades: decide si la
    // localidad tiene listado «Hermandades de X» para la miga de pan.
    getIndexableBrotherhoodDirectory().catch((error) => {
      console.error('[Hilo Cofrade] Directorio de localidades omitido en la miga de la ficha de Hermandad', { slug: h.slug, error });
      return [];
    }),
  ]);
  // Miga: «Sevilla» lleva a las hermandades de la localidad; si no hay listado, a su guía.
  const localityBreadcrumbHref = brotherhoodLocalityDirectoryHref(h, indexableBrotherhoods) || municipalityHubHref;
  const upcomingAgendaItems = brotherhoodUpcomingAgenda({
    agendaItems: agendaData.items,
    crewEvents,
    brotherhoodHref: canonicalPath,
  });
  const heroMedia = entityCoverMedia.get(h.id)
    || h.imagenes.map((imagen) => entityCoverMedia.get(imagen.id)).find(Boolean)
    || null;
  const imagenMap = new Map(h.imagenes.map((imagen) => [imagen.id, imagen]));
  // Imágenes que ya se presentan en «Sagrados Titulares» (titulares y otras imágenes).
  const imageIdsShownInTitulars = new Set([...(h.imagenes || []), ...(h.otrasImagenes || [])].map((imagen) => imagen.id));
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
  // Música actual: la de cada paso y la Cruz de Guía se muestran en «Pasos
  // procesionales»; «Acompañamiento musical» solo recoge el resto.
  const currentMusicItems = h.acompanamientoActual || [];
  const crossGuideMusic = crossGuideAccompaniments(currentMusicItems);
  const accompanimentIdsInSteps = accompanimentIdsShownInSteps(currentMusicItems, steps);
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
  // Sede con su dirección publicada: ayuda a responder «dónde está» en buscadores e IA.
  const seatJsonLd = brotherhoodSeatJsonLd(h.sedeDetalle, { locality: h.localidad, region: h.provincia || 'Sevilla' });
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationJsonLdId,
    url: absoluteUrl(canonicalPath),
    name: h.nombreOficial || h.nombrePopular,
    alternateName: h.nombrePopular,
    description: brotherhoodFactSentence(h),
    ...(h.enlacesOficiales?.length ? {
      sameAs: h.enlacesOficiales.map((link) => link.url),
    } : {}),
    ...(authoritativeCrestPath ? {
      logo: absoluteUrl(authoritativeCrestPath),
    } : {}),
    ...(heroMedia?.path ? {
      image: absoluteUrl(heroMedia.path),
    } : {}),
    ...(brotherhoodFoundingYear(h.fundacion) ? { foundingDate: brotherhoodFoundingYear(h.fundacion) } : {}),
    ...(seatJsonLd ? { location: seatJsonLd } : {}),
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

  const councilSection = (<>
{h.participacionesConsejo?.length > 0 && (
        <section className="section"><div className="shell">
          <div className="council-participations">
            {h.participacionesConsejo.map((participacion) => {
              const eventMedia = entityCoverMedia.get(participacion.id);
              const imagePath = eventMedia?.path || participacion.imagen;
              const imageCredit = eventMedia?.credit || participacion.imagenCredito;

              return (
                <article className={`council-participation-card${imagePath ? '' : ' is-text-only'}`} key={participacion.id}>
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
                  ) : null}
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
  </>);
  const titularsSection = (<>
{h.imagenes?.length > 0 && (
      <section className="section brotherhood-soft" id="titulares"><div className="shell">
        <SectionTitle eyebrow="Titularidad" title="Sagrados Titulares" />
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
              ) : null}
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
                    <summary>Iconografía <span>+</span></summary>
                    <p>{imagen.iconografia}</p>
                  </details>
                )}
                {imagen.fichaDisponible && (reading ? <Link href={`/imagenes/${imagen.slug}`} className="text-link">Descubrir titular →</Link> : <span className="text-link">Descubrir titular →</span>)}
              </div>
            </>
          );

          return imagen.fichaDisponible && !reading ? (
            <Link href={`/imagenes/${imagen.slug}`} className={`image-card brotherhood-image-card${coverMedia?.path ? '' : ' is-text-only'}`} key={imagen.id}>{card}</Link>
          ) : (
            <article className={`image-card brotherhood-image-card${coverMedia?.path ? '' : ' is-text-only'}`} key={imagen.id}>{card}</article>
          );
        })}</div>
        <BrotherhoodOtherImages items={h.otrasImagenes || []} />
        <BrotherhoodConceptualTitulars brotherhoodId={h.id} />
        {reading ? <BrotherhoodQuickFacts brotherhood={h} peopleOnly /> : null}
      </div></section>
      )}
  </>);
  const bandLink = (item) => (
    item.bandaSlug
      ? <Link key={item.id || item.bandaSlug} href={`/bandas/${item.bandaSlug}`}>{publicText(item.banda)}</Link>
      : <span className="related-name" key={item.id || item.banda}>{publicText(item.banda)}</span>
  );
  const stepTechnicalData = (paso) => (<>
    {(paso.ejecucion || paso.sistemaPortadores || paso.materiales) && (
      <div className="step-technical-data">
        {paso.ejecucion && <div><small>Ejecución</small><strong>{paso.ejecucion}</strong></div>}
        {paso.sistemaPortadores && <div><small>Sistema de portadores</small><strong>{paso.sistemaPortadores}</strong></div>}
        {paso.materiales && <div className="step-technical-wide"><small>Materiales</small><strong>{paso.materiales}</strong></div>}
      </div>
    )}
    {paso.estadoActual && <p className="step-current-state">{paso.estadoActual}</p>}
  </>);
  const stepsSection = (<>
{h.pasos?.length > 0 && (
      <section className="section" id="pasos"><div className="shell">
        <SectionTitle eyebrow={stepCountText(h.pasos.length)} title="Pasos procesionales" />
        {crossGuideMusic.length > 0 ? (
          <div className="related-row cross-guide-music">
            <small>Cruz de Guía</small>
            <div>{crossGuideMusic.map((item) => {
              const detail = crossGuideDetail(item);
              return <span key={item.id || item.banda}>{bandLink(item)}{detail ? <em> · {detail}</em> : null}</span>;
            })}</div>
          </div>
        ) : null}
        <div className="processional-grid">{h.pasos.map((paso) => {
          const media = entityCoverMedia.get(paso.id);
          const music = stepAccompaniments(currentMusicItems, paso.id);
          // Sin periodos publicados con banda se conserva el texto libre del paso.
          const musicFallback = music.length ? '' : publicText(paso.acompanamientoActual);
          const stepImages = paso.imagenesDetalle?.length
            ? paso.imagenesDetalle
            : (paso.imagenes || []).map((id) => imagenMap.get(id)).filter(Boolean);
          // Los Titulares ya tienen su sección: aquí solo lo que no aparece allí.
          const otherStepImages = stepImages.filter((imagen) => imagen.rol !== 'secundaria' && !imageIdsShownInTitulars.has(imagen.id));
          const figures = stepImages.filter((imagen) => imagen.rol === 'secundaria');
          const renderStepImage = (imagen) => (
            imagen.fichaDisponible
              ? <Link key={imagen.id} href={`/imagenes/${imagen.slug}`}>{imagen.nombre}</Link>
              : <span className="related-name" key={imagen.id}>{imagen.nombre}</span>
          );
          const hasCurrentData = publicText(paso.capatazActual) || music.length || musicFallback;

          return (
          <article className={`processional-card${media?.path ? '' : ' is-text-only'}`} key={paso.id}>
            {media?.path ? (
              <div className="processional-photo has-image">
                <Image
                  className="processional-photo-image"
                  src={media.path}
                  alt={media.alt || `Fotografía de ${paso.nombre}`}
                  fill
                  sizes="(max-width: 900px) calc(100vw - 40px), 50vw"
                  style={{ objectPosition: getStepPhotoFraming(paso.slug).card }}
                />
                {media.credit ? (
                  <small className="processional-photo-credit">
                    {media.credit}
                  </small>
                ) : null}
              </div>
            ) : null}
            <div className="processional-body">{publicText(paso.tipo) ? <span className="pill">{paso.tipo}</span> : null}<h3>{paso.nombre}</h3>{!reading && publicText(paso.descripcion) ? <p>{paso.descripcion}</p> : null}
              {hasCurrentData ? (
                <div className="step-current-data">
                  {publicText(paso.capatazActual) ? <div><small>Capataz actual</small><strong>{publicText(paso.capatazActual)}</strong></div> : null}
                  {music.length ? <div><small>Música</small><strong className="step-music-links">{music.map(bandLink)}</strong></div> : null}
                  {musicFallback ? <div><small>Música</small><strong>{musicFallback}</strong></div> : null}
                </div>
              ) : null}
              {reading
                ? ((publicText(paso.descripcion) || paso.ejecucion || paso.sistemaPortadores || paso.materiales || paso.estadoActual)
                  ? <details className={readingStyles.inlineDisclosure}><summary>Diseño y datos técnicos <span aria-hidden="true">+</span></summary>{publicText(paso.descripcion) ? <p>{paso.descripcion}</p> : null}{stepTechnicalData(paso)}</details>
                  : null)
                : stepTechnicalData(paso)}
              {otherStepImages.length ? <div className="related-row"><small>También procesionan</small><div>{otherStepImages.map(renderStepImage)}</div></div> : null}
              {figures.length ? <div className="related-row related-row-secondary"><small>Figuras del misterio</small><div>{figures.map(renderStepImage)}</div></div> : null}
              {paso.fichaDisponible && <Link href={`/pasos/${paso.slug}`} className="text-link">Ver ficha del paso →</Link>}
            </div>
          </article>
          );
        })}</div>
      </div></section>
      )}
  </>);
  const ownMusicSection = (<>
<BrotherhoodOwnBands brotherhoodId={h.id} musicOnly={reading} excludeAccompanimentIds={accompanimentIdsInSteps} />
  </>);
  const musicalHeritageSection = (<>
{musicalHeritage.length > 0 ? (
        <BrotherhoodMusicalHeritage items={musicalHeritage} compact={reading} headingLevel={reading ? 3 : 2} id={reading ? "patrimonio-musical" : "musica"} />
      ) : fallbackMusicalHeritage.length > 0 ? (
        <section className="section music-section" id={reading ? "patrimonio-musical" : "musica"}><div className="shell">
          <SectionTitle level={reading ? 3 : 2} eyebrow="Sonidos propios" title="Patrimonio Musical" />
          <div className="music-list">{fallbackMusicalHeritage.map((m) => (
            <article key={m.id}><div className="music-index">♪</div><div><h3>{m.nombre}</h3><p>{m.autor}</p></div><strong>{m.ano}</strong>
            {m.youtube ? <a href={m.youtube} target="_blank" rel="noreferrer" className="music-play">YouTube ↗</a> : null}</article>
          ))}</div>
        </div></section>
      ) : null}
  </>);
  const repertoiresSection = (<>
<MusicalRepertoiresSection items={musicalRepertoires} context="brotherhood" headingLevel={reading ? 3 : 2} />
  </>);
  const historySection = (<>
<BrotherhoodHistoryTimeline items={h.cronologia || []} introduction={publicText(h.historia)} semanticPreview={reading} formerTitulars={h.antiguasTitulares || []} />
  </>);
  const viaCrucisSection = (<>
<BrotherhoodViaCrucisSection items={h.viaCrucisCofradias} />
  </>);
  // Túnica: solo los campos con dato; sin ninguno, la sección no aparece.
  const documentedHabits = (h.habitos || [])
    .map((item) => ({ ...item, fields: habitFields(item) }))
    .filter((item) => item.fields.length > 0);
  const habitSection = (<>
{documentedHabits.length > 0 && <section className="section brotherhood-dark" id="tunica"><div className="shell">
        <SectionTitle eyebrow="Estación de penitencia" title="Túnica" />
        <div className="habit-grid">{documentedHabits.map((item, index) => (
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
              {item.fields.map((field) => <div key={field.key}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}
            </dl></div>
          </article>
        ))}</div>
      </div></section>}
  </>);
  const outingsSection = (<>
<BrotherhoodOutingsSection outings={h.salidas} />
  </>);
  const crewSection = (<>
<BrotherhoodCrewEventsSection events={crewEvents} collapseHistory={reading} />
  </>);
  const cultsSection = (<>
<BrotherhoodCultsSection cults={h.cultos} />
  </>);
  const simpecadosSection = (<>
<BrotherhoodSimpecadosSection items={h.simpecados} />
  </>);
  const postersSection = (<>
<FestivalPostersSection posters={h.cartelesFiestas} />
  </>);
  const heritageSection = (<>
{(h.patrimonio?.length > 0 || h.estrenos?.length > 0) && <section className="section heritage-section" id="patrimonio"><div className="shell">
        <SectionTitle eyebrow="Memoria material" title="Patrimonio" />

        {h.patrimonio?.length > 0 && (
          <details className="heritage-catalog-disclosure" open={h.patrimonio.length <= 3}>
            <summary><span>Explorar catálogo patrimonial</span><strong>{h.patrimonio.length} {h.patrimonio.length === 1 ? 'pieza' : 'piezas'}</strong><b aria-hidden="true">+</b></summary>
          <div className="heritage-catalog">
            {h.patrimonio.map((pieza) => (
              <article className={`heritage-work ${pieza.destacado ? 'heritage-work-featured' : ''}`} key={pieza.id}>
                {pieza.imagen ? (
                <div className="heritage-work-visual has-image">
                    <>
                      <Image
                        src={pieza.imagen.src}
                        alt={pieza.imagen.alt}
                        fill
                        sizes="(max-width: 820px) calc(100vw - 40px), (max-width: 1199px) calc(50vw - 32px), 565px"
                      />
                      {(pieza.imagen.pie || pieza.imagen.autor) && <small>{[pieza.imagen.pie, pieza.imagen.autor].filter(Boolean).join(' · ')}</small>}
                    </>
                </div>
                ) : null}

                <div className="heritage-work-copy">
                  <div className="heritage-work-meta">
                    <span>{pieza.tipo}</span>
                    {pieza.fecha && <strong>{pieza.fecha}</strong>}
                  </div>
                  <h3>{pieza.nombre}</h3>
                  {(pieza.resumen || pieza.descripcion) ? <p className="heritage-work-lead">{pieza.resumen || pieza.descripcion}</p> : null}

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
                      <summary>Conocer la pieza <span>+</span></summary>
                      <div className="heritage-work-story">
                        {pieza.descripcion && pieza.descripcion !== pieza.resumen && <p>{pieza.descripcion}</p>}
                        {pieza.contexto && <div><small>Contexto histórico</small><p>{pieza.contexto}</p></div>}
                        {pieza.iconografia && <div><small>Diseño e iconografía</small><p>{pieza.iconografia}</p></div>}
                        {pieza.origen && pieza.origen.trim() !== pieza.contexto?.trim() && <div><small>Origen y evolución</small><p>{pieza.origen}</p></div>}
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
  </>);
  const historicalMusicSection = (<>
{documentedHistoricalAccompaniments.length > 0 && <section className="section brotherhood-soft" id="acompanamientos"><div className="shell">
        <SectionTitle level={reading ? 3 : 2} eyebrow="Memoria sonora" title="Acompañamientos Musicales Históricos" />
        <div className="music-history-grid">{documentedHistoricalAccompaniments.map((a) => (
          <article key={a.id}>{publicText(a.periodo) ? <span className="music-period">{publicText(a.periodo)}</span> : null}<h3>{a.bandaSlug ? <Link href={`/bandas/${a.bandaSlug}`}>{publicText(a.banda)} <span aria-hidden="true">↗</span></Link> : publicText(a.banda)}</h3>{publicText(a.paso) ? <p>{publicText(a.paso)}</p> : null}{publicText(a.tipo) ? <small>{publicText(a.tipo)}</small> : null}</article>
        ))}</div>
      </div></section>}
  </>);
  const newsSection = (<>
{h.noticias?.length > 0 && <section className="section brotherhood-white" id="noticias"><div className="shell">
        <SectionTitle eyebrow="Última hora" title="Noticias relacionadas" />
        <div className="news-grid">{h.noticias.map((n) => (
          <article className="news-card" key={n.id}><div><small>{n.fecha} · {n.categoria}</small><h3>{n.titulo}</h3><p>{n.extracto}</p>{n.url ? <a href={n.url} target="_blank" rel="noreferrer" className="text-link">Leer noticia ↗</a> : null}</div></article>
        ))}</div>
      </div></section>}
  </>);
  const curiositiesSection = (<>
{h.curiosidades?.length > 0 && <section className="section brotherhood-soft" id="curiosidades"><div className="shell">
        <SectionTitle eyebrow="¿Sabías que…?" title="Curiosidades" />
        {h.curiosidades.map((c) => <div className="curiosity-card brotherhood-curiosity" key={c.id}><span className="curiosity-mark">?</span><div><span className="eyebrow">{c.categoria}</span><h3>{c.titulo}</h3><p>{c.texto}</p></div></div>)}
      </div></section>}
  </>);

  return (
    <div className={`brotherhood-page ${reading ? readingStyles.reading : ""}`} style={{
      '--brotherhood-primary': h.colores?.primario || '#153B69',
      '--brotherhood-secondary': h.colores?.secundario || '#A71930',
      '--brotherhood-light': h.colores?.claro || '#FFFFFF',
      '--brotherhood-dark': h.colores?.oscuro || '#0D2949',
      '--brotherhood-on-secondary': h.colores?.sobreSecundario || '#FFFFFF'
    }}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Hermandades', path: '/hermandades' },
        // Mismo nivel que la miga visible: las hermandades de la localidad (o su guía).
        ...(publicText(h.localidad) && localityBreadcrumbHref ? [{ name: publicText(h.localidad), path: localityBreadcrumbHref }] : []),
        { name: h.nombrePopular, path: canonicalPath },
      ])} />
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={pageJsonLd} />

      <BrotherhoodProgramHero
        compact={reading}
        entityType={brotherhoodTypeLabel}
        title={h.nombrePopular}
        officialName={h.nombreOficial}
        locality={publicText(h.localidad)}
        localityHref={municipalityHubHref}
        seat={publicText(h.sede)}
        breadcrumbItems={[
          { label: 'Hermandades', href: '/hermandades' },
          publicText(h.localidad) ? { label: publicText(h.localidad), href: localityBreadcrumbHref || undefined } : null,
          { label: h.nombrePopular },
        ]}
        facts={heroFacts}
        actions={<FollowBrotherhoodButton slug={slug} name={h.nombrePopular} municipality={publicText(h.localidad)} />}
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

      {reading ? (
        <BrotherhoodReadingLayout
          brotherhood={h}
          today={agendaData.today}
          agendaItems={upcomingAgendaItems}
          heroFactLabels={heroFacts.map((fact) => fact.label)}
          hasMusic={Boolean(documentedCurrentAccompaniments.length || musicalHeritage.length || fallbackMusicalHeritage.length || documentedHistoricalAccompaniments.length || musicalRepertoires.length)}
          slots={{ titulars: titularsSection, steps: stepsSection, history: historySection,
            ownMusic: ownMusicSection, musicalHeritage: musicalHeritageSection, repertoires: repertoiresSection,
            historicalMusic: historicalMusicSection, heritage: heritageSection, simpecados: simpecadosSection,
            posters: postersSection, habit: habitSection, council: councilSection, viaCrucis: viaCrucisSection,
            outings: outingsSection, crew: crewSection, hasCrew: crewEvents.length > 0, cults: cultsSection, news: newsSection, curiosities: curiositiesSection }}
        />
      ) : (<>
      <EntitySectionNav items={[
        hasPracticalOverview && { href: '#resumen', label: 'Resumen' },
        h.imagenes?.length > 0 && { href: '#titulares', label: 'Titulares' },
        (publicText(h.historia) || h.cronologia?.length > 0 || h.antiguasTitulares?.length > 0) && { href: '#historia', label: 'Historia' },
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

      <BrotherhoodAgendaSection items={upcomingAgendaItems} brotherhoodSlug={h.slug} brotherhoodName={h.nombrePopular || h.nombreOficial} />



      {councilSection}

      {titularsSection}

      {stepsSection}

      {ownMusicSection}

      {musicalHeritageSection}

      {repertoiresSection}

      {historySection}

      {viaCrucisSection}

      {habitSection}

      {outingsSection}

      {crewSection}

      {cultsSection}

      {simpecadosSection}

      {postersSection}

      {heritageSection}

      {historicalMusicSection}

      {newsSection}

      {curiositiesSection}

      </>)}

      {/* Cierre: rutas de segundo grado. Las relaciones directas ya están en su sección. */}
      {!reading && <BrotherhoodReadingDiscovery brotherhoodId={h.id} />}

      {reading && <div className={`shell ${readingStyles.documentation}`}><details className={readingStyles.disclosure}><summary>Más rutas para tirar del hilo <b aria-hidden="true">+</b></summary><BrotherhoodReadingDiscovery brotherhoodId={h.id} /></details></div>}

      {reading && h.enlacesOficiales?.length ? <div className={`shell ${readingStyles.documentation}`}><details className={readingStyles.disclosure}><summary>Web y redes oficiales <span>{h.enlacesOficiales.length}</span><b aria-hidden="true">+</b></summary><OfficialLinks links={h.enlacesOficiales} /></details></div> : <OfficialLinks links={h.enlacesOficiales} />}
      <SourcesBlock sources={h.fuentesFicha} />
    </div>
  );
}
