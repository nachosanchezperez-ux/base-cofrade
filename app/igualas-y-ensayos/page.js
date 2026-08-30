import CrewEventDirectory from '@/components/CrewEventDirectory'
import JsonLd from '@/components/JsonLd'
import { breadcrumbJsonLd, collectionPageJsonLd, pageTitle } from '@/lib/seo'
import { getCrewEventDirectory } from '@/lib/supabase/crew-events'
import styles from './crew-events-page.module.css'

export const revalidate = 900

const title = 'Calendario de Igualás y Ensayos'
const description = 'Próximas igualás, ensayos, mudás y convocatorias de costaleros de las hermandades de Sevilla y su provincia, relacionadas con sus pasos y capataces.'

export const metadata = {
  title: pageTitle(title),
  description,
  alternates: { canonical: '/igualas-y-ensayos' },
  openGraph: { title: pageTitle(title), description, url: '/igualas-y-ensayos' },
  twitter: { title: pageTitle(title), description },
}

export default async function CrewEventsPage() {
  const events = await getCrewEventDirectory()
  const upcoming = events.filter((item) => item.isUpcoming)
  const brotherhoodCount = new Set(events.map((item) => item.brotherhoodId)).size
  const stepCount = new Set(events.flatMap((item) => item.steps.map((step) => step.id))).size
  const directoryJsonLd = collectionPageJsonLd({
    path: '/igualas-y-ensayos',
    name: title,
    description,
    items: events.map((event) => ({ name: event.title, path: event.detailHref })),
  })

  return (
    <section className={`section page-top ${styles.page}`}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: title, path: '/igualas-y-ensayos' },
      ])} />
      <JsonLd data={directoryJsonLd} />
      <div className="shell">
        <header className={styles.intro}>
          <div><span className="eyebrow">Costaleros · Sevilla y provincia</span><h1>Calendario de Igualás y Ensayos</h1></div>
          <p>Una agenda estructurada de las convocatorias de cuadrilla, conectada con cada Hermandad, sus Pasos y los capataces responsables.</p>
        </header>

        <div className={styles.summary} aria-label="Resumen del calendario de igualás y ensayos">
          <div><span className="eyebrow">Archivo vivo</span><p>Las citas futuras aparecen primero y, una vez celebradas, permanecen disponibles en el histórico.</p></div>
          <div className={styles.stats}>
            <span><strong>{upcoming.length}</strong> próximas</span>
            <span><strong>{events.length}</strong> documentadas</span>
            <span><strong>{brotherhoodCount}</strong> Hermandades</span>
            <span><strong>{stepCount}</strong> Pasos</span>
          </div>
        </div>

        <CrewEventDirectory events={events} />

        <section className={styles.scope} aria-labelledby="que-incluye-calendario-costaleros">
          <span className="eyebrow">Alcance</span>
          <h2 id="que-incluye-calendario-costaleros">Qué recoge este calendario</h2>
          <p>Igualás, ensayos, mudás, retranqueos, desarmás, reuniones de cuadrilla y otros actos costaleros comunicados por las corporaciones o sus equipos de capataces.</p>
          <p>Cada convocatoria se conserva como una ficha propia, con sus relaciones y Fuentes, para que el paso del tiempo no convierta la agenda en información perdida.</p>
        </section>
      </div>
    </section>
  )
}
