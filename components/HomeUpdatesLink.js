import Image from 'next/image'
import Link from 'next/link'
import styles from './HomeUpdatesLink.module.css'

// «El Hilo se mueve» en la portada: una pequeña primera plana con la noticia
// más reciente y dos titulares más, con la identidad de la sección (burdeos,
// marfil y titulares en Georgia). Si no hay titulares, queda el acceso.
// Cuando el juego propio esté publicado, se añadirá aquí como acceso aparte.
export const HOME_SECONDARY_LINKS = [
  {
    href: '/el-hilo-se-mueve',
    title: 'El Hilo se mueve',
    detail: 'Lo que cambia en nuestras hermandades: sones que llegan, patrimonio que vuelve e historias que siguen.',
  },
]

function Crest({ path }) {
  if (!path) return null
  return (
    <Image
      className={styles.crest}
      src={path}
      alt=""
      width={44}
      height={52}
      unoptimized={/\.svg(?:$|\?)/i.test(path)}
    />
  )
}

function Kicker({ item }) {
  return (
    <span className={styles.dateline}>
      {item.topic ? <span className={styles.topic}>{item.topic}</span> : null}
      {item.dateLabel ? <time dateTime={item.date}>{item.dateLabel}</time> : null}
    </span>
  )
}

export default function HomeUpdatesLink({ news = [] }) {
  const [lead, ...rest] = Array.isArray(news) ? news : []

  return (
    <section className={styles.section} id="el-hilo-se-mueve" aria-labelledby="noticias-title">
      <div className="shell">
        <header className={styles.masthead}>
          <div>
            <p className={styles.tag}>Actualidad cofrade</p>
            <h2 id="noticias-title" className={styles.title}>El Hilo <em>se mueve</em></h2>
          </div>
          <Link className={styles.all} href="/el-hilo-se-mueve">
            Todas las noticias <span aria-hidden="true">→</span>
          </Link>
        </header>

        {lead ? (
          <div className={styles.front}>
            <article className={styles.lead}>
              <Link className={styles.leadLink} href={lead.href}>
                <Kicker item={lead} />
                <h3 className={styles.leadTitle}>{lead.title}</h3>
                {lead.summary ? <p className={styles.summary}>{lead.summary}</p> : null}
                <span className={styles.byline}>
                  <Crest path={lead.crestPath} />
                  <span>
                    <strong>{lead.brotherhood}</strong>
                    {lead.municipality ? <span>{lead.municipality}</span> : null}
                  </span>
                </span>
              </Link>
            </article>

            {rest.length ? (
              <ul className={styles.headlines}>
                {rest.map((item) => (
                  <li key={item.id}>
                    <Link className={styles.headline} href={item.href}>
                      <Kicker item={item} />
                      <h3 className={styles.headlineTitle}>{item.title}</h3>
                      <span className={styles.headlineMeta}>
                        {[item.brotherhood, item.municipality].filter(Boolean).join(', ')}
                      </span>
                    </Link>
                  </li>
                ))}
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
