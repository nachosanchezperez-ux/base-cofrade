import { connection } from 'next/server'
import Link from 'next/link'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import { musicChangePositionLabel } from '@/lib/music-changes'
import { getPublicMusicAccompanimentSummary } from '@/lib/supabase/public-directory-cache'
import {
  breadcrumbJsonLd,
  collectionPageJsonLd,
  filteredViewRobots,
  socialMetadata,
} from '@/lib/seo'
import styles from './acompanamientos-musicales.module.css'

export const revalidate = 300

const PATH = '/acompanamientos-musicales'
const CHANGES_PATH = '/semana-santa/2027/cambios-musicales'
const TITLE = 'Acompañamientos musicales por banda en Sevilla y provincia'
const DESCRIPTION = 'Consulta los acompañamientos de Semana Santa documentados por banda en Hilo Cofrade, con desglose de Sevilla capital y el resto de la provincia.'
const TYPE_LABELS = {
  agrupacion: 'Agrupación Musical',
  cornetas: 'Cornetas y Tambores',
  musica: 'Banda de Música',
}
const SORT_OPTIONS = [
  { key: 'nombre', label: 'Bandas A–Z' },
  { key: 'total', label: 'Más acompañamientos' },
  { key: 'capital', label: 'Más en la capital' },
  { key: 'province', label: 'Más en la provincia' },
]

function parameter(value) {
  return String(Array.isArray(value) ? value[0] || '' : value || '')
}

function normalized(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/\s+/g, ' ')
    .trim()
}

function filterHref({ year = 2026, query = '', type = '', order = 'nombre' } = {}) {
  const params = new URLSearchParams()
  if (year === 2027) params.set('temporada', '2027')
  if (query) params.set('q', query)
  if (type) params.set('tipo', type)
  if (order !== 'nombre') params.set('orden', order)
  const suffix = params.toString()
  return suffix ? `${PATH}?${suffix}` : PATH
}

function bandTypeKey(band) {
  return band.typeKey || 'otros'
}

function bandTypeLabel(band) {
  return TYPE_LABELS[bandTypeKey(band)] || band.type || 'Otra formación musical'
}

function compareBands(order) {
  return (first, second) => {
    const difference = order === 'nombre' ? 0 : second[order] - first[order]
    return difference || first.name.localeCompare(second.name, 'es', { sensitivity: 'base' })
  }
}

function countLabel(count, singular, plural) {
  return `${count.toLocaleString('es-ES')} ${count === 1 ? singular : plural}`
}

function BandName({ band }) {
  return band.href ? <Link href={band.href}>{band.name}</Link> : band.name
}

function Count({ value, isAdvance }) {
  return isAdvance && value === 0 ? (
    <>
      <span aria-hidden="true">—</span>
      <span className={styles.srOnly}>Sin acompañamientos identificados para 2027</span>
    </>
  ) : value.toLocaleString('es-ES')
}

function AccompanimentList({ items }) {
  const municipalities = new Map()
  for (const item of items) {
    const municipality = item.municipality || 'Municipio por documentar'
    if (!municipalities.has(municipality)) municipalities.set(municipality, [])
    municipalities.get(municipality).push(item)
  }

  return (
    <div className={styles.accompanimentGroups}>
      {[...municipalities.entries()].map(([municipality, entries]) => (
        <section className={styles.accompanimentGroup} key={municipality}>
          <h4>{municipality === 'Sevilla' ? 'Sevilla capital' : municipality}</h4>
          <ul className={styles.accompanimentList}>
            {entries.map((item) => {
              const contextLabel = [item.stepName, musicChangePositionLabel(item)].filter(Boolean).join(' · ')
              return (
                <li key={item.id}>
                  <div className={styles.accompanimentIdentity}>
                    <strong>
                      {item.brotherhoodHref
                        ? <Link href={item.brotherhoodHref}>{item.brotherhoodName}</Link>
                        : item.brotherhoodName}
                    </strong>
                    <span>{item.day}</span>
                  </div>
                  <div className={styles.accompanimentContext}>
                    {contextLabel ? <p>{contextLabel}</p> : null}
                    {item.periodLabel ? <span>{item.periodLabel}</span> : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

export async function generateMetadata({ searchParams } = {}) {
  const params = await searchParams
  const year = parameter(params?.temporada) === '2027' ? 2027 : 2026
  const seasonTitle = `${year === 2027 ? 'Avance 2027' : 'Semana Santa 2026'} · Acompañamientos musicales por banda`
  const robots = filteredViewRobots(params, ['temporada', 'q', 'tipo', 'orden'])
  return {
    title: seasonTitle,
    description: DESCRIPTION,
    ...socialMetadata({ title: seasonTitle, description: DESCRIPTION, path: PATH }),
    ...(robots ? { robots } : {}),
  }
}

export default async function AcompanamientosMusicalesPage({ searchParams } = {}) {
  await connection()
  const params = await searchParams
  const year = parameter(params?.temporada) === '2027' ? 2027 : 2026
  const summary = await getPublicMusicAccompanimentSummary(year)
  const { bands, totals, isAdvance } = summary
  const query = parameter(params?.q).trim().slice(0, 80)
  const requestedType = parameter(params?.tipo)
  const requestedOrder = parameter(params?.orden)
  const typeOptions = [...new Map(bands.map((band) => [
    bandTypeKey(band),
    { key: bandTypeKey(band), label: bandTypeLabel(band) },
  ])).values()].sort((first, second) => first.label.localeCompare(second.label, 'es'))
  const activeType = typeOptions.some((type) => type.key === requestedType) ? requestedType : ''
  const activeOrder = SORT_OPTIONS.some((order) => order.key === requestedOrder) ? requestedOrder : 'nombre'
  const normalizedQuery = normalized(query)
  const matchingBands = bands.filter((band) => (
    (!activeType || bandTypeKey(band) === activeType)
    && (!normalizedQuery || normalized(band.name).includes(normalizedQuery))
  ))
  const recordedBands = matchingBands.filter((band) => band.total > 0).sort(compareBands(activeOrder))
  const pendingBands = matchingBands.filter((band) => band.pendingCount > 0)
    .sort(compareBands('nombre'))
  const filteredTotal = recordedBands.reduce((total, band) => total + band.total, 0)
  const filteredPendingTotal = pendingBands.reduce((total, band) => total + band.pendingCount, 0)
  const hasFilters = Boolean(query || activeType || activeOrder !== 'nombre')
  const seasonHref = filterHref({ year })
  const formKey = filterHref({ year, query, type: activeType, order: activeOrder })

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Bandas', path: '/bandas' },
        { name: 'Acompañamientos musicales', path: PATH },
      ])} />
      <JsonLd data={collectionPageJsonLd({
        path: seasonHref,
        name: `${TITLE} · ${year}`,
        description: DESCRIPTION,
        items: bands.filter((band) => band.total > 0).map((band) => ({
          name: band.name,
          path: `${seasonHref}#banda-${band.id}`,
        })),
      })} />

      <header className={styles.hero}>
        <div className={`shell ${styles.heroInner}`}>
          <SiteBreadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Bandas', href: '/bandas' },
              { label: 'Acompañamientos musicales' },
            ]}
            tone="dark"
            showAccent={false}
          />
          <div className={styles.heroCopy}>
            <span>Semana Santa · Sevilla y provincia</span>
            <h1>Acompañamientos musicales por banda</h1>
            <p>Consulta el reparto de los acompañamientos documentados de cada formación entre Sevilla capital y los municipios de la provincia.</p>
          </div>
          <nav className={styles.heroLinks} aria-label="Explorar la música cofrade">
            <Link href={CHANGES_PATH}>Cambios musicales 2027 <span aria-hidden="true">→</span></Link>
            <Link href="/bandas">Directorio de bandas <span aria-hidden="true">→</span></Link>
          </nav>
        </div>
      </header>

      <div className={`shell ${styles.content}`}>
        <section className={styles.seasonIntro} aria-labelledby="temporada-acompanamientos">
          <div>
            <span className={styles.eyebrow}>Temporada seleccionada</span>
            <h2 id="temporada-acompanamientos">{isAdvance ? 'Avance de 2027' : 'Semana Santa 2026'}</h2>
          </div>
          <p>
            {isAdvance
              ? 'El recuento recoge los acompañamientos cuya vigencia para 2027 está identificada en Hilo Cofrade. Otros vínculos documentados siguen pendientes de revisión para esa temporada.'
              : 'Acompañamientos de Semana Santa y vísperas registrados para 2026 en Hilo Cofrade. Cada cifra permite consultar las Hermandades, municipios y pasos que la componen.'}
          </p>
        </section>

        <section className={styles.overview} aria-label={`Resumen de los registros incluidos de ${year}`}>
          <div className={styles.overviewHeading}>
            <span>Resumen de la temporada · todos los registros incluidos</span>
            <strong>{countLabel(summary.bandsCount, 'banda con acompañamientos', 'bandas con acompañamientos')}</strong>
          </div>
          <dl className={styles.totals}>
            <div><dt>Sevilla capital</dt><dd><Count value={totals.capital} isAdvance={isAdvance} /></dd></div>
            <div><dt>Resto de la provincia</dt><dd><Count value={totals.province} isAdvance={isAdvance} /></dd></div>
            <div className={styles.totalCombined}><dt>Total registrado</dt><dd><Count value={totals.total} isAdvance={isAdvance} /></dd></div>
          </dl>
        </section>

        <section className={styles.explorer} aria-labelledby="buscar-acompanamientos">
          <div className={styles.explorerHeading}>
            <h2 id="buscar-acompanamientos">Consulta una banda</h2>
            <p>Abre el desglose para ver sus acompañamientos por municipio.</p>
          </div>
          <form key={formKey} className={styles.searchPanel} action={PATH} method="get">
            <label className={styles.searchField}>
              <span>Buscar banda</span>
              <input type="search" name="q" defaultValue={query} placeholder="Santa Ana, Las Cigarreras…" autoComplete="off" />
            </label>
            <label>
              <span>Temporada</span>
              <select name="temporada" defaultValue={String(year)}>
                <option value="2026">Semana Santa 2026</option>
                <option value="2027">Avance de 2027</option>
              </select>
            </label>
            <label>
              <span>Formación</span>
              <select name="tipo" defaultValue={activeType}>
                <option value="">Todas</option>
                {typeOptions.map((type) => <option value={type.key} key={type.key}>{type.label}</option>)}
              </select>
            </label>
            <label>
              <span>Ordenar por</span>
              <select name="orden" defaultValue={activeOrder}>
                {SORT_OPTIONS.map((order) => <option value={order.key} key={order.key}>{order.label}</option>)}
              </select>
            </label>
            <div className={styles.formActions}>
              <button type="submit">Aplicar</button>
              {hasFilters ? <Link href={seasonHref}>Limpiar</Link> : null}
            </div>
          </form>
          <div className={styles.resultBar} aria-live="polite">
            <strong>{countLabel(recordedBands.length, 'banda en el recuento', 'bandas en el recuento')}</strong>
            <span>{countLabel(filteredTotal, 'acompañamiento', 'acompañamientos')} · {SORT_OPTIONS.find((order) => order.key === activeOrder)?.label}</span>
            {hasFilters ? <Link href={seasonHref}>Ver todas las bandas</Link> : null}
          </div>
        </section>

        {recordedBands.length ? (
          <div className={styles.tableContainer}>
            <table className={styles.bandTable} role="table" aria-describedby="criterio-cifras">
              <caption className={styles.srOnly}>Acompañamientos por banda en Sevilla capital y provincia · {year}</caption>
              <colgroup><col className={styles.nameColumn} /><col /><col /><col /></colgroup>
              <thead role="rowgroup">
                <tr role="row">
                  <th scope="col" role="columnheader" id="col-banda">Banda</th>
                  <th scope="col" role="columnheader" id="col-capital">Sevilla capital</th>
                  <th scope="col" role="columnheader" id="col-provincia">Resto de la provincia</th>
                  <th scope="col" role="columnheader" id="col-total">Total</th>
                </tr>
              </thead>
              {recordedBands.map((band) => (
                <tbody role="rowgroup" key={band.id} id={`banda-${band.id}`}>
                  <tr className={styles.bandRow} role="row">
                    <th scope="row" role="rowheader" id={`nombre-banda-${band.id}`} className={styles.bandIdentity}>
                      <h3><BandName band={band} /></h3>
                      <span>{bandTypeLabel(band)}</span>
                    </th>
                    <td role="cell" headers={`nombre-banda-${band.id} col-capital`}>
                      <span className={styles.mobileColumnLabel} aria-hidden="true">Sevilla capital</span>
                      <strong><Count value={band.capital} isAdvance={isAdvance} /></strong>
                    </td>
                    <td role="cell" headers={`nombre-banda-${band.id} col-provincia`}>
                      <span className={styles.mobileColumnLabel} aria-hidden="true">Resto de la provincia</span>
                      <strong><Count value={band.province} isAdvance={isAdvance} /></strong>
                    </td>
                    <td className={styles.bandTotal} role="cell" headers={`nombre-banda-${band.id} col-total`}>
                      <span className={styles.mobileColumnLabel} aria-hidden="true">Total</span>
                      <strong>{band.total.toLocaleString('es-ES')}</strong>
                    </td>
                  </tr>
                  <tr className={styles.detailRow} role="row">
                    <td role="cell" colSpan={4}>
                      <details className={styles.bandDetails}>
                        <summary>Ver {countLabel(band.total, 'acompañamiento', 'acompañamientos')}</summary>
                        <AccompanimentList items={band.items} />
                      </details>
                      {isAdvance && band.pendingCount > 0 ? (
                        <p className={styles.bandReviewNote}>{countLabel(band.pendingCount, 'otro vínculo por revisar', 'otros vínculos por revisar')} para 2027 en el apartado inferior.</p>
                      ) : null}
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        ) : (
          <div className={styles.empty}>
            <strong>No hay acompañamientos incluidos en el recuento con estos filtros.</strong>
            <p>{pendingBands.length ? 'Puedes consultar los vínculos por revisar que aparecen más abajo.' : 'Prueba con otra banda, formación o temporada.'}</p>
            {hasFilters ? <Link href={seasonHref}>Ver todas las bandas <span aria-hidden="true">→</span></Link> : null}
          </div>
        )}

        <p className={styles.figureNote} id="criterio-cifras">
          {isAdvance
            ? 'El guion indica que no hay acompañamientos con vigencia identificada para 2027 en ese ámbito. Los vínculos por revisar quedan fuera de estas cifras.'
            : 'El cero indica que no hay acompañamientos registrados en ese ámbito para la temporada seleccionada.'}
        </p>

        {isAdvance && pendingBands.length ? (
          <section className={styles.pendingSection} aria-labelledby="vinculos-por-revisar">
            <div className={styles.pendingHeading}>
              <span className={styles.eyebrow}>Archivo por revisar</span>
              <h2 id="vinculos-por-revisar">Otros vínculos por revisar para 2027</h2>
              <p>Estos acompañamientos tienen información documentada en Hilo Cofrade. Su vigencia para 2027 sigue pendiente de revisión.</p>
            </div>
            <details key={formKey} className={styles.pendingDisclosure} open={!recordedBands.length || Boolean(query)}>
              <summary>
                <span>{countLabel(filteredPendingTotal, 'vínculo', 'vínculos')} en {countLabel(pendingBands.length, 'banda', 'bandas')}{hasFilters ? ' con estos filtros' : ''}</span>
                <span className={styles.disclosureAction} aria-hidden="true">Ver desglose</span>
              </summary>
              <div className={styles.pendingBands}>
                {pendingBands.map((band) => (
                  <details className={styles.pendingBand} key={band.id}>
                    <summary>
                      <span><strong>{band.name}</strong><small>{bandTypeLabel(band)}</small></span>
                      <span>{countLabel(band.pendingCount, 'vínculo', 'vínculos')}</span>
                    </summary>
                    <div className={styles.pendingBandContent}>
                      {band.href ? <Link className={styles.bandProfileLink} href={band.href}>Ficha de la banda <span aria-hidden="true">→</span></Link> : null}
                      <AccompanimentList items={band.pendingItems} />
                    </div>
                  </details>
                ))}
              </div>
            </details>
          </section>
        ) : null}

        <section className={styles.method} aria-labelledby="como-se-cuenta">
          <div><span className={styles.eyebrow}>Criterio del recuento</span><h2 id="como-se-cuenta">Qué cuenta cada cifra</h2></div>
          <div>
            <p>Cada acompañamiento se cuenta una vez por banda, Hermandad, jornada y paso o posición. Dos pasos distintos de una misma Hermandad pueden sumar dos acompañamientos.</p>
            <p>Sevilla capital corresponde al municipio de Sevilla; provincia reúne el resto de municipios sevillanos. La ubicación es la de la Hermandad. El resumen incluye Semana Santa y vísperas y refleja la información documentada en Hilo Cofrade.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
