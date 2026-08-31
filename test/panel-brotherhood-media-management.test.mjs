import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const page = read('app/panel/(protected)/hermandades/[id]/multimedia/page.js')
const manager = read('app/panel/(protected)/hermandades/[id]/multimedia/MediaAssetManager.js')
const actions = read('app/panel/(protected)/hermandades/[id]/multimedia/manage-actions.js')

test('Fotos y carteles muestra los archivos ya vinculados en el contenido natural', () => {
  assert.match(page, /MediaAssetManager/)
  assert.match(page, /media=\{target\.media\}/)
  assert.match(manager, /Archivos vinculados/)
  assert.match(manager, /Editar información/)
  assert.match(manager, /Usar como principal/)
  assert.match(manager, /Confirmar eliminación/)
})

test('la gestión local valida que el destino pertenece a la Hermandad', () => {
  assert.match(actions, /brotherhood_steps/)
  assert.match(actions, /brotherhood_images/)
  assert.match(actions, /heritage_assets/)
  assert.match(actions, /cults/)
  assert.match(actions, /El contenido seleccionado no pertenece a esta Hermandad/)
})

test('eliminar limpia el archivo solo cuando no queda reutilizado', () => {
  assert.match(actions, /\['entity_media', 'cult_media', 'outing_media'\]/)
  assert.match(actions, /remainingReferences === 0/)
  assert.match(actions, /from\('media_assets'\)\.delete/)
  assert.match(actions, /storage\.from\('hilo-media'\)\.remove/)
  assert.match(actions, /preserved_because_reused/)
})

test('retirar una portada promociona otra imagen vinculada cuando existe', () => {
  assert.match(actions, /promoteNextCover/)
  assert.match(actions, /is_cover: true/)
  assert.match(actions, /\[context\.spec\.relationColumn\]: 'cover'/)
})
