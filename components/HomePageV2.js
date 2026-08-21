import Image from 'next/image'
import Link from 'next/link'
import HiloSearch from '@/components/HiloSearch'
import HomeTodayV2 from '@/components/HomeTodayV2'
import HomeExploreV2 from '@/components/HomeExploreV2'
import styles from '@/app/home.module.css'

const stackedNextExtraHeadStyle = { alignItems: 'flex-start', flexDirection: 'column', gap: 4 }

export default function HomePageV2({
  today,
  searchItems,
  todayContent,
  extraordinaryOutings,
  featuredBriefing,
  discoveryThreads,
  exploreStats,
}) {
  const featuredExtraordinary = extraordinaryOutings[0] || null
  const followingExtraordinaryOutings = extraordinaryOutings.slice(1)

  return (
    <div className={styles.home}>
      <section className={styles.hero} id="inicio">
        <div className="shell">
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>Sevilla y su provincia</span>
            <h1>Hilo Cofrade, <span>todo en las cofradías está relacionado</span></h1>
            <p>Consulta, descubre y sigue las conexiones entre hermandades, imágenes, bandas, marchas, autores y patrimonio</p>
          </div>

          <aside className={styles.searchBox} id="tiradelhilo">
            <div className={styles.searchInner}>
              <span className={styles.searchLabel}>Tira del hilo</span>
              <h2>¿Qué quieres descubrir?</h2>
              <p>Busca una entidad y empieza a recorrer las relaciones ya documentadas en Hilo Cofrade</p>
              <HiloSearch items={searchItems} />
            </div>
          </aside>
        </div>
      </section>

      {featuredExtraordinary ? (
        <section
          className={`${styles.section} ${styles.featuredExtraordinary}`}
          id="extraordinarias"
          aria-labelledby="proxima-extraordinaria-title"
        >
          <div className="shell">
            <article className={styles.featuredExtraordinaryCard}>
              {featuredExtraordinary.heroImagePath ? (
                <figure className={styles.featuredExtraordinaryMedia}>
                  <div className={styles.featuredExtraordinaryImageFrame}>
                    <Image
                      src={featuredExtraordinary.heroImagePath}
                      alt={featuredExtraordinary.heroImageAlt}
                      fill
                      sizes="(max-width: 859px) calc(100vw - 32px), 33vw"
                      priority
                    />
                  </div>
                  {featuredExtraordinary.heroImageCredit ? (
                    <figcaption>{featuredExtraordinary.heroImageCredit}</figcaption>
                  ) : null}
                </figure>
              ) : null}

              <div className={styles.featuredExtraordinaryCopy}>
                <div className={styles.featuredExtraordinaryIntro}>
                  <span className={styles.eyebrow}>Próxima extraordinaria</span>
                  <h2 id="proxima-extraordinaria-title">{featuredExtraordinary.title}</h2>
                  <div className={styles.featuredExtraordinaryMeta}>
                    <strong>
                      {[featuredExtraordinary.municipality, featuredExtraordinary.dateParts.weekdayLabel || featuredExtraordinary.dateParts.label]
                        .filter(Boolean)
                        .join(' · ')}
                    </strong>
                  </div>
                  {featuredExtraordinary.reason ? <p>{featuredExtraordinary.reason}</p> : null}
                </div>

                <div className={styles.extraordinaryBriefing}>
                  {featuredBriefing.schedule.length ? (
                    <section className={styles.briefingBlock} aria-labelledby="briefing-horarios">
                      <span className={styles.briefingLabel} id="briefing-horarios">Horarios</span>
                      <div className={styles.briefingRows}>
                        {featuredBriefing.schedule.map((item) => (
                          <div className={styles.briefingRow} key={item.id}>
                            <strong>{item.time}</strong>
                            <span>
                              <b>{item.label}</b>
                              {item.place ? <small>{item.place}</small> : null}
                              {item.label === 'Misa estacional' && featuredBriefing.liturgicalMusic[0]?.name
                                ? <small>Música · {featuredBriefing.liturgicalMusic[0].name}</small>
                                : null}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {featuredBriefing.bands.length ? (
                    <section className={styles.briefingBlock} aria-labelledby="briefing-bandas">
                      <span className={styles.briefingLabel} id="briefing-bandas">Bandas</span>
                      <div className={styles.briefingRows}>
                        {featuredBriefing.bands.map((band) => (
                          <div className={styles.bandRow} key={band.id}>
                            {band.href
                              ? <Link className={styles.bandEntityLink} href={band.href}>{band.name}</Link>
                              : <strong>{band.name}</strong>}
                            {band.context ? <small>{band.context}</small> : null}
                          </div>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {featuredBriefing.places.length ? (
                    <section className={`${styles.briefingBlock} ${styles.briefingPlaces}`} aria-labelledby="briefing-lugares">
                      <span className={styles.briefingLabel} id="briefing-lugares">Lugares clave</span>
                      <div className={styles.placePills}>
                        {featuredBriefing.places.map((place) => <span key={place.id}>{place.name}</span>)}
                      </div>
                    </section>
                  ) : null}
                </div>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <HomeTodayV2 today={today} content={todayContent} />

      {discoveryThreads.length ? (
        <section className={`${styles.section} ${styles.threadsSection}`} id="ultimos-hilos">
          <div className="shell">
            <div className={styles.threadsHead}>
              <span className={styles.threadsEyebrow}>Conocimiento en movimiento</span>
              <h2>Últimos hilos incorporados</h2>
              <p>Lo último que ha crecido dentro de la enciclopedia: nuevas relaciones, patrimonio y conexiones ya publicadas.</p>
            </div>
            <div className={styles.threadRail}>
              {discoveryThreads.map((thread) => (
                <Link className={styles.threadCard} href={thread.href} key={thread.id}>
                  <div className={styles.threadTopline}>
                    <span className={styles.threadLabel}>{thread.label}</span>
                    <span className={styles.threadActivity}>
                      <strong>{thread.activityStatus}</strong>
                      {thread.dateLabel ? (
                        <time dateTime={thread.dateTime}>{thread.dateLabel}</time>
                      ) : null}
                    </span>
                  </div>
                  <h3>{thread.title}</h3>
                  <strong className={styles.threadMetric}>{thread.metric}</strong>
                  <p>{thread.summary}</p>
                  <div className={styles.threadPath} aria-label={`Ruta de descubrimiento: ${thread.path.join(', ')}`}>
                    {thread.path.map((step, index) => (
                      <span key={`${thread.id}-${step}`}>{index ? '→ ' : ''}{step}</span>
                    ))}
                  </div>
                  <span className={styles.threadCta}>{thread.cta}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {followingExtraordinaryOutings.length ? (
        <section className={`${styles.section} ${styles.nextExtraSection}`} id="siguientes-extraordinarias">
          <div className="shell">
            <div className={styles.nextExtraHead} style={stackedNextExtraHeadStyle}>
              <span className={styles.eyebrow}>Después</span>
              <h2>Las siguientes extraordinarias</h2>
            </div>
            <div className={styles.nextExtraList}>
              {followingExtraordinaryOutings.map((outing) => (
                <article className={styles.nextExtraRow} key={outing.id}>
                  <time dateTime={outing.date}>
                    <strong>{outing.dateParts.day}</strong>
                    <span>{outing.dateParts.month}</span>
                  </time>
                  <div>
                    <h3>{outing.title}</h3>
                    <p>{[outing.municipality, outing.reason].filter(Boolean).join(' · ')}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <HomeExploreV2 stats={exploreStats} />
    </div>
  )
}
