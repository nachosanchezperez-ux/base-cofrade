import Image from 'next/image'
import Link from 'next/link'
import HolyWeekProgramme from '@/components/HolyWeekProgramme'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import { PROGRAMME_DAYS, PROGRAMME_PATH, PROGRAMME_SOURCES, dateLabel } from '@/lib/holy-week-programme'
import styles from './page.module.css'

export function programmeDateLabels() {
  return Object.fromEntries(PROGRAMME_DAYS.map((day) => {
    const long = day.dateLabel || dateLabel(day.date)
    const short = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', timeZone: 'Europe/Madrid' })
      .format(new Date(`${day.date}T12:00:00Z`))
      .replace('.', '')
    return [day.id, { long, short }]
  }))
}

// Bandas que suenan en la jornada, cada una una sola vez y con las cofradías a
// las que acompaña. Enlace natural a la ficha de la Banda.
export function dayBands(day) {
  const bySlug = new Map()
  for (const item of day?.items || []) {
    for (const step of item.cortejo || []) {
      for (const band of step.bands || []) {
        const entry = bySlug.get(band.slug) || { ...band, brotherhoods: [] }
        if (!entry.brotherhoods.some((brotherhood) => brotherhood.href === item.href)) {
          entry.brotherhoods.push({ name: item.name, href: item.href })
        }
        bySlug.set(band.slug, entry)
      }
    }
  }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

function DayBands({ day }) {
  const bands = dayBands(day)
  if (!bands.length) return null
  return <section className={styles.bands} aria-labelledby="bandas-jornada">
    <h2 id="bandas-jornada">Bandas del {day.name}</h2>
    <ul>
      {bands.map((band) => <li key={band.slug}>
        {band.logoPath
          ? <span className={styles.bandLogo} style={{ background: band.logoBackground || '#fff' }} aria-hidden="true"><Image src={band.logoPath} alt="" width={32} height={32} /></span>
          : <span className={styles.bandEmpty} aria-hidden="true">♪</span>}
        <span>
          <Link href={band.href}>{band.name}</Link>
          <small>{band.brotherhoods.map((brotherhood) => brotherhood.name).join(' · ')}</small>
        </span>
      </li>)}
    </ul>
  </section>
}

export default function ProgrammeShell({ days, activeDayId, mode, breadcrumb, eyebrow, heading, lead }) {
  const day = days.find((item) => item.id === activeDayId)
  return <div className={styles.page}>
    <header className={styles.hero}>
      <div className={`shell ${styles.heroInner}`}>
        <SiteBreadcrumb items={breadcrumb} tone="dark" showAccent={false} />
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{heading}</h1>
        <p className={styles.lead}>{lead}</p>
      </div>
    </header>

    <div className={`shell ${styles.content}`}>
      <HolyWeekProgramme key={activeDayId} days={days} activeDayId={activeDayId} dateLabels={programmeDateLabels()} mode={mode} />

      {mode === 'day' ? <DayBands day={day} /> : null}

      <nav className={styles.related} aria-label="Más sobre la Semana Santa 2027">
        {mode === 'day' ? <Link href={PROGRAMME_PATH}>Programa de mano completo de 2027 <span aria-hidden="true">›</span></Link> : null}
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
}
