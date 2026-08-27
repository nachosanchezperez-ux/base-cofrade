import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const layout = read('app/panel/(protected)/hermandades/[id]/layout.js')
const outings = read('app/panel/(protected)/hermandades/[id]/salidas/page.js')
const habitual = read('app/panel/(protected)/hermandades/[id]/salidas/recurrentes/page.js')

test('Salidas es el único módulo visible de agenda en la ficha de Hermandad', () => {
  assert.match(layout, /href: `\$\{root\}\/salidas`, label: 'Salidas'/)
  assert.doesNotMatch(layout, /label: 'Series'/)
  assert.doesNotMatch(layout, /href: `\$\{root\}\/salidas\/recurrentes`/)
})

test('Salidas contempla el calendario habitual y cada edición concreta', () => {
  assert.match(outings, /<h1>Salidas<\/h1>/)
  assert.match(outings, /<h2>Salidas habituales<\/h2>/)
  assert.match(outings, /Gestionar salidas habituales/)
  assert.match(outings, /<h2>Salidas registradas<\/h2>/)
  assert.match(outings, /Salida habitual vinculada/)
  assert.match(outings, /Sin salida habitual vinculada/)
  assert.match(outings, /defaultValue=\{item\?\.character \|\| 'ordinary'\}/)
  assert.match(outings, /defaultValue=\{item\?\.outing_type \|\| ''\}/)
  assert.doesNotMatch(outings, /defaultValue=\{item\?\.outing_type \|\| 'Procesión extraordinaria'\}/)
})

test('el vocabulario de Salidas cubre los actos anuales reales de una Hermandad', () => {
  for (const label of [
    'Estación de penitencia',
    'Procesión de Gloria',
    'Vía Crucis',
    'Rosario público',
    'Traslado',
    'Romería',
    'Subida',
    'Bajada',
    'Procesión sacramental',
    'Procesión extraordinaria',
  ]) {
    assert.match(outings, new RegExp(label))
    assert.match(habitual, new RegExp(label))
  }
})

test('el editor anual oculta la terminología técnica de Series al usuario', () => {
  assert.match(habitual, /<h1>Salidas habituales<\/h1>/)
  assert.match(habitual, /Calendario de la Hermandad/)
  assert.doesNotMatch(habitual, />Series anuales</)
  assert.doesNotMatch(habitual, />Salidas recurrentes</)
  assert.doesNotMatch(habitual, />Nueva serie anual</)
  assert.doesNotMatch(habitual, />Recurrencias registradas</)
})
