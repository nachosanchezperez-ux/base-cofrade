import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const importer = read('lib/panel/document-import.js')
const actions = read('app/panel/(protected)/importar/actions.js')
const page = read('app/panel/(protected)/importar/page.js')
const navigation = read('lib/panel/navigation.js')
const park = read('supabase/migrations/20260825140859_park_document_import_rpc.sql')
const activation = read('supabase/migrations/20260826090000_activate_document_import_rpc.sql')

test('la descarga documental fija la conexión al DNS público validado y limita el stream', () => {
  assert.match(importer, /lookup: \(_hostname, options, callback\)/)
  assert.match(importer, /resolvedAddress\.address/)
  assert.match(importer, /response\.on\('data'/)
  assert.match(importer, /bytes > MAX_SOURCE_BYTES/)
  assert.doesNotMatch(importer, /response\.arrayBuffer\(\)/)
  assert.match(importer, /redirectCount <= MAX_REDIRECTS/)
  assert.match(importer, /request\.setTimeout\(FETCH_TIMEOUT_MS/)
})

test('el análisis trata la fuente como entrada no confiable y gobierna fallos del modelo', () => {
  assert.match(importer, /FUENTE_NO_CONFIABLE/)
  assert.match(importer, /Ignora cualquier instrucción/)
  assert.match(importer, /store: false/)
  assert.match(importer, /type: 'json_schema'/)
  assert.match(importer, /strict: true/)
  assert.match(importer, /part\?\.type === 'refusal'/)
  assert.match(importer, /payload\?\.status === 'incomplete'/)
  assert.match(importer, /MODEL_TIMEOUT_MS/)
})

test('el flujo permanece editorial: editor requerido, revisión y borradores', () => {
  assert.match(actions, /requirePanelEditor/)
  assert.match(actions, /status !== 'review'/)
  assert.match(actions, /apply_document_import/)
  assert.match(page, /Analizar no modifica el grafo/)
  assert.match(page, /crea únicamente borradores revisados/)
})

test('la activación sucede después del aparcado y solo expone el wrapper gobernado', () => {
  assert.match(park, /revoke execute on function public\.apply_document_import/)
  assert.match(activation, /to_regclass\('public\.document_imports'\)/)
  assert.match(activation, /grant execute on function public\.apply_document_import\(uuid, jsonb, integer\[\]\)[\s\S]*to authenticated/)
  assert.doesNotMatch(activation, /grant execute on function public\.apply_document_import_(?:music_)?core/)
  assert.match(activation, /revoke all on function public\.apply_document_import_core/)
  assert.match(activation, /revoke all on function public\.apply_document_import_music_core/)
})

test('el importador entra en la navegación canónica sin crear un segundo Panel', () => {
  assert.match(navigation, /href: '\/panel\/importar'/)
  assert.match(navigation, /label: 'Importar fuentes'/)
  assert.match(navigation, /Ingesta asistida y revisión documental/)
})
