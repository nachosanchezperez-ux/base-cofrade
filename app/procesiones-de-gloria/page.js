import GloryDirectory from '@/components/GloryDirectory'
import JsonLd from '@/components/JsonLd'
import { getGloryDirectory } from '@/lib/supabase/glory-directory'
import { breadcrumbJsonLd, collectionPageJsonLd, pageTitle } from '@/lib/seo'
import styles from './glory-page.module.css'

export const dynamic = 'force-dynamic'

const baseTitle = 'Procesiones de Gloria en Sevilla'
const baseDescription = 'Calendario de procesiones de Gloria de Sevilla capital y provincia: fechas, horarios, recorridos, hermandades, bandas y fuentes documentadas.'

function currentMadridYear() {
  return Number(new Intl.DateTimeFormat('en', {
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(new Date()))
}

export async function generateMetadata() {
  const year = currentMadridYear()
  const title = `${baseTitle} ${year}`
  const description = `Calendario de procesiones de Gloria de Sevilla capital y provincia en ${year}: fechas, horarios, recorridos, hermandades, bandas y fuentes documentadas.`
  return {
    title,
    description,
    alternates: {
      canonical: '/procesiones-de-gloria',
    },
    openGraph: {
      title: pageTitle(title),
      description,
      url: '/procesiones-de-gloria',
    },
    twitter: {
      title: pageTitle(title),
      description,
    },
  }
}

export default async function ProcesionesDeGloriaPage() {
  const outings = await getGloryDirectory()
  const visibleOutings = outings.filter((item) => !item.isCancelled)
  const currentYear = currentMadridYear()
  const yearOutings = visibleOutings.filter((item) => item.year === currentYear)
  const upcomingCount = yearOutings.filter((item) => item.isUpcoming).length
  const archiveCount = yearOutings.filter((item) => item.isCelebrated || item.isPast).length
  const capitalCount = yearOutings.filter((item) => item.scope === 'capital').length
  const provinceCount = yearOutings.filter((item) => item.scope === 'province').length
  const directoryJsonLd = collectionPageJsonLd({
    path: '/procesiones-de-gloria',
    name: `${baseTitle} ${currentYear}`,
    description: baseDescription,
    items: visibleOutings.map((outing) => ({
      name: `${outing.title} · ${outing.municipality}`,
      path: outing.detailHref,
    })),
  })

  return (
    <section className={`section page-top ${styles.page}`}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Procesiones de Gloria', path: '/procesiones-de-gloria' },
      ])} />
      <JsonLd data={directoryJsonLd} />

      <div className="shell">
        <header className={styles.intro}>
          <div>
            <span className="eyebrow">Calendario cofrade · Sevilla y provincia</span>
            <h1>Procesiones de Gloria en Sevilla</h1>
          </div>
          <p>
            Consulta las próximas procesiones de las hermandades de Gloria, con sus fechas y los datos documentados de cada salida. Las celebradas permanecen disponibles como archivo de consulta.
          </p>
        </header>

        <div className={styles.summary} aria-label={`Resumen del calendario de procesiones de Gloria de ${currentYear}`}>
          <div className={styles.summaryCopy}>
            <span className="eyebrow">Glorias · {currentYear}</span>
            <p>
              Hilo Cofrade reúne en una sola agenda las <strong>procesiones de Gloria de Sevilla capital y provincia</strong>. Cada salida está conectada con su hermandad y se amplía a medida que se documentan horarios, recorrido, música y fuentes.
            </p>
          </div>
          <div className={styles.stats}>
            <span><strong>{yearOutings.length}</strong> documentadas</span>
            <span><strong>{upcomingCount}</strong> próximas</span>
            <span><strong>{archiveCount}</strong> en archivo</span>
            <span><strong>{capitalCount}</strong> capital · <strong>{provinceCount}</strong> provincia</span>
          </div>
        </div>

        <GloryDirectory outings={outings} />

        <section className={styles.guide} aria-labelledby="guia-procesiones-gloria-sevilla">
          <span className="eyebrow">Guía en crecimiento</span>
          <h2 id="guia-procesiones-gloria-sevilla">Fechas, recorridos y bandas de las Glorias de Sevilla</h2>
          <p>
            Esta agenda no sustituye al directorio de hermandades de Gloria: lo complementa. Aquí la unidad de consulta es cada procesión, mientras que la ficha de la hermandad conserva su historia, titulares, patrimonio y demás relaciones.
          </p>
          <p>
            Cuando un horario, itinerario o acompañamiento musical todavía no está documentado, Hilo Cofrade lo mantiene pendiente en lugar de completarlo sin una fuente. Así, la página puede crecer con nuevas salidas sin perder trazabilidad.
          </p>
        </section>
      </div>
    </section>
  )
}
