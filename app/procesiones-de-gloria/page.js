import GloryDirectory from '@/components/GloryDirectory'
import JsonLd from '@/components/JsonLd'
import { getGloryDirectory } from '@/lib/supabase/glory-directory'
import { breadcrumbJsonLd, collectionPageJsonLd, pageTitle } from '@/lib/seo'
import styles from './glory-page.module.css'

export const dynamic = 'force-dynamic'

const baseTitle = 'Procesiones de Gloria en Sevilla'
const baseDescription = 'Calendario de procesiones de Gloria en Sevilla capital y provincia: fechas, horarios, recorridos y acompañamientos musicales.'

function currentMadridYear() {
  return Number(new Intl.DateTimeFormat('en', {
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(new Date()))
}

export async function generateMetadata() {
  const year = currentMadridYear()
  const title = `${baseTitle} ${year}`
  const description = `Calendario de procesiones de Gloria en Sevilla capital y provincia en ${year}: fechas, horarios, recorridos y acompañamientos musicales.`
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
            Fechas, horarios y recorridos de las próximas procesiones de Gloria de Sevilla capital y provincia. Las salidas ya celebradas pueden consultarse por año.
          </p>
        </header>

        <div className={styles.summary} aria-label={`Resumen del calendario de procesiones de Gloria de ${currentYear}`}>
          <div className={styles.summaryCopy}>
            <span className="eyebrow">Glorias · {currentYear}</span>
            <p>
              Las <strong>procesiones de Gloria de Sevilla capital y provincia</strong>, ordenadas por fecha y localidad, con la información disponible de cada jornada.
            </p>
          </div>
          <div className={styles.stats}>
            <span><strong>{yearOutings.length}</strong> salidas</span>
            <span><strong>{upcomingCount}</strong> próximas</span>
            <span><strong>{archiveCount}</strong> celebradas</span>
            <span><strong>{capitalCount}</strong> capital · <strong>{provinceCount}</strong> provincia</span>
          </div>
        </div>

        <GloryDirectory outings={outings} />

        <section className={styles.guide} aria-labelledby="guia-procesiones-gloria-sevilla">
          <span className="eyebrow">Calendario anual</span>
          <h2 id="guia-procesiones-gloria-sevilla">Las Glorias de Sevilla, mes a mes</h2>
          <p>
            Las hermandades de Gloria de Sevilla capital y provincia celebran sus procesiones a lo largo de todo el año, con especial presencia en primavera y otoño.
          </p>
          <p>
            Quedan fuera de este listado las romerías, los traslados y las salidas extraordinarias, aunque estén vinculados a las mismas hermandades.
          </p>
        </section>
      </div>
    </section>
  )
}
