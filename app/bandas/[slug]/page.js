import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import SourcesBlock from '@/components/SourcesBlock'
import { getBandBySlug, youtubeEmbedUrl } from '@/lib/supabase/bands'
import { absoluteUrl } from '@/lib/seo'
import styles from '../bandas.module.css'

export const dynamic = 'force-dynamic'

const OUTING_ORDER = [
  'Viernes de Dolores',
  'Sábado de Pasión',
  'Domingo de Ramos',
  'Lunes Santo',
  'Martes Santo',
  'Miércoles Santo',
  'Jueves Santo',
  'Madrugada',
  'Viernes Santo',
  'Sábado Santo',
  'Domingo de Resurrección',
]

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
  if (!item.yearFrom) return 'Periodo por documentar'
  return item.yearTo ? `${item.yearFrom}–${item.yearTo}` : `Desde ${item.yearFrom}`
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const band = await getBandBySlug(slug)
  if (!band) return {}
  return {
    title: band.popularName,
    description: band.summary,
    alternates: { canonical: `/bandas/${slug}` },
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
  const years = [...new Set(band.premieres.map((item) => item.year))].sort((a, b) => b - a)
  const currentYear = new Date().getFullYear()
  const currentPremieres = band.premieres.filter((item) => item.year === currentYear)
  const orderedAccompaniments = [...band.accompaniments].sort((a, b) => {
    const aIndex = OUTING_ORDER.indexOf(a.outingType)
    const bIndex = OUTING_ORDER.indexOf(b.outingType)
    return (aIndex === -1 ? OUTING_ORDER.length : aIndex) - (bIndex === -1 ? OUTING_ORDER.length : bIndex)
  })
  const hasAccompaniments = band.accompaniments.length > 0
  const hasOutings = band.outings.length > 0
  const hasPremieres = band.premieres.length > 0
  const hasDirection = band.direction.length > 0
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': `${absoluteUrl(`/bandas/${band.slug}`)}#band`,
    name: band.officialName,
    alternateName: band.popularName,
    url: absoluteUrl(`/bandas/${band.slug}`),
    description: band.summary,
    foundingDate: band.foundation || undefined,
    foundingLocation: band.municipality || undefined,
    image: band.heroImagePath ? absoluteUrl(band.heroImagePath) : undefined,
  }

  return (
    <main
      className={`${styles.module} ${styles.bandPage}`}
      style={{
        '--band-primary': band.primaryColor,
        '--band-secondary': band.secondaryColor,
        '--bc-red': band.primaryColor,
        '--bc-blue': band.secondaryColor,
        '--bc-dark': band.secondaryColor,
      }}
    >
      <JsonLd data={jsonLd} />
      <section className={styles.bandHero}>
        <div className={`shell ${styles.heroShell}`}>
          <nav className={`brotherhood-breadcrumb ${styles.bandBreadcrumb}`} aria-label="Migas de pan">
            <span className="breadcrumb-accent" />
            <Link href="/bandas">Bandas</Link>
            <span className="breadcrumb-arrow">→</span>
            <strong>{band.popularName}</strong>
          </nav>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>Ficha de banda</span>
              <h1>{band.popularName}</h1>
              <p className={styles.officialName}>{band.officialName}</p>
              <div className={styles.heroLinks}>
                {band.websiteUrl ? <a href={band.websiteUrl} target="_blank" rel="noreferrer">Web oficial ↗</a> : null}
                {band.instagramUrl ? <a href={band.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a> : null}
              </div>
            </div>
            <div className={styles.identityBlock}>
              {band.logoPath ? <Image src={band.logoPath} alt={`Logotipo de ${band.popularName}`} width={150} height={225} priority sizes="150px" /> : <strong>{band.popularName.slice(0, 2).toUpperCase()}</strong>}
            </div>
          </div>
        </div>
      </section>

      <nav className={`section-nav brotherhood-nav ${styles.sectionNav}`} aria-label="Secciones de la ficha">
        <div className="shell brotherhood-nav-shell">
          <span className={`brotherhood-nav-label ${styles.navLabel}`}>Explorar ficha</span>
          <div className={`brotherhood-nav-list nav-scroll ${styles.navList}`}>
            <a href="#resumen">De un vistazo</a>
            {hasAccompaniments ? <a href="#acompanamientos">Acompañamientos</a> : null}
            {hasOutings ? <a href="#extraordinarias">Extraordinarias</a> : null}
            {hasPremieres ? <a href="#estrenos">Estrenos</a> : null}
            {hasDirection ? <a href="#direccion">Dirección</a> : null}
            {band.sources?.length ? <a href="#fuentes">Fuentes</a> : null}
          </div>
        </div>
      </nav>

      <section className={`${styles.contentSection} ${styles.overviewSection}`} id="resumen">
        <div className="shell">
          <div className={styles.overviewGrid}>
            {band.heroImagePath ? (
              <figure className={styles.featurePhoto}>
                <div><Image src={band.heroImagePath} alt={band.heroImageAlt || `Fotografía de ${band.popularName}`} fill sizes="(max-width: 900px) calc(100vw - 32px), 52vw" /></div>
                <figcaption>
                  <span>Identidad sonora</span>
                  <strong>{band.type}</strong>
                  {band.heroImageCredit ? <small>{band.heroImageCredit}</small> : null}
                </figcaption>
              </figure>
            ) : null}
            <div className={styles.overviewCopy}>
              <div className={styles.sectionHeading}>
                <span className={styles.eyebrow}>De un vistazo</span>
                <h2>Las claves para entender su lugar</h2>
              </div>
              <div className={styles.roleGrid}>
                <article>
                  <span>Qué es</span>
                  <strong>{band.type}</strong>
                  <Link href={`/bandas?tipo=${band.typeSlug}`}>Bandas de esta formación →</Link>
                </article>
                <article>
                  <span>De dónde</span>
                  <strong>{band.municipality}</strong>
                  {band.municipalitySlug ? <Link href={`/bandas?localidad=${band.municipalitySlug}`}>Bandas de {band.municipality} →</Link> : null}
                </article>
                <article className={styles.roleCardWide}>
                  <span>Vínculo institucional</span>
                  <strong>{band.linkedBrotherhood || 'Por documentar'}</strong>
                  {band.linkedBrotherhoodSlug ? <Link href={`/hermandades/${band.linkedBrotherhoodSlug}`}>Abrir ficha relacionada →</Link> : <small>Relación documentada</small>}
                </article>
                <article className={styles.trajectoryCard}>
                  <span>Trayectoria</span>
                  <strong>{band.foundation ? `Desde ${band.foundation}` : 'Por documentar'}</strong>
                  {band.headquarters && band.headquarters !== band.municipality ? <small>{band.headquarters}</small> : null}
                </article>
              </div>
              {(band.accompaniments.length || currentPremieres.length || band.outings.length) ? (
                <div className={styles.impactPanel}>
                  <div className={styles.impactHeading}>
                    <span>Impacto documentado</span>
                    <strong>{currentYear}</strong>
                  </div>
                  <div className={styles.impactMetrics}>
                    {band.accompaniments.length ? <a href="#acompanamientos"><strong>{band.accompaniments.length}</strong><span>{band.accompaniments.length === 1 ? 'acompañamiento actual' : 'acompañamientos actuales'}</span></a> : null}
                    {currentPremieres.length ? <a href="#estrenos"><strong>{currentPremieres.length}</strong><span>{currentPremieres.length === 1 ? 'estreno musical' : 'estrenos musicales'}</span></a> : null}
                    {band.outings.length ? <a href="#extraordinarias"><strong>{band.outings.length}</strong><span>{band.outings.length === 1 ? 'próxima extraordinaria' : 'próximas extraordinarias'}</span></a> : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {hasAccompaniments ? <section className={`${styles.contentSection} ${styles.softSection}`} id="acompanamientos">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Su papel en el cortejo</span><h2>Acompañamientos actuales</h2><p>Hermandad, paso, posición y periodo: cada relación en su contexto.</p></div>
          <div className={styles.relationshipGrid}>{orderedAccompaniments.map((item) => (
            <article className={styles.relationshipCard} key={item.id}>
              <span>{item.outingType || 'Salida procesional'}</span>
              <h3>{item.brotherhoodName}</h3>
              {item.stepName ? <p><strong>{item.position}</strong>{item.stepName}</p> : <p><strong>{item.position}</strong></p>}
              <div className={styles.relationshipPeriod}><small>Vinculación</small><strong>{yearRange(item)}</strong></div>
              {item.notes ? <p className={styles.relationshipNote}>{item.notes}</p> : null}
              <div className={styles.relationshipLinks}>
                {item.brotherhoodSlug ? <Link href={`/hermandades/${item.brotherhoodSlug}`}>Ver hermandad →</Link> : null}
                {item.source?.url ? <a href={item.source.url} target="_blank" rel="noreferrer">Fuente oficial ↗</a> : null}
              </div>
            </article>
          ))}</div>
        </div>
      </section> : null}

      {hasOutings ? <section className={styles.contentSection} id="extraordinarias">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Agenda</span><h2>Donde volverá a sonar</h2><p>Próximas participaciones extraordinarias confirmadas.</p></div>
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

      {hasPremieres ? <section className={`${styles.contentSection} ${styles.premiereSection}`} id="estrenos">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Patrimonio musical</span><h2>La música que incorpora</h2><p>Cada estreno conserva su autoría, grabación y fuente.</p></div>
          {years.map((year) => (
            <div className={styles.premiereYear} key={year}>
              <div className={styles.premiereYearHeading}><h3>{year}</h3><span>{band.premieres.filter((item) => item.year === year).length} {band.premieres.filter((item) => item.year === year).length === 1 ? 'obra' : 'obras'}</span></div>
              <div className={styles.premiereGrid}>{band.premieres.filter((item) => item.year === year).map((item) => {
                const embed = youtubeEmbedUrl(item.videoUrl)
                return (
                  <article className={styles.premiereCard} key={item.id}>
                    {embed ? <div className={styles.videoWrap}><iframe src={embed} title={`${item.title}, de ${item.composerName}`} loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div> : null}
                    <div className={styles.premiereCopy}><span>Estreno · {item.year}</span><h4>{item.title}</h4><strong>{item.composerName}</strong>{item.date || item.venue || item.municipality ? <p>{[dateLabel(item.date), item.venue, item.municipality].filter(Boolean).join(' · ')}</p> : null}{item.description ? <p>{item.description}</p> : null}{item.source?.url ? <a href={item.source.url} target="_blank" rel="noreferrer">Fuente: {item.source.name} ↗</a> : null}</div>
                  </article>
                )
              })}</div>
            </div>
          ))}
        </div>
      </section> : null}

      {hasDirection ? <section className={`${styles.contentSection} ${styles.softSection}`} id="direccion">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Organización</span><h2>Dirección actual</h2></div>
          <div className={styles.directionGrid}>{band.direction.map((item) => <article key={item.id}><span>{item.role}</span><h3>{item.name}</h3>{item.notes ? <p>{item.notes}</p> : null}</article>)}</div>
        </div>
      </section> : null}

      <SourcesBlock sources={band.sources} />
    </main>
  )
}
