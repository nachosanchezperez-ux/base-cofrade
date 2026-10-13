'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  CUTOFF_YEAR, DAYS, ICONOGRAPHY_BY_KEY, SOURCE_2013,
  councilBrotherhoods, councilDayStats,
  councilExtraordinary2013, councilIconographyStats, councilNextEdition,
  councilRepeatedBrotherhoods, councilSummary, councilViaCrucisEditions,
  pendingBrotherhoods, pendingWithoutNextDesignation,
} from '@/lib/via-crucis-consejo'
import styles from './via-crucis.module.css'

const tabOptions = [
  { id: 'estadisticas', label: 'Radiografía' },
  { id: 'pendientes', label: 'Las que faltan' },
  { id: 'historico', label: 'Archivo por años' },
]

function normalize(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function StatBar({ label, count, max, children, kind }) {
  return (
    <div className={styles.statBarRow} data-kind={kind || undefined}>
      <div className={styles.statBarTitle}>
        <span>{label}</span>
        <strong>{count}</strong>
      </div>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.fill} style={{ width: (max ? count * 100 / max : 0) + '%' }} />
      </div>
      {children ? <small>{children}</small> : null}
    </div>
  )
}

function EditionCard({ edition }) {
  const kind = ICONOGRAPHY_BY_KEY[edition.iconography]
  return (
    <article className={styles.editionCard} data-kind={edition.iconography}>
      <div className={styles.yearBlock}><strong>{edition.year}</strong><span>Vía Crucis</span></div>
      <div className={styles.editionBody}>
        <div className={styles.editionTags}>
          <span>{edition.brotherhood.day}</span>
          <span className={styles.iconTag}>{kind.shortLabel}</span>
        </div>
        <h3>{edition.imageName}</h3>
        <Link href={edition.brotherhood.href}>{edition.brotherhood.name} <span aria-hidden="true">↗</span></Link>
        {edition.year === 2021 ? <small>Sin traslado procesional: la imagen ya recibía culto en la Catedral.</small> : null}
      </div>
    </article>
  )
}

function HistoricalView() {
  const [query, setQuery] = useState('')
  const [day, setDay] = useState('todas')
  const [type, setType] = useState('todos')
  const filtered = useMemo(() => councilViaCrucisEditions.filter((edition) => {
    const haystack = normalize([edition.year, edition.imageName, edition.brotherhood.name].join(' '))
    return (day === 'todas' || edition.brotherhood.day === day)
      && (type === 'todos' || edition.iconography === type)
      && (!query || haystack.includes(normalize(query)))
  }), [query, day, type])

  return (
    <section className={styles.panel} aria-labelledby="historico-titulo">
      <header className={styles.panelHeader}>
        <div><p className={styles.eyebrow}>Medio siglo de historia</p><h2 id="historico-titulo">Una imagen, cada Cuaresma</h2></div>
        <p>Desde el Cristo de las Misericordias de Santa Cruz en 1976 hasta la Buena Muerte de la Hiniesta en 2026. Abre cada hermandad para seguir tirando del hilo.</p>
      </header>
      <div className={styles.filters}>
        <label className={styles.searchField}>
          <span>Buscar imagen, hermandad o año</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej.: Gran Poder, 1997…" />
        </label>
        <label><span>Jornada</span>
          <select value={day} onChange={(event) => setDay(event.target.value)}>
            <option value="todas">Todas las jornadas</option>
            {DAYS.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label><span>Iconografía</span>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="todos">Todas las iconografías</option>
            {Object.values(ICONOGRAPHY_BY_KEY).map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}
          </select>
        </label>
      </div>
      <div className={styles.resultsCount}>
        <strong>{filtered.length}</strong> {filtered.length === 1 ? 'edición' : 'ediciones'} en el archivo
        {(query || day !== 'todas' || type !== 'todos') ? <button type="button" onClick={() => { setQuery(''); setDay('todas'); setType('todos') }}>Limpiar filtros</button> : null}
      </div>
      <div className={styles.editionList}>
        {filtered.map((edition) => <EditionCard edition={edition} key={edition.year} />)}
        {!filtered.length ? <p className={styles.empty}>No hay ediciones con esos filtros. Prueba con otra jornada o iconografía.</p> : null}
      </div>
      <aside className={styles.exception}>
        <div className={styles.exceptionYear}>2013</div>
        <div>
          <span className={styles.eyebrow}>Edición extraordinaria · Año de la Fe</span>
          <h3>{councilExtraordinary2013.name}</h3>
          <p>{councilExtraordinary2013.summary} Las 14 imágenes previstas se documentan aparte y no computan como 14 presidencias.</p>
          <a href={SOURCE_2013} rel="noopener noreferrer" target="_blank">Consultar las estaciones previstas en el Consejo ↗</a>
        </div>
      </aside>
    </section>
  )
}

function DashboardSnapshot() {
  const covered = councilSummary.representedBrotherhoods
  const total = councilSummary.census
  const pct = Math.round(covered / total * 100)
  const iconography = councilIconographyStats
  const topDay = councilDayStats[0]
  const topType = councilIconographyStats[0]
  const topPercentage = Math.round(topType.count / councilSummary.editions * 100)
  return (
    <div className={styles.dashboardSnapshot}>
      <div className={styles.snapshotHead}>
        <div><span className={styles.eyebrow}>El Vía Crucis en cifras</span><h2 id="estadisticas-titulo">50 ediciones. <em>Una radiografía.</em></h2></div>
        <span className={styles.snapshotScope}>1976–2026 · Ediciones ordinarias</span>
      </div>
      <div className={styles.snapshotGrid}>
        <div className={styles.snapshotPrimary}><span>Jornada con más protagonismo</span><strong>{topDay.day}</strong><p><b>{topDay.count}</b> designaciones · {Math.round(topDay.count/councilSummary.editions*100)}% del histórico</p></div>
        <div className={styles.snapshotMetric}><span>Iconografía más frecuente</span><strong>{topPercentage}%</strong><p>{topType.label} · {topType.count} de {councilSummary.editions}</p></div>
        <div className={styles.snapshotMetric}><span>Hermandades sin presidirlo</span><strong>{councilSummary.pending}</strong><p>{councilSummary.withoutNextDesignation} sin designación anunciada</p></div>
        <div className={styles.snapshotMetric}><span>Hermandades que han repetido</span><strong>{councilRepeatedBrotherhoods.length}</strong><p>Gran Poder · Gitanos · Santo Entierro</p></div>
      </div>
      <div className={styles.snapshotVisuals}>
        <section className={styles.coverageVisual} aria-label={`${covered} de ${total} hermandades han presidido el Vía Crucis`}>
          <div className={styles.coverageDonut} style={{ '--coverage': `${pct}%` }}><div><strong>{pct}%</strong><small>han presidido</small></div></div>
          <div><span className={styles.eyebrow}>¿Quién ha salido ya?</span><h3>{covered} de {total} hermandades</h3><p>{councilSummary.pending} aún no lo habían presidido hasta 2026. La Exaltación está designada para 2027.</p></div>
        </section>
        <section className={styles.iconOverview} aria-label="Distribución de las 50 presidencias por iconografía">
          <div><span className={styles.eyebrow}>Qué imágenes han presidido</span><h3>La Pasión, en proporciones</h3></div>
          <div className={styles.iconStack}>
            {iconography.map(item => <div key={item.key} data-kind={item.key} style={{flex:item.count}} title={`${item.label}: ${item.count} (${Math.round(item.count/50*100)}%)`} />)}
          </div>
          <div className={styles.iconOverviewLegend}>
            {iconography.map(item => <span key={item.key} data-kind={item.key}><i aria-hidden="true" /><strong>{item.count}</strong> {item.shortLabel} <small>{Math.round(item.count/50*100)}%</small></span>)}
          </div>
        </section>
      </div>

    </div>
  )
}

function DayCoverageMatrix() {
  const [selection,setSelection] = useState(null)
  const rows = DAYS.map(day => {
    const members = councilBrotherhoods.filter(item => item.day === day)
    const participated = new Set(councilViaCrucisEditions.filter(item => item.brotherhood.day === day).map(item => item.brotherhoodSlug))
    return {day,members,represented:members.filter(item=>participated.has(item.slug)),missing:members.filter(item=>!participated.has(item.slug))}
  }).filter(row=>row.members.length)
  const chosen=rows.find(row=>row.day===selection)
  return <section className={styles.coverageMatrix} aria-labelledby="matrix-heading">
    <div className={styles.matrixTop}><div><span className={styles.eyebrow}>Radiografía por jornadas</span><h3 id="matrix-heading">¿Qué días han completado el pleno?</h3></div><p>Pulsa sobre una jornada para ver qué hermandades faltan. La Madrugada es la única con todas sus hermandades representadas.</p></div>
    <div className={styles.matrixGrid}>
      {rows.map(row=><button type="button" key={row.day} className={styles.matrixCard} data-selected={selection===row.day} onClick={()=>setSelection(selection===row.day?null:row.day)} aria-pressed={selection===row.day}>
        <span>{row.day}</span><strong>{row.represented.length}<small>/{row.members.length}</small></strong>
        <div className={styles.matrixProgress} aria-hidden="true"><i style={{width:`${row.represented.length/row.members.length*100}%`}} /></div>
        <small>{row.missing.length ? `${row.missing.length} sin protagonizarlo` : 'Todas han participado'}</small>
      </button>)}
    </div>
    {chosen && <div className={styles.matrixDetail}><div><strong>{chosen.day}</strong><button type="button" onClick={()=>setSelection(null)} aria-label="Cerrar detalles">✕</button></div><p>{chosen.represented.length} de {chosen.members.length} hermandades ya lo han presidido.</p><div>{chosen.missing.length ? chosen.missing.map(item=><Link href={item.href} key={item.slug}>{item.name} ↗</Link>) : <span>No quedan hermandades pendientes.</span>}</div></div>}
  </section>
}

const DECADE_GROUPS = [
  { label: '1976–1989', start: 1976, end: 1989 },
  { label: '1990–1999', start: 1990, end: 1999 },
  { label: '2000–2009', start: 2000, end: 2009 },
  { label: '2010–2019', start: 2010, end: 2019 },
  { label: '2020–2026', start: 2020, end: 2026 },
]

function InteractiveChronology() {
  const [period, setPeriod] = useState(4)
  const [year, setYear] = useState(2026)
  const years = DECADE_GROUPS[period]
  const byYear = new Map(councilViaCrucisEditions.map(item => [item.year, item]))
  const selected = byYear.get(year)
  const isExtraordinary = year === 2013

  function choosePeriod(index) {
    setPeriod(index)
    setYear(DECADE_GROUPS[index].end)
  }

  return <section className={styles.chronology} aria-labelledby="alternancia-titulo">
    <div className={styles.chronologyIntro}>
      <div><span className={styles.eyebrow}>La alternancia visual</span><h3 id="alternancia-titulo">Cada año tiene su historia</h3></div>
      <p>Elige una época y pulsa un año. Descubre la imagen, su hermandad y la iconografía que presidió el Vía Crucis.</p>
    </div>
    <div className={styles.periodPicker} role="group" aria-label="Seleccionar época">
      {DECADE_GROUPS.map((group,index)=><button key={group.label} type="button" aria-pressed={period===index} onClick={()=>choosePeriod(index)}>{group.label}</button>)}
    </div>
    <div className={styles.chronologyYears} style={{ '--year-columns': years.end - years.start + 1 }} role="group" aria-label={`Años de ${years.start} a ${years.end}`}>
      {Array.from({length:years.end-years.start+1},(_,i)=>years.start+i).map(value=>{
        const edition=byYear.get(value)
        const kind=edition?.iconography||'extraordinario'
        return <button key={value} type="button" data-kind={kind} aria-pressed={year===value} aria-label={`${value}: ${edition ? edition.imageName : 'Vía Crucis extraordinario del Año de la Fe'}`} onClick={()=>setYear(value)}>
          <span>{value}</span><i aria-hidden="true" />
        </button>
      })}
    </div>
    <div className={styles.chronologyDetail} aria-live="polite">
      <div className={styles.chronologyDetailYear}><strong>{year}</strong><span>{isExtraordinary ? 'Edición extraordinaria' : 'Edición ordinaria'}</span></div>
      <div className={styles.chronologyDetailBody}>
        <span className={styles.eyebrow}>{isExtraordinary ? 'Año de la Fe · Sin pasos' : ICONOGRAPHY_BY_KEY[selected.iconography].label}</span>
        <h4>{isExtraordinary ? councilExtraordinary2013.name : selected.imageName}</h4>
        <p>{isExtraordinary ? councilExtraordinary2013.summary : selected.brotherhood.name+' · '+selected.brotherhood.day}</p>
        {isExtraordinary ? <a href={SOURCE_2013} target="_blank" rel="noopener noreferrer">Ver documentación del Consejo ↗</a> : <Link href={selected.brotherhood.href}>Abrir ficha de la hermandad ↗</Link>}
      </div>
    </div>
    <div className={styles.chronologyLegend}>
      {Object.values(ICONOGRAPHY_BY_KEY).map(item=><span key={item.key} data-kind={item.key}><i aria-hidden="true" />{item.shortLabel}</span>)}
      <span data-kind="extraordinario"><i aria-hidden="true" />Extraordinario 2013</span>
    </div>
  </section>
}

function StatisticsView() {
  const most = councilDayStats[0]?.count || 0
  const largestIconography = councilIconographyStats[0]?.count || 0

  return (
    <section className={styles.panel} aria-labelledby="estadisticas-titulo">
      <DashboardSnapshot />
      <DayCoverageMatrix />
      <InteractiveChronology />
      <div className={styles.statsColumns}>
        <section className={styles.barPanel} aria-labelledby="por-jornada">
          <h3 id="por-jornada">¿Qué jornada ha protagonizado más?</h3>
          <p>La Madrugada encabeza el histórico, aunque sus seis hermandades ya han participado.</p>
          <div className={styles.barList}>
            {councilDayStats.map(({ day, count }) => <StatBar key={day} label={day} count={count} max={most} />)}
          </div>
        </section>
        <section className={styles.barPanel} aria-labelledby="por-iconografia">
          <h3 id="por-iconografia">¿Crucificado, Nazareno o Cautivo?</h3>
          <p>La clasificación responde a la escena representada, no al tratamiento «Cristo» o «Jesús».</p>
          <div className={styles.barList}>
            {councilIconographyStats.map(({ key, label, count }) => <StatBar key={key} kind={key} label={label} count={count} max={largestIconography} />)}
          </div>
        </section>
      </div>
      <section className={styles.repeated} aria-labelledby="repeticiones-titulo">
        <span className={styles.eyebrow}>Tres repiten en el archivo</span>
        <h3 id="repeticiones-titulo">Hermandades que han presidido dos veces</h3>
        <div className={styles.repeatGrid}>
          {councilRepeatedBrotherhoods.map((item) => <Link href={item.href} key={item.slug}>
            <strong>{item.name}</strong><span>{item.years.slice().sort((a,b) => a-b).join(' · ')}</span><i aria-hidden="true">↗</i>
          </Link>)}
        </div>
      </section>
    </section>
  )
}

function PendingView() {
  const [day, setDay] = useState('todas')
  const [query, setQuery] = useState('')
  const groups = DAYS.map((name) => ({
    name, brotherhoods: pendingBrotherhoods.filter((item) => item.day === name && (!query || normalize(item.name).includes(normalize(query)))),
  })).filter((group) => (day === 'todas' || group.name === day) && group.brotherhoods.length)

  return (
    <section className={styles.panel} aria-labelledby="pendientes-titulo">
      <header className={styles.panelHeader}>
        <div><p className={styles.eyebrow}>Las que aún no han presidido</p><h2 id="pendientes-titulo">Por estrenar en el Vía Crucis</h2></div>
        <p>Se comparan las 71 hermandades de penitencia del Consejo con las 47 corporaciones que lo han presidido hasta {CUTOFF_YEAR}. Participar en lecturas o estaciones de 2013 no equivale a presidir una edición ordinaria.</p>
      </header>
      <div className={styles.pendingLead}>
        <div><strong>{pendingBrotherhoods.length}</strong><span>sin presidencia hasta 2026</span></div>
        <div><strong>{pendingWithoutNextDesignation.length}</strong><span>sin designación anunciada para 2027</span></div>
      </div>
      <div className={styles.filters}>
        <label className={styles.searchField}><span>Buscar hermandad</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre de la hermandad…" /></label>
        <label><span>Jornada</span>
          <select value={day} onChange={(event) => setDay(event.target.value)}>
            <option value="todas">Todas las jornadas</option>
            {DAYS.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </label>
      </div>
      <div className={styles.pendingGroups}>
        {groups.map((group) => <section key={group.name} className={styles.pendingGroup}>
          <div className={styles.groupHeading}><h3>{group.name}</h3><span>{group.brotherhoods.length}</span></div>
          <div className={styles.pendingCards}>
            {group.brotherhoods.map((item) => <Link className={styles.pendingCard} key={item.slug} href={item.href}>
              <span>{item.name}</span>
              {item.slug === councilNextEdition.brotherhoodSlug ? <small>Designada para 2027</small> : <small>Pendiente</small>}
              <i aria-hidden="true">↗</i>
            </Link>)}
          </div>
        </section>)}
        {!groups.length ? <p className={styles.empty}>No hay hermandades pendientes en esa búsqueda.</p> : null}
      </div>
      <p className={styles.disclaimer}>La Exaltación permanece en el recuento histórico de las que no lo han presidido hasta 2026, aunque su imagen ya está designada para el Vía Crucis de 2027. La cifra se actualizará cuando esa edición se celebre.</p>
    </section>
  )
}

export default function ViaCrucisExplorer() {
  const [tab, setTab] = useState('estadisticas')
  const onTabKeyDown = (event, index) => {
    const last = tabOptions.length - 1
    const next = event.key === 'ArrowRight' ? (index + 1) % tabOptions.length
      : event.key === 'ArrowLeft' ? (index + last) % tabOptions.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? last : -1
    if (next === -1) return
    event.preventDefault()
    setTab(tabOptions[next].id)
    event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[next]?.focus()
  }

  return (
    <>
      <header className={styles.hero}>
        <div className={styles.heroMain}>
          <span className={styles.eyebrow}>Archivo histórico · Sevilla</span>
          <h1>El Vía Crucis <em>del Consejo</em></h1>
          <p>La historia contada con datos. Descubre qué jornada manda, cómo se alternan las iconografías y cuántas hermandades esperan su primera designación.</p>
          <a className={styles.sourceJump} href="#fuentes">Documentación y fuentes <span aria-hidden="true">↘</span></a>
        </div>
        <aside className={styles.nextEdition}>
          <div className={styles.nextTop}><span>Próxima edición</span><span>Designada</span></div>
          <strong className={styles.nextYear}>2027</strong>
          <span className={styles.nextDay}>15 de febrero · Catedral de Sevilla</span>
          <h2>{councilNextEdition.imageName}</h2>
          <p>{councilNextEdition.brotherhood.name} · Jueves Santo</p>
          <Link href={councilNextEdition.brotherhood.href}>Conocer la hermandad <span aria-hidden="true">↗</span></Link>
        </aside>
      </header>
      <nav className={styles.tabs} aria-label="Explorar Vía Crucis" role="tablist">
        {tabOptions.map((option, index) => <button key={option.id} id={`via-crucis-tab-${option.id}`} type="button" role="tab" aria-selected={tab === option.id} aria-controls="contenido-via-crucis" tabIndex={tab === option.id ? 0 : -1} onClick={() => setTab(option.id)} onKeyDown={(event) => onTabKeyDown(event, index)} className={tab === option.id ? styles.activeTab : ''}>
          {option.label}{option.id === 'historico' ? <small>{councilSummary.editions}</small> : option.id === 'pendientes' ? <small>{councilSummary.pending}</small> : null}
        </button>)}
      </nav>
      <div role="tabpanel" id="contenido-via-crucis" aria-labelledby={`via-crucis-tab-${tab}`} tabIndex={0}>
        {tab === 'historico' ? <HistoricalView /> : null}
        {tab === 'estadisticas' ? <StatisticsView /> : null}
        {tab === 'pendientes' ? <PendingView /> : null}
      </div>
      <aside className={styles.methodology} aria-label="Criterio estadístico">
        <strong>Cómo se han calculado estas cifras</strong>
        <p>Se cuentan las 50 designaciones ordinarias de 1976 a 2026, no los pasos anunciados en el Vía Crucis extraordinario de 2013. La edición de 2021 figura en el histórico sin traslado procesional y la de 2027 permanece como designada. La clasificación iconográfica es editorial; el listado de pendientes se cruza con el censo de 71 hermandades de penitencia del Consejo.</p>
        <a href="#fuentes">Consultar las cuatro fuentes oficiales <span aria-hidden="true">↓</span></a>
      </aside>
    </>
  )
}
