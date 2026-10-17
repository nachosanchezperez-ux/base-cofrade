import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildHiloMovements, hiloPassedLabel, isFreshHiloMovement, selectHiloMovements } from '../lib/hilo-movements.js'
import { editorialNewsToMovements, newsNeedsTenseReview, newsPublicationIssues } from '../lib/hilo-movements-editorial.js'

const brotherhood = { id: 'b1', name: 'Las Cigarreras', slug: 'las-cigarreras', entity_type: 'band', status: 'published' }
const base = {
  id: 'uniforme-2026', eventKey: 'k1', status: 'published', topic: 'musica', kind: 'Estreno', municipality: 'Sevilla',
  subject: { id: 'b1', type: 'band', label: 'Las Cigarreras' }, title: 'Nuevo uniforme', summary: 'Resumen', context: 'Contexto',
  documentedOn: '2026-10-15', announcedOn: '2026-10-15', relations: [], sources: [{ label: 'Web', href: 'https://example.org/a' }],
}

test('la fecha del acto pasada se marca como «Ya celebrado»', () => {
  const [passed] = buildHiloMovements([{ ...base, eventDate: '2026-10-16' }], [brotherhood], { today: '2026-10-17' })
  assert.equal(passed.eventPassed, true)
  assert.equal(hiloPassedLabel(passed, '2026-10-17'), 'Ya celebrado · 16 de octubre')
  const [upcoming] = buildHiloMovements([{ ...base, eventDate: '2026-11-14' }], [brotherhood], { today: '2026-10-17' })
  assert.equal(upcoming.eventPassed, false)
  assert.equal(hiloPassedLabel(upcoming, '2026-10-17'), '')
  const [none] = buildHiloMovements([{ ...base, eventDate: 'mañana' }], [brotherhood], { today: '2026-10-17' })
  assert.equal(none.eventDate, '')
  assert.equal(none.eventPassed, false)
})

test('portada y fichas: solo noticias recientes o con el acto aún por llegar', () => {
  assert.equal(isFreshHiloMovement({ announcedOn: '2026-10-01' }, '2026-10-17'), true)
  assert.equal(isFreshHiloMovement({ announcedOn: '2026-07-01' }, '2026-10-17'), false)
  assert.equal(isFreshHiloMovement({ announcedOn: '2026-07-01', eventDate: '2027-03-23' }, '2026-10-17'), true)
  const items = [{ id: 'vieja', announcedOn: '2026-06-01', protagonist: {}, relations: [] }, { id: 'nueva', announcedOn: '2026-10-10', protagonist: {}, relations: [] }]
  assert.deepEqual(selectHiloMovements(items, { fresh: true, today: '2026-10-17' }).map((item) => item.id), ['nueva'])
  assert.deepEqual(selectHiloMovements(items, { today: '2026-10-17' }).map((item) => item.id), ['vieja', 'nueva'])
})

test('noticia del Panel con protagonista sin ficha (Consejo, Triana…)', () => {
  const row = { id: 'c1', content_type: 'news', status: 'published', slug: 'glorias-cartel-2027', title: 'Cartel', summary: 'S', body: 'C', publish_date: '2026-10-14', announced_on: '2026-10-13', news_topic: 'patrimonio', municipality_id: 'm1', subject_label: 'Consejo de Hermandades de Sevilla', subject_kind: 'Sección de Gloria', event_date: null }
  const [record] = editorialNewsToMovements({ contents: [row], municipalities: [{ id: 'm1', name: 'Sevilla' }], sources: [{ editorial_content_id: 'c1', label: 'Consejo', href: 'https://example.org/c' }] })
  assert.equal(record.editorialException, true)
  assert.deepEqual(record.editorialSubject, { label: 'Consejo de Hermandades de Sevilla', kind: 'Sección de Gloria' })
  const [built] = buildHiloMovements([record], [], { today: '2026-10-17' })
  assert.equal(built.protagonist.label, 'Consejo de Hermandades de Sevilla')
  assert.equal(built.protagonist.href, '')
  const issues = newsPublicationIssues({ content: row, protagonist: null, sources: [{ label: 'Consejo', href: 'https://example.org/c' }], today: '2026-10-17' })
  assert.deepEqual(issues, [])
  const missing = newsPublicationIssues({ content: { ...row, subject_label: '', subject_kind: '' }, protagonist: null, sources: [{ label: 'C', href: 'https://example.org/c' }], today: '2026-10-17' })
  assert.ok(missing.some((issue) => issue.startsWith('Falta la Hermandad o banda protagonista')))
})

test('el Panel avisa de revisar el texto cuando el acto ya pasó', () => {
  assert.equal(newsNeedsTenseReview({ status: 'published', event_date: '2026-10-16' }, '2026-10-17'), true)
  assert.equal(newsNeedsTenseReview({ status: 'published', event_date: '2026-10-17' }, '2026-10-17'), false)
  assert.equal(newsNeedsTenseReview({ status: 'draft', event_date: '2026-10-01' }, '2026-10-17'), false)
  assert.equal(newsNeedsTenseReview({ status: 'published', event_date: null }, '2026-10-17'), false)
  const list = readFileSync(new URL('../app/panel/(protected)/noticias/page.js', import.meta.url), 'utf8')
  assert.match(list, /revisar texto: el acto ya pasó/)
  const editor = readFileSync(new URL('../app/panel/(protected)/noticias/[id]/page.js', import.meta.url), 'utf8')
  assert.match(editor, /name="event_date"/)
  assert.match(editor, /name="subject_label"/)
})

test('índice ligero: 12 tarjetas completas y el resto en archivo breve con su ancla', () => {
  const hub = readFileSync(new URL('../app/el-hilo-se-mueve/page.js', import.meta.url), 'utf8')
  assert.match(hub, /const HILO_INDEX_CARDS = 12/)
  assert.match(hub, /selected\.slice\(HILO_INDEX_CARDS\)\} headingLevel=\{3\} compact anchors/)
  const cards = readFileSync(new URL('../components/HiloMovementCards.js', import.meta.url), 'utf8')
  assert.match(cards, /id=\{anchors \? item\.id : undefined\}/)
})
