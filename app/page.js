import Image from 'next/image';
import Link from 'next/link';
import HiloSearch from '@/components/HiloSearch';
import { DEFAULT_DESCRIPTION, HOME_TITLE } from '@/lib/seo';
import {
  getHomeDiscoveryThreads,
  getTodayHomeContent,
  getUpcomingExtraordinaryOutings,
} from '@/lib/supabase/home';
import { getOutingBriefing } from '@/lib/supabase/outing-briefing';
import { getGlobalSearchItems } from '@/lib/supabase/search';
import styles from './home.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  alternates: { canonical: '/' },
  openGraph: { title: HOME_TITLE, description: DEFAULT_DESCRIPTION, url: '/' },
  twitter: { title: HOME_TITLE, description: DEFAULT_DESCRIPTION },
};

const regularEyebrowStyle = { fontWeight: 400 };
const stackedNextExtraHeadStyle = { alignItems: 'flex-start', flexDirection: 'column', gap: 4 };

function getTodayLabel() {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const parts = formatter.formatToParts(new Date());
  const value = (type) => parts.find((part) => part.type === type)?.value || '';
  const weekday = value('weekday');
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} · ${value('day')} de ${value('month')} de ${value('year')}`;
}

export default async function HomePage() {
  const today = getTodayLabel();
  const [searchItems, todayContent, extraordinaryOutings, discoveryThreads] = await Promise.all([
    getGlobalSearchItems(),
    getTodayHomeContent(),
    getUpcomingExtraordinaryOutings(5),
    getHomeDiscoveryThreads(3),
  ]);
  const featuredExtraordinary = extraordinaryOutings[0] || null;
  const followingExtraordinaryOutings = extraordinaryOutings.slice(1);
  const featuredBriefing = featuredExtraordinary
    ? await getOutingBriefing(featuredExtraordinary.id)
    : { schedule: [], bands: [], liturgicalMusic: [], places: [] };
  const todayItems = [
    ['EF', 'Efeméride', todayContent.ephemeris],
    ['DC', 'Dato Cofrade', todayContent.fact],
    ['CU', 'Curiosidad', todayContent.curiosity],
  ].filter(([, , item]) => Boolean(item));
  const hasTodayContent = todayItems.length > 0 || Boolean(todayContent.march);

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
                  <span className={styles.eyebrow} style={regularEyebrowStyle}>Próxima extraordinaria</span>
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

      {hasTodayContent ? (
        <section className={`${styles.section} ${styles.today}`} id="hoy">
          <div className="shell">
            <div className={styles.todayHeader}>
              <span className={styles.todayDate}>{today}</span>
              <h2 className={styles.todayTitle}>Hoy en Hilo Cofrade</h2>
              <p className={styles.todaySub}>Una selección diaria para descubrir, consultar y seguir tirando del hilo</p>
            </div>

            {todayItems.length ? (
              <div className={styles.todayGrid}>
                {todayItems.map(([icon, label, item]) => (
                  <article className={styles.dailyCard} key={label}>
                    <span className={styles.dailyIcon}>{icon}</span>
                    <div>
                      <span className={styles.dailyType}>{label}</span>
                      <h3>{item.title}</h3>
                      {item.summary ? <p>{item.summary}</p> : null}
                      {item.href ? <Link className={styles.dailyLink} href={item.href}>{item.linkLabel}</Link> : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {todayContent.march ? (
              <article className={styles.musicCard}>
                <div className={styles.musicHead}>
                  <div className={styles.musicTop}>
                    <span className={styles.dailyType}>Marcha del día</span>
                    {todayContent.march.listenUrl ? <span className={styles.musicPill}>Escuchar</span> : null}
                  </div>
                  <h3>“{todayContent.march.title}”</h3>
                  <p>{[todayContent.march.composer, todayContent.march.year, todayContent.march.dedicatee].filter(Boolean).join(' · ')}</p>
                </div>
                {todayContent.march.whyToday ? (
                  <div className={styles.musicWhy}>
                    <span>Por qué escucharla hoy</span>
                    <p>{todayContent.march.whyToday}</p>
                  </div>
                ) : null}
                <div className={styles.musicInfo}>
                  <div className={styles.musicMeta}>
                    {todayContent.march.composer ? <span>{todayContent.march.composer}</span> : null}
                    {todayContent.march.year ? <span>{todayContent.march.year}</span> : null}
                    {todayContent.march.dedicatee ? <span>{todayContent.march.dedicatee}</span> : null}
                  </div>
                  {todayContent.march.listenUrl ? (
                    <a
                      className={styles.musicListen}
                      href={todayContent.march.listenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ▶ Escuchar
                    </a>
                  ) : null}
                </div>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      {discoveryThreads.length ? (
        <section className={`${styles.section} ${styles.threadsSection}`} id="ultimos-hilos">
          <div className="shell">
            <div className={styles.threadsHead}>
              <span className={styles.threadsEyebrow}>Conocimiento en movimiento</span>
              <h2>Últimos hilos incorporados</h2>
              <p>Relaciones nuevas o enriquecidas que ya puedes recorrer dentro de la enciclopedia.</p>
            </div>
            <div className={styles.threadRail}>
              {discoveryThreads.map((thread) => (
                <Link className={styles.threadCard} href={thread.href} key={thread.id}>
                  <span className={styles.threadLabel}>{thread.label}</span>
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
        <section className={`${styles.section} ${styles.nextExtraSection}`}>
          <div className="shell">
            <div className={styles.nextExtraHead} style={stackedNextExtraHeadStyle}>
              <span className={styles.eyebrow} style={regularEyebrowStyle}>Después</span>
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

      <section className={styles.section} id="enciclopedia">
        <div className="shell">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow} style={regularEyebrowStyle}>Enciclopedia</span>
            <h2 className={styles.sectionTitle}>Entra por donde quieras</h2>
            <p className={styles.sectionDescription}>Acceso compacto a las principales entidades de Hilo Cofrade</p>
          </div>

          <div className={styles.exploreList}>
            <Link className={styles.exploreRow} href="/hermandades">
              <span className={styles.exploreIcon}>H</span>
              <span className={styles.exploreCopy}><strong>Hermandades</strong><span>Historia · cultos · salidas · relaciones</span></span>
              <span className={styles.exploreArrow}>→</span>
            </Link>
            <Link className={styles.exploreRow} href="/imagenes">
              <span className={styles.exploreIcon}>I</span>
              <span className={styles.exploreCopy}><strong>Imágenes</strong><span>Autoría · cronología · restauraciones</span></span>
              <span className={styles.exploreArrow}>→</span>
            </Link>
            <Link className={styles.exploreRow} href="/pasos">
              <span className={styles.exploreIcon}>P</span>
              <span className={styles.exploreCopy}><strong>Pasos</strong><span>Patrimonio · autores · acompañamiento</span></span>
              <span className={styles.exploreArrow}>→</span>
            </Link>
            <Link className={styles.exploreRow} href="/bandas">
              <span className={styles.exploreIcon}>B</span>
              <span className={styles.exploreCopy}><strong>Bandas</strong><span>Historia · acompañamientos · relaciones</span></span>
              <span className={styles.exploreArrow}>→</span>
            </Link>
            <div className={`${styles.exploreRow} ${styles.disabled}`}>
              <span className={styles.exploreIcon}>A</span>
              <span className={styles.exploreCopy}><strong>Autores</strong><span>Obras · intervenciones · relaciones</span></span>
              <span className={styles.status}>Próximamente</span>
            </div>
            <div className={`${styles.exploreRow} ${styles.disabled}`}>
              <span className={styles.exploreIcon}>M</span>
              <span className={styles.exploreCopy}><strong>Marchas</strong><span>Autor · dedicatoria · fecha · relaciones</span></span>
              <span className={styles.status}>Próximamente</span>
            </div>
          </div>

          <aside className={styles.collab} id="colabora">
            <span className={styles.eyebrow} style={regularEyebrowStyle}>Participa</span>
            <h3>Ayúdanos a completar el hilo</h3>
            <p>Las aportaciones pasarán por revisión y documentación antes de incorporarse a Hilo Cofrade</p>
            <div className={styles.flow}>
              <span>1 · Envías</span><span>2 · Revisamos</span><span>3 · Documentamos</span><span>4 · Publicamos</span>
            </div>
            <Link className={styles.collabButton} href="/colabora">Proponer información</Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
