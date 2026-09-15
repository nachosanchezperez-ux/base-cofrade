import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('cada salida registrada expone su cargador directo de fotografía', () => {
  const page = read('app/panel/(protected)/hermandades/[id]/salidas/page.js')
  const uploader = read('components/panel/brotherhood/OutingDirectImageUpload.js')
  const actions = read('app/panel/(protected)/hermandades/[id]/salidas/hero-image-actions.js')

  assert.match(page, /data\.outings\.map/)
  assert.match(page, /<OutingDirectImageUpload/)
  assert.match(uploader, /Fotografía de esta salida/)
  assert.match(uploader, /metadata=\{\{ brotherhood_id: brotherhoodId, outing_id: outingId \}\}/)
  assert.match(actions, /uploadToSignedUrl|createSignedUploadUrl/)
  assert.match(actions, /hero_image_path/)
})

test('la fotografía queda visible antes de los campos de edición y oculta rutas técnicas', () => {
  const layout = read('app/panel/layout.js')
  const css = read('app/panel/outing-photo.css')

  assert.match(layout, /import '\.\/outing-photo\.css'/)
  assert.match(css, /article\[id\^="outing-"\] > div:has\(> \[data-direct-image-upload\]\)/)
  assert.match(css, /order: -2/)
  assert.match(css, /hero_image_path/)
  assert.match(css, /hero_image_alt/)
  assert.match(css, /hero_image_credit/)
})
