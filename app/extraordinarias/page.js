import Link from 'next/link'
import ExtraordinaryDirectory from '@/components/ExtraordinaryDirectory'
import styles from '@/components/ExtraordinaryDirectory.module.css'
import seoStyles from '@/components/ExtraordinarySeo.module.css'
import JsonLd from '@/components/JsonLd'
import { getExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory'
import { breadcrumbJsonLd, collectionPageJsonLd, pageTitle } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const title = 'Procesiones y salidas extraordinarias de Sevilla 2026'
const description = 'Calendario actualizado de procesiones y salidas extraordinarias de Sevilla capital y provincia en 2026: fechas, horarios, recorridos, bandas, motivos y guías.'

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
}

function groupUpcomingByMonth(items) {
  const groups = []
  const index = new Map()

  for (const item of items) {
    if (!item.monthKey || !item.monthLabel || !item.slug) continue
    if (!index.has(item.monthKey)) {
      const group = { key: item.monthKey, label: item.monthLabel, items: [] }
      index.set(item.monthKey, group)
      groups.push(group)
    }
    index.get(item.monthKey).items.push(item)
  }

  return groups
}

function isCoronation(item) {
  return normalizeText([item.title, item.reason, item.outingType].filter(Boolean).join(' ')).includes('coron')
}

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
  const upcomingOutings = yearOutings.filter((item) => item.isUpcoming)
  const upcomingCount = upcomingOutings.length
  const capitalCount = yearOutings.filter((item) => item.scope === 'capital').length
  const provinceCount = yearOutings.filter((item) => item.scope === 'province').length
  const monthGroups = groupUpcomingByMonth(upcomingOutings)
  const coronations = upcomingOutings.filter(isCoronation)
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

        {monthGroups.length ? (
          <section className={seoStyles.temporal} aria-labelledby="proximas-extraordinarias-meses">
            <header>
              <span className="eyebrow">Próximas citas</span>
              <h2 id="proximas-extraordinarias-meses">Extraordinarias de Sevilla 2026 por meses</h2>
              <p>Acceso directo a las próximas salidas extraordinarias de Sevilla capital y provincia, ordenadas por mes y enlazadas a su guía individual.</p>
            </header>
            <div className={seoStyles.monthGrid}>
              {monthGroups.map((group) => (
                <article key={group.key} className={seoStyles.monthCard}>
                  <div className={seoStyles.monthHead}>
                    <h3>{group.label}</h3>
                    <span>{group.items.length}</span>
                  </div>
                  <div className={seoStyles.monthLinks}>
                    {group.items.map((outing) => (
                      <Link href={`/extraordinarias/${outing.slug}`} key={outing.id}>
                        <span>{outing.dateParts?.day ? `${outing.dateParts.day} · ` : ''}{outing.title}</span>
                        <small>{outing.municipality}</small>
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {coronations.length ? (
          <section className={seoStyles.coronations} aria-labelledby="coronaciones-canonicas-sevilla-2026">
            <header>
              <span className="eyebrow">Citas destacadas</span>
              <h2 id="coronaciones-canonicas-sevilla-2026">Coronaciones y salidas extraordinarias de 2026</h2>
              <p>Guías de las próximas extraordinarias cuyo motivo o tipo documentado está relacionado con una coronación.</p>
            </header>
            <div className={seoStyles.coronationLinks}>
              {coronations.map((outing) => (
                <Link href={`/extraordinarias/${outing.slug}`} key={outing.id}>
                  <strong>{outing.title}</strong>
                  <span>{outing.dateParts?.label || outing.monthLabel} · {outing.municipality}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

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
