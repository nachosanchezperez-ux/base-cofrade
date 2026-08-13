import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import SourcesBlock from '@/components/SourcesBlock'
import { getBandBySlug, youtubeEmbedUrl } from '@/lib/supabase/bands'
import { absoluteUrl } from '@/lib/seo'
import styles from '../bandas.module.css'

export const dynamic = 'force-dynamic'

function dateLabel(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' }).format(new Date(`${value}T12:00:00`))
}

function timeLabel(value) {
  return value ? value.slice(0, 5) : ''
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
              <span className={styles.eyebrow}>{band.type} · {band.municipality}</span>
              <h1>{band.popularName}</h1>
              <p className={styles.officialName}>{band.officialName}</p>
              <p className={styles.heroLead}>{band.summary}</p>
              <div className={styles.heroLinks}>
                {band.websiteUrl ? <a href={band.websiteUrl} target="_blank" rel="noreferrer">Web oficial ↗</a> : null}
                {band.instagramUrl ? <a href={band.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a> : null}
              </div>
            </div>
            <div className={styles.identityBlock}>
              {band.logoPath ? <Image src={band.logoPath} alt={`Logotipo de ${band.popularName}`} width={150} height={225} priority sizes="150px" /> : <strong>{band.popularName.slice(0, 2).toUpperCase()}</strong>}
            </div>
          </div>
          <div className={styles.heroFacts}>
            <div><small>Fundación</small><strong>{band.foundation || 'Por documentar'}</strong></div>
            <div><small>Localidad</small>{band.municipalitySlug ? <Link href={`/bandas?localidad=${band.municipalitySlug}`}>{band.municipality}</Link> : <strong>{band.municipality}</strong>}</div>
            <div><small>Formación</small><Link href={`/bandas?tipo=${band.typeSlug}`}>{band.type}</Link></div>
            <div><small>Vinculación</small>{band.linkedBrotherhoodSlug ? <Link href={`/hermandades/${band.linkedBrotherhoodSlug}`}>{band.linkedBrotherhood}</Link> : <strong>{band.linkedBrotherhood || 'Por documentar'}</strong>}</div>
          </div>
        </div>
      </section>

      <nav className={`section-nav brotherhood-nav ${styles.sectionNav}`} aria-label="Secciones de la ficha">
        <div className="shell brotherhood-nav-shell">
          <span className={`brotherhood-nav-label ${styles.navLabel}`}>Explorar ficha</span>
          <div className={`brotherhood-nav-list nav-scroll ${styles.navList}`}>
            <a href="#resumen">Resumen</a>
            <a href="#acompanamientos">Acompañamientos</a>
            <a href="#extraordinarias">Extraordinarias</a>
            <a href="#estrenos">Estrenos</a>
            <a href="#direccion">Dirección</a>
            {band.sources?.length ? <a href="#fuentes">Fuentes</a> : null}
          </div>
        </div>
      </nav>

      <section className={styles.contentSection} id="resumen">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Identidad y trayectoria</span><h2>Una banda con identidad propia</h2></div>
          <div className={styles.storyGrid}>
            <div className={styles.storyText}><p>{band.description || band.summary}</p>{band.headquarters ? <p><strong>Sede o lugar de ensayo:</strong> {band.headquarters}</p> : null}</div>
            {band.heroImagePath ? (
              <figure className={styles.heroPhoto}>
                <div><Image src={band.heroImagePath} alt={band.heroImageAlt || `Fotografía de ${band.popularName}`} fill sizes="(max-width: 760px) calc(100vw - 32px), 460px" /></div>
                {band.heroImageCredit ? <figcaption>{band.heroImageCredit}</figcaption> : null}
              </figure>
            ) : null}
          </div>
        </div>
      </section>

      <section className={`${styles.contentSection} ${styles.softSection}`} id="acompanamientos">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Semana Santa</span><h2>Acompañamientos actuales</h2><p>Relaciones documentadas entre la banda, las hermandades y sus pasos.</p></div>
          {band.accompaniments.length ? <div className={styles.relationshipGrid}>{band.accompaniments.map((item) => (
            <article className={styles.relationshipCard} key={item.id}>
              <span>{item.outingType || 'Salida procesional'}</span><h3>{item.brotherhoodName}</h3>{item.stepName ? <p>{item.position} · {item.stepName}</p> : <p>{item.position}</p>}<strong>{yearRange(item)}</strong>{item.brotherhoodSlug ? <Link href={`/hermandades/${item.brotherhoodSlug}`}>Ver hermandad →</Link> : null}
            </article>
          ))}</div> : <div className={styles.emptyBlock}>Los acompañamientos se incorporarán conforme queden documentados.</div>}
        </div>
      </section>

      <section className={styles.contentSection} id="extraordinarias">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Agenda</span><h2>Próximas salidas extraordinarias</h2><p>Solo se muestran citas futuras publicadas y no canceladas.</p></div>
          {band.outings.length ? <div className={styles.outingList}>{band.outings.map((item) => (
            <article key={item.id}><time dateTime={item.date}><strong>{dateLabel(item.date)}</strong>{timeLabel(item.time) ? <span>{timeLabel(item.time)} h</span> : null}</time><div><small>{item.type}</small><h3>{item.title}</h3>{item.organizerName ? <strong className={styles.outingOrganizer}>{item.organizerName}</strong> : null}<p>{[item.municipality, item.position, item.reason].filter(Boolean).join(' · ')}</p></div></article>
          ))}</div> : <div className={styles.emptyBlock}>No hay próximas salidas extraordinarias publicadas.</div>}
        </div>
      </section>

      <section className={`${styles.contentSection} ${styles.premiereSection}`} id="estrenos">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Patrimonio musical</span><h2>Estrenos</h2><p>Nuevas composiciones organizadas por año, con su autoría, grabación y fuente.</p></div>
          {years.length ? years.map((year) => (
            <div className={styles.premiereYear} key={year}>
              <h3>{year}</h3>
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
          )) : <div className={styles.emptyBlock}>Los estrenos se incorporarán desde el Panel editorial.</div>}
        </div>
      </section>

      <section className={`${styles.contentSection} ${styles.softSection}`} id="direccion">
        <div className="shell">
          <div className={styles.sectionHeading}><span className={styles.eyebrow}>Organización</span><h2>Dirección actual</h2></div>
          {band.direction.length ? <div className={styles.directionGrid}>{band.direction.map((item) => <article key={item.id}><span>{item.role}</span><h3>{item.name}</h3>{item.notes ? <p>{item.notes}</p> : null}</article>)}</div> : <div className={styles.emptyBlock}>El equipo de dirección se incorporará conforme quede documentado.</div>}
        </div>
      </section>

      <SourcesBlock sources={band.sources} />
    </main>
  )
}
