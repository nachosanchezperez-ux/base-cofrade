from pathlib import Path
import hashlib

def change(path, old, new):
 p=Path(path); s=p.read_text(); assert s.count(old)==1,(path,old[:90],s.count(old)); p.write_text(s.replace(old,new))

path='components/MusicDashboard.js'
assert hashlib.sha1(b'blob '+str(len(Path(path).read_bytes())).encode()+b'\0'+Path(path).read_bytes()).hexdigest()=='84659bf4afe1776f204fb058dd570eb130aec3e6'
for target in [path,'app/acompanamientos-musicales/page.js']:
 change(target,"from '@/lib/music-dashboard'","from '@/lib/music-dashboard-capital'")
change(path,"import styles from './MusicDashboard.module.css'", "import styles from './MusicDashboard.module.css'\nimport { CapitalFilters, CapitalJornadas, CapitalPositions } from './MusicDashboardCapital'")
change(path,'function ItemList({ items }) {','function ItemList({ items, capital = false }) {')
change(path,"    if (!groups.has(item.municipality)) groups.set(item.municipality, [])\n    groups.get(item.municipality).push(item)","    const group = capital ? item.day : item.municipality\n    if (!groups.has(group)) groups.set(group, [])\n    groups.get(group).push(item)")
change(path,'  const summary = summaries[filters.year]',"  const summary = summaries[filters.year]\n  const capitalView = filters.scope === 'capital' || filters.municipality === 'Sevilla'\n  const columns = capitalView ? [{ key: 'steps', label: 'Pasos' }, { key: 'guides', label: 'Cruz de guía' }, { key: 'others', label: 'Otros' }, { key: 'total', label: 'Total' }] : [{ key: 'capital', label: 'Capital' }, { key: 'province', label: 'Provincia' }, { key: 'total', label: 'Total' }]")
change(path,'Boolean(filters.query || filters.scope || filters.type || filters.municipality || filters.band)',"Boolean(filters.query || filters.scope !== 'capital' || filters.type || filters.municipality || filters.band || filters.day || filters.position || filters.section)")
change(path,'<h1>Panel de acompañamientos</h1><p>Una mirada al reparto musical de la Semana Santa de Sevilla y su provincia.</p>',"<h1>{capitalView ? 'La música de la Semana Santa de Sevilla' : 'Panel de acompañamientos'}</h1><p>{capitalView ? 'Bandas, jornadas y cortejos de Sevilla capital, en datos.' : 'Una mirada al reparto musical de Sevilla y el resto de la provincia.'}</p>")
change(path,'<a href="#distribucion-musical">Distribución</a>',"{capitalView ? <a href=\"#jornadas-musicales\">Jornadas</a> : <a href=\"#distribucion-musical\">Distribución</a>}")
change(path,'<option value="">Todos</option><option value="capital">Sevilla capital</option><option value="province">Resto de la provincia</option>', '<option value="capital">Sevilla capital</option><option value="province">Resto de la provincia</option><option value="">Capital y provincia</option>')
s=Path(path).read_text(); start=s.index('      <label><span>Municipio</span>'); end=s.index('\n',start); old=s[start:end]; change(path,old,'      {!capitalView ? '+old.strip()+' : null}')
change(path,'      <input type="hidden" name="orden" value={filters.order} />','      <CapitalFilters filters={filters} change={change} />\n      <input type="hidden" name="orden" value={filters.order} />\n      {capitalView && filters.municipality ? <input type="hidden" name="municipio" value={filters.municipality} /> : null}')
change(path,'<span>Cifras y gráficos de la misma selección</span>',"<span>{[filters.day, filters.position && ({ paso: 'Pasos', guia: 'Cruz de guía', otros: 'Otros' })[filters.position], filters.section === 'juvenil' ? 'Juveniles identificadas' : filters.section === 'sin-mencion' ? 'Sin mención juvenil' : ''].filter(Boolean).join(' · ') || 'Cifras y gráficos de la misma selección'}</span>")
s=Path(path).read_text(); start=s.index('      <div><span><i className={styles.capitalDot} />Sevilla capital'); end=s.index('\n    </section>',start); old=s[start:end]
new='''      {capitalView ? <>
        <div><span>Acompañamientos de pasos</span><strong data-kpi="steps">{number(data.positions.steps)}</strong><small>Según la posición documentada</small></div>
        <div><span>Cruz de guía</span><strong data-kpi="guides">{number(data.positions.guides)}</strong><small>{number(data.positions.others)} en otras posiciones o sin detalle preciso</small></div>
      </> : <>'''+old+'''</>}'''
change(path,old,new)
change(path,'<div className={styles.charts}>','<div className={`${styles.charts} ${capitalView ? styles.capitalCharts : \'\'}`}>')
change(path,'<h2>Bandas con más acompañamientos</h2>',"<h2>{capitalView ? 'Bandas con más acompañamientos en Sevilla' : 'Bandas con más acompañamientos'}</h2>")
change(path,'          <TerritoryLegend />','          {!capitalView ? <TerritoryLegend /> : null}')
change(path,'<span>{number(band.capital)} capital · {number(band.province)} provincia</span>',"<span>{capitalView ? `${number(band.steps)} pasos · ${number(band.guides)} cruz de guía · ${number(band.others)} otros` : `${number(band.capital)} capital · ${number(band.province)} provincia`}</span>")
s=Path(path).read_text(); start=s.index('        <section className={`${styles.card} ${styles.territory}`}>'); end=s.index('\n        <section className={`${styles.card} ${styles.histogram}`}',start); old=s[start:end]
change(path,old,'        {capitalView ? <CapitalJornadas data={data} filters={filters} change={change} advance={summary.isAdvance} /> : ('+old.strip()+')}')
s=Path(path).read_text(); start=s.index('        <section className={`${styles.card} ${styles.histogram}`}',0); end=s.index('\n',start); old=s[start:end]; change(path,old,'        {!capitalView ? '+old.strip()+' : null}')
s=Path(path).read_text(); start=s.index('        <section className={styles.card}><h2>Municipios'); end=s.index('\n',start); old=s[start:end]; change(path,old,'        {capitalView ? <CapitalPositions data={data} filters={filters} change={change} /> : ('+old.strip()+')}')
change(path,'{DASHBOARD_ORDERS.map((option)',"{DASHBOARD_ORDERS.filter((option) => !capitalView || ['nombre', 'total'].includes(option.key)).map((option)")
change(path,'<table className={styles.table} role="table">',"<table className={`${styles.table} ${capitalView ? styles.capitalTable : ''}`} role=\"table\">")
change(path,'<th scope="col" role="columnheader">Capital</th><th scope="col" role="columnheader">Provincia</th><th scope="col" role="columnheader">Total</th>','{columns.map((column) => <th key={column.key} scope="col" role="columnheader">{column.label}</th>)}')
change(path,"{['capital', 'province', 'total'].map((key) =>",'{columns.map(({ key, label }) =>')
change(path,"{key === 'capital' ? 'Capital' : key === 'province' ? 'Provincia' : 'Total'}",'{label}')
change(path,'<td colSpan={4} role="cell">','<td colSpan={columns.length + 1} role="cell">')
change(path,'<ItemList items={band.items} />','<ItemList items={band.items} capital={capitalView} />')
change(path,'<ItemList items={band.pendingItems} />','<ItemList items={band.pendingItems} capital={capitalView} />')
change(path,'<Link prefetch={false} href="/bandas">Explorar el directorio de bandas →</Link></footer>', '<p>Las secciones juveniles se identifican por menciones expresas en el archivo, sin confundirlas con el resto de la formación. Las posiciones imprecisas permanecen visibles en «Otros».</p><Link prefetch={false} href="/bandas">Explorar el directorio de bandas →</Link></footer>')
page='app/acompanamientos-musicales/page.js'
change(page,"'banda', 'pagina']","'banda', 'pagina', 'jornada', 'posicion', 'seccion']")
change(page,"  const { year } = dashboardFilters(params)","  const { year, scope, municipality } = dashboardFilters(params)")
change(page,'`Panel de acompañamientos musicales · ${year',"`${scope === 'capital' || municipality === 'Sevilla' ? 'Música de la Semana Santa de Sevilla' : 'Panel de acompañamientos musicales'} · ${year")
css=Path('components/MusicDashboard.module.css'); css.write_text(css.read_text()+'''\n/* Capital-focused presentation; the all-territory view retains its existing layout. */
.capitalCharts .ranking { grid-row: auto; }
.capitalCharts { align-items: start; }
.extraFilters { grid-column: 1 / -1; border-top: 1px solid var(--line); padding-top: 4px; }
.extraFilterFields { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; padding-block: 10px; }
.dayList li + li { margin-top: 3px; }
.dayList .track { height: 6px; }
.dashboard button[aria-pressed="true"] { background: var(--soft); box-shadow: inset 3px 0 var(--capital); padding-left: 10px; }
.capitalTable thead th:first-child { width: 52%; }
@media (min-width: 1280px) { .filters { grid-template-columns: 1fr 1fr 1.6fr 1.2fr; } }
@media (max-width: 767px) { .capitalTable .dataRow { grid-template-columns: repeat(4,minmax(0,1fr)); } .extraFilterFields { grid-template-columns: 1fr; } .capitalTable .mobileLabel { min-height: 36px; display: flex; align-items: center; justify-content: center; } }
''')
state=Path('docs/ESTADO-PROYECTO.md'); s=state.read_text(); marker='# Hilo Cofrade · Estado canónico\n'; assert s.startswith(marker); state.write_text(s.replace(marker,marker+'\n**8/10/2026 · Panel musical · ENFOQUE SEVILLA CAPITAL:** vista inicial de capital; jornadas y posiciones sustituyen territorio/municipios en ese ámbito. Filtros de jornada, paso/cruz de guía/otros y menciones juveniles afectan a todas las cifras, tabla y CSV. Provincia y conjunto siguen accesibles con estado explícito en URL. 2027 sigue parcial: notas y registros sin vigencia estructurada no se promocionan automáticamente. Reconciliado #1114 ya publicado; sus antiguas marcas de QA pendiente en este tablero son históricas. Validación y auditoría en la PR de `ui/panel-musical-sevilla-20261008`; no dar por cerrado el censo de capital. #1115/#1097/#1086/#1020/#1019 y #1110 independientes.\n',1))
print('Capital presentation patch applied; no database, eligibility, dependency or authentication changes.')
