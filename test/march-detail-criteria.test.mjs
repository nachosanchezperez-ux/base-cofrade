import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { selectMarchPalette, legibleMarchPalette, DEFAULT_MARCH_PALETTE } from '../lib/march-palette.js'
import { groupReleasesForDisplay } from '../lib/bands/discography.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const page = read('app/marchas/[slug]/page.js')
const layout = read('app/marchas/[slug]/layout.js')
const css = read('app/marchas/[slug]/marcha.module.css')
const loader = read('lib/supabase/public-marches.js')

// Criterios aprobados el 19/10/2026 para Marcha (revision-resto-web-2026-10-19).
test('la ficha de Marcha no repite relaciones en un bloque «Conexiones»', () => {
  assert.doesNotMatch(page, /RelationalThread/)
  assert.doesNotMatch(page, /Conexiones/)
  assert.doesNotMatch(page, /tira-del-hilo/)
})

test('la ficha de Marcha no muestra cifras a 0 ni bloques de relleno', () => {
  assert.match(page, /\.filter\(\(metric\) => metric\.count > 0\)/)
  assert.doesNotMatch(page, /Autoría todavía no documentada/)
  assert.doesNotMatch(page, /Sin dedicatoria documentada/)
  assert.match(page, /identityBlocks \? \(/)
})

test('la ficha de Marcha no lleva coletillas de sección', () => {
  for (const text of ['Marcha → disco → banda', 'Archivo sonoro', 'Presencia documentada en las crucetas', 'Grabaciones y pistas enlazadas']) {
    assert.ok(!page.includes(text), text)
  }
})

test('la discografía no repite el enlace de Spotify ya presente en Escuchar', () => {
  assert.doesNotMatch(page, /spotifyUrl/)
})

test('listas largas plegadas: crucetas tras 6 y discografía por décadas', () => {
  assert.match(page, /CRUCETAS_FOLD_THRESHOLD = 6/)
  assert.match(page, /groupReleasesForDisplay\(march\.discographyHistory\)/)
  assert.match(page, /<details className=\{styles\.fold\}/)
  const releases = Array.from({ length: 9 }, (_, index) => ({ id: String(index), year: 2024 - index * 4 }))
  const grouped = groupReleasesForDisplay(releases)
  assert.equal(grouped.recent.length, 3)
  assert.ok(grouped.groups.every((group) => group.releases.length > 1))
})

test('El Hilo se mueve cierra la ficha de Marcha, como en el resto de fichas', () => {
  assert.match(layout, /<HiloMovementsSection entityHref=\{`\/marchas\/\$\{slug\}`\} \/>/)
})

test('la ficha usa el color heredado y no deja letra de 8–10 px', () => {
  assert.match(page, /'--march-primary': palette\.primario/)
  assert.match(css, /var\(--march-primary/)
  assert.doesNotMatch(css.replace(/\.discographyYear span[^}]*}/, ''), /font-size:\s*(?:[0-9]|10)px/)
  assert.match(loader, /from\('brotherhood_colors'\)/)
  assert.match(loader, /\.is\('date_to', null\)/)
})

const brotherhood = { id: 'b1', entity_type: 'brotherhood', status: 'published' }
const image = { id: 'i1', entity_type: 'image', status: 'published' }
const draftBrotherhood = { id: 'b2', entity_type: 'brotherhood', status: 'draft' }
const entities = new Map([[brotherhood.id, brotherhood], [image.id, image], [draftBrotherhood.id, draftBrotherhood], ['b3', { id: 'b3', entity_type: 'brotherhood', status: 'published' }]])
const morado = [{ id: 'c1', color_role: 'primary', color_name: 'Morado', hex_value: '#4B1E5A', sort_order: 0 }]
const celeste = [{ id: 'c2', color_role: 'primary', color_name: 'Celeste', hex_value: '#66B8D4', sort_order: 0 }]

test('hereda primero de la Hermandad dedicataria publicada', () => {
  const palette = selectMarchPalette({
    dedications: [{ dedicatee_entity_id: 'b2' }, { dedicatee_entity_id: 'b1' }],
    entityById: entities,
    colorsByBrotherhood: new Map([['b1', morado], ['b2', celeste]]),
  })
  assert.equal(palette.primario, '#4B1E5A')
  assert.deepEqual(palette.source, { kind: 'brotherhood', id: 'b1' })
})

test('si la dedicatoria es a una Imagen, hereda de su Hermandad actual', () => {
  const palette = selectMarchPalette({
    dedications: [{ dedicatee_entity_id: 'i1' }],
    entityById: entities,
    imageOwnersById: new Map([['i1', ['b1']]]),
    colorsByBrotherhood: new Map([['b1', morado]]),
  })
  assert.deepEqual(palette.source, { kind: 'brotherhood', id: 'b1' })
})

test('sin Hermandad con paleta, hereda de la banda que la estrenó; si no, la de Hilo', () => {
  const band = selectMarchPalette({ premiereBand: { entity_id: 'x', primary_color: '#7A1F2B', secondary_color: '#D4AF37' } })
  assert.equal(band.primario, '#7A1F2B')
  assert.equal(band.source.kind, 'band')
  assert.equal(selectMarchPalette({ premiereBand: { entity_id: 'x', primary_color: 'rojo' } }).primario, DEFAULT_MARCH_PALETTE.primario)
  assert.equal(selectMarchPalette().source, null)
})

test('un principal claro se oscurece para mantener el contraste del texto blanco', () => {
  const palette = selectMarchPalette({
    dedications: [{ dedicatee_entity_id: 'b3' }],
    entityById: entities,
    colorsByBrotherhood: new Map([['b3', celeste]]),
  })
  assert.equal(palette.primario, '#35606E')
  assert.equal(legibleMarchPalette({ primario: '#FFFFFF' }).primario, '#666666')
  assert.equal(legibleMarchPalette({ primario: '#4B1E5A', oscuro: '#270F2F' }).primario, '#4B1E5A')
})
test('la miga visible de la Marcha no muestra «Inicio» (se conserva en el JSON-LD)', () => {
  assert.doesNotMatch(page, /label: 'Inicio'/)
  assert.match(page, /\{ name: 'Inicio', path: '\/' \}/)
})
