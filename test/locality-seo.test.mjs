import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  brotherhoodPrimaryKind,
  localityBrotherhoodGroups,
  localityDirectorySeo,
  localityGuideSeo,
  localityKindSummary,
} from '../lib/locality-seo.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const items = [
  { id: 1, tipos: ['Penitencia', 'Sacramental'] },
  { id: 2, tipos: ['Penitencia'] },
  { id: 3, tipos: ['Gloria'] },
  { id: 4, tipos: ['Sacramental'] },
  { id: 5, tipos: [], nombreOficial: 'Agrupación Parroquial de la Oración' },
]

test('cada corporación cuenta una sola vez, por su tipo principal', () => {
  assert.equal(brotherhoodPrimaryKind(items[0]), 'penitencia')
  assert.equal(brotherhoodPrimaryKind(items[3]), 'sacramental')
  assert.equal(brotherhoodPrimaryKind(items[4]), 'agrupacion')
  assert.equal(brotherhoodPrimaryKind({ tipos: [] }), 'otras')
  const groups = localityBrotherhoodGroups(items)
  assert.deepEqual(groups.map((group) => [group.key, group.items.length]), [['agrupacion', 1], ['penitencia', 2], ['gloria', 1], ['sacramental', 1]])
  assert.equal(groups.reduce((sum, group) => sum + group.items.length, 0), items.length)
})

test('el resumen por tipos usa recuentos reales y concordancia', () => {
  assert.equal(localityKindSummary(items), '1 agrupación parroquial, 2 de Semana Santa, 1 de Gloria y 1 sacramental')
  assert.equal(localityKindSummary([items[1], items[2]]), '1 de Semana Santa y 1 de Gloria')
  assert.equal(localityKindSummary([items[1]]), '')
})

test('el listado se titula «Hermandades de X» y su intro no repite la descripción', () => {
  const seo = localityDirectorySeo('Dos Hermanas', items)
  assert.equal(seo.title, 'Hermandades de Dos Hermanas: listado y días de salida')
  assert.equal(localityDirectorySeo('Pilas', items).title, 'Hermandades de Pilas: listado por tipo y día de salida')
  assert.match(seo.lead, /^Hilo Cofrade documenta 5 corporaciones de Dos Hermanas: /)
  assert.notEqual(seo.lead, seo.description)
  assert.ok(seo.description.length <= 160, seo.description)
  assert.match(seo.description, /^Hermandades de Dos Hermanas: 5 corporaciones \(/)
  assert.ok(localityDirectorySeo('Castilblanco de los Arroyos', items).title.length <= 58)
  assert.equal(localityDirectorySeo('Pilas', [items[1]]).lead.startsWith('Hilo Cofrade documenta 1 corporación de Pilas.'), true)
})

test('la guía local describe sus recuentos y sus próximas citas', () => {
  const hub = { label: 'Dos Hermanas', brotherhoods: [1, 2], bands: [1], images: [], steps: [1, 2, 3], items: [1, 2, 3, 4] }
  assert.equal(localityGuideSeo(hub).description, 'Guía cofrade de Dos Hermanas: 2 hermandades, 1 banda y 3 pasos, con 4 próximas citas en la agenda.')
  assert.equal(localityGuideSeo({ label: 'Gerena' }).description, 'Guía cofrade de Gerena: agenda de procesiones, cultos y besamanos.')
})

test('el listado enlaza la guía, comparte su Place y agrupa con H2', () => {
  const page = read('app/hermandades/localidad/[localidad]/page.js')
  assert.match(page, /relatedAgendaHref=\{data\.guidePath\}/)
  assert.match(page, /place=\{\{ path: data\.guidePath, name: data\.label \}\}/)
  assert.match(page, /title=\{`Hermandades de \$\{data\.label\}`\}/)
  const route = read('components/DirectoryRoutePage.js')
  assert.match(route, /municipalityPlaceJsonLd\(place\)/)
  assert.match(route, /about: placeRef,\s*spatialCoverage: placeRef/)
  assert.match(route, /<h2 id=\{`grupo-\$\{group\.key\}`\}/)
  assert.match(route, /\{lead \|\| description\}/)
})

test('cada localidad con fichas indexables del directorio enlaza su guía cofrade', () => {
  const index = read('components/BrotherhoodPublicIndex.js')
  assert.match(index, /const hasGuide = Boolean\(group\.slug\) && group\.items\.some\(\(item\) => indexableIds\.includes\(item\.id\)\)/)
  assert.match(index, /\{hasGuide \? <Link href=\{`\/agenda-cofrade\/localidad\/\$\{group\.slug\}`\} prefetch=\{false\}/)
  const page = read('app/hermandades/page.js')
  assert.match(page, /indexableIds: indexableHermandades\.map\(\(item\) => item\.id\)/)
})
