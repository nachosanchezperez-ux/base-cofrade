import { connection } from 'next/server'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import { getPublicMusicChanges2027 } from '@/lib/supabase/public-directory-cache'
import {
  musicChangeDaySlug,
  musicChangeKindLabel,
  normalizeMusicChangeText,
  SEMANA_SANTA_DAYS,
} from '@/lib/music-changes'
import {
  absoluteUrl,
  breadcrumbJsonLd,
  collectionPageJsonLd,
  filteredViewRobots,
  socialMetadata,
} from '@/lib/seo'
import styles from './cambios-musicales.module.css'

export const revalidate = 300

const PATH = '/semana-santa/2027/cambios-musicales'
const title = 'Cambios de bandas en la Semana Santa de Sevilla 2027'
const description = 'Todos los cambios musicales de la Semana Santa de Sevilla 2027: relevos de bandas, nuevas incorporaciones y acompañamientos confirmados en Sevilla y su provincia, comparados con 2026.'

const BAND_TYPES = [
  { key: 'agrupacion', label: 'Agrupación Musical' },
  { key: 'cornetas', label: 'Cornetas y Tambores' },
  { key: 'musica', label: 'Banda de Música' },
]

export async function generateMetadata({ searchParams } = {}) {
  const robots = filteredViewRobots(await searchParams, ['jornada', 'ambito', 'municipio', 'tipo', 'q'])
  return {
    title,
    description,
    ...socialMetadata({
      title: 'Cambios de bandas · Semana Santa de Sevilla 2027',
      description,
      path: PATH,
    }),
    ...(robots ? { robots } : {}),
  }
}

function filterHref({ day = '', scope = '', municipality = '', type = '', query = '' } = {}) {
  const params = new URLSearchParams()
  if (day) params.set('jornada', day)
  if (scope) params.set('ambito', scope)
  if (municipality) params.set('municipio', municipality)
  if (type) params.set('tipo', type)
  if (query) params.set('q', query)
  const suffix = params.toString()
  return suffix ? `${PATH}?${suffix}` : PATH
}

function updatedLabel(changes) {
  const timestamps = changes
    .map((item) => item.updatedAt ? new Date(item.updatedAt).getTime() : 0)
    .filter(Number.isFinite)
    .filter(Boolean)

  if (!timestamps.length) return ''
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(new Date(Math.max(...timestamps)))
}

function groupsFor(changes) {
  return SEMANA_SANTA_DAYS.flatMap((day) => {
    const items = changes.filter((change) => change.day === day.label)
    return items.length ? [{ ...day, items }] : []
  })
}

function bandFamilyKey(change) {
  const value = normalizeMusicChangeText(
    [change.newBandType, change.newBandName].filter(Boolean).join(' '),
  )
  if (value.includes('cornetas') || value.includes('tambores')) return 'cornetas'
  if (value.includes('agrupacion musical')) return 'agrupacion'
  return 'musica'
}

function bandFamilyLabel(change) {
  return BAND_TYPES.find((item) => item.key === bandFamilyKey(change))?.label || 'Formación musical'
}

function latestChanges(changes) {
  return [...changes]
    .sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return bTime - aTime
    })
    .slice(0, 4)
}

function municipalityRanking(changes) {
  const counts = new Map()
  for (const change of changes) {
    if (!change.municipality) continue
    counts.set(change.municipality, (counts.get(change.municipality) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'es'))
    .slice(0, 6)
}

function bandLink(change, previous = false) {
  const name = previous ? change.previousBandName : change.newBandName
  const href = previous ? change.previousBandHref : change.newBandHref
  if (!name) return <strong>Sin acompañamiento anterior documentado</strong>
  return href ? <Link href={href}>{name}</Link> : <strong>{name}</strong>
}

export default async function CambiosMusicales2027Page({ searchParams } = {}) {
  await connection()
  const params = await searchParams
  const changes = await getPublicMusicChanges2027()

  const dayOptions = SEMANA_SANTA_DAYS.filter((day) => (
    changes.some((change) => change.day === day.label)
  ))
  const daySlugs = new Set(dayOptions.map((day) => day.slug))
  const municipalities = [...new Set(changes.map((item) => item.municipality).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))

  const requestedDay = String(params?.jornada || '')
  const requestedScope = String(params?.ambito || '')
  const requestedMunicipality = String(params?.municipio || '')
  const requestedType = String(params?.tipo || '')
  const requestedQuery = String(params?.q || '').trim().slice(0, 80)

  const activeDay = daySlugs.has(requestedDay) ? requestedDay : ''
  const activeScope = ['capital', 'province'].includes(requestedScope) ? requestedScope : ''
  const activeMunicipality = municipalities.includes(requestedMunicipality) ? requestedMunicipality : ''
  const activeType = BAND_TYPES.some((item) => item.key === requestedType) ? requestedType : ''
  const normalizedQuery = normalizeMusicChangeText(requestedQuery)

  const filtered = changes.filter((change) => {
    const searchable = normalizeMusicChangeText([
      change.brotherhoodName,
      change.municipality,
      change.stepName,
      change.position,
      change.previousBandName,
      change.newBandName,
      bandFamilyLabel(change),
    ].filter(Boolean).join(' '))

    return (
      (!activeDay || musicChangeDaySlug(change.day) === activeDay)
      && (!activeScope || change.scope === activeScope)
      && (!activeMunicipality || change.municipality === activeMunicipality)
      && (!activeType || bandFamilyKey(change) === activeType)
      && (!normalizedQuery || searchable.includes(normalizedQuery))
    )
  })

  const brotherhoodCount = new Set(changes.map((item) => item.brotherhoodSlug || item.brotherhoodName)).size
  const newBandCount = new Set(changes.map((item) => item.newBandSlug || item.newBandName)).size
  const capitalCount = changes.filter((item) => item.scope === 'capital').length
  const provinceCount = changes.filter((item) => item.scope === 'province').length
  const capitalPercent = changes.length ? Math.round((capitalCount / changes.length) * 100) : 0
  const lastUpdated = updatedLabel(changes)
  const groups = groupsFor(filtered)
  const recent = latestChanges(changes)
  const municipalityTop = municipalityRanking(changes)
  const hasFilters = Boolean(activeDay || activeScope || activeMunicipality || activeType || requestedQuery)

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Semana Santa 2027', path: PATH },
        { name: 'Cambios musicales', path: PATH },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path: PATH,
        name: title,
        description,
        items: changes.map((change) => ({
          name: `${change.brotherhoodName}: ${change.newBandName}`,
          path: `${PATH}#cambio-${change.id}`,
        })),
      })} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroInner}`}>
          <SiteBreadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Semana Santa 2027' },
              { label: 'Cambios musicales' },
            ]}
            tone="dark"
            showAccent={false}
          />
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <span>Archivo musical · 2027</span>
              <h1>Cambios musicales</h1>
              <p>
                Los relevos de bandas confirmados para la Semana Santa de Sevilla y su provincia,
                comparados con el acompañamiento documentado de 2026.
              </p>
            </div>
            <dl className={styles.metrics}>
              <div><dt>Cambios confirmados</dt><dd>{changes.length}</dd></div>
              <div><dt>Hermandades</dt><dd>{brotherhoodCount}</dd></div>
              <div><dt>Bandas que llegan</dt><dd>{newBandCount}</dd></div>
            </dl>
          </div>
          <div className={styles.heroMeta}>
            <span>Sevilla capital: <strong>{capitalCount}</strong></span>
            <span>Provincia: <strong>{provinceCount}</strong></span>
            {lastUpdated ? <span>Actualizado: <strong>{lastUpdated}</strong></span> : null}
          </div>
        </div>
      </header>

      <div className={`shell ${styles.content}`}>
        <section className={styles.controls} aria-labelledby="filtrar-cambios-musicales">
          <header>
            <div>
              <span>Explora 2027</span>
              <h2 id="filtrar-cambios-musicales">Encuentra los cambios por jornada</h2>
            </div>
            <p>Los filtros no alteran los datos: solo acotan esta lectura del archivo.</p>
          </header>

          <div className={styles.filterBlock}>
            <span className={styles.filterLabel}>Jornada</span>
            <nav className={styles.filters} aria-label="Filtrar cambios por jornada">
              <Link
                href={filterHref({ scope: activeScope })}
                className={!activeDay ? styles.activeFilter : ''}
                aria-current={!activeDay ? 'page' : undefined}
              >
                Todas <b>{changes.length}</b>
              </Link>
              {dayOptions.map((day) => {
                const count = changes.filter((item) => item.day === day.label).length
                return (
                  <Link
                    href={filterHref({ day: day.slug, scope: activeScope })}
                    className={activeDay === day.slug ? styles.activeFilter : ''}
                    aria-current={activeDay === day.slug ? 'page' : undefined}
                    key={day.slug}
                  >
                    {day.label} <b>{count}</b>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className={styles.filterBlock}>
            <span className={styles.filterLabel}>Ámbito</span>
            <nav className={styles.filters} aria-label="Filtrar cambios por ámbito">
              <Link
                href={filterHref({ day: activeDay })}
                className={!activeScope ? styles.activeFilter : ''}
                aria-current={!activeScope ? 'page' : undefined}
              >
                Todo
              </Link>
              <Link
                href={filterHref({ day: activeDay, scope: 'capital' })}
                className={activeScope === 'capital' ? styles.activeFilter : ''}
                aria-current={activeScope === 'capital' ? 'page' : undefined}
              >
                Sevilla capital <b>{capitalCount}</b>
              </Link>
              <Link
                href={filterHref({ day: activeDay, scope: 'province' })}
                className={activeScope === 'province' ? styles.activeFilter : ''}
                aria-current={activeScope === 'province' ? 'page' : undefined}
              >
                Provincia <b>{provinceCount}</b>
              </Link>
            </nav>
          </div>
        </section>

        <div className={styles.resultBar} aria-live="polite">
          <div>
            <strong>{filtered.length} {filtered.length === 1 ? 'cambio' : 'cambios'}</strong>
            <span>
              {activeDay ? dayOptions.find((day) => day.slug === activeDay)?.label : 'Semana Santa 2027'}
              {activeScope ? ` · ${activeScope === 'capital' ? 'Sevilla capital' : 'Provincia'}` : ''}
            </span>
          </div>
          {(activeDay || activeScope) ? <Link href={PATH}>Limpiar filtros</Link> : <span>Confirmados y documentados</span>}
        </div>

        {groups.length ? (
          <div className={styles.dayGroups}>
            {groups.map((group) => (
              <section className={styles.dayGroup} key={group.slug} aria-labelledby={`jornada-${group.slug}`}>
                <header className={styles.dayHeading}>
                  <div>
                    <span>Semana Santa 2027</span>
                    <h2 id={`jornada-${group.slug}`}>{group.label}</h2>
                  </div>
                  <strong>{group.items.length}</strong>
                </header>

                <div className={styles.changeList}>
                  {group.items.map((change) => (
                    <article className={styles.changeCard} id={`cambio-${change.id}`} key={change.id}>
                      <header className={styles.cardHeader}>
                        <div className={styles.cardIdentity}>
                          <span>{musicChangeKindLabel(change.kind)}</span>
                          <h3>
                            {change.brotherhoodHref
                              ? <Link href={change.brotherhoodHref}>{change.brotherhoodName}</Link>
                              : change.brotherhoodName}
                          </h3>
                          <p>{change.municipality}</p>
                        </div>
                        <span className={styles.scope}>{change.scope === 'capital' ? 'Sevilla capital' : 'Provincia'}</span>
                      </header>

                      <div className={styles.stepLine}>
                        <span>Acompañamiento</span>
                        {change.stepHref
                          ? <Link href={change.stepHref}>{change.stepName}</Link>
                          : <strong>{change.stepName}</strong>}
                        {change.position && change.position !== change.stepName ? <small>{change.position}</small> : null}
                      </div>

                      <div className={styles.transition} aria-label={`Cambio musical de ${change.brotherhoodName}`}>
                        <div className={styles.bandBefore}>
                          <span>Hasta 2026</span>
                          {bandLink(change, true)}
                        </div>
                        <div className={styles.arrow} aria-hidden="true">
                          <span>→</span>
                        </div>
                        <div className={styles.bandAfter}>
                          <span>Desde 2027</span>
                          {bandLink(change)}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>No hay cambios confirmados con esos filtros.</strong>
            <p>Prueba otra jornada o vuelve al listado completo.</p>
            <Link href={PATH}>Ver todos los cambios →</Link>
          </div>
        )}

        <section className={styles.method} aria-labelledby="criterio-cambios-musicales">
          <div>
            <span>Criterio editorial</span>
            <h2 id="criterio-cambios-musicales">Qué entra en esta sección</h2>
          </div>
          <div className={styles.methodCopy}>
            <p>
              Se muestran únicamente nuevos acompañamientos publicados con inicio en 2027 y vinculados
              a una Hermandad de Sevilla o su provincia. Cuando existe un acompañamiento del mismo paso
              o posición cerrado en 2026, Hilo Cofrade lo presenta como relevo.
            </p>
            <p>
              Las renovaciones sin cambio de formación no aparecen aquí. Tampoco se convierten en
              cambios las negociaciones, candidaturas o continuidades no confirmadas.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
