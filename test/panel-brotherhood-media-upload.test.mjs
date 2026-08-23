import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const page = read('app/panel/(protected)/hermandades/[id]/multimedia/page.js')
const actions = read('app/panel/(protected)/hermandades/[id]/multimedia/actions.js')
const styles = read('app/panel/(protected)/hermandades/[id]/multimedia/media.module.css')
const loader = read('lib/panel/brotherhood-media.js')
const layout = read('app/panel/(protected)/hermandades/[id]/layout.js')
const metricNavigation = read('components/panel/PanelMetricNavigation.js')

test('la Hermandad ofrece una subida semántica para Pasos, carteles y Titulares', () => {
  assert.match(page, /¿Qué quieres subir\?/)
  assert.match(page, /Fotografía de un Paso/)
  assert.match(page, /title="Carteles"|title="Cartel"/)
  assert.match(page, /Fotografías de los Titulares/)
  assert.match(page, /El Panel se encarga de vincular la imagen a la ficha correcta/)
  assert.doesNotMatch(page, /name="relation_type"/)
})

test('la subida móvil pide solo archivo, crédito, derechos y descripción', () => {
  assert.match(page, /name="file" type="file" accept="image\/\*"/)
  assert.match(page, /Fototeca, Cámara o Archivos/)
  assert.match(page, /name="author_name"/)
  assert.match(page, /name="rights_status"/)
  assert.match(page, /name="alt_text"/)
  assert.match(styles, /input\[type='file'\]::file-selector-button/)
  assert.match(styles, /@media \(max-width: 620px\)/)
  assert.match(styles, /\.uploadActions button\s*\{[\s\S]*width: 100%/)
})

test('el servidor solo permite destinos relacionados con la Hermandad', () => {
  assert.match(actions, /assertBrotherhoodTarget/)
  assert.match(actions, /\.from\('brotherhood_steps'\)/)
  assert.match(actions, /\.from\('brotherhood_images'\)/)
  assert.match(actions, /\.from\('heritage_assets'\)/)
  assert.match(actions, /El contenido seleccionado no pertenece a esta Hermandad/)
  assert.match(actions, /relation_type: 'cover'/)
  assert.match(actions, /is_cover: true/)
  assert.match(actions, /10 \* 1024 \* 1024/)
})

test('el workspace carga los destinos relacionados y prioriza carteles por año', () => {
  assert.match(loader, /getBrotherhoodMediaWorkspaceData/)
  assert.match(loader, /public_image_path/)
  assert.match(loader, /function isPoster/)
  assert.match(loader, /brotherhood_steps/)
  assert.match(loader, /brotherhood_images/)
  assert.match(loader, /heritage_assets/)
  assert.match(loader, /entity_media/)
  assert.match(loader, /second\.year/)
})

test('Multimedia de Hermandad conduce al nuevo espacio local', () => {
  assert.match(layout, /`\$\{root\}\/multimedia`/)
  assert.match(layout, /label: 'Fotos y carteles'/)
  assert.doesNotMatch(layout, /\/panel\/multimedia\?entity=\$\{id\}.*label: 'Multimedia'/)
  assert.match(metricNavigation, /Multimedia: `\$\{pathname\}\/multimedia`/)
})
