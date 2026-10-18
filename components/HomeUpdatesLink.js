import Image from 'next/image'
import Link from 'next/link'
import { homeNewsDayLabel } from '@/lib/home-news'
import styles from './HomeUpdatesLink.module.css'

// «El Hilo se mueve» en la portada: una noticia principal y dos titulares
// secundarios, con el tema, cuándo se supo y, sobre todo, lo que Hilo Cofrade
// añade: el enlace a sus fichas. Si no hay titulares, queda el acceso a la sección.
export const HOME_SECONDARY_LINKS = [
  {
    href: '/el-hilo-se-mueve',
    title: 'El Hilo se mueve',
    detail: 'Lo que cambia en nuestras hermandades: sones que llegan, patrimonio que vuelve e historias que siguen.',
  },
]

function madridToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date())
}

const isSvg = (path = '') => /\.svg(?:$|\?)/i.test(path)

function Crest({ item, size }) {
  if (!item.crestPath) return null
  return (
    <Image
      className={styles.crest}
      src={item.crestPath}
      alt=""
      width={size}
      height={Math.round(size * 1.22)}
      unoptimized={isSvg(item.crestPath)}
    />
  )
}

function Meta({ item, today }) {
  const when = homeNewsDayLabel(item.date, today)
  if (!item.topic && !when) return null
  return (
    <p className={styles.meta}>
      {item.topic ? <b>{item.topic}</b> : null}
      {when ? <time dateTime={item.date}>{when}</time> : null}
    </p>
  )
}

// Jerarquía (#1253): una noticia principal (foto, titular grande y entradilla) y
// las demás como titulares compactos. Todas conservan el escudo del protagonista
// y el enlace «Descubre…» a sus fichas, que es lo que aporta Hilo Cofrade.
function LeadStory({ item, today }) {
  return (
    <article className={styles.lead} data-home-news="lead">
      {item.photo ? (
        <div className={styles.leadPhoto}>
          <Image
            src={item.photo.src}
            alt={item.photo.alt || ''}
            fill
            sizes="(max-width: 767px) 100vw, 640px"
            style={{ objectPosition: item.photo.focusPosition || '50% 50%' }}
          />
        </div>
      ) : null}
      <div className={`${styles.leadBody} ${!item.photo && item.crestPath ? styles.leadBodyNoPhoto : ''}`}>
        {!item.photo ? <Crest item={item} size={52} /> : null}
        <div className={styles.copy}>
          <Meta item={item} today={today} />
          <h3 className={styles.leadHeadline}>
            <Link className={styles.storyLink} href={item.href}>{item.title}</Link>
          </h3>
          {item.summary ? <p className={styles.summary}>{item.summary}</p> : null}
          {item.brotherhood ? (
            <p className={styles.who}>
              {item.photo ? <Crest item={item} size={22} /> : null}
              <span>{item.brotherhood}</span>
            </p>
          ) : null}
        </div>
      </div>
      {item.discover ? (
        <Link className={styles.discover} href={item.discover.href}>{item.discover.label}</Link>
      ) : null}
    </article>
  )
}

function SecondaryStory({ item, today }) {
  return (
    <li className={styles.secondary} data-home-news="secondary">
      <div className={styles.secondaryRow}>
        {item.crestPath ? <Crest item={item} size={28} /> : <span className={styles.crestSpace} aria-hidden="true" />}
        <div className={styles.copy}>
          <Meta item={item} today={today} />
          <h3 className={styles.headline}>
            <Link className={styles.storyLink} href={item.href}>{item.title}</Link>
          </h3>
          {item.brotherhood ? <p className={styles.whySmall}>{item.brotherhood}</p> : null}
        </div>
      </div>
      {item.discover ? (
        <Link className={styles.discoverSmall} href={item.discover.href}>{item.discover.label}</Link>
      ) : null}
    </li>
  )
}

export default function HomeUpdatesLink({ news = [] }) {
  const items = Array.isArray(news) ? news : []
  const today = madridToday()
  const [lead, ...secondary] = items

  return (
    <section className={styles.section} id="el-hilo-se-mueve" aria-labelledby="noticias-title">
      <div className="shell">
        <div className={styles.head}>
          <h2 id="noticias-title" className={styles.title}>
            <i className={styles.pulse} aria-hidden="true" />
            El Hilo se mueve
          </h2>
          <Link className={styles.all} href="/el-hilo-se-mueve">Ver todas</Link>
        </div>

        {lead ? (
          <div className={`${styles.layout} ${secondary.length ? '' : styles.layoutSingle}`}>
            <LeadStory item={lead} today={today} />
            {secondary.length ? (
              <ul className={styles.secondaryList}>
                {secondary.map((item) => <SecondaryStory item={item} today={today} key={item.id} />)}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className={styles.fallback}>
            <Link href={HOME_SECONDARY_LINKS[0].href}>{HOME_SECONDARY_LINKS[0].detail}</Link>
          </p>
        )}
      </div>
    </section>
  )
}
