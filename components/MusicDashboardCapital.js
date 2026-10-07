import { DASHBOARD_DAYS, DASHBOARD_POSITIONS } from '@/lib/music-dashboard-capital'
import styles from './MusicDashboard.module.css'

export function CapitalFilters({ filters, change }) {
  const active = [filters.day, filters.position, filters.section].filter(Boolean).length
  return <details className={styles.extraFilters} open={active > 0 || undefined}>
    <summary>Jornada, posición y secciones{active ? ` · ${active} filtros activos` : ''}</summary>
    <div className={styles.extraFilterFields}>
      <label><span>Jornada</span><select name="jornada" value={filters.day || ''} onChange={(event) => change({ day: event.target.value })}><option value="">Todas, incluidas vísperas</option>{DASHBOARD_DAYS.map((day) => <option key={day} value={day}>{day === 'Semana Santa' ? 'Sin jornada precisa' : day}</option>)}</select></label>
      <label><span>Posición</span><select name="posicion" value={filters.position || ''} onChange={(event) => change({ position: event.target.value })}><option value="">Todas las posiciones</option>{DASHBOARD_POSITIONS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
      <label><span>Secciones juveniles</span><select name="seccion" value={filters.section || ''} onChange={(event) => change({ section: event.target.value })}><option value="">Todos los registros</option><option value="juvenil">Juveniles identificadas</option><option value="sin-mencion">Sin mención juvenil</option></select></label>
    </div>
  </details>
}

export function CapitalJornadas({ data, filters, change, advance }) {
  const maximum = Math.max(1, ...data.byDay.map((day) => day.count))
  return <section className={styles.card} id="jornadas-musicales">
    <h2>Acompañamientos por jornada</h2><p>Sevilla capital, incluidas las vísperas. Pulsa una jornada para filtrarla.</p>
    <ul className={`${styles.breakdownList} ${styles.dayList}`}>{data.byDay.map((day) => <li key={day.name}>
      <button type="button" aria-pressed={filters.day === day.name} disabled={!day.count && filters.day !== day.name} onClick={() => change({ day: filters.day === day.name ? '' : day.name })}><span>{day.name}</span><strong>{day.count || '—'}</strong></button>
      <div className={styles.track} aria-hidden="true"><span className={styles.capitalBar} style={{ width: `${day.count * 100 / maximum}%` }} /></div>
    </li>)}</ul>
    <p className={styles.footnote}>{advance ? '—: sin vigencia identificada en esta selección, no ausencia de contratos.' : 'Las cifras describen el archivo documentado, no todas las actuaciones posibles.'}</p>
  </section>
}

export function CapitalPositions({ data, filters, change }) {
  const rows = [{ key: 'paso', field: 'steps', name: 'Acompañamiento de pasos' }, { key: 'guia', field: 'guides', name: 'Cruz de guía' }, { key: 'otros', field: 'others', name: 'Otros o sin posición precisa' }]
  return <section className={styles.card} id="posiciones-musicales"><h2>Dónde suena cada formación</h2><p>Pasos y cruz de guía se cuentan por separado.</p><ul className={styles.breakdownList}>{rows.map((row) => <li key={row.key}><button type="button" aria-pressed={filters.position === row.key} onClick={() => change({ position: filters.position === row.key ? '' : row.key })}><span>{row.name}</span><strong>{data.positions[row.field]}</strong></button><div className={styles.track} aria-hidden="true"><span className={styles.capitalBar} style={{ width: `${data.positions[row.field] * 100 / (data.totals.total || 1)}%` }} /></div></li>)}</ul><p className={styles.footnote}>{data.positions.juvenile} acompañamientos con mención juvenil. Esta condición puede aparecer en cualquiera de las posiciones y no se suma de nuevo al total.</p><p className={styles.footnote}>La ausencia de esa mención no certifica que se trate de una formación adulta. Los registros imprecisos o mixtos permanecen en «Otros».</p></section>
}
