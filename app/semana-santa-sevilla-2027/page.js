import Link from 'next/link'
import { connection } from 'next/server'
import HolyWeekProgramme from '@/components/HolyWeekProgramme'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import {
  PROGRAMME_DAYS,
  PROGRAMME_PATH,
  PROGRAMME_SOURCES,
  dateLabel,
  initialDayId,
} from '@/lib/holy-week-programme'
import { breadcrumbJsonLd, collectionPageJsonLd, socialMetadata } from '@/lib/seo'
import { getHolyWeekProgramme } from '@/lib/supabase/holy-week-programme'
import styles from './page.module.css'

export const revalidate = 900

const title = 'Semana Santa de Sevilla 2027: orden de paso y programa de mano'
const description = 'Programa de mano de la Semana Santa de Sevilla 2027: orden de paso por la Carrera Oficial de cada jornada, vísperas, cortejo con sus bandas, horarios y recorridos.'

export const metadata = {
  title,
  description,
  alternates: { canonical: PROGRAMME_PATH },
  ...socialMetadata({ title: 'Semana Santa de Sevilla 2027 · Programa de mano', description, path: PROGRAMME_PATH }),
}

function dateLabels() {
  return Object.fromEntries(PROGRAMME_DAYS.map((day) => {
    const long = day.dateLabel || dateLabel(day.date)
    const short = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', timeZone: 'Europe/Madrid' })
      .format(new Date(`${day.date}T12:00:00Z`))
      .replace('.', '')
    return [day.id, { long, short }]
  }))
}

export default async function HolyWeekProgrammePage() {
  // Se renderiza en la petición, como el resto de páginas que leen Supabase:
  // el build (CI incluido) no necesita las claves públicas.
  await connection()
  const { days } = await getHolyWeekProgramme()
  const total = new Set(days.flatMap((day) => day.items.map((item) => item.slug))).size
  const labels = dateLabels()

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Semana Santa de Sevilla 2027', path: PROGRAMME_PATH },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path: PROGRAMME_PATH,
        name: title,
        description,
        items: days.flatMap((day) => day.items.map((item) => ({
          name: `${day.name}${item.position ? ` · ${item.position}.º` : ''} · ${item.name}`,
          path: item.href,
        }))),
      })} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroInner}`}>
          <SiteBreadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Semana Santa 2027' },
            ]}
            tone="dark"
            showAccent={false}
          />
          <p className={styles.eyebrow}>Programa de mano</p>
          <h1>Semana Santa de Sevilla 2027</h1>
          <p className={styles.lead}>Del 19 al 28 de marzo · {total} hermandades</p>
        </div>
      </header>

      <div className={`shell ${styles.content}`}>
        <HolyWeekProgramme days={days} initialDayId={initialDayId(PROGRAMME_DAYS)} dateLabels={labels} />

        <nav className={styles.related} aria-label="Más sobre la Semana Santa 2027">
          <Link href="/semana-santa/2027/cambios-musicales">Cambios musicales de 2027 <span aria-hidden="true">›</span></Link>
          <Link href="/agenda-cofrade">Agenda de la Cuaresma <span aria-hidden="true">›</span></Link>
        </nav>

        <footer className={styles.sources}>
          <p>
            Orden de paso: <a href={PROGRAMME_SOURCES.consejoOrden2027.url} rel="noopener noreferrer" target="_blank">Consejo General de Hermandades y Cofradías de Sevilla</a>.
            Horarios de vísperas: <a href={PROGRAMME_SOURCES.consejoPrevias2026.url} rel="noopener noreferrer" target="_blank">nómina de 2026 del Consejo</a>.
            Cortejo, bandas, horarios y recorridos de referencia: Hilo Cofrade.
          </p>
          <p>Los horarios e itinerarios de 2027 se publican antes de la Cuaresma; hasta entonces se muestran los de 2026 como referencia.</p>
        </footer>
      </div>
    </div>
  )
}
