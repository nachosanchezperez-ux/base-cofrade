/** Presentation-only statistics. The published accompaniment reader owns eligibility and deduplication. */
export const DASHBOARD_PATH = '/acompanamientos-musicales'
export const DASHBOARD_ORDERS = [
  { key: 'nombre', label: 'Bandas A–Z' },
  { key: 'total', label: 'Más acompañamientos' },
  { key: 'capital', label: 'Más en la capital' },
  { key: 'province', label: 'Más en la provincia' },
]
const text = (value) => String(Array.isArray(value) ? value[0] ?? '' : value ?? '')
const normalize = (value) => text(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[-_/]+/g, ' ').replace(/\s+/g, ' ').trim()
const alphabetic = (a, b) => a.localeCompare(b, 'es', { sensitivity: 'base', numeric: true })

export function dashboardFilters(params = {}) {
  const get = (key) => text(typeof params.get === 'function' ? params.get(key) : params[key])
  return {
    year: get('temporada') === '2027' ? 2027 : 2026,
    query: get('q').trim().slice(0, 80),
    scope: ['capital', 'province'].includes(get('ambito')) ? get('ambito') : '',
    type: get('tipo').slice(0, 80),
    municipality: get('municipio').slice(0, 100),
    band: get('banda').slice(0, 100),
    order: DASHBOARD_ORDERS.some(({ key }) => key === get('orden')) ? get('orden') : 'nombre',
    page: Math.min(10000, Math.max(1, Number.parseInt(get('pagina'), 10) || 1)),
  }
}

export function dashboardHref(filters) {
  const p = new URLSearchParams()
  if (filters.year === 2027) p.set('temporada', '2027')
  for (const [key, value] of Object.entries({ q: filters.query, ambito: filters.scope, tipo: filters.type, municipio: filters.municipality, banda: filters.band })) {
    if (value) p.set(key, value)
  }
  if (filters.order && filters.order !== 'nombre') p.set('orden', filters.order)
  if (filters.page > 1) p.set('pagina', String(filters.page))
  return DASHBOARD_PATH + (p.size ? `?${p}` : '')
}

export function selectMusicDashboard(summary, filters = {}, pageSize = 10) {
  const rows = []
  const pending = []
  const needle = normalize(filters.query)
  const includeItem = (item) => (!filters.scope || item.scope === filters.scope)
    && (!filters.municipality || item.municipality === filters.municipality)
  for (const band of summary.bands || []) {
    if (filters.band && band.id !== filters.band) continue
    if (filters.type && (band.typeKey || 'sin-tipo') !== filters.type) continue
    if (needle && !normalize(`${band.name} ${band.href || ''}`).includes(needle)) continue
    const items = (band.items || []).filter(includeItem)
    const pendingItems = (band.pendingItems || []).filter(includeItem)
    if (pendingItems.length) pending.push({ ...band, pendingItems, pendingCount: pendingItems.length })
    if (!items.length) continue
    const capital = items.filter((item) => item.scope === 'capital').length
    const province = items.filter((item) => item.scope === 'province').length
    rows.push({ ...band, items, capital, province, total: items.length, pendingItems, pendingCount: pendingItems.length })
  }
  const totals = rows.reduce((sum, row) => ({ capital: sum.capital + row.capital, province: sum.province + row.province, total: sum.total + row.total }), { capital: 0, province: 0, total: 0 })
  const ranking = [...rows].sort((a, b) => b.total - a.total || alphabetic(a.name, b.name))
  const counts = rows.map((row) => row.total).sort((a, b) => a - b)
  const n = counts.length
  const percent = (value) => totals.total ? value * 100 / totals.total : 0
  const median = n ? n % 2 ? counts[(n - 1) / 2] : (counts[n / 2 - 1] + counts[n / 2]) / 2 : null
  const histogram = [
    { label: '1', min: 1, max: 1 }, { label: '2–3', min: 2, max: 3 },
    { label: '4–6', min: 4, max: 6 }, { label: '7 o más', min: 7, max: Infinity },
  ].map((bin) => ({ label: bin.label, count: counts.filter((value) => value >= bin.min && value <= bin.max).length }))
  const types = new Map()
  const municipalities = new Map()
  for (const row of rows) {
    const key = row.typeKey || 'sin-tipo'
    if (!types.has(key)) types.set(key, { key, name: row.type || 'Tipo sin especificar', count: 0, bandsCount: 0 })
    types.get(key).count += row.total
    types.get(key).bandsCount += 1
    for (const item of row.items) {
      const name = item.municipality || 'Municipio sin especificar'
      if (!municipalities.has(name)) municipalities.set(name, { name, count: 0 })
      municipalities.get(name).count += 1
    }
  }
  const descending = (a, b) => b.count - a.count || alphabetic(a.name, b.name)
  const order = DASHBOARD_ORDERS.some(({ key }) => key === filters.order) ? filters.order : 'nombre'
  rows.sort((a, b) => (order === 'nombre' ? 0 : b[order] - a[order]) || alphabetic(a.name, b.name))
  pending.sort((a, b) => alphabetic(a.name, b.name))
  const size = Math.max(1, Math.floor(pageSize) || 10)
  const pages = Math.max(1, Math.ceil(rows.length / size))
  const page = Math.min(pages, Math.max(1, Number(filters.page) || 1))
  return {
    rows, pending, totals, ranking: ranking.slice(0, 8), bandsCount: n, histogram,
    mean: n ? totals.total / n : null, median,
    topCount: Math.min(5, n), topShare: n ? percent(ranking.slice(0, 5).reduce((sum, row) => sum + row.total, 0)) : null,
    capitalPercent: percent(totals.capital), provincePercent: percent(totals.province),
    presence: { capital: rows.filter((r) => r.capital > 0 && r.province === 0).length, both: rows.filter((r) => r.capital > 0 && r.province > 0).length, province: rows.filter((r) => r.province > 0 && r.capital === 0).length },
    types: [...types.values()].sort(descending), municipalities: [...municipalities.values()].sort(descending),
    pendingTotal: pending.reduce((sum, row) => sum + row.pendingCount, 0),
    page, pages, pageRows: rows.slice((page - 1) * size, page * size),
  }
}

export function musicDashboardCsv(rows, year) {
  // Keep user-entered/public names as text when opened in spreadsheet applications.
  const cell = (value) => {
    let safe = String(value ?? '')
    if (/^[\s]*[=+@-]/.test(safe) || /^[\t\r\n]/.test(safe)) safe = `'${safe}`
    return `"${safe.replaceAll('"', '""')}"`
  }
  const records = [['Temporada', 'Banda', 'Formación', 'Sevilla capital', 'Resto de la provincia', 'Total documentado'],
    ...rows.map((row) => [year, row.name, row.type || '', row.capital, row.province, row.total])]
  return '\ufeff' + records.map((row) => row.map(cell).join(';')).join('\r\n') + '\r\n'
}
