import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  musicalRepertoireFallbackName,
  musicalRepertoireMonthLabel,
  presentMusicalRepertoireIdentity,
} from '../lib/musical-repertoires/presentation.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

test('una Hermandad en borrador no deja la cruceta identificada solo por la fecha', () => {
  const name = musicalRepertoireFallbackName('María Santísima de los Dolores · traslado extraordinario al Cementerio Municipal')
  assert.equal(name, 'María Santísima de los Dolores')
  assert.equal(presentMusicalRepertoireIdentity({
    brotherhoodName: name,
    outingType: 'Traslado',
    outingDate: '2026-11-02',
    year: 2026,
  }).title, 'María Santísima de los Dolores · 2 de noviembre de 2026')
  assert.equal(musicalRepertoireFallbackName('Procesión de Nuestra Señora del Castillo Coronada 2026'), 'Nuestra Señora del Castillo Coronada')
  assert.equal(musicalRepertoireFallbackName('Rosario de la Aurora de María Santísima de las Lágrimas · 2026'), 'María Santísima de las Lágrimas')
  assert.equal(musicalRepertoireFallbackName(''), '')
})

test('el listado se agrupa por mes', () => {
  assert.equal(musicalRepertoireMonthLabel('2026-10-25'), 'Octubre de 2026')
  assert.equal(musicalRepertoireMonthLabel(''), 'Sin fecha')
})

test('el listado busca también por marcha y no repite datos en la tarjeta', () => {
  const directory = read('../app/crucetas-musicales/CrucetasDirectory.js')
  const page = read('../app/crucetas-musicales/page.js')
  const loader = read('../lib/supabase/musical-repertoires.js')
  assert.match(loader, /marchTitles: unique\(repertoireEntries\.map\(\(entry\) => entry\.display_title\)\)/)
  assert.match(page, /marchTitles: item\.marchTitles/)
  assert.match(directory, /item\.marchTitles/)
  assert.match(directory, /groupByMonth/)
  assert.doesNotMatch(directory, /Ver cruceta/)
  assert.doesNotMatch(directory, /Repertorio interpretado/)
  assert.doesNotMatch(page, /Repertorios documentados/)
})

test('la ficha no enlaza a una Hermandad no pública ni repite la Banda', () => {
  const detail = read('../app/crucetas-musicales/[slug]/page.js')
  const explorer = read('../app/crucetas-musicales/[slug]/RepertoireExplorer.js')
  assert.match(detail, /repertoire\.brotherhood\.href \? \{ label: 'Hermandad'/)
  assert.doesNotMatch(detail, /<span aria-label="Banda">/)
  assert.match(detail, /repertoireContext/)
  assert.match(detail, /Más crucetas/)
  assert.match(explorer, /hasListening \?/)
  assert.match(explorer, /hasRepeated \?/)
})

test('una cruceta puede llevar nombre propio en lugar del de la Hermandad', () => {
  const loader = read('../lib/supabase/musical-repertoires.js')
  assert.ok(loader.includes('`${REPERTOIRE_COLUMNS}, display_name`'))
  assert.ok(loader.includes("result.error?.code === '42703'"))
  assert.match(loader, /String\(repertoire\.display_name \|\| ''\)\.trim\(\)\s*\n\s*\|\| brotherhoodName/)
  assert.equal(presentMusicalRepertoireIdentity({
    brotherhoodName: 'Virgen del Rosario de la Macarena',
    outingType: 'Procesión de Gloria',
    outingDate: '2026-10-25',
    year: 2026,
  }).title, 'Virgen del Rosario de la Macarena · 25 de octubre de 2026')
})
