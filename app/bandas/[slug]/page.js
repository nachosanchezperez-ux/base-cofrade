import Image from 'next/image'
import Link from 'next/link'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import SourcesBlock from '@/components/SourcesBlock'
import OfficialLinks from '@/components/OfficialLinks'
import RelationalEntityHero from '@/components/RelationalEntityHero'
import { panelEditHref } from '@/lib/panel-session-cookie'
import EntitySectionNav from '@/components/EntitySectionNav'
import EntityLastUpdated from '@/components/EntityLastUpdated'
import BandDiscographySection from '@/components/bands/BandDiscographySection'
import BandFeaturePhoto from '@/components/BandFeaturePhoto'
import MusicalRepertoiresSection from '@/components/MusicalRepertoiresSection'
import ContextAgendaSection from '@/components/ContextAgendaSection'
import HiloMovementsSection from '@/components/HiloMovementsSection'
import HistoricalAccompanimentsRail from './HistoricalAccompanimentsRail'
import { getBandBySlug as getBandBySlugUncached, youtubeEmbedUrl } from '@/lib/supabase/bands'
import { getBandDiscography } from '@/lib/supabase/bandDiscography'
import { getPublishedBandColors } from '@/lib/supabase/bandColors'
import { getBandOutingPublicLinks } from '@/lib/supabase/band-outing-links'
import { getConcertEventDirectory } from '@/lib/supabase/public-directory-cache'
import { getMusicalRepertoires } from '@/lib/supabase/musical-repertoires'
import {
  meetsPublicEditorialMinimum,
  publicEditorialRobots,
  publicText,
} from '@/lib/supabase/public-entity-page'
import {
  absoluteUrl,
  breadcrumbJsonLd,
  compactSeoTitle,
  schemaDate,
  seoDescription,
  socialMetadata,
} from '@/lib/seo'
import { resolveBandPageTheme } from '@/lib/bands/theme'
import { bandSeoIdentity } from '@/lib/bands/seo'
import { buildBandUpcomingAgenda } from '@/lib/band-agenda'
import { agendaMunicipalityHref } from '@/lib/agenda-relations'
import {
  groupGloryAccompaniments,
  partitionAccompanimentsBySeason,
  presentAccompanimentLocation,
  presentAccompanimentMoment,
  presentAccompanimentStep,
  sortGloryAccompaniments,
  sortHolyWeekAccompaniments,
  splitCurrentAccompaniments,
  summarizeGloryTypes,
  withoutInternalNotes,
} from '@/lib/bands/accompaniments'
import styles from '../bandas.module.css'

export const revalidate = 900

const getBandBySlug = cache(getBandBySlugUncached)

function dateLabel(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' }).format(new Date(`${value}T12:00:00`))
}

function yearRange(item) {
  if (item.yearFrom && item.yearTo) {
    return item.yearFrom === item.yearTo ? `Año ${item.yearFrom}` : `${item.yearFrom}–${item.yearTo}`
  }
  if (publicText(item.periodText)) return publicText(item.periodText)
  if (!item.yearFrom) return ''
  return `Desde ${item.yearFrom}`
}

function groupContributions(items = []) {
  return items.reduce((groups, item) => {
    const type = publicText(item.interventionType) || 'Intervención'
    const year = publicText(item.year)
    const key = [type, year].filter(Boolean).join(' · ')
    const group = groups.find((entry) => entry.key === key)
    if (group) group.items.push(item)
    else groups.push({ key, type, year, items: [item] })
    return groups
  }, [])
}

function creditedName(item) {
  return [item.name, ...(item.aliases || [])].join(' · ')
}

function accompanimentHeaderLabel(item) {
  const label = publicText(presentAccompanimentMoment(item))
  const normalized = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  if (normalized === 'estacion de penitencia') return 'Semana Santa'
  if (normalized === 'procesion de gloria') return 'Gloria'
  if (normalized === 'procesion eucaristica') return 'Eucarística'
  if (normalized === 'procesion extraordinaria') return 'Extraordinaria'
  if (normalized === 'procesion penitencial') return 'Penitencial'
  return label || 'Acompañamiento'
}

function isLinkedBrotherhood(item, band) {
  if (!band.linkedBrotherhood && !band.linkedBrotherhoodSlug) return false
  if (band.linkedBrotherhoodSlug && item.brotherhoodSlug) return item.brotherhoodSlug === band.linkedBrotherhoodSlug
  return item.brotherhoodName === band.linkedBrotherhood
}

function linkedBrotherhoodLabel(band) {
  return band.linkedBrotherhoodRelationType === 'associated_with_brotherhood'
    ? 'Hermandad asociada'
    : 'Vínculo institucional'
}

function AccompanimentCard({ item, band, showLocation = false }) {
  const linked = isLinkedBrotherhood(item, band)
  const step = presentAccompanimentStep(item)
  const hasStepDetail = step.type || step.name || step.position
  const period = yearRange(item)
  const location = publicText(presentAccompanimentLocation(item))

  return (
    <article className={`${styles.relationshipCard} ${showLocation ? styles.locatedRelationshipCard : ''}`}>
      <div className={styles.relationshipTop}>
        <span>{accompanimentHeaderLabel(item)}</span>
        {period ? <strong>{period}</strong> : null}
      </div>
      {showLocation && location ? <div className={styles.relationshipLocation}>
        <strong>{location}</strong>
      </div> : null}
      <div className={styles.relationshipIdentity}>
        {linked ? <span className={styles.relationshipBond}>{linkedBrotherhoodLabel(band)}</span> : null}
        <h3>{item.brotherhoodName}</h3>
      </div>
      {hasStepDetail ? <div className={styles.relationshipStep}>
        {step.type ? <span className={styles.relationshipStepType}>{step.type}</span> : null}
        {step.name ? (
          item.stepPageReady && item.stepSlug
            ? <Link href={`/pasos/${item.stepSlug}`}>{step.name} <b aria-hidden="true">→</b></Link>
            : <strong>{step.name}</strong>
        ) : null}
        {step.position ? <small className={styles.relationshipStepPosition}>{step.position}</small> : null}
      </div> : null}
      {publicText(item.notes) && !linked ? <p className={styles.relationshipNote}>{publicText(item.notes)}</p> : null}
      {item.brotherhoodSlug && item.brotherhoodPageReady ? <div className={styles.relationshipLinks}>
        <Link href={`/hermandades/${item.brotherhoodSlug}`}>Ver ficha de la hermandad <span>→</span></Link>
      </div> : null}
    </article>
  )
}

function HistoricalIcon() {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <path d="M3.6 12a8.4 8.4 0 1 0 2.46-5.94L3.6 8.52" />
    <path d="M3.6 4.8v3.72h3.72M12 7.8V12l2.88 1.68" />
  </svg>
}

function CuriosityIcon() {
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <path d="M12 3.4c.48 3.2 2 4.72 5.2 5.2-3.2.48-4.72 2-5.2 5.2-.48-3.2-2-4.72-5.2-5.2 3.2-.48 4.72-2 5.2-5.2Z" />
    <path d="M18.2 14.7c.24 1.62 1 2.38 2.62 2.62-1.62.24-2.38 1-2.62 2.62-.24-1.62-1-2.38-2.62-2.62 1.62-.24 2.38-1 2.62-2.62ZM5.25 14.2c.18 1.2.75 1.77 1.95 1.95-1.2.18-1.77.75-1.95 1.95-.18-1.2-.75-1.77-1.95-1.95 1.2-.18 1.77-.75 1.95-1.95Z" />
  </svg>
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const band = await getBandBySlug(slug)
  if (!band) return {
    title: 'Banda no encontrada',
    robots: { index: false, follow: false },
  }
  const editoriallyReady = meetsPublicEditorialMinimum({
    identity: band.popularName || band.officialName,
    type: band.type,
    context: band.municipality,
    summary: band.summary,
    relations: [band.accompaniments, band.historicalAccompaniments, band.outings, band.premieres, band.heritage, band.direction],
    sources: band.sources || [],
    publicValues: band,
  })
  const title = compactSeoTitle(bandSeoIdentity(band), 58)
  const description = seoDescription(band.summary)
  const path = `/bandas/${slug}`
  return {
    title,
    description,
    robots: publicEditorialRobots(editoriallyReady),
    ...socialMetadata({
      title,
      description,
      path,
      images: band.heroImagePath ? [{ url: band.heroImagePath, alt: band.heroImageAlt }] : undefined,
    }),
  }
}

export default async function BandDetailPage({ params }) {
  const { slug } = await params
  const band = await getBandBySlug(slug)
  if (!band) notFound()
  const municipalityHubHref = band.province === 'Sevilla'
    ? agendaMunicipalityHref(band.municipality)
    : ''
  // Como en Hermandad: la localidad lleva al listado de bandas de esa localidad;
  // si no hay listado, a su guía cofrade.
  const municipalityBandsHref = band.municipalitySlug ? `/bandas/localidad/${band.municipalitySlug}` : ''
  const bandDescription = withoutInternalNotes(publicText(band.description))
  const artistSpotifyUrl = band.interestLinks.find((link) => link.platform === 'spotify')?.url || ''
  const [discography, colors, outingLinks, musicalRepertoires, concertEvents] = await Promise.all([
    getBandDiscography(band.id, {
      bandName: band.popularName || band.officialName,
      bandLogoPath: band.logoPath,
      artistSpotifyUrl,
    }),
    getPublishedBandColors(band.id),
    getBandOutingPublicLinks((band.upcomingOutings || band.outings || []).map((item) => item.id)),
    getMusicalRepertoires({ bandEntityId: band.id }),
    getConcertEventDirectory().catch((error) => {
      console.error('[Hilo Cofrade] Conciertos relacionados omitidos temporalmente en la ficha de Banda', { slug: band.slug, error })
      return []
    }),
  ])
  const upcomingAgendaItems = buildBandUpcomingAgenda({ band, outingLinks, concerts: concertEvents })
  const years = [...new Set(band.premieres.map((item) => item.year))].sort((a, b) => b - a)
  const currentYear = new Date().getFullYear()
  const seasonalAccompaniments = partitionAccompanimentsBySeason(
    band.accompaniments,
    band.historicalAccompaniments,
    currentYear
  )
  const accompanimentGroups = splitCurrentAccompaniments(seasonalAccompaniments.current)
  const upcomingAccompanimentGroups = splitCurrentAccompaniments(seasonalAccompaniments.upcoming || [])
  const orderedAccompaniments = sortHolyWeekAccompaniments(accompanimentGroups.holyWeek)
  const gloryAccompaniments = sortGloryAccompaniments(accompanimentGroups.glories)
  const upcomingAccompaniments = [
    ...sortHolyWeekAccompaniments(upcomingAccompanimentGroups.holyWeek),
    ...sortGloryAccompaniments(upcomingAccompanimentGroups.glories),
  ]
  const upcomingYears = [...new Set(upcomingAccompaniments.map((item) => item.yearFrom).filter(Boolean))].sort((a, b) => a - b)
  const nextAccompanimentYear = upcomingYears[0] || currentYear + 1
  const gloryGroups = groupGloryAccompaniments(gloryAccompaniments)
  const gloryTypeSummary = summarizeGloryTypes(gloryAccompaniments)
  const historicalAccompaniments = seasonalAccompaniments.historical.sort((a, b) => (b.yearTo || b.yearFrom || 0) - (a.yearTo || a.yearFrom || 0))
  const curiosities = band.curiosities || []
  const hasAccompaniments = orderedAccompaniments.length > 0
  const hasGloryAccompaniments = gloryAccompaniments.length > 0
  const hasUpcomingAccompaniments = upcomingAccompaniments.length > 0
  const hasHistoricalAccompaniments = historicalAccompaniments.length > 0
  const hasUpcomingAgenda = upcomingAgendaItems.length > 0
  const hasPremieres = band.premieres.length > 0
  const hasMusicalRepertoires = musicalRepertoires.length > 0
  const hasDiscography = discography.length > 0
  const hasDirection = band.direction.length > 0
  const banderin = band.heritage?.find((item) => item.type === 'Banderín') || null
  const primaryColor = colors.find((item) => item.role === 'primary')?.hexValue || band.primaryColor
  const secondaryColor = colors.find((item) => item.role === 'secondary')?.hexValue || band.secondaryColor
  const accentColor = colors.find((item) => item.role === 'accent')?.hexValue || primaryColor
  const bandTheme = resolveBandPageTheme({ primaryColor, secondaryColor, accentColor })
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': `${absoluteUrl(`/bandas/${band.slug}`)}#band`,
    name: band.officialName,
    alternateName: band.popularName,
    url: absoluteUrl(`/bandas/${band.slug}`),
    mainEntityOfPage: absoluteUrl(`/bandas/${band.slug}`),
    ...(publicText(band.summary) ? { description: publicText(band.summary) } : {}),
    foundingDate: schemaDate(publicText(band.foundation)),
    foundingLocation: publicText(band.municipality) || undefined,
    image: band.heroImagePath ? absoluteUrl(band.heroImagePath) : undefined,
    sameAs: band.interestLinks.map((link) => link.url),
  }

  return (
    <div
      className={`${styles.module} ${styles.bandPage}`}
      style={{
        '--band-primary': bandTheme.primary,
        '--band-secondary': bandTheme.deep,
        '--band-soft': bandTheme.soft,
        '--bc-red': bandTheme.accent,
        '--bc-blue': bandTheme.deep,
        '--bc-dark': bandTheme.deep,
        '--brotherhood-primary': bandTheme.primary,
        '--brotherhood-secondary': bandTheme.accent,
        '--brotherhood-dark': bandTheme.deep,
      }}
    >
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Bandas', path: '/bandas' },
        { name: band.popularName, path: `/bandas/${band.slug}` },
      ])} />
      <JsonLd data={jsonLd} />

      <RelationalEntityHero
        variant="band"
        entityType="Banda"
        editHref={panelEditHref('band', band.id)}
        title={band.popularName}
        subtitle={band.officialName}
        breadcrumbItems={[
          { label: 'Bandas', href: '/bandas' },
          { label: band.popularName },
        ]}
        relation={band.linkedBrotherhoodSlug ? {
          label: linkedBrotherhoodLabel(band),
          name: band.linkedBrotherhood,
          href: `/hermandades/${band.linkedBrotherhoodSlug}`,
        } : null}
        facts={[
          publicText(band.type) ? { label: 'Formación', value: publicText(band.type), href: band.typeSlug ? `/bandas/tipo/${band.typeSlug}` : undefined } : null,
          publicText(band.municipality) ? {
            label: 'Localidad',
            value: publicText(band.municipality),
            href: municipalityBandsHref || municipalityHubHref || undefined,
          } : null,
          publicText(band.foundation) ? { label: 'Fundación', value: publicText(band.foundation) } : null,
        ]}
        media={{
          crestSrc: band.logoPath,
          crestAlt: `Logotipo de ${band.popularName}`,
          initials: band.popularName.slice(0, 2).toUpperCase(),
        }}
      />

      <EntitySectionNav items={[
        { href: '#resumen', label: 'De un vistazo' },
        hasUpcomingAgenda && { href: '#agenda', label: 'Agenda' },
        banderin && { href: '#banderin', label: 'Banderín' },
        hasAccompaniments && { href: '#acompanamientos', label: 'Dónde suena' },
        hasUpcomingAccompaniments && { href: '#proximos-acompanamientos', label: 'Próximos' },
        hasGloryAccompaniments && { href: '#glorias', label: 'Glorias y eucarísticas' },
        hasHistoricalAccompaniments && { href: '#acompanamientos-historicos', label: 'Histórico' },
        hasPremieres && { href: '#repertorio', label: 'Música' },
        hasMusicalRepertoires && { href: '#crucetas-musicales', label: 'Crucetas' },
        hasDiscography && { href: '#discografia', label: 'Discografía' },
        hasDirection && { href: '#direccion', label: 'Dirección' },
        band.interestLinks.length > 0 && { href: '#enlaces-de-interes', label: 'Enlaces de interés' },
        band.sources?.length > 0 && { href: '#fuentes', label: 'Fuentes' },
      ]} />

      <section className={`${styles.contentSection} ${styles.overviewSection}`} id="resumen">
        <div className="shell">
          <div className={`${styles.overviewGrid} ${band.heroImagePath ? '' : styles.overviewGridSingle}`}>
            {band.heroImagePath ? <BandFeaturePhoto
              key={band.heroImagePath || band.logoPath || band.id}
              src={band.heroImagePath}
              alt={band.heroImageAlt}
              credit={band.heroImageCredit}
              name={band.popularName}
              logoPath={band.logoPath}
            /> : null}
            <div className={styles.overviewCopy}>
              <div className={styles.sectionHeading}>
                <h2>{band.popularName}, de un vistazo</h2>
                <EntityLastUpdated value={band.updatedAt} />
              </div>
              {bandDescription ? <p>{bandDescription}</p> : null}
              {publicText(band.headquarters) && band.headquarters !== band.municipality ? (
                <p className={styles.overviewFact}><span>Sede y local de ensayo</span> {band.headquarters}</p>
              ) : null}
              {municipalityHubHref ? (
                <nav className={styles.exploreLinks} aria-label="Seguir explorando">
                  <Link href={municipalityHubHref}>Guía cofrade de {band.municipality} →</Link>
                </nav>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <HiloMovementsSection entityId={band.id} entityName={band.popularName} />

      <ContextAgendaSection
        id="agenda"
        eyebrow="Agenda de la Banda"
        title="Próximas actuaciones"
        items={upcomingAgendaItems}
        maxItems={upcomingAgendaItems.length}
        links={[
          { href: '/agenda-cofrade', label: 'Agenda Cofrade' },
          { href: '/procesiones-de-gloria', label: 'Glorias' },
          { href: '/extraordinarias', label: 'Extraordinarias' },
        ]}
      />


      {banderin ? <section className={`${styles.contentSection} ${styles.heritageSection}`} id="banderin">
        <div className="shell">
            <article className={styles.heritageFeature}>
              {banderin.imagePath ? (
                <figure className={styles.heritagePhoto}>
                  <div><Image src={banderin.imagePath} alt={banderin.imageAlt || banderin.name} fill sizes="(max-width: 900px) calc(100vw - 32px), 42vw" /></div>
                  {banderin.imageCredit ? <figcaption>{banderin.imageCredit}</figcaption> : null}
                </figure>
              ) : null}
              <div className={styles.heritageCopy}>
                <div className={styles.sectionHeading}>
                  <span className={styles.eyebrow}>Banderín</span>
                  <h2>El banderín</h2>
                  {banderin.description ? <p>{banderin.description}</p> : null}
                </div>
                <div className={styles.heritageTimeline}>
                  {groupContributions(banderin.contributions).map((group) => (
                    <section key={group.key}>
                      <div className={styles.heritageMoment}>
                        <span>{group.type}</span>
                        <strong>{group.year}</strong>
                      </div>
                      <div className={styles.heritageCredits}>
                        {group.items.map((item) => (
                          <div key={item.id}>
                            <span>{item.discipline}</span>
                            <strong>{creditedName(item)}</strong>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </article>
        </div>
      </section> : null}

      {hasAccompaniments ? <section className={`${styles.contentSection} ${styles.softSection}`} id="acompanamientos">
        <div className="shell">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Dónde suena · Semana Santa · {currentYear}</span>
            <h2>Acompañamientos musicales</h2>
          </div>
          <div className={styles.relationshipGrid}>{orderedAccompaniments.map((item) => (
            <AccompanimentCard item={item} band={band} key={item.id} showLocation />
          ))}</div>
        </div>
      </section> : null}

      {hasUpcomingAccompaniments ? <section className={styles.contentSection} id="proximos-acompanamientos">
        <div className="shell">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Dónde suena · Próximas vinculaciones · {nextAccompanimentYear}</span>
            <h2>Próximos acompañamientos</h2>
          </div>
          <div className={styles.relationshipGrid}>{upcomingAccompaniments.map((item) => (
            <AccompanimentCard item={item} band={band} key={item.id} showLocation />
          ))}</div>
        </div>
      </section> : null}

      {hasGloryAccompaniments ? <section className={styles.contentSection} id="glorias">
        <div className="shell">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Dónde suena · Sevilla y provincia</span>
            <h2>Glorias, eucarísticas y cultos externos</h2>
          </div>
          {/* Con un solo acompañamiento, el resumen por tipos repetiría la cabecera de la tarjeta. */}
          {gloryAccompaniments.length > 1 ? <div className={styles.gloryTypeSummary} aria-label="Tipos de procesiones documentadas">
            {gloryTypeSummary.map((item) => <article key={item.type}>
              <strong>{item.count}</strong>
              <span>{item.count === 1 ? item.type : item.label}</span>
            </article>)}
          </div> : null}
          <div className={styles.gloryGroups}>
            {gloryGroups.map((group) => group.items.length === 1 ? (
              // Un único acompañamiento: sin capa de grupo; la tarjeta ya indica la localidad.
              <div className={`${styles.relationshipGrid} ${styles.gloryRelationshipGrid}`} key={group.key}>
                <AccompanimentCard item={group.items[0]} band={band} showLocation />
              </div>
            ) : <section className={styles.gloryGroup} key={group.key}>
              <header className={styles.gloryGroupHeading}>
                <div>
                  <h3>{group.label}</h3>
                  <p>{group.detail}</p>
                </div>
                <strong aria-label={`${group.items.length} acompañamientos`}>{group.items.length}</strong>
              </header>
              <div className={`${styles.relationshipGrid} ${styles.gloryRelationshipGrid}`}>
                {group.items.map((item) => (
                  <AccompanimentCard item={item} band={band} key={item.id} showLocation />
                ))}
              </div>
            </section>)}
          </div>
        </div>
      </section> : null}

      {hasHistoricalAccompaniments ? <section className={`${styles.contentSection} ${styles.historicalSection}`} id="acompanamientos-historicos">
        <div className="shell">
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Memoria musical</span>
            <h2>Acompañamientos históricos</h2>
          </div>
          <div className={styles.historicalLayout}>
            <HistoricalAccompanimentsRail count={historicalAccompaniments.length}>
              {historicalAccompaniments.map((item) => {
                const step = presentAccompanimentStep(item)
                const location = publicText(presentAccompanimentLocation(item))
                const stepIdentity = step.name || item.position || 'Acompañamiento musical'
                const stepContext = step.position && step.position !== stepIdentity ? step.position : ''
                return <article className={styles.historicalCard} key={item.id}>
                  <div className={styles.historicalPeriod}>
                    <span className={styles.historicalIcon}><HistoricalIcon /></span>
                    <strong>{yearRange(item)}</strong>
                  </div>
                  <div className={styles.historicalCopy}>
                    <div className={styles.historicalMeta}>
                      {publicText(item.outingType) ? <span>{accompanimentHeaderLabel(item)}</span> : null}
                      {location ? <small>{location}</small> : null}
                    </div>
                    <h3>{item.brotherhoodName}</h3>
                    <div className={styles.historicalStep}>
                      {step.type ? <strong>{step.type}</strong> : null}
                      <span>{stepIdentity}</span>
                      {stepContext ? <small>{stepContext}</small> : null}
                    </div>
                    {item.notes ? <small>{item.notes}</small> : null}
                    {item.brotherhoodSlug && item.brotherhoodPageReady
                      ? <Link href={`/hermandades/${item.brotherhoodSlug}`}>Ver ficha de la hermandad <span>→</span></Link>
                      : null}
                  </div>
                </article>
              })}
            </HistoricalAccompanimentsRail>
            {curiosities.length ? <div className={styles.curiosityStack}>
              {curiosities.map((item) => (
                <aside className={styles.curiosityCard} key={item.id}>
                  <div className={styles.curiosityLabel}>
                    <span className={styles.curiosityIcon}><CuriosityIcon /></span>
                    <span>{item.title || '¿Sabías que…?'}</span>
                  </div>
                  <p>{item.body || item.summary}</p>
                </aside>
              ))}
            </div> : null}
          </div>
        </div>
      </section> : null}

      {hasPremieres ? <section className={`${styles.contentSection} ${styles.premiereSection}`} id="repertorio">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Conoce su música</span><h2>Estrenos y novedades</h2></div>
          {years.map((year) => (
            <details className={styles.premiereYear} key={year} open={year === currentYear}>
              <summary className={styles.premiereYearHeading}><h3>{year}</h3><span>{band.premieres.filter((item) => item.year === year).length} {band.premieres.filter((item) => item.year === year).length === 1 ? 'novedad' : 'novedades'}</span><b aria-hidden="true">＋</b></summary>
              <div className={styles.premiereGrid}>{band.premieres.filter((item) => item.year === year).map((item) => {
                const embed = youtubeEmbedUrl(item.videoUrl)
                return (
                  <article className={styles.premiereCard} key={item.id}>
                    {embed ? <div className={styles.videoWrap}><iframe src={embed} title={`${item.title}, de ${item.composerName}`} loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div> : null}
                    <div className={styles.premiereCopy}>
                      <span>{item.type || 'Novedad musical'}</span>
                      <h4>{item.title}</h4>
                      {item.credits?.length ? (
                        <div className={styles.premiereCredits}>
                          {item.credits.map((credit) => <div key={`${credit.id}-${credit.role}`}><span>{credit.label}</span><strong>{credit.name}</strong></div>)}
                        </div>
                      ) : <strong>{item.composerName}</strong>}
                      {item.date || item.venue || item.municipality ? <p>{[dateLabel(item.date), item.venue, item.municipality].filter(Boolean).join(' · ')}</p> : null}
                      {item.description ? <p>{item.description}</p> : null}
                    </div>
                  </article>
                )
              })}</div>
            </details>
          ))}
        </div>
      </section> : null}

      <MusicalRepertoiresSection items={musicalRepertoires} context="band" />

      <BandDiscographySection releases={discography} />

      {hasDirection ? <section className={`${styles.contentSection} ${styles.softSection}`} id="direccion">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Organización</span><h2>Dirección actual</h2></div>
          <div className={styles.directionGrid}>{band.direction.map((item) => <article key={item.id}><span>{item.role}</span><h3>{item.name}</h3>{item.notes ? <p>{item.notes}</p> : null}</article>)}</div>
        </div>
      </section> : null}

      <OfficialLinks links={band.interestLinks} />
      <SourcesBlock sources={band.sources} />
    </div>
  )
}
