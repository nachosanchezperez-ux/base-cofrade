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
    const key = change.brotherhoodSlug || change.brotherhoodName
    if (!groups.has(key)) {
      groups.set(key, {
        key,
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
  return SEMANA_SANTA_DAYS.flatMap((day) => {
    const items = changes.filter((change) => change.day === day.label)
    return items.length
      ? [{ ...day, items, brotherhoods: groupBrotherhoodChanges(items) }]
      : []
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
  const lastUpdated = updatedLabel(changes)
  const groups = groupsFor(filtered)
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
              <span>Especial · Archivo musical 2027</span>
              <h1>Cambios musicales de la Semana Santa de Sevilla 2027</h1>
              <p>
                Relevos de bandas, nuevas incorporaciones y acompañamientos confirmados en Sevilla y
                su provincia. Hilo Cofrade compara la fotografía musical de 2026 con la que ya se
                dibuja para 2027.
              </p>
              <nav className={styles.heroActions} aria-label="Accesos rápidos a los cambios musicales">
                <Link href={filterHref({ scope: 'capital' })}>Sevilla capital <b>{capitalCount}</b></Link>
                <Link href={filterHref({ scope: 'province' })}>Provincia <b>{provinceCount}</b></Link>
                <a href="#explorar-cambios">Explorar cambios <span aria-hidden="true">↓</span></a>
              </nav>
            </div>

            <aside className={styles.heroScore} aria-label="Resumen de cambios musicales 2027">
              <div className={styles.heroNumber}>
                <strong>{changes.length}</strong>
                <span>cambios confirmados</span>
              </div>
              <dl className={styles.heroStats}>
                <div><dt>Corporaciones relacionadas</dt><dd>{brotherhoodCount}</dd></div>
                <div><dt>Formaciones entrantes</dt><dd>{newBandCount}</dd></div>
              </dl>
              {lastUpdated ? <p>Actualizado el <strong>{lastUpdated}</strong></p> : null}
            </aside>
          </div>
        </div>
      </header>

      <div className={`shell ${styles.content}`}>
        <section className={styles.intro} aria-labelledby="guia-cambios-musicales-2027">
          <div>
            <span>Guía viva · Semana Santa 2027</span>
            <h2 id="guia-cambios-musicales-2027">Todos los cambios de bandas, en un solo hilo</h2>
          </div>
          <div className={styles.introCopy}>
            <p>
              Esta guía reúne los cambios de acompañamiento musical ya confirmados para la Semana Santa
              de Sevilla de 2027: contratos que provocan un relevo, nuevas bandas tras un paso y
              modificaciones en posiciones como la Cruz de Guía. Cada movimiento se relaciona con la
              Hermandad, el Paso y la formación musical cuando sus fichas están publicadas.
            </p>
            <p>
              El objetivo es ofrecer una referencia estable: cada cambio se integra en la red de Hilo Cofrade
              y se actualiza cuando las corporaciones y las bandas hacen oficiales sus acuerdos.
            </p>
          </div>
        </section>

        <section className={styles.panorama} aria-labelledby="panorama-musical-2027">
          <header className={styles.sectionHeading}>
            <div>
              <span>Panorama 2027</span>
              <h2 id="panorama-musical-2027">Consulta los cambios por jornada o localidad</h2>
            </div>
            <p>Dos accesos rápidos para llegar al dato sin recorrer toda la página.</p>
          </header>

          <div className={styles.panoramaGrid}>
            <nav className={styles.dayMatrix} aria-label="Cambios musicales por jornada">
              {dayOptions.map((day) => {
                const count = changes.filter((item) => item.day === day.label).length
                return (
                  <Link
                    href={filterHref({
                      day: day.slug,
                      scope: activeScope,
                      municipality: activeMunicipality,
                      type: activeType,
                      query: requestedQuery,
                    })}
                    key={day.slug}
                  >
                    <span>{day.label}</span>
                    <strong>{count}</strong>
                  </Link>
                )
              })}
            </nav>

            <div className={styles.municipalityPanel}>
              <div className={styles.panelTitle}>
                <strong>Localidades con más movimientos</strong>
                <span>{changes.length} cambios confirmados</span>
              </div>
              <ol>
                {municipalityTop.map((item) => (
                  <li key={item.name}>
                    <Link href={filterHref({ municipality: item.name })}>
                      <span>{item.name}</span>
                      <strong>{item.count}</strong>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className={styles.explorer} id="explorar-cambios" aria-labelledby="explorar-cambios-musicales">
          <header className={styles.sectionHeading}>
            <div>
              <span>Buscador del especial</span>
              <h2 id="explorar-cambios-musicales">Encuentra una Hermandad, una banda o una jornada</h2>
            </div>
            <p>Combina filtros para acotar los {changes.length} cambios ya documentados.</p>
          </header>

          <form className={styles.searchPanel} action={PATH} method="get">
            <label className={styles.searchField}>
              <span>Buscar</span>
              <input type="search" name="q" defaultValue={requestedQuery} placeholder="Hermandad, banda, paso…" autoComplete="off" />
            </label>
            <label><span>Jornada</span><select name="jornada" defaultValue={activeDay}><option value="">Todas</option>{dayOptions.map((day) => <option value={day.slug} key={day.slug}>{day.label}</option>)}</select></label>
            <label><span>Ámbito</span><select name="ambito" defaultValue={activeScope}><option value="">Todo</option><option value="capital">Sevilla capital</option><option value="province">Provincia</option></select></label>
            <label><span>Municipio</span><select name="municipio" defaultValue={activeMunicipality}><option value="">Todos</option>{municipalities.map((municipality) => <option value={municipality} key={municipality}>{municipality}</option>)}</select></label>
            <label><span>Formación entrante</span><select name="tipo" defaultValue={activeType}><option value="">Todas</option>{BAND_TYPES.map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}</select></label>
            <button type="submit">Aplicar filtros</button>
            {hasFilters ? <Link href={PATH}>Limpiar</Link> : null}
          </form>

          <div className={styles.resultBar} aria-live="polite">
            <div>
              <strong>{filtered.length} {filtered.length === 1 ? 'cambio' : 'cambios'}</strong>
              <span>
                {activeDay ? dayOptions.find((day) => day.slug === activeDay)?.label : 'Semana Santa 2027'}
                {activeScope ? ` · ${activeScope === 'capital' ? 'Sevilla capital' : 'Provincia'}` : ''}
                {activeMunicipality ? ` · ${activeMunicipality}` : ''}
              </span>
            </div>
            {hasFilters ? <Link href={PATH}>Ver los {changes.length} cambios</Link> : <span>Confirmados y documentados</span>}
          </div>
        </section>

        {groups.length ? (
          <div className={styles.dayGroups}>
            {groups.map((group) => (
              <section className={styles.dayGroup} key={group.slug} aria-labelledby={`jornada-${group.slug}`}>
                <header className={styles.dayHeading}>
                  <div><span>Semana Santa 2027</span><h2 id={`jornada-${group.slug}`}>{group.label}</h2></div>
                  <div className={styles.dayCount}>
                    <strong>{group.items.length}</strong>
                    <span>{group.items.length === 1 ? 'cambio' : 'cambios'} · {group.brotherhoods.length} {group.brotherhoods.length === 1 ? 'corporación' : 'corporaciones'}</span>
                  </div>
                </header>

                <div className={styles.brotherhoodList}>
                  {group.brotherhoods.map((brotherhood) => (
                    <article
                      className={styles.brotherhoodCluster}
                      data-multiple={brotherhood.changes.length > 1 ? 'true' : 'false'}
                      key={brotherhood.key}
                    >
                      <header className={styles.clusterHeader}>
                        <div>
                          <span>{brotherhood.scope === 'capital' ? 'Sevilla capital' : brotherhood.municipality}</span>
                          <h3>
                            {brotherhood.brotherhoodHref
                              ? <Link href={brotherhood.brotherhoodHref}>{brotherhood.brotherhoodName}</Link>
                              : brotherhood.brotherhoodName}
                          </h3>
                        </div>
                        {brotherhood.changes.length > 1 ? (
                          <div className={styles.clusterCount}>
                            <strong>{brotherhood.changes.length}</strong>
                            <span>cambios musicales</span>
                          </div>
                        ) : null}
                      </header>

                      <div className={styles.clusterChanges}>
                        {brotherhood.changes.map((change, index) => (
                          <section
                            className={styles.movement}
                            data-kind={change.kind}
                            id={`cambio-${change.id}`}
                            key={change.id}
                          >
                            <div className={styles.movementLead}>
                              <span className={styles.movementNumber}>{String(index + 1).padStart(2, '0')}</span>
                              <div>
                                <div className={styles.movementEyebrow}>
                                  <span>{musicChangeKindLabel(change.kind)}</span>
                                  <i aria-hidden="true">·</i>
                                  <span>{bandFamilyLabel(change)}</span>
                                </div>
                                <strong>
                                  {change.stepHref ? <Link href={change.stepHref}>{change.stepName}</Link> : change.stepName}
                                </strong>
                                {change.position && change.position !== change.stepName ? <small>{change.position}</small> : null}
                              </div>
                            </div>

                            <div className={styles.transition} aria-label={`Cambio musical de ${brotherhood.brotherhoodName}`}>
                              <div className={styles.bandBefore}>
                                <div className={styles.yearLabel}><b>2026</b><span>Hasta ahora</span></div>
                                {bandLink(change, true)}
                              </div>
                              <div className={styles.arrow} aria-hidden="true"><span>→</span></div>
                              <div className={styles.bandAfter}>
                                <div className={styles.yearLabel}><b>2027</b><span>Nueva etapa</span></div>
                                {bandLink(change)}
                              </div>
                            </div>

                            <div className={styles.movementLinks}>
                              {change.stepHref ? <Link href={change.stepHref}>Paso</Link> : null}
                              {change.newBandHref ? <Link href={change.newBandHref}>Banda 2027</Link> : null}
                            </div>
                          </section>
                        ))}
                      </div>

                      {brotherhood.brotherhoodHref ? (
                        <footer className={styles.clusterFooter}>
                          <span>Entidad relacionada</span>
                          <Link href={brotherhood.brotherhoodHref}>Ver ficha de la Hermandad →</Link>
                        </footer>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className={styles.empty}><strong>No hay cambios confirmados con esos filtros.</strong><p>Prueba otra jornada, municipio o formación.</p><Link href={PATH}>Ver todos los cambios →</Link></div>
        )}

        <section className={styles.method} aria-labelledby="criterio-cambios-musicales">
          <div><span>Criterio editorial</span><h2 id="criterio-cambios-musicales">Qué entra en este archivo</h2></div>
          <div className={styles.methodCopy}>
            <p>Se muestran únicamente nuevos acompañamientos publicados con inicio en 2027 y vinculados a una corporación de Sevilla o su provincia. Cuando existe un acompañamiento del mismo paso o posición cerrado en 2026, Hilo Cofrade lo presenta como relevo.</p>
            <p>Las renovaciones sin cambio de formación no aparecen aquí. Tampoco se convierten en cambios las negociaciones, candidaturas o continuidades no confirmadas oficialmente.</p>
          </div>
        </section>

        <section className={styles.faq} aria-labelledby="preguntas-cambios-musicales">
          <header className={styles.sectionHeading}><div><span>Preguntas frecuentes</span><h2 id="preguntas-cambios-musicales">Cómo leer los cambios musicales de 2027</h2></div></header>
          <div className={styles.faqGrid}>
            <details><summary>¿Qué cambios de bandas aparecen en esta guía?</summary><p>Relevos confirmados, nuevas incorporaciones y cambios de formación o posición musical con vigencia desde la Semana Santa de 2027.</p></details>
            <details><summary>¿Incluye Sevilla capital y la provincia?</summary><p>Sí. El archivo reúne movimientos de la capital y de los municipios de la provincia de Sevilla y permite filtrarlos por ámbito y localidad.</p></details>
            <details><summary>¿Se publican rumores o acuerdos ligados a candidaturas?</summary><p>No. Hilo Cofrade solo incorpora el cambio cuando existe una confirmación suficientemente acreditada. Los escenarios pendientes quedan fuera del contador.</p></details>
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
