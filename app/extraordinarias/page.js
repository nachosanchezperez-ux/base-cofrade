import Link from 'next/link'
import ExtraordinaryDirectory from '@/components/ExtraordinaryDirectory'
import styles from '@/components/ExtraordinaryDirectory.module.css'
import seoStyles from '@/components/ExtraordinarySeo.module.css'
import JsonLd from '@/components/JsonLd'
import { getExtraordinaryDirectory } from '@/lib/supabase/extraordinary-directory'
import { breadcrumbJsonLd, collectionPageJsonLd, pageTitle } from '@/lib/seo'
import { extraordinarySeoCopy, madridYear } from '@/lib/seo-calendar'

export const revalidate = 300

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

export function generateMetadata() {
  const { title, description } = extraordinarySeoCopy(madridYear())
  return {
    title,
    description,
    alternates: { canonical: '/extraordinarias' },
    openGraph: { title: pageTitle(title), description, url: '/extraordinarias' },
    twitter: { title: pageTitle(title), description },
  }
}

export default async function ExtraordinariasPage() {
  const currentYear = madridYear()
  const { title, description } = extraordinarySeoCopy(currentYear)
  const outings = await getExtraordinaryDirectory()
  const visibleOutings = outings.filter((item) => !item.isCancelled)
  const yearOutings = visibleOutings.filter((item) => item.year === currentYear)
  const upcomingOutings = visibleOutings.filter((item) => item.isUpcoming)
  const upcomingCount = upcomingOutings.length
  const capitalCount = upcomingOutings.filter((item) => item.scope === 'capital').length
  const provinceCount = upcomingOutings.filter((item) => item.scope === 'province').length
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
            <span className="eyebrow">Sevilla capital y provincia</span>
            <h1>Salidas extraordinarias</h1>
          </div>
          <div className={styles.introCopy}>
            <p>Encuentra de forma rápida las próximas extraordinarias y distingue con un toque las de Sevilla capital y las de la provincia.</p>
            <span
              className={styles.introMeta}
              aria-label={`${upcomingCount} próximas: ${capitalCount} en Sevilla capital y ${provinceCount} en la provincia. ${yearOutings.length} documentadas en ${currentYear}.`}
            >
              <strong>{upcomingCount}</strong> próximas · {yearOutings.length} documentadas en {currentYear}
            </span>
          </div>
        </header>

        <ExtraordinaryDirectory outings={outings} />

        {monthGroups.length ? (
          <section className={seoStyles.temporal} aria-labelledby="proximas-extraordinarias-meses">
            <header>
              <span className="eyebrow">Accesos rápidos</span>
              <h2 id="proximas-extraordinarias-meses">Próximas extraordinarias de Sevilla por meses</h2>
              <p>Abre solo el mes que te interese para consultar sus guías.</p>
            </header>
            <div className={seoStyles.monthGrid}>
              {monthGroups.map((group) => (
                <details key={group.key} className={seoStyles.monthCard}>
                  <summary className={seoStyles.monthHead}>
                    <h3>{group.label}</h3>
                    <span>{group.items.length}</span>
                  </summary>
                  <div className={seoStyles.monthLinks}>
                    {group.items.map((outing) => (
                      <Link href={`/extraordinarias/${outing.slug}`} key={outing.id}>
                        <span>{outing.dateParts?.day ? `${outing.dateParts.day} · ` : ''}{outing.title}</span>
                        <small>{outing.municipality}</small>
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {coronations.length ? (
          <section className={seoStyles.coronations} aria-labelledby="coronaciones-extraordinarias-sevilla">
            <header>
              <span className="eyebrow">Citas destacadas</span>
              <h2 id="coronaciones-extraordinarias-sevilla">Próximas coronaciones y salidas extraordinarias</h2>
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

        <section className={seoStyles.guide} aria-labelledby="guia-extraordinarias-sevilla">
          <span className="eyebrow">Cómo leer la agenda</span>
          <h2 id="guia-extraordinarias-sevilla">Qué encontrarás en cada extraordinaria</h2>
          <p>Las próximas citas aparecen primero y las ya celebradas permanecen disponibles como archivo. Cada guía reúne únicamente los datos confirmados: motivo, horarios, itinerario, acompañamiento musical y fuentes.</p>
          <p>Cuando un dato todavía no está publicado, se mantiene pendiente en lugar de completarlo sin documentación.</p>
        </section>
      </div>
    </section>
  )
}
