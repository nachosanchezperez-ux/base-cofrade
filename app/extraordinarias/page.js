import ExtraordinaryDirectory from '@/components/ExtraordinaryDirectory'
import styles from '@/components/ExtraordinaryDirectory.module.css'
import seoStyles from '@/components/ExtraordinarySeo.module.css'
import JsonLd from '@/components/JsonLd'
import { getExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory'
import { breadcrumbJsonLd, collectionPageJsonLd, pageTitle } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const title = 'Procesiones y salidas extraordinarias de Sevilla 2026'
const description = 'Calendario actualizado de procesiones y salidas extraordinarias de Sevilla capital y provincia en 2026: fechas, horarios, recorridos, bandas, motivos y guías.'

export const metadata = {
  title,
  description,
  alternates: {
    canonical: '/extraordinarias',
  },
  openGraph: {
    title: pageTitle(title),
    description,
    url: '/extraordinarias',
  },
  twitter: {
    title: pageTitle(title),
    description,
  },
}

export default async function ExtraordinariasPage() {
  const outings = await getExtraordinaryDirectory()
  const visibleOutings = outings.filter((item) => !item.isCancelled)
  const currentYear = 2026
  const yearOutings = visibleOutings.filter((item) => item.year === currentYear)
  const upcomingCount = yearOutings.filter((item) => item.isUpcoming).length
  const capitalCount = yearOutings.filter((item) => item.scope === 'capital').length
  const provinceCount = yearOutings.filter((item) => item.scope === 'province').length
  const directoryJsonLd = collectionPageJsonLd({
    path: '/extraordinarias',
    name: title,
    description,
    items: visibleOutings.map((outing) => ({
      name: `${outing.title} · ${outing.municipality}`,
      path: outing.slug ? `/extraordinarias/${outing.slug}` : outing.anchorHref,
    })),
  })

  return (
    <section className={`section page-top ${styles.page}`}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Extraordinarias', path: '/extraordinarias' },
      ])} />
      <JsonLd data={directoryJsonLd} />

      <div className="shell">
        <header className={styles.pageIntro}>
          <div>
            <span className="eyebrow">Calendario cofrade · Sevilla y provincia</span>
            <h1>Procesiones y salidas extraordinarias de Sevilla 2026</h1>
          </div>
          <p>
            Consulta las próximas procesiones extraordinarias de Sevilla capital y provincia: fechas, horarios, recorridos, acompañamientos musicales, motivos y fuentes documentales.
          </p>
        </header>

        <div className={seoStyles.summary} aria-label="Resumen del calendario de extraordinarias de 2026">
          <p>
            Hilo Cofrade reúne en una sola agenda las <strong>salidas extraordinarias de Sevilla en 2026</strong>, tanto en la capital como en los municipios de la provincia. Cada cita dispone de una guía propia y se amplía a medida que se confirman el horario, el itinerario, las bandas y otros datos de interés.
          </p>
          <div className={seoStyles.stats}>
            <span><strong>{yearOutings.length}</strong> documentadas en 2026</span>
            <span><strong>{upcomingCount}</strong> próximas</span>
            <span><strong>{capitalCount}</strong> en Sevilla capital</span>
            <span><strong>{provinceCount}</strong> en la provincia</span>
          </div>
        </div>

        <ExtraordinaryDirectory outings={outings} />

        <section className={seoStyles.guide} aria-labelledby="guia-extraordinarias-sevilla">
          <span className="eyebrow">Guía actualizada</span>
          <h2 id="guia-extraordinarias-sevilla">Extraordinarias en Sevilla: fechas, recorridos y bandas</h2>
          <p>
            El calendario incluye procesiones extraordinarias, traslados y otros cultos externos de carácter excepcional que están documentados para Sevilla y su provincia. Las próximas citas aparecen primero y las ya celebradas permanecen disponibles como archivo de consulta.
          </p>
          <p>
            En cada guía de Hilo Cofrade puedes consultar los datos confirmados de la jornada: motivo de la extraordinaria, lugar y hora de salida, entrada, recorrido, acompañamiento musical y fuentes utilizadas. Cuando un dato todavía no está publicado, se mantiene pendiente en lugar de completarlo sin documentación.
          </p>
        </section>
      </div>
    </section>
  )
}
