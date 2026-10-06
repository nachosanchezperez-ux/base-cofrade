import { connection } from 'next/server'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import { getPublicMusicChanges2027 } from '@/lib/supabase/public-directory-cache'
import {
  musicChangeDaySlug,
  musicChangeKindLabel,
  musicChangePositionLabel,
  normalizeMusicChangeText,
  SEMANA_SANTA_DAYS,
  sortMusicChanges,
} from '@/lib/music-changes'
import {
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

function groupBrotherhoodChanges(items = []) {
  const groups = new Map()

  for (const change of items) {
    const identity = change.brotherhoodEntityId || change.brotherhoodSlug || change.brotherhoodName
    const key = `${change.day}:${identity}`
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        day: change.day,
        brotherhoodName: change.brotherhoodName,
        brotherhoodHref: change.brotherhoodHref,
        municipality: change.municipality,
        scope: change.scope,
        changes: [],
      })
    }
    groups.get(key).changes.push(change)
  }

  return [...groups.values()]
}

function groupsFor(changes) {
  const municipalities = new Map()

  for (const change of sortMusicChanges(changes)) {
    const municipality = change.municipality || ''
    if (!municipalities.has(municipality)) municipalities.set(municipality, [])
    municipalities.get(municipality).push(change)
  }

  return [...municipalities.entries()]
    .sort(([a], [b]) => {
      if (!a) return 1
      if (!b) return -1
      return a.localeCompare(b, 'es', { sensitivity: 'base' })
    })
    .map(([municipality, items]) => ({
      slug: normalizeMusicChangeText(municipality).replaceAll(' ', '-') || 'sin-municipio',
      label: municipality === 'Sevilla' ? 'Sevilla capital' : municipality || 'Municipio por confirmar',
      items,
      brotherhoodCount: new Set(items.map((change) => (
        change.brotherhoodEntityId || change.brotherhoodSlug || change.brotherhoodName
      ))).size,
      brotherhoods: groupBrotherhoodChanges(items),
    }))
}

function municipalityRanking(changes, limit = 6) {
  const counts = new Map()
  for (const change of changes) {
    if (!change.municipality) continue
    counts.set(change.municipality, (counts.get(change.municipality) || 0) + 1)
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'es'))
    .slice(0, limit)
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

function bandLink(change, previous = false) {
  const name = previous
    ? change.previousBandDisplayName || change.previousBandName
    : change.newBandDisplayName || change.newBandName
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
      change.previousBandDisplayName,
      change.newBandName,
      change.newBandDisplayName,
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
  const lastUpdated = updatedLabel(changes)
  const municipalityTop = municipalityRanking(changes)
  const hasFilters = Boolean(activeDay || activeScope || activeMunicipality || activeType || requestedQuery)
  const allGroups = groupsFor(changes)
  const groups = hasFilters ? groupsFor(filtered) : allGroups

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
        items: allGroups.flatMap((group) => group.items).map((change) => ({
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

          <div className={styles.heroCopy}>
            <span>Semana Santa de Sevilla · 2027</span>
            <h1>Cambios musicales 2027</h1>
            <p>
              Relevos de bandas y nuevas incorporaciones confirmadas en las Hermandades de Sevilla y su provincia,
              con comparación entre los acompañamientos de 2026 y 2027.
            </p>
            <div className={styles.heroMeta} aria-label="Resumen del archivo">
              <span><strong>{changes.length}</strong> cambios</span>
              <span><strong>{brotherhoodCount}</strong> corporaciones</span>
              <span><strong>{newBandCount}</strong> formaciones entrantes</span>
              {lastUpdated ? <span>Actualizado <strong>{lastUpdated}</strong></span> : null}
            </div>
          </div>
        </div>
      </header>

      <div className={`shell ${styles.content}`}>
        <section className={styles.seoIntro} aria-labelledby="guia-cambios-musicales-2027">
          <h2 id="guia-cambios-musicales-2027">Cambios de bandas en la Semana Santa de Sevilla 2027</h2>
          <p>
            Hilo Cofrade reúne en esta guía los cambios de acompañamiento musical confirmados para 2027.
            El listado relaciona cada Hermandad con su jornada, municipio, Paso y formación musical,
            y permite consultar tanto los relevos de banda como las nuevas incorporaciones.
          </p>
        </section>

        <section className={styles.summaryStrip} aria-label="Resumen de cambios musicales 2027">
          <div className={styles.totalChanges}>
            <strong>{changes.length}</strong>
            <span>cambios confirmados</span>
          </div>

          <div className={styles.municipalitySummary}>
            <div className={styles.summaryHeading}>
              <span>Municipios con más cambios</span>
              <small>Consulta rápida por localidad</small>
            </div>
            <nav className={styles.municipalityList} aria-label="Municipios con más cambios musicales">
              {municipalityTop.map((item) => (
                <Link href={filterHref({ municipality: item.name })} key={item.name}>
                  <span>{item.name === 'Sevilla' ? 'Sevilla capital' : item.name}</span>
                  <strong>{item.count}</strong>
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section className={styles.explorer} id="explorar-cambios" aria-labelledby="explorar-cambios-musicales">
          <div className={styles.explorerHeader}>
            <div>
              <span>Filtrar listado</span>
              <h2 id="explorar-cambios-musicales">Encuentra un cambio musical</h2>
            </div>
            <p>{changes.length} cambios confirmados entre Sevilla capital y la provincia.</p>
          </div>

          <form
            key={filterHref({ day: activeDay, scope: activeScope, municipality: activeMunicipality, type: activeType, query: requestedQuery })}
            className={styles.searchPanel}
            action={PATH}
            method="get"
          >
            <label className={styles.searchField}>
              <span>Buscar</span>
              <input type="search" name="q" defaultValue={requestedQuery} placeholder="Hermandad, banda o paso…" autoComplete="off" />
            </label>
            <label><span>Jornada</span><select name="jornada" defaultValue={activeDay}><option value="">Todas</option>{dayOptions.map((day) => <option value={day.slug} key={day.slug}>{day.label}</option>)}</select></label>
            <label><span>Ámbito</span><select name="ambito" defaultValue={activeScope}><option value="">Todo</option><option value="capital">Sevilla capital</option><option value="province">Provincia</option></select></label>
            <label><span>Municipio</span><select name="municipio" defaultValue={activeMunicipality}><option value="">Todos</option>{municipalities.map((municipality) => <option value={municipality} key={municipality}>{municipality}</option>)}</select></label>
            <label><span>Formación</span><select name="tipo" defaultValue={activeType}><option value="">Todas</option>{BAND_TYPES.map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}</select></label>
            <button type="submit">Aplicar</button>
            {hasFilters ? <Link href={PATH}>Limpiar</Link> : null}
          </form>

          <div className={styles.resultBar} aria-live="polite">
            <strong>{filtered.length} {filtered.length === 1 ? 'cambio' : 'cambios'}</strong>
            <span>
              Municipios A–Z ·{' '}
              {activeDay ? dayOptions.find((day) => day.slug === activeDay)?.label : 'Todas las jornadas'}
              {activeScope ? ` · ${activeScope === 'capital' ? 'Sevilla capital' : 'Provincia'}` : ''}
              {activeMunicipality ? ` · ${activeMunicipality}` : ''}
            </span>
            {hasFilters ? <Link href={PATH}>Ver listado completo</Link> : null}
          </div>
        </section>

        {groups.length ? (
          <div className={styles.municipalityGroups}>
            {groups.map((group) => (
              <section className={styles.municipalityGroup} key={group.slug} aria-labelledby={`municipio-${group.slug}`}>
                <header className={styles.municipalityHeading}>
                  <h2 id={`municipio-${group.slug}`}>{group.label}</h2>
                  <span>{group.items.length} {group.items.length === 1 ? 'cambio' : 'cambios'} · {group.brotherhoodCount} {group.brotherhoodCount === 1 ? 'corporación' : 'corporaciones'}</span>
                </header>

                <div className={styles.brotherhoodList}>
                  {group.brotherhoods.map((brotherhood) => (
                    <article className={styles.brotherhoodCluster} key={brotherhood.key}>
                      <header className={styles.clusterHeader}>
                        <div>
                          <h3>
                            {brotherhood.brotherhoodHref
                              ? <Link href={brotherhood.brotherhoodHref}>{brotherhood.brotherhoodName}</Link>
                              : brotherhood.brotherhoodName}
                          </h3>
                          <span>
                            {brotherhood.day}
                            {brotherhood.changes.length > 1 ? ` · ${brotherhood.changes.length} cambios` : ''}
                          </span>
                        </div>
                      </header>

                      <div className={styles.clusterChanges}>
                        {brotherhood.changes.map((change) => {
                          const positionLabel = musicChangePositionLabel(change)
                          return (
                            <section
                              className={styles.movement}
                              id={`cambio-${change.id}`}
                              key={change.id}
                            >
                              <div className={styles.movementLead}>
                                <strong>
                                  {change.stepHref ? <Link href={change.stepHref}>{change.stepName}</Link> : change.stepName}
                                </strong>
                                {positionLabel ? <small>{positionLabel}</small> : null}
                                <span>{musicChangeKindLabel(change.kind)} · {bandFamilyLabel(change)}</span>
                              </div>

                              <dl className={styles.bandComparison} aria-label="Acompañamiento musical en 2026 y 2027">
                                <div className={styles.bandCell}>
                                  <dt>2026</dt>
                                  <dd>{bandLink(change, true)}</dd>
                                </div>
                                <div className={`${styles.bandCell} ${styles.bandCellNew}`}>
                                  <dt>2027</dt>
                                  <dd>{bandLink(change)}</dd>
                                </div>
                              </dl>
                            </section>
                          )
                        })}
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
            <p>Prueba otra jornada, municipio o formación.</p>
            <Link href={PATH}>Ver todos los cambios →</Link>
          </div>
        )}

        <section className={styles.method} aria-labelledby="criterio-cambios-musicales">
          <div><span>Criterio editorial</span><h2 id="criterio-cambios-musicales">Solo cambios confirmados</h2></div>
          <div className={styles.methodCopy}>
            <p>El listado incluye relevos y nuevas incorporaciones con vigencia desde 2027. Las renovaciones sin cambio de formación y los acuerdos no confirmados quedan fuera.</p>
          </div>
        </section>

        <nav className={styles.related} aria-label="Seguir explorando la música cofrade">
          <div><span>Sigue tirando del hilo</span><strong>Del cambio musical a toda la enciclopedia</strong></div>
          <Link href="/hermandades">Hermandades <span>→</span></Link>
          <Link href="/bandas">Bandas <span>→</span></Link>
          <Link href="/crucetas-musicales">Crucetas <span>→</span></Link>
          <Link href="/marchas">Marchas <span>→</span></Link>
        </nav>
      </div>
    </div>
  )
}
