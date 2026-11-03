import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  bandHabitualMarchIds,
  compareEditions,
  newMarchesOfYear,
  previousEdition,
  topMarches,
} from '../lib/musical-repertoires/insights.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const entry = (marchId, title, extra = {}) => ({ marchId, title, catalogTitle: title, marchHref: `/marchas/${marchId}`, count: 1, displayOrder: 1, ...extra })
const cruceta = (id, bandId, brotherhoodId, year, entries, extra = {}) => ({
  id, href: `/crucetas-musicales/${id}`, year, date: `${year}-10-0${id.length % 9}`,
  band: { id: bandId, name: `Banda ${bandId}` },
  brotherhood: { id: brotherhoodId, name: `Hermandad ${brotherhoodId}` },
  outing: { type: 'Procesión de Gloria' },
  entries, ...extra,
})

test('«Lo que más suena» agrupa por marcha, no por título', () => {
  const list = [
    cruceta('a', 'b1', 'h1', 2026, [entry('m1', 'Macarena'), entry('m2', 'Macarena', { count: 3 })]),
    cruceta('bb', 'b2', 'h2', 2026, [entry('m1', 'Macarena')]),
    cruceta('ccc', 'b3', 'h3', 2026, [entry('m1', 'Macarena')]),
  ]
  const top = topMarches(list)
  assert.equal(top.length, 1)
  assert.deepEqual([top[0].id, top[0].repertoires, top[0].bands], ['m1', 3, 3])
})

test('las marchas nuevas solo marcan estreno con fecha de estreno documentada', () => {
  const list = [
    cruceta('a', 'b1', 'h1', 2026, [entry('m9', 'Cachorro Eterno', { isNewThisYear: true })]),
    cruceta('bb', 'b2', 'h2', 2026, [entry('m9', 'Cachorro Eterno', { isNewThisYear: true, isPremiere: true })]),
    cruceta('ccc', 'b3', 'h3', 2025, [entry('m8', 'Otra', { isNewThisYear: true })]),
  ]
  const items = newMarchesOfYear(list, 2026)
  assert.equal(items.length, 1)
  assert.equal(items[0].sounded.length, 2)
  assert.equal(items[0].premiere.href, '/crucetas-musicales/bb')
})

test('habituales de banda: tres crucetas o más y presencia en el 75 %', () => {
  const two = [cruceta('a', 'b1', 'h1', 2026, [entry('m1', 'X')]), cruceta('bb', 'b1', 'h2', 2026, [entry('m1', 'X')])]
  assert.equal(bandHabitualMarchIds(two, 'b1').size, 0)
  const four = [...two, cruceta('ccc', 'b1', 'h3', 2026, [entry('m1', 'X')]), cruceta('dddd', 'b1', 'h4', 2026, [entry('m2', 'Y')])]
  assert.deepEqual([...bandHabitualMarchIds(four, 'b1')], ['m1'])
})

test('la comparativa usa la cruceta del año anterior de la misma Hermandad y salida', () => {
  const before = cruceta('a', 'b1', 'h1', 2025, [entry('m1', 'X'), entry('m2', 'Y')])
  const now = cruceta('bb', 'b2', 'h1', 2026, [entry('m1', 'X'), entry('m3', 'Z')])
  const previous = previousEdition(now, [before, now])
  assert.equal(previous.id, 'a')
  const diff = compareEditions(now, previous)
  assert.equal(diff.sameBand, false)
  assert.deepEqual(diff.entered.map((item) => item.title), ['Z'])
  assert.deepEqual(diff.left.map((item) => item.title), ['Y'])
  assert.equal(diff.kept, 1)
  assert.equal(previousEdition(cruceta('x', 'b1', 'h9', 2026, []), [before]), null)
})

test('listado y ficha usan las lecturas y la imagen propia', () => {
  const page = read('../app/crucetas-musicales/page.js')
  const detail = read('../app/crucetas-musicales/[slug]/page.js')
  const explorer = read('../app/crucetas-musicales/[slug]/RepertoireExplorer.js')
  const loader = read('../lib/supabase/musical-repertoires.js')
  assert.match(page, /topMarches\(seasonRepertoires/)
  assert.match(page, /newMarchesOfYear\(repertoires, latestYear\)/)
  assert.match(detail, /images: null/)
  assert.match(explorer, /Más interpretadas/)
  assert.match(explorer, /Dedicada a esta Hermandad/)
  assert.match(loader, /isPremiere: Boolean\(marchProfile\.premiere_date/)
  assert.match(read('../app/crucetas-musicales/[slug]/opengraph-image.js'), /renderRepertoireSocialImage/)
})

test('la cruceta enlaza con la ficha de su salida solo si existe como página', () => {
  const detail = read('../app/crucetas-musicales/[slug]/page.js')
  assert.match(detail, /isPreservedAgendaEventPath\(path\)/)
  assert.match(detail, /outingHref \? \(/)
  assert.match(read('../lib/supabase/musical-repertoires.js'), /slug: outing\.slug \|\| ''/)
})

test('Novedades presenta la cruceta con su nombre propio cuando lo tiene', () => {
  const loader = read('../lib/supabase/platform-updates.js')
  assert.match(loader, /title, display_name, outing_id/)
  assert.match(loader, /String\(repertoire\.display_name \|\| ''\)\.trim\(\) \|\| \(brotherhood/)
})
