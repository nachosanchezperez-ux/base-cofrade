import test from 'node:test'
import assert from 'node:assert/strict'
import { buildHiloMovements } from '../lib/hilo-movements.js'
import { editorialNewsToMovements, mergeHiloMovementRecords, newsPublicationIssues } from '../lib/hilo-movements-editorial.js'

const BROTHERHOOD = { id: 'b0000000-0000-4000-8000-000000000001', name: 'El Calvario', slug: 'el-calvario', entity_type: 'brotherhood', status: 'published' }
const AGENT = { id: 'a0000000-0000-4000-8000-000000000001', name: 'José López Escobar', slug: 'jose-lopez-escobar', entity_type: 'agent', status: 'published' }
const DRAFT_BAND = { id: 'c0000000-0000-4000-8000-000000000001', name: 'Banda en borrador', slug: 'banda-borrador', entity_type: 'band', status: 'draft' }
const MUNICIPALITY = { id: 'm0000000-0000-4000-8000-000000000001', name: 'Sevilla' }

function panelRow(overrides = {}) {
  return {
    id: 'e0000000-0000-4000-8000-000000000001',
    content_type: 'news',
    status: 'published',
    slug: 'nuevo-capataz-calvario',
    title: 'Nuevo capataz del Cristo del Calvario',
    summary: 'El Cabildo de Oficiales acordó su nombramiento.',
    body: 'La hermandad hizo público el acuerdo el 9 de octubre.',
    publish_date: '2026-10-09',
    announced_on: '2026-10-09',
    news_topic: 'hermandad',
    news_kind: 'Nombramiento',
    municipality_id: MUNICIPALITY.id,
    ...overrides,
  }
}

const links = [
  { editorial_content_id: 'e0000000-0000-4000-8000-000000000001', entity_id: BROTHERHOOD.id, relation_type: 'about', is_primary: true, notes: null },
  { editorial_content_id: 'e0000000-0000-4000-8000-000000000001', entity_id: AGENT.id, relation_type: 'related', is_primary: false, notes: 'Nuevo capataz' },
]
const sources = [{ editorial_content_id: 'e0000000-0000-4000-8000-000000000001', label: 'Comunicado de la Hermandad', href: 'https://example.org/comunicado' }]

test('una noticia del Panel se muestra en El Hilo se mueve con su protagonista, fichas y fuentes', () => {
  const records = editorialNewsToMovements({ contents: [panelRow()], links, entities: [BROTHERHOOD, AGENT], municipalities: [MUNICIPALITY], sources })
  const [item] = buildHiloMovements(records, [BROTHERHOOD, AGENT], { today: '2026-10-16' })
  assert.equal(item.id, 'nuevo-capataz-calvario')
  assert.equal(item.href, '/el-hilo-se-mueve#nuevo-capataz-calvario')
  assert.equal(item.protagonist.href, '/hermandades/el-calvario')
  assert.equal(item.municipality, 'Sevilla')
  assert.deepEqual(item.relations.map((relation) => [relation.label, relation.role, relation.href]), [['José López Escobar', 'Nuevo capataz', '/autores/jose-lopez-escobar']])
  assert.equal(item.sources.length, 1)
})

test('no se muestra sin fuente https, sin protagonista publicado, programada o en borrador', () => {
  const build = (contents, extra = {}) => buildHiloMovements(
    editorialNewsToMovements({ contents, links, entities: [BROTHERHOOD, AGENT], municipalities: [MUNICIPALITY], sources, ...extra }),
    [BROTHERHOOD, AGENT],
    { today: '2026-10-16' },
  )
  assert.equal(build([panelRow()], { sources: [{ ...sources[0], href: 'http://example.org' }] }).length, 0)
  assert.equal(build([panelRow()], { entities: [AGENT] }).length, 0)
  assert.equal(build([panelRow({ publish_date: '2026-10-20' })]).length, 0)
  assert.equal(build([panelRow({ status: 'draft' })]).length, 0)
  assert.equal(build([panelRow({ news_topic: null })]).length, 0)
})

test('las fichas sin publicar no se enlazan', () => {
  const records = editorialNewsToMovements({
    contents: [panelRow()],
    links: [...links, { editorial_content_id: links[0].editorial_content_id, entity_id: DRAFT_BAND.id, relation_type: 'related', is_primary: false, notes: 'Banda' }],
    entities: [BROTHERHOOD, AGENT],
    municipalities: [MUNICIPALITY],
    sources,
  })
  const [item] = buildHiloMovements(records, [BROTHERHOOD, AGENT], { today: '2026-10-16' })
  assert.equal(item.relations.length, 1)
})

test('una noticia del Panel sustituye a la del archivo con el mismo identificador', () => {
  const merged = mergeHiloMovementRecords([{ id: 'a' }, { id: 'b' }], [{ id: 'b', panel: true }])
  assert.deepEqual(merged.map((item) => [item.id, Boolean(item.panel)]), [['b', true], ['a', false]])
})

test('el Panel explica qué falta para publicar', () => {
  const issues = newsPublicationIssues({ content: { title: 'Titular' }, protagonist: { status: 'draft' }, sources: [], today: '2026-10-16' })
  assert.ok(issues.includes('Falta la entradilla.'))
  assert.ok(issues.includes('La Hermandad protagonista no está publicada.'))
  assert.ok(issues.includes('Falta al menos una fuente con enlace https.'))
  const ready = newsPublicationIssues({ content: panelRow(), protagonist: BROTHERHOOD, sources: [{ label: 'X', href: 'https://example.org' }], today: '2026-10-16' })
  assert.deepEqual(ready, [])
  const future = newsPublicationIssues({ content: panelRow({ announced_on: '2026-10-20', publish_date: '2026-10-21' }), protagonist: BROTHERHOOD, sources: [{ label: 'X', href: 'https://example.org' }], today: '2026-10-16' })
  assert.deepEqual(future, ['La fecha del anuncio no puede ser futura.'])
})
