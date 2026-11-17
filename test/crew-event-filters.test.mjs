import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  activeCrewFilterCount,
  crewFacetOptions,
  emptyCrewFilters,
  filterCrewEntries,
  hrefKey,
  indexCrewEvents,
  parseCrewFilterParams,
  serializeCrewFilterParams,
} from '../lib/crew-event-filters.js'

function event(id, overrides = {}) {
  return {
    id,
    title: `Igualá ${id}`,
    eventType: 'iguala',
    eventTypeLabel: 'Igualá',
    monthKey: '2026-11',
    monthLabel: 'NOVIEMBRE DE 2026',
    brotherhoodId: 'b-estrella',
    brotherhoodName: 'La Estrella',
    brotherhoodHref: '/hermandades/la-estrella',
    municipality: 'Sevilla',
    location: 'Casa hermandad',
    steps: [{ id: 's-misterio', name: 'Misterio de la Estrella', href: '/pasos/misterio-estrella' }],
    agents: [{ id: 'a-1', name: 'Antonio Santiago', href: '/autores/antonio-santiago' }],
    ...overrides,
  }
}

const events = [
  event('1'),
  event('2', { monthKey: '2027-01', monthLabel: 'ENERO DE 2027', eventType: 'ensayo', eventTypeLabel: 'Ensayo' }),
  event('3', {
    monthKey: '2027-04', monthLabel: 'ABRIL DE 2027',
    brotherhoodId: 'b-gerena', brotherhoodName: 'Vera-Cruz de Gerena', brotherhoodHref: '/hermandades/vera-cruz-gerena',
    municipality: 'Gerena', steps: [{ id: 's-cristo', name: 'Paso de Cristo', href: '' }], agents: [],
  }),
  event('4', { monthKey: '2026-12', monthLabel: 'DICIEMBRE DE 2026', municipality: 'Dos Hermanas' }),
]
const entries = indexCrewEvents(events)

test('los meses se ofrecen en orden cronológico, no alfabético', () => {
  const months = crewFacetOptions(entries, emptyCrewFilters(), 'mes')
  assert.deepEqual(months.map((item) => item.value), ['2026-11', '2026-12', '2027-01', '2027-04'])
  const archive = crewFacetOptions(entries, emptyCrewFilters(), 'mes', { descendingMonths: true })
  assert.deepEqual(archive.map((item) => item.value), ['2027-04', '2027-01', '2026-12', '2026-11'])
})

test('cada desplegable se acota con el resto de filtros y muestra recuento', () => {
  const filters = { ...emptyCrewFilters(), hermandad: 'vera-cruz-gerena' }
  const steps = crewFacetOptions(entries, filters, 'paso')
  assert.deepEqual(steps.map((item) => [item.label, item.count]), [['Paso de Cristo', 1]])
  // La propia Hermandad no se filtra a sí misma: se puede cambiar de Hermandad.
  const brotherhoods = crewFacetOptions(entries, filters, 'hermandad')
  assert.deepEqual(brotherhoods.map((item) => [item.value, item.count]), [['la-estrella', 3], ['vera-cruz-gerena', 1]])
})

test('la opción elegida se conserva aunque se quede sin resultados', () => {
  const filters = { ...emptyCrewFilters(), paso: 'misterio-estrella', localidad: 'gerena' }
  const steps = crewFacetOptions(entries, filters, 'paso')
  assert.deepEqual(steps, [
    { value: 'misterio-estrella', label: 'Misterio de la Estrella', count: 0 },
    { value: 'paso-de-cristo', label: 'Paso de Cristo', count: 1 },
  ])
})

test('la búsqueda ignora tildes y mayúsculas y combina términos', () => {
  assert.deepEqual(filterCrewEntries(entries, emptyCrewFilters(), { query: 'gerena' }).map((item) => item.event.id), ['3'])
  assert.deepEqual(filterCrewEntries(entries, emptyCrewFilters(), { query: 'ANTONIO ensayo' }).map((item) => item.event.id), ['2'])
  assert.equal(filterCrewEntries(entries, emptyCrewFilters(), { query: 'veracruz' }).length, 0)
  assert.equal(filterCrewEntries(entries, emptyCrewFilters(), { query: 'Vera-Cruz' }).length, 1)
})

test('los filtros viajan en la URL con claves legibles', () => {
  const state = { filters: { ...emptyCrewFilters(), hermandad: 'la-estrella', tipo: 'ensayo' }, query: ' costaleros ', phase: 'archive' }
  const search = serializeCrewFilterParams(state)
  assert.equal(search, 'ver=historico&tipo=ensayo&hermandad=la-estrella&q=costaleros')
  const parsed = parseCrewFilterParams(`?${search}`)
  assert.equal(parsed.phase, 'archive')
  assert.equal(parsed.filters.hermandad, 'la-estrella')
  assert.equal(parsed.query, 'costaleros')
  assert.equal(parseCrewFilterParams('?hermandad=<script>').filters.hermandad, '')
  assert.equal(serializeCrewFilterParams({ filters: emptyCrewFilters() }), '')
  assert.equal(activeCrewFilterCount(state.filters, state.query), 3)
})

test('las claves salen de la ruta de la ficha o, si no la hay, del nombre', () => {
  assert.equal(hrefKey('/hermandades/la-estrella#igualas'), 'la-estrella')
  assert.equal(hrefKey(''), '')
  assert.equal(entries[2].facets.paso[0].value, 'paso-de-cristo')
  assert.equal(entries[3].facets.localidad[0].value, 'dos-hermanas')
})

test('el explorador usa el buscador, el panel plegable y no pisa la URL al cargar', () => {
  const directory = readFileSync('components/CrewEventDirectory.js', 'utf8')
  assert.match(directory, /crewFacetOptions\(/)
  assert.match(directory, /aria-controls="crew-filters"/)
  assert.match(directory, /type="search"/)
  // La sincronización con la URL se declara antes de leerla.
  assert.ok(directory.indexOf('serializeCrewFilterParams({ filters, query, phase })') < directory.indexOf('parseCrewFilterParams(window.location.search)'))
  const css = readFileSync('components/CrewEventDirectory.module.css', 'utf8')
  const block = css.slice(css.lastIndexOf('/* Explorador de convocatorias'))
  // 16 px en móvil: iOS no hace zoom al tocar el buscador o un desplegable.
  assert.match(block, /\.search input\{height:48px;font-size:16px\}/)
  assert.match(block, /\.filters\[data-open\]\{display:grid\}/)
})
