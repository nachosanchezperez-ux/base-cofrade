'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { DASHBOARD_ORDERS, DASHBOARD_PATH, dashboardFilters, dashboardHref, musicDashboardCsv, selectMusicDashboard } from '@/lib/music-dashboard'
import styles from './MusicDashboard.module.css'

const number = (value, digits = 0) => value == null ? '—' : new Intl.NumberFormat('es-ES', { maximumFractionDigits: digits }).format(value)
const percentage = (value) => `${number(value, 1)} %`
const municipalityLabel = (name) => name === 'Sevilla' ? 'Sevilla capital' : name
const seasonLabel = (year) => year === 2027 ? 'Avance de 2027' : 'Semana Santa 2026'
const countLabel = (n) => `${number(n)} ${n === 1 ? 'acompañamiento' : 'acompañamientos'}`

function TerritoryLegend() {
  return <div className={styles.legend}><span><i className={styles.capitalDot} />Capital</span><span><i className={styles.provinceDot} />Resto de la provincia</span></div>
}

function ItemList({ items }) {
  const groups = new Map()
  for (const item of items) {
    if (!groups.has(item.municipality)) groups.set(item.municipality, [])
    groups.get(item.municipality).push(item)
  }
  return <div className={styles.itemGroups}>{[...groups].map(([name, entries]) => <section key={name}>
    <h4>{municipalityLabel(name)}</h4>
    <ul>{entries.map((item) => <li key={item.id}>
      <div><strong>{item.brotherhoodHref ? <Link prefetch={false} href={item.brotherhoodHref}>{item.brotherhoodName}</Link> : item.brotherhoodName}</strong><span>{item.day}</span></div>
      <p>{item.stepName}{item.position && item.position !== item.stepName ? ` · ${item.position}` : ''}</p>
      {item.periodLabel ? <small>{item.periodLabel}</small> : null}
    </li>)}</ul>
  </section>)}</div>
}

function TerritoryCount({ value, year }) {
  return year === 2027 && value === 0
    ? <><span aria-hidden="true">—</span><span className={styles.srOnly}>Sin acompañamientos identificados para 2027 en este ámbito</span></>
    : number(value)
}

export default function MusicDashboard({ summaries, initialFilters }) {
  const [filters, setFilters] = useState(initialFilters)
  const [ready, setReady] = useState(false)
  const [pendingOpen, setPendingOpen] = useState(false)
  const summary = summaries[filters.year]
  const data = useMemo(() => selectMusicDashboard(summary, filters), [summary, filters])
  const tableRef = useRef(null)
  const pendingRef = useRef(null)
  const summariesList = Object.values(summaries)
  const types = [...new Map(summariesList.flatMap((s) => s.bands.map((b) => [b.typeKey || 'sin-tipo', b.type || 'Tipo sin especificar']))).entries()]
    .sort((a, b) => a[1].localeCompare(b[1], 'es'))
  const municipalities = [...new Set(summariesList.flatMap((s) => s.bands.flatMap((b) => [...b.items, ...b.pendingItems].map((item) => item.municipality))))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'es'))
  const activeBand = summary.bands.find((band) => band.id === filters.band)
  const hasSelection = Boolean(filters.query || filters.scope || filters.type || filters.municipality || filters.band)
  const topMaximum = data.ranking[0]?.total || 1
  const histogramMaximum = Math.max(1, ...data.histogram.map((bin) => bin.count))

  function change(patch, replace = false) {
    const next = { ...filters, page: 1, ...patch }
    setFilters(next)
    window.history[replace ? 'replaceState' : 'pushState'](null, '', dashboardHref(next))
  }
  function reset() { change({ ...dashboardFilters({ temporada: String(filters.year) }) }) }

  useEffect(() => {
    setReady(true)
    const back = () => setFilters(dashboardFilters(new URLSearchParams(window.location.search)))
    window.addEventListener('popstate', back)
    return () => window.removeEventListener('popstate', back)
  }, [])

  useEffect(() => {
    const reveal = () => {
      const hash = window.location.hash.slice(1)
      if (!hash.startsWith('banda-')) return
      const id = hash.slice(6)
      const rowIndex = data.rows.findIndex((band) => band.id === id)
      if (rowIndex >= 0) {
        const page = Math.floor(rowIndex / 10) + 1
        if (page !== data.page) { setFilters((old) => ({ ...old, page })); return }
      } else if (data.pending.some((band) => band.id === id)) setPendingOpen(true)
      const frame = requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start' }))
      return () => cancelAnimationFrame(frame)
    }
    const cleanup = reveal()
    window.addEventListener('hashchange', reveal)
    return () => { cleanup?.(); window.removeEventListener('hashchange', reveal) }
  }, [data.rows, data.pending, data.page])

  function exportCsv() {
    const blob = new Blob([musicDashboardCsv(data.rows, filters.year)], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hilo-cofrade-acompanamientos-${filters.year}${hasSelection ? '-filtrado' : ''}.csv`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function goPage(page) {
    change({ page })
    tableRef.current?.scrollIntoView({ block: 'start' })
  }

  return <div className={styles.client} data-music-dashboard data-hydrated={ready ? 'true' : 'false'}>
    <header className={styles.heading}>
      <div><span className={styles.eyebrow}>Música cofrade · Datos y estadísticas</span><h1>Panel de acompañamientos</h1><p>Una mirada al reparto musical de la Semana Santa de Sevilla y su provincia.</p></div>
      <div className={styles.headingNote}><strong>Datos de Hilo Cofrade</strong><span>Semana Santa y vísperas · Registros documentados</span></div>
    </header>
    <nav className={styles.sectionNav} aria-label="Secciones del panel musical"><a href="#resumen-musical">Resumen</a><a href="#bandas-musicales">Bandas</a><a href="#distribucion-musical">Distribución</a><a href="#tabla-musical">Tabla de datos</a><Link prefetch={false} href="/semana-santa/2027/cambios-musicales">Cambios 2027 →</Link></nav>

    <form action={DASHBOARD_PATH} method="get" className={styles.filters} onSubmit={(event) => { event.preventDefault(); change({}) }}>
      <label><span>Temporada</span><select name="temporada" value={filters.year} onChange={(event) => change({ year: Number(event.target.value) })}><option value="2026">Semana Santa 2026</option><option value="2027">Avance de 2027</option></select></label>
      <label><span>Ámbito</span><select name="ambito" value={filters.scope} onChange={(event) => change({ scope: event.target.value, municipality: '' })}><option value="">Todos</option><option value="capital">Sevilla capital</option><option value="province">Resto de la provincia</option></select></label>
      <label className={styles.search}><span>Buscar banda</span><input type="search" name="q" value={filters.query} placeholder="Santa Ana, Las Cigarreras…" autoComplete="off" onChange={(event) => change({ query: event.target.value.slice(0, 80), band: '' }, true)} /></label>
      <label><span>Formación</span><select name="tipo" value={filters.type} onChange={(event) => change({ type: event.target.value })}><option value="">Todas</option>{types.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label><span>Municipio</span><select name="municipio" value={filters.municipality} onChange={(event) => change({ municipality: event.target.value, scope: '' })}><option value="">Todos</option>{municipalities.map((name) => <option key={name} value={name}>{municipalityLabel(name)}</option>)}</select></label>
      <input type="hidden" name="orden" value={filters.order} />
      {filters.band ? <input type="hidden" name="banda" value={filters.band} /> : null}
      <div className={styles.filterActions}><button type="button" onClick={reset}>Restablecer filtros</button><noscript><button type="submit">Aplicar filtros</button></noscript></div>
    </form>
    <div className={styles.selection} aria-live="polite" aria-atomic="true"><div><strong>{seasonLabel(filters.year)}</strong><span>{filters.scope === 'capital' ? 'Sevilla capital' : filters.scope === 'province' ? 'Resto de la provincia' : 'Capital y resto de la provincia'}{filters.municipality ? ` · ${municipalityLabel(filters.municipality)}` : ''}{filters.band ? ` · ${activeBand?.name || 'Banda seleccionada'}` : ''}</span></div><span>Cifras y gráficos de la misma selección</span></div>
    {summary.isAdvance ? <aside className={styles.advance}><strong>Avance parcial de 2027.</strong> Solo se incluyen vigencias identificadas para esta temporada. Los vínculos por revisar quedan fuera de las cifras; no es una comparación de crecimiento con 2026.{data.pendingTotal ? <button type="button" onClick={() => { setPendingOpen(true); pendingRef.current?.scrollIntoView({ block: 'start' }) }}>Ver {number(data.pendingTotal)} vínculos por revisar</button> : null}</aside> : null}

    <section className={styles.kpis} id="resumen-musical" aria-label="Indicadores de la selección">
      <div className={styles.primaryKpi}><span>Acompañamientos</span><strong data-kpi="total">{number(data.totals.total)}</strong><small>Registros documentados</small></div>
      <div><span>Bandas incluidas</span><strong data-kpi="bands">{number(data.bandsCount)}</strong><small>Formaciones en la selección</small></div>
      <div><span><i className={styles.capitalDot} />Sevilla capital</span><strong data-kpi="capital">{number(data.totals.capital)}</strong><small>{data.totals.total ? `${percentage(data.capitalPercent)} del total filtrado` : 'Sin registros en la selección'}</small></div>
      <div><span><i className={styles.provinceDot} />Resto de la provincia</span><strong data-kpi="province">{number(data.totals.province)}</strong><small>{data.totals.total ? `${percentage(data.provincePercent)} del total filtrado` : 'Sin registros en la selección'}</small></div>
    </section>

    {data.bandsCount ? <>
      <div className={styles.charts}>
        <section className={`${styles.card} ${styles.ranking}`} id="bandas-musicales">
          <div className={styles.cardHeading}><div><h2>Bandas con más acompañamientos</h2><p>{data.ranking.length} de {number(data.bandsCount)} bandas. Pulsa un nombre para analizarlo.</p></div><span className={styles.badge}>Top {data.ranking.length}</span></div>
          <TerritoryLegend />
          <ol className={styles.rankList}>{data.ranking.map((band) => <li key={band.id}>
            <button type="button" onClick={() => change({ band: band.id, query: '' })} aria-label={`Analizar ${band.name}`}><strong>{band.name}</strong><b>{number(band.total)}</b></button>
            <div className={styles.track} aria-hidden="true"><span className={styles.capitalBar} style={{ width: `${band.capital * 100 / topMaximum}%` }} /><span className={styles.provinceBar} style={{ width: `${band.province * 100 / topMaximum}%` }} /></div>
            <div className={styles.rankMeta}><span>{number(band.capital)} capital · {number(band.province)} provincia</span><span>{percentage(band.total * 100 / data.totals.total)}</span></div>
          </li>)}</ol>
        </section>
        <section className={`${styles.card} ${styles.territory}`}>
          <h2>Reparto territorial</h2><p>Acompañamientos de la selección.</p>
          <div className={styles.donutRow}>
            <div className={styles.donut} role="img" aria-label={`${countLabel(data.totals.total)}: ${number(data.totals.capital)} en capital y ${number(data.totals.province)} en el resto de la provincia.`}>
              <svg viewBox="0 0 120 120" aria-hidden="true"><circle className={styles.donutTrack} cx="60" cy="60" r="50" /><circle className={styles.donutProvince} cx="60" cy="60" r="50" /><circle className={styles.donutCapital} cx="60" cy="60" r="50" pathLength="100" strokeDasharray={`${data.capitalPercent} ${100 - data.capitalPercent}`} transform="rotate(-90 60 60)" /></svg>
              <div aria-hidden="true"><strong>{number(data.totals.total)}</strong><span>acompañamientos</span></div>
            </div>
            <dl className={styles.territoryNumbers}><div><dt><i className={styles.capitalDot} />Sevilla capital</dt><dd>{percentage(data.capitalPercent)}</dd><small>{countLabel(data.totals.capital)}</small></div><div><dt><i className={styles.provinceDot} />Resto de la provincia</dt><dd>{percentage(data.provincePercent)}</dd><small>{countLabel(data.totals.province)}</small></div></dl>
          </div>
          <div className={styles.presence}><h3>Presencia de las bandas en esta selección</h3><dl><div><dt>Solo en la capital</dt><dd>{number(data.presence.capital)}</dd></div><div><dt>En ambos ámbitos</dt><dd>{number(data.presence.both)}</dd></div><div><dt>Solo en la provincia</dt><dd>{number(data.presence.province)}</dd></div></dl><p>El ámbito corresponde a la Hermandad, no a la localidad de origen de la banda. La presencia se refiere solo a estos registros.</p></div>
        </section>
        <section className={`${styles.card} ${styles.histogram}`} id="distribucion-musical"><h2>Cuántos acompañamientos por banda</h2><p>Número de formaciones en cada intervalo.</p><div className={styles.histogramBars}>{data.histogram.map((bin) => <div key={bin.label}><strong>{number(bin.count)}</strong><div className={styles.histogramArea}><span style={{ height: `${bin.count * 100 / histogramMaximum}%` }} aria-hidden="true" /></div><b>{bin.label}</b><small>acompañamientos</small></div>)}</div></section>
      </div>
      <section className={`${styles.card} ${styles.perspective}`}><div><h2>El conjunto en perspectiva</h2><p>Estadísticas sobre los acompañamientos registrados.</p></div><dl><div><dt>Media por banda</dt><dd>{number(data.mean, 2)}</dd><small>acompañamientos</small></div><div><dt>Mediana</dt><dd>{number(data.median, 1)}</dd><small>acompañamientos</small></div><div><dt>Peso de las {data.topCount === 5 ? 'cinco' : number(data.topCount)} primeras</dt><dd>{percentage(data.topShare)}</dd><small>del total filtrado</small></div></dl><p className={styles.perspectiveNote}>La mediana es el valor central al ordenar las bandas por sus acompañamientos. Más registros no es una valoración de calidad musical.</p></section>
      <div className={styles.breakdowns}>
        <section className={styles.card}><h2>Reparto por formación</h2><p>Acompañamientos según el tipo documentado. Pulsa para filtrar.</p><ul className={styles.breakdownList}>{data.types.map((type) => <li key={type.key}><button type="button" onClick={() => change({ type: filters.type === type.key ? '' : type.key })}><span>{type.name}</span><strong>{number(type.count)}</strong></button><div className={styles.track} aria-hidden="true"><span className={styles.capitalBar} style={{ width: `${type.count * 100 / data.totals.total}%` }} /></div><small>{number(type.bandsCount)} bandas · {percentage(type.count * 100 / data.totals.total)}</small></li>)}</ul></section>
        <section className={styles.card}><h2>Municipios con más acompañamientos</h2><p>Ubicación de las Hermandades. Pulsa para consultar una localidad.</p><ul className={styles.breakdownList}>{data.municipalities.slice(0, 6).map((item) => <li key={item.name}><button type="button" onClick={() => change({ municipality: filters.municipality === item.name ? '' : item.name, scope: '' })}><span>{municipalityLabel(item.name)}</span><strong>{number(item.count)}</strong></button><div className={styles.track} aria-hidden="true"><span className={styles.provinceBar} style={{ width: `${item.count * 100 / data.totals.total}%` }} /></div><small>{percentage(item.count * 100 / data.totals.total)} del total filtrado</small></li>)}</ul>{data.municipalities.length > 6 ? <p className={styles.footnote}>Otros {number(data.municipalities.length - 6)} municipios: {countLabel(data.municipalities.slice(6).reduce((sum, row) => sum + row.count, 0))}.</p> : null}</section>
      </div>
    </> : <section className={`${styles.card} ${styles.empty}`} role="status"><h2>No hay acompañamientos incluidos con estos filtros</h2><p>{data.pendingTotal ? 'Hay vínculos por revisar más abajo, pero no forman parte de las cifras de esta temporada.' : 'Prueba otra banda, formación, municipio o ámbito.'}</p><button type="button" onClick={reset}>Restablecer filtros</button></section>}

    <section className={`${styles.card} ${styles.tableCard}`} id="tabla-musical" ref={tableRef} aria-labelledby="titulo-tabla-musical">
      <div className={styles.tableHeading}><div><h2 id="titulo-tabla-musical">Tabla de datos</h2><p>{number(data.bandsCount)} bandas · {countLabel(data.totals.total)} de la selección</p></div><div><label><span className={styles.srOnly}>Ordenar tabla</span><select value={filters.order} onChange={(event) => change({ order: event.target.value })}>{DASHBOARD_ORDERS.map((option) => <option value={option.key} key={option.key}>{option.label}</option>)}</select></label><button type="button" onClick={exportCsv} disabled={!data.rows.length}>Exportar CSV</button></div></div>
      {data.pageRows.length ? <><table className={styles.table} role="table"><caption className={styles.srOnly}>Acompañamientos documentados por banda · {seasonLabel(filters.year)}</caption><thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">Banda</th><th scope="col" role="columnheader">Capital</th><th scope="col" role="columnheader">Provincia</th><th scope="col" role="columnheader">Total</th></tr></thead>{data.pageRows.map((band) => <tbody key={`${filters.year}-${band.id}`} id={`banda-${band.id}`} role="rowgroup"><tr role="row" className={styles.dataRow}><th role="rowheader" scope="row"><h3>{band.href ? <Link prefetch={false} href={band.href}>{band.name}</Link> : band.name}</h3><span>{band.type}</span></th>{['capital', 'province', 'total'].map((key) => <td key={key} role="cell" className={key === 'total' ? styles.tableTotal : ''}><span className={styles.mobileLabel} aria-hidden="true">{key === 'capital' ? 'Capital' : key === 'province' ? 'Provincia' : 'Total'}</span><strong><TerritoryCount value={band[key]} year={filters.year} /></strong></td>)}</tr><tr role="row" className={styles.detailRow}><td colSpan={4} role="cell"><details><summary>Ver {countLabel(band.total)}</summary><ItemList items={band.items} /></details>{band.pendingCount ? <p className={styles.footnote}>{number(band.pendingCount)} vínculos por revisar, no incluidos.</p> : null}</td></tr></tbody>)}</table><nav className={styles.pagination} aria-label="Páginas de bandas"><span>{number((data.page - 1) * 10 + 1)}–{number(Math.min(data.page * 10, data.bandsCount))} de {number(data.bandsCount)} bandas</span><div><button type="button" onClick={() => goPage(data.page - 1)} disabled={data.page === 1}>Anterior</button><span>Página {data.page} de {data.pages}</span><button type="button" onClick={() => goPage(data.page + 1)} disabled={data.page === data.pages}>Siguiente</button></div></nav></> : <p>No hay filas que mostrar.</p>}
    </section>
    {summary.isAdvance && data.pendingTotal > 0 ? <section className={`${styles.card} ${styles.pending}`} id="archivo-musical-pendiente" ref={pendingRef}><h2>Otros vínculos por revisar para 2027</h2><p>{number(data.pendingTotal)} vínculos en {number(data.pending.length)} bandas con esta selección. Fuera de todos los gráficos, indicadores y exportaciones.</p><details open={pendingOpen} onToggle={(event) => setPendingOpen(event.currentTarget.open)}><summary>Consultar archivo pendiente</summary>{data.pending.map((band) => <details key={band.id} id={data.rows.some((row) => row.id === band.id) ? undefined : `banda-${band.id}`}><summary>{band.name} · {number(band.pendingCount)} vínculos</summary>{band.href ? <Link prefetch={false} href={band.href}>Ficha de la banda →</Link> : null}<ItemList items={band.pendingItems} /></details>)}</details></section> : null}
    <footer className={styles.method}><h2>Qué cuenta cada cifra</h2><p>Un acompañamiento por banda, Hermandad, jornada y paso o posición. Dos pasos distintos pueden sumar dos acompañamientos. Se conservan las reglas del archivo publicado y no se proyecta automáticamente una vinculación de 2026 a 2027.</p><p>Las estadísticas describen los registros disponibles en Hilo Cofrade, no un censo exhaustivo ni una clasificación de calidad. Los filtros afectan a todas las cifras, gráficos, desgloses y al CSV completo; la paginación solo limita las filas visibles.</p>{summary.isAdvance ? <p>El guion de la tabla significa que no hay una vigencia identificada en ese ámbito; no certifica la ausencia de contratos.</p> : null}<Link prefetch={false} href="/bandas">Explorar el directorio de bandas →</Link></footer>
  </div>
}
