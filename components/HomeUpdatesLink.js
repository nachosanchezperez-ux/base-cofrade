import Image from 'next/image'
import Link from 'next/link'
import { homeNewsDayLabel } from '@/lib/home-news'
import styles from './HomeUpdatesLink.module.css'

// «El Hilo se mueve» en la portada, en formato ágil: la noticia se lee antes en
// los medios especializados, así que aquí solo van el titular, el tema, cuándo
// se supo y, sobre todo, lo que Hilo Cofrade añade: el enlace a sus fichas.
// Si no hay titulares, queda el acceso a la sección.
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

export default function HomeUpdatesLink({ news = [] }) {
  const items = Array.isArray(news) ? news : []
  const today = madridToday()

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

        {items.length ? (
          <ul className={styles.list}>
            {items.map((item) => {
              const when = homeNewsDayLabel(item.date, today)
              return (
                <li className={styles.item} key={item.id}>
                  <Link className={styles.story} href={item.href}>
                    {item.crestPath ? (
                      <Image
                        className={styles.crest}
                        src={item.crestPath}
                        alt=""
                        width={36}
                        height={44}
                        unoptimized={/\.svg(?:$|\?)/i.test(item.crestPath)}
                      />
                    ) : <span className={styles.crestSpace} aria-hidden="true" />}
                    <span className={styles.copy}>
                      <span className={styles.meta}>
                        {item.topic ? <b>{item.topic}</b> : null}
                        {when ? <time dateTime={item.date}>{when}</time> : null}
                      </span>
                      <span className={styles.headline}>{item.title}</span>
                      {item.brotherhood ? <span className={styles.who}>{item.brotherhood}</span> : null}
                    </span>
                  </Link>
                  {item.discover ? (
                    <Link className={styles.discover} href={item.discover.href}>
                      {item.discover.label}
                    </Link>
                  ) : null}
                </li>
              )
            })}
          </ul>
        ) : (
          <p className={styles.fallback}>
            <Link href={HOME_SECONDARY_LINKS[0].href}>{HOME_SECONDARY_LINKS[0].detail}</Link>
          </p>
        )}
      </div>
    </section>
  )
}
