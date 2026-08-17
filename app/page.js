import Image from 'next/image';
import Link from 'next/link';
import HiloSearch from '@/components/HiloSearch';
import { DEFAULT_DESCRIPTION, HOME_TITLE } from '@/lib/seo';
import { getTodayHomeContent, getUpcomingExtraordinaryOutings } from '@/lib/supabase/home';
import { getGlobalSearchItems } from '@/lib/supabase/search';
import styles from './home.module.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: HOME_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: '/',
  },
  twitter: {
    title: HOME_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

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
  const day = value('day');
  const month = value('month');
  const year = value('year');
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} · ${day} de ${month} de ${year}`;
}

export default async function HomePage() {
  const today = getTodayLabel();
  const [searchItems, todayContent, extraordinaryOutings] = await Promise.all([
    getGlobalSearchItems(),
    getTodayHomeContent(),
    getUpcomingExtraordinaryOutings(5),
  ]);
  const featuredExtraordinary = extraordinaryOutings[0] || null;
  const followingExtraordinaryOutings = extraordinaryOutings.slice(1);

  return (
    <div className={styles.home}>
      <section className={styles.hero} id="inicio">
        <div className="shell">
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>Sevilla y su provincia</span>
            <h1>Hilo Cofrade, <span>todo en las cofradías está relacionado</span></h1>
            <p>
              Consulta, descubre y sigue las conexiones entre hermandades, imágenes,
              bandas, marchas, autores y patrimonio
            </p>
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
        <section className={`${styles.section} ${styles.featuredExtraordinary}`} aria-labelledby="proxima-extraordinaria-title">
          <div className="shell">
            <article className={styles.featuredExtraordinaryCard}>
              {featuredExtraordinary.heroImagePath ? (
                <figure className={styles.featuredExtraordinaryMedia}>
                  <div className={styles.featuredExtraordinaryImageFrame}>
                    <Image
                      src={featuredExtraordinary.heroImagePath}
                      alt={featuredExtraordinary.heroImageAlt}
                      fill
                      sizes="(max-width: 859px) calc(100vw - 32px), 55vw"
                    />
                  </div>
                  {featuredExtraordinary.heroImageCredit ? (
                    <figcaption>{featuredExtraordinary.heroImageCredit}</figcaption>
                  ) : null}
                </figure>
              ) : null}

              <div className={styles.featuredExtraordinaryCopy}>
                <span className={styles.eyebrow}>Próxima extraordinaria</span>
                <h2 id="proxima-extraordinaria-title">{featuredExtraordinary.title}</h2>
                <div className={styles.featuredExtraordinaryMeta}>
                  {featuredExtraordinary.municipality ? <span>{featuredExtraordinary.municipality}</span> : null}
                  <strong>{featuredExtraordinary.dateParts.weekdayLabel || featuredExtraordinary.dateParts.label}</strong>
                </div>
                {featuredExtraordinary.reason ? <p>{featuredExtraordinary.reason}</p> : null}
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <section className={`${styles.section} ${styles.today}`} id="hoy">
        <div className="shell">
          <div className={styles.todayHeader}>
            <span className={styles.todayDate}>{today}</span>
            <h2 className={styles.todayTitle}>Hoy en Hilo Cofrade</h2>
            <p className={styles.todaySub}>Una selección diaria para descubrir, consultar y seguir tirando del hilo</p>
          </div>

          <div className={styles.todayGrid}>
            {[
              ['EF', 'Efeméride', todayContent.ephemeris, 'Una fecha para entrar en la historia cofrade'],
              ['DC', 'Dato Cofrade', todayContent.fact, 'Un dato para seguir tirando del hilo'],
              ['CU', 'Curiosidad', todayContent.curiosity, 'Una relación cofrade por descubrir'],
            ].map(([icon, label, item, emptyTitle]) => (
              <article className={styles.dailyCard} key={label}>
                <span className={styles.dailyIcon}>{icon}</span>
                <div>
                  <span className={styles.dailyType}>{label}</span>
                  <h3>{item?.title || emptyTitle}</h3>
                  <p>{item?.summary || 'Este contenido se mostrará cuando exista una relación documentada y publicada para esta categoría.'}</p>
                  {item?.href
                    ? <Link className={styles.dailyLink} href={item.href}>{item.linkLabel}</Link>
                    : <span className={styles.dailyLink}>Contenido en preparación</span>}
                </div>
              </article>
            ))}
          </div>

          {todayContent.march ? (
            <article className={styles.musicCard}>
              <div className={styles.musicHead}>
                <div className={styles.musicTop}>
                  <span className={styles.dailyType}>Marcha del día</span>
                  {todayContent.march.videoUrl ? <span className={styles.musicPill}>Escuchar</span> : null}
                </div>
                <h3>“{todayContent.march.title}”</h3>
                <p>{[todayContent.march.composer, todayContent.march.year, todayContent.march.dedicatee].filter(Boolean).join(' · ')}</p>
              </div>
              {todayContent.march.videoUrl ? (
                <div className={styles.videoWrap}>
                  <iframe
                    src={todayContent.march.videoUrl}
                    title={todayContent.march.title}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : null}
              <div className={styles.musicInfo}>
                <div className={styles.musicMeta}>
                  {todayContent.march.composer ? <span>{todayContent.march.composer}</span> : null}
                  {todayContent.march.year ? <span>{todayContent.march.year}</span> : null}
                  {todayContent.march.dedicatee ? <span>{todayContent.march.dedicatee}</span> : null}
                </div>
                <span className={styles.musicLink}>Ficha musical próximamente</span>
              </div>
            </article>
          ) : (
            <article className={styles.musicCard}>
              <div className={styles.musicHead}>
                <div className={styles.musicTop}>
                  <span className={styles.dailyType}>Marcha del día</span>
                </div>
                <h3>Repertorio en preparación</h3>
                <p>La selección musical aparecerá automáticamente entre las marchas publicadas y elegibles.</p>
              </div>
            </article>
          )}
        </div>
      </section>

      {followingExtraordinaryOutings.length ? (
        <section className={`${styles.section} ${styles.extraSection}`} id="extraordinarias">
          <div className="shell">
            <div className={styles.extraBox}>
              <div className={styles.extraHead}>
                <span className={styles.eyebrow}>Agenda</span>
                <h2>Próximas salidas extraordinarias</h2>
                <p>Las siguientes citas documentadas y publicadas en Hilo Cofrade</p>
              </div>
              <div className={styles.todayGrid}>
                {followingExtraordinaryOutings.map((outing) => (
                  <article className={styles.dailyCard} key={outing.id}>
                    <span className={styles.dailyIcon}>{outing.dateParts.day}</span>
                    <div>
                      <span className={styles.dailyType}>{outing.dateParts.month} {outing.dateParts.year}</span>
                      <h3>{outing.title}</h3>
                      <p>{[outing.brotherhoodName, outing.municipality].filter(Boolean).join(' · ')}</p>
                      {outing.reason ? <p>{outing.reason}</p> : null}
                      <div className={styles.musicMeta}>
                        {outing.departureTime ? <span>Salida · {outing.departureTime}</span> : null}
                        {outing.origin ? <span>Desde · {outing.origin}</span> : null}
                        {outing.destination ? <span>Hasta · {outing.destination}</span> : null}
                      </div>
                      {outing.routeSummary ? <span className={styles.dailyLink}>{outing.routeSummary}</span> : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className={styles.section} id="enciclopedia">
        <div className="shell">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Enciclopedia</span>
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
            <span className={styles.eyebrow}>Participa</span>
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
