import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const layout = read('app/panel/(protected)/hermandades/[id]/layout.js')
const outings = read('app/panel/(protected)/hermandades/[id]/salidas/page.js')
const outingsData = read('lib/panel/brotherhood-outings.js')
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
    'Estación de Penitencia',
    'Procesión de Gloria',
    'Procesión sacramental',
    'Vía Crucis',
    'Vía Lucis',
    'Rosario Matutino',
    'Rosario de la Aurora',
    'Rosario Vespertino',
    'Rosario Público',
    'Rosario Extraordinario',
    'Traslado',
    'Romería',
    'Subida',
    'Bajada',
  ]) {
    assert.match(outings, new RegExp(`<option value="${label}" />`))
    assert.match(habitual, new RegExp(`<option value="${label}" />`))
  }
})

test('el Panel ya no sugiere las variantes antiguas del tipo de salida', () => {
  for (const legacy of ['Estación de penitencia', 'Rosario público', 'Procesión extraordinaria']) {
    assert.doesNotMatch(outings, new RegExp(`<option value="${legacy}" />`))
    assert.doesNotMatch(habitual, new RegExp(`<option value="${legacy}" />`))
  }
})

test('Salidas permite indicar el subtipo y lo guarda como outing_subtype', () => {
  const actions = read('app/panel/(protected)/hermandades/[id]/salidas/actions.js')

  assert.match(outings, /name="outing_subtype"/)
  assert.match(outings, /defaultValue=\{item\?\.outing_subtype \|\| ''\}/)
  assert.match(actions, /outing_subtype: nullable\(formData, 'outing_subtype'\)/)
})

test('el editor anual oculta la terminología técnica de Series al usuario', () => {
  assert.match(habitual, /<h1>Salidas habituales<\/h1>/)
  assert.match(habitual, /Calendario de la Hermandad/)
  assert.doesNotMatch(habitual, />Series anuales</)
  assert.doesNotMatch(habitual, />Salidas recurrentes</)
  assert.doesNotMatch(habitual, />Nueva serie anual</)
  assert.doesNotMatch(habitual, />Recurrencias registradas</)
})


test('el Panel resuelve y etiqueta los Pasos participantes de una salida', () => {
  assert.match(outingsData, /participantById\.get\(participant\.entity_id\) \|\| stepById\.get\(participant\.entity_id\)/)
  assert.match(outings, /processional_step: 'Paso procesional'/)
  assert.match(outings, /PARTICIPANT_ROLE_LABELS\[participant\.role\] \|\| participant\.role/)
  assert.doesNotMatch(outings, /participant\.role === 'processional_image' \? 'Imagen procesional' : 'Música litúrgica'/)
})
