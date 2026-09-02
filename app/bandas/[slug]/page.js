import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import SourcesBlock from '@/components/SourcesBlock'
import OfficialLinks from '@/components/OfficialLinks'
import RelationalThread from '@/components/RelationalThread'
import RelationalEntityHero from '@/components/RelationalEntityHero'
import EntitySectionNav from '@/components/EntitySectionNav'
import BandDiscographySection from '@/components/bands/BandDiscographySection'
import BandFeaturePhoto from '@/components/BandFeaturePhoto'
import HistoricalAccompanimentsRail from './HistoricalAccompanimentsRail'
import { getBandBySlug, youtubeEmbedUrl } from '@/lib/supabase/bands'
import { getBandDiscography } from '@/lib/supabase/bandDiscography'
import { getPublishedBandColors } from '@/lib/supabase/bandColors'
import {
  meetsPublicEditorialMinimum,
  publicEditorialRobots,
  publicText,
} from '@/lib/supabase/public-entity-page'
import { absoluteUrl, breadcrumbJsonLd } from '@/lib/seo'
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
} from '@/lib/bands/accompaniments'
import styles from '../bandas.module.css'

export const dynamic = 'force-dynamic'

function dateLabel(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' }).format(new Date(`${value}T12:00:00`))
}

function timeLabel(value) {
  return value ? value.slice(0, 5) : ''
}

function eventDate(value) {
  if (!value) return { day: '', month: '', year: '' }
  const date = new Date(`${value}T12:00:00`)
  return {
    day: new Intl.DateTimeFormat('es-ES', { day: '2-digit', timeZone: 'Europe/Madrid' }).format(date),
    month: new Intl.DateTimeFormat('es-ES', { month: 'short', timeZone: 'Europe/Madrid' }).format(date).replace('.', ''),
    year: new Intl.DateTimeFormat('es-ES', { year: 'numeric', timeZone: 'Europe/Madrid' }).format(date),
  }
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

function AccompanimentCard({ item, band, showLocation = false }) {
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
      {publicText(item.notes) && item.brotherhoodName !== band.linkedBrotherhood ? <p className={styles.relationshipNote}>{publicText(item.notes)}</p> : null}
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
  return {
    title: band.popularName,
    description: band.summary,
    alternates: { canonical: `/bandas/${slug}` },
    robots: publicEditorialRobots(editoriallyReady),
    openGraph: {
      title: band.popularName,
      description: band.summary,
      url: `/bandas/${slug}`,
      images: band.heroImagePath ? [{ url: band.heroImagePath, alt: band.heroImageAlt }] : undefined,
    },
  }
}

export default async function BandDetailPage({ params }) {
  const { slug } = await params
  const band = await getBandBySlug(slug)
  if (!band) notFound()
  const [discography, colors] = await Promise.all([
    getBandDiscography(band.id),
    getPublishedBandColors(band.id),
  ])
  const years = [...new Set(band.premieres.map((item) => item.year))].sort((a, b) => b - a)
  const currentYear = new Date().getFullYear()
  const currentPremieres = band.premieres.filter((item) => item.year === currentYear)
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
  const hasOutings = band.outings.length > 0
  const hasPremieres = band.premieres.length > 0
  const hasDiscography = discography.length > 0
  const hasDirection = band.direction.length > 0
  const banderin = band.heritage?.find((item) => item.type === 'Banderín') || null
  const accentColor = colors.find((item) => item.role === 'accent')?.hexValue || band.primaryColor
  const currentRelations = [...orderedAccompaniments, ...gloryAccompaniments, ...upcomingAccompaniments]
  const bandThreadItems = [
    ...(band.linkedBrotherhoodSlug ? [{
      kind: 'Hermandad',
      relation: band.linkedBrotherhoodRelationType === 'associated_with_brotherhood' ? 'Hermandad asociada' : 'Vínculo institucional',
      title: band.linkedBrotherhood,
      href: `/hermandades/${band.linkedBrotherhoodSlug}`,
      context: 'Relación institucional de la formación',
    }] : []),
    ...currentRelations.flatMap((item) => [
      ...(item.stepPageReady && item.stepSlug && item.stepName ? [{
        kind: 'Paso',
        relation: item.position || 'Acompañamiento',
        title: item.stepName,
        href: `/pasos/${item.stepSlug}`,
        context: [item.brotherhoodName, item.outingType, yearRange(item)].filter(Boolean).join(' · '),
      }] : []),
      ...(item.brotherhoodPageReady && item.brotherhoodSlug ? [{
        kind: 'Hermandad',
        relation: item.outingType || 'Acompañamiento',
        title: item.brotherhoodName,
        href: `/hermandades/${item.brotherhoodSlug}`,
        context: [item.municipality, yearRange(item)].filter(Boolean).join(' · '),
      }] : []),
    ]),
  ]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': `${absoluteUrl(`/bandas/${band.slug}`)}#band`,
    name: band.officialName,
    alternateName: band.popularName,
    url: absoluteUrl(`/bandas/${band.slug}`),
    ...(publicText(band.summary) ? { description: publicText(band.summary) } : {}),
    foundingDate: publicText(band.foundation) || undefined,
    foundingLocation: publicText(band.municipality) || undefined,
    image: band.heroImagePath ? absoluteUrl(band.heroImagePath) : undefined,
    sameAs: band.interestLinks.map((link) => link.url),
  }

  return (
    <div
      className={`${styles.module} ${styles.bandPage}`}
      style={{
        '--band-primary': band.primaryColor,
        '--band-secondary': band.secondaryColor,
        '--bc-red': accentColor,
        '--bc-blue': band.secondaryColor,
        '--bc-dark': band.secondaryColor,
        '--brotherhood-primary': band.primaryColor,
        '--brotherhood-secondary': accentColor,
        '--brotherhood-dark': band.secondaryColor,
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
        title={band.popularName}
        subtitle={band.officialName}
        breadcrumbItems={[
          { label: 'Bandas', href: '/bandas' },
          { label: band.popularName },
        ]}
        badges={[publicText(band.type), publicText(band.municipality)].filter(Boolean)}
        relation={band.linkedBrotherhoodSlug ? {
          label: band.linkedBrotherhoodRelationType === 'associated_with_brotherhood'
            ? 'Hermandad asociada'
            : 'Vínculo institucional',
          name: band.linkedBrotherhood,
          href: `/hermandades/${band.linkedBrotherhoodSlug}`,
        } : null}
        facts={[
          publicText(band.type) ? { label: 'Formación', value: publicText(band.type) } : null,
          publicText(band.municipality) ? { label: 'Localidad', value: publicText(band.municipality) } : null,
          publicText(band.foundation) ? { label: 'Fundación', value: publicText(band.foundation) } : null,
        ]}
        media={{
          crestSrc: band.logoPath,
          crestAlt: `Logotipo de ${band.popularName}`,
          initials: band.popularName.slice(0, 2).toUpperCase(),
          logoBackgroundColor: band.logoBackgroundColor,
        }}
      />

      <EntitySectionNav items={[
        { href: '#resumen', label: 'De un vistazo' },
        bandThreadItems.length > 0 && { href: '#tira-del-hilo', label: 'Tira del hilo' },
        banderin && { href: '#banderin', label: 'Banderín' },
        hasAccompaniments && { href: '#acompanamientos', label: 'Dónde suena' },
        hasUpcomingAccompaniments && { href: '#proximos-acompanamientos', label: 'Próximos' },
        hasGloryAccompaniments && { href: '#glorias', label: 'Glorias y eucarísticas' },
        hasHistoricalAccompaniments && { href: '#acompanamientos-historicos', label: 'Histórico' },
        hasOutings && { href: '#extraordinarias', label: 'Extraordinarias' },
        hasPremieres && { href: '#repertorio', label: 'Música' },
        hasDiscography && { href: '#discografia', label: 'Discografía' },
        hasDirection && { href: '#direccion', label: 'Dirección' },
        band.interestLinks.length > 0 && { href: '#enlaces-de-interes', label: 'Enlaces de interés' },
        band.sources?.length > 0 && { href: '#fuentes', label: 'Fuentes' },
      ]} />

      <section className={`${styles.contentSection} ${styles.overviewSection}`} id="resumen">
        <div className="shell">
          <div className={styles.overviewGrid} style={!band.heroImagePath ? { gridTemplateColumns: '1fr' } : undefined}>
            {band.heroImagePath ? (
              <BandFeaturePhoto
                key={band.heroImagePath}
                src={band.heroImagePath}
                alt={band.heroImageAlt}
                credit={band.heroImageCredit}
                name={band.popularName}
                logoPath={band.logoPath}
              />
            ) : null}
            <div className={styles.overviewCopy}>
              <div className={styles.sectionHeading}>
                <h2>{band.popularName}, de un vistazo</h2>
              </div>
              <div className={styles.roleGrid}>
                {publicText(band.type) ? <article>
                  <span>Formación</span>
                  <strong>{publicText(band.type)}</strong>
                  <Link href={`/bandas?tipo=${band.typeSlug}`}>Bandas de esta formación →</Link>
                </article> : null}
                {publicText(band.municipality) ? <article>
                  <span>Localidad</span>
                  <strong>{publicText(band.municipality)}</strong>
                  {band.municipalitySlug ? <Link href={`/bandas?localidad=${band.municipalitySlug}`}>Bandas de {band.municipality} →</Link> : null}
                </article> : null}
                {band.linkedBrotherhood ? <article>
                  <span>{band.linkedBrotherhoodRelationType === 'associated_with_brotherhood' ? 'Hermandad asociada' : 'Hermandad'}</span>
                  <strong>{band.linkedBrotherhood}</strong>
                  {band.linkedBrotherhoodSlug ? <Link href={`/hermandades/${band.linkedBrotherhoodSlug}`}>Ver ficha de la hermandad →</Link> : null}
                </article> : null}
                {(publicText(band.foundation) || publicText(band.headquarters)) ? <article className={styles.trajectoryCard}>
                  <span>Trayectoria</span>
                  {publicText(band.foundation) ? <strong>Fundación: {publicText(band.foundation)}</strong> : null}
                  {publicText(band.headquarters) && band.headquarters !== band.municipality ? (
                    <div className={styles.trajectoryLocation}>
                      <span>Sede / local de ensayo</span>
                      <strong>{band.headquarters}</strong>
                    </div>
                  ) : null}
                </article> : null}
              </div>
              {(hasAccompaniments || hasGloryAccompaniments || currentPremieres.length || band.outings.length) ? (
                <div className={styles.impactPanel}>
                  <div className={styles.impactHeading}>
                    <span>En cifras</span>
                    <strong>{currentYear}</strong>
                  </div>
                  <div className={styles.impactMetrics}>
                    {hasAccompaniments ? <a href="#acompanamientos"><strong>{orderedAccompaniments.length}</strong><span>{orderedAccompaniments.length === 1 ? 'contrato de Semana Santa' : 'contratos de Semana Santa'}</span></a> : null}
                    {hasGloryAccompaniments ? <a href="#glorias"><strong>{gloryAccompaniments.length}</strong><span>{gloryAccompaniments.length === 1 ? 'contrato de Gloria o culto externo' : 'contratos de Glorias y cultos externos'}</span></a> : null}
                    {currentPremieres.length ? <a href="#repertorio"><strong>{currentPremieres.length}</strong><span>{currentPremieres.length === 1 ? `novedad musical en ${currentYear}` : `novedades musicales en ${currentYear}`}</span></a> : null}
                    {band.outings.length ? <a href="#extraordinarias"><strong>{band.outings.length}</strong><span>{band.outings.length === 1 ? 'salida extraordinaria' : 'salidas extraordinarias'}</span></a> : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <RelationalThread
        currentLabel="Banda"
        currentName={band.popularName}
        currentMeta={[band.type, band.municipality].filter(Boolean).join(' · ')}
        items={bandThreadItems}
        title="De la banda al paso y a la Hermandad"
        description="Prioriza los vínculos institucionales y los acompañamientos vigentes para que una formación musical no sea un destino aislado, sino una puerta de entrada al resto de la enciclopedia."
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
            <p>Acompañamientos procesionales, ordenados por jornada y con su localidad exacta.</p>
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
            <p>Acuerdos ya anunciados para próximas salidas procesionales, separados de los acompañamientos vigentes de {currentYear}.</p>
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
            <p>Acompañamientos documentados para {currentYear}, organizados por ámbito y naturaleza de la salida.</p>
          </div>
          <div className={styles.gloryTypeSummary} aria-label="Tipos de procesiones documentadas">
            {gloryTypeSummary.map((item) => <article key={item.type}>
              <strong>{item.count}</strong>
              <span>{item.label}</span>
            </article>)}
          </div>
          <div className={styles.gloryGroups}>
            {gloryGroups.map((group) => <section className={styles.gloryGroup} key={group.key}>
              <header className={styles.gloryGroupHeading}>
                <div>
                  <span>Ámbito</span>
                  <h3>{group.label}</h3>
                  <p>{group.detail}</p>
                </div>
                <strong>{group.items.length}</strong>
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
            <p>Un recorrido por las hermandades y los pasos que forman parte de su trayectoria.</p>
          </div>
          <div className={styles.historicalLayout}>
            <HistoricalAccompanimentsRail count={historicalAccompaniments.length}>
              {historicalAccompaniments.map((item) => {
                const step = presentAccompanimentStep(item)
                const location = publicText(presentAccompanimentLocation(item))
                return <article className={styles.historicalCard} key={item.id}>
                  <div className={styles.historicalPeriod}>
                    <span className={styles.historicalIcon}><HistoricalIcon /></span>
                    <span>Periodo histórico</span>
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
                      <span>{step.name || item.position || 'Acompañamiento musical'}</span>
                      {step.position ? <small>{step.position}</small> : null}
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

      {hasOutings ? <section className={styles.contentSection} id="extraordinarias">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Agenda</span><h2>Próximas salidas extraordinarias</h2></div>
          <div className={styles.outingList}>{band.outings.map((item) => {
            const event = eventDate(item.date)
            return (
              <article key={item.id}>
                <time dateTime={item.date} aria-label={dateLabel(item.date)}>
                  <span>{event.month}</span>
                  <strong>{event.day}</strong>
                  <small>{event.year}</small>
                  {timeLabel(item.time) ? <em>{timeLabel(item.time)} h</em> : null}
                </time>
                <div className={styles.outingCopy}>
                  <div className={styles.outingMeta}><span>{item.type}</span>{item.municipality ? <strong>{item.municipality}</strong> : null}</div>
                  <h3>{item.title}</h3>
                  {item.organizerName ? <p className={styles.outingOrganizer}>{item.organizerName}</p> : null}
                  {item.reason ? <p className={styles.outingReason}>{item.reason}</p> : null}
                  {item.position ? <small>{item.position}</small> : null}
                </div>
              </article>
            )
          })}</div>
        </div>
      </section> : null}

      {hasPremieres ? <section className={`${styles.contentSection} ${styles.premiereSection}`} id="repertorio">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Conoce su música</span><h2>Estrenos y novedades</h2><p>Obras nuevas, adaptaciones e incorporaciones al repertorio, identificadas según su naturaleza documental.</p></div>
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
