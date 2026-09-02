import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const ROOT = new URL('../', import.meta.url)

async function source(path) {
  return readFile(new URL(path, ROOT), 'utf8')
}

test('el editor de Pasos muestra y permite editar la fotografía vinculada en contexto', async () => {
  const [stepsLoader, inlineMedia, stepsEditor, mediaManager, mediaActions, stepsPage] = await Promise.all([
    source('lib/panel/brotherhood-steps.js'),
    source('components/panel/BrotherhoodInlineMedia.js'),
    source('components/panel/BrotherhoodStepsEditor.js'),
    source('app/panel/(protected)/hermandades/[id]/multimedia/MediaAssetManager.js'),
    source('app/panel/(protected)/hermandades/[id]/multimedia/manage-actions.js'),
    source('app/panel/(protected)/hermandades/[id]/pasos/page.js'),
  ])

  assert.match(stepsLoader, /from\('entity_media'\)/)
  assert.match(stepsLoader, /media_assets\(id, storage_path, media_type, title, caption, alt_text, author_name, rights_status\)/)
  assert.match(stepsEditor, /media=\{relation\.step\.media \|\| \[\]\}/)
  assert.match(inlineMedia, /MediaAssetManager/)
  assert.match(inlineMedia, /Fotografía · \$\{author\}/)
  assert.match(inlineMedia, /returnPath=\{returnPath\}/)
  assert.match(mediaManager, /name="return_path"/)
  assert.match(mediaActions, /allowedPrefix = `\/panel\/hermandades\/\$\{context\.brotherhoodId\}\//)
  assert.match(mediaActions, /'media-updated'/)
  assert.match(stepsPage, /Información de la fotografía actualizada correctamente/)
})
