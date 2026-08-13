import Link from 'next/link';
import HiloSearch from '@/components/HiloSearch';
import { hermandades } from '@/lib/data';
import { DEFAULT_DESCRIPTION, HOME_TITLE } from '@/lib/seo';
import { getBandsDirectory } from '@/lib/supabase/bands';
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

function buildSearchItems(bands) {
  return [
    ...hermandades.flatMap((hermandad) => [
    {
      type: 'Hermandad',
      title: hermandad.nombrePopular,
      subtitle: `${hermandad.localidad} · ${hermandad.diaSalida}`,
      href: `/hermandades/${hermandad.slug}`,
    },
    ...hermandad.imagenes.map((imagen) => ({
      type: 'Imagen',
      title: imagen.nombre,
      subtitle: `${imagen.autor} · ${imagen.fecha}`,
      href: `/imagenes/${imagen.slug}`,
    })),
    ...hermandad.pasos.map((paso) => ({
      type: 'Paso',
      title: paso.nombre,
      subtitle: `${paso.tipo} · ${hermandad.nombrePopular}`,
      href: `/pasos/${paso.slug}`,
    })),
    ]),
    ...bands.map((band) => ({
      type: 'Banda',
      title: band.popularName,
      subtitle: `${band.type} · ${band.municipality}`,
      href: `/bandas/${band.slug}`,
    })),
  ];
}

export default async function HomePage() {
  const today = getTodayLabel();
  const bands = await getBandsDirectory();
  const searchItems = buildSearchItems(bands);

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

      <section className={`${styles.section} ${styles.today}`} id="hoy">
        <div className="shell">
          <div className={styles.todayHeader}>
            <span className={styles.todayDate}>{today}</span>
            <h2 className={styles.todayTitle}>Hoy en Hilo Cofrade</h2>
            <p className={styles.todaySub}>Una selección diaria para descubrir, consultar y seguir tirando del hilo</p>
          </div>

          <div className={styles.todayGrid}>
            <article className={styles.dailyCard}>
              <span className={styles.dailyIcon}>EF</span>
              <div>
                <span className={styles.dailyType}>Efeméride</span>
                <h3>Una fecha para entrar en la historia cofrade</h3>
                <p>Este módulo se alimentará de acontecimientos documentados y de sus protagonistas relacionados</p>
                <span className={styles.dailyLink}>Contenido diario en preparación</span>
              </div>
            </article>

            <article className={styles.dailyCard}>
              <span className={styles.dailyIcon}>DC</span>
              <div>
                <span className={styles.dailyType}>Dato Cofrade</span>
                <h3>2.292 nazarenos en la estación de penitencia del Baratillo en 2026</h3>
                <p>Un dato puede llevarte a la hermandad, su jornada, sus imágenes y sus pasos</p>
                <Link className={styles.dailyLink} href="/hermandades/el-baratillo">Descubrir →</Link>
              </div>
            </article>

            <article className={styles.dailyCard}>
              <span className={styles.dailyIcon}>CU</span>
              <div>
                <span className={styles.dailyType}>Curiosidad</span>
                <h3>San José es titular del Baratillo aunque no forma parte de sus pasos procesionales</h3>
                <p>Una relación que permite distinguir entre titularidad y presencia procesional</p>
                <Link className={styles.dailyLink} href="/imagenes/patriarca-bendito-senor-san-jose">Seguir el hilo →</Link>
              </div>
            </article>
          </div>

          <article className={styles.musicCard}>
            <div className={styles.musicHead}>
              <div className={styles.musicTop}>
                <span className={styles.dailyType}>Marcha del día</span>
                <span className={styles.musicPill}>Escuchar</span>
              </div>
              <h3>“Plegaria a la Virgen de la Asunción”</h3>
              <p>Manuel López Farfán · 1926 · Virgen de la Asunción de Cantillana</p>
            </div>
            <div className={styles.videoWrap}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/nOcty-P2C0E?rel=0"
                title="Plegaria a la Virgen de la Asunción"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className={styles.musicInfo}>
              <div className={styles.musicMeta}>
                <span>Manuel López Farfán</span>
                <span>1926</span>
                <span>Cantillana</span>
              </div>
              <span className={styles.musicLink}>Ficha musical próximamente</span>
            </div>
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.extraSection}`} id="extraordinarias">
        <div className="shell">
          <div className={styles.extraBox}>
            <div className={styles.extraHead}>
              <span className={styles.eyebrow}>Próximamente</span>
              <h2>Salidas extraordinarias</h2>
              <p>Solo aparecerán aquí las próximas citas que estén documentadas</p>
            </div>
            <div className={styles.extraEmpty}>
              <strong>No hay salidas extraordinarias publicadas en esta versión beta</strong>
              <span>Cuando incorporemos una próxima salida, este bloque mostrará directamente su fecha, motivo y relaciones principales</span>
            </div>
          </div>
        </div>
      </section>

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
            <div className={`${styles.exploreRow} ${styles.disabled}`}>
              <span className={styles.exploreIcon}>I</span>
              <span className={styles.exploreCopy}><strong>Imágenes</strong><span>Autoría · cronología · restauraciones</span></span>
              <span className={styles.status}>Próximamente</span>
            </div>
            <div className={`${styles.exploreRow} ${styles.disabled}`}>
              <span className={styles.exploreIcon}>P</span>
              <span className={styles.exploreCopy}><strong>Pasos</strong><span>Patrimonio · autores · acompañamiento</span></span>
              <span className={styles.status}>Próximamente</span>
            </div>
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
