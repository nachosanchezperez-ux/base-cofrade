import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { presentMusicalRepertoireIdentity } from '../lib/musical-repertoires/presentation.js'

test('San Gonzalo se identifica por Hermandad, Lunes Santo y año', () => {
  assert.deepEqual(presentMusicalRepertoireIdentity({
    brotherhoodName: 'San Gonzalo',
    outingTitle: 'Estación de Penitencia · Lunes Santo 2026',
    outingType: 'Estación de Penitencia',
    outingDate: '2026-03-30',
    year: 2026,
  }), {
    title: 'San Gonzalo · Lunes Santo 2026',
    moment: 'Lunes Santo',
  })
})

test('una jornada ya estructurada mantiene la misma jerarquía', () => {
  assert.equal(presentMusicalRepertoireIdentity({
    brotherhoodName: 'La Exaltación',
    outingType: 'Jueves Santo',
    outingDate: '2026-04-02',
    year: 2026,
  }).title, 'La Exaltación · Jueves Santo 2026')
})

test('las Glorias se distinguen por Hermandad y fecha completa', () => {
  assert.equal(presentMusicalRepertoireIdentity({
    brotherhoodName: 'Pastora de Cantillana',
    outingTitle: 'Procesión de la Divina Pastora',
    outingType: 'Procesión de Gloria',
    outingDate: '2026-09-08',
    year: 2026,
  }).title, 'Pastora de Cantillana · 8 de septiembre de 2026')
})

test('directorio, ficha y bloques relacionados priorizan la identidad común y la Banda', () => {
  const directory = readFileSync(new URL('../app/crucetas-musicales/page.js', import.meta.url), 'utf8')
  const detail = readFileSync(new URL('../app/crucetas-musicales/[slug]/page.js', import.meta.url), 'utf8')
  const related = readFileSync(new URL('../components/MusicalRepertoiresSection.js', import.meta.url), 'utf8')

  for (const source of [directory, detail, related]) {
    assert.match(source, /displayTitle/)
    assert.doesNotMatch(source, /<h[123]>\{(?:item|repertoire)\.outing\.title\}<\/h[123]>/)
  }

  assert.match(directory, /<span>Cruceta de<\/span><strong>\{item\.band\.name\}<\/strong>/)
  assert.match(directory, /item\.band\.logoPath/)
  assert.match(detail, /Cruceta de \{repertoire\.band\.name\}/)
  assert.match(related, /Cruceta de \{item\.band\.name\}/)
})
