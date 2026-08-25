import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la ficha de Hermandad permite gestionar el escudo sin editar una ruta técnica', async () => {
  const page = await source('app/panel/(protected)/hermandades/[id]/page.js')
  const editor = await source('components/panel/BrotherhoodCrestEditor.js')

  assert.match(page, /BrotherhoodCrestEditor/)
  assert.match(page, /name="crest_path" value=\{data\.brotherhood\?\.crest_path \|\| ''\}/)
  assert.doesNotMatch(page, /Ruta o URL del escudo/)
  assert.match(editor, /Escudo de la hermandad/)
  assert.match(editor, /Subir escudo|Sustituir escudo/)
  assert.match(editor, /Retirar escudo/)
})

test('el editor muestra requisitos de formato, resolución y encuadre útil', async () => {
  const editor = await source('components/panel/BrotherhoodCrestEditor.js')

  assert.match(editor, /SVG recomendado/)
  assert.match(editor, /PNG o WEBP/)
  assert.match(editor, /1600 px lado mayor/)
  assert.match(editor, /1000 px en raster/)
  assert.match(editor, /Transparente/)
  assert.match(editor, /Lienzo ajustado al escudo, sin aire exterior/)
  assert.match(editor, /Máximo 10 MB/)
  assert.match(editor, /dimensionAdvice/)
  assert.doesNotMatch(editor, /1600 × 1600 px/)
})

test('la subida del escudo mantiene la arquitectura signed direct del Panel móvil', async () => {
  const editor = await source('components/panel/BrotherhoodCrestEditor.js')
  const action = await source('app/panel/(protected)/hermandades/[id]/crest-actions.js')

  assert.match(editor, /createBrowserSupabaseClient/)
  assert.match(editor, /uploadToSignedUrl/)
  assert.match(action, /createSignedUploadUrl\(storagePath, \{ upsert: false \}\)/)
  assert.match(action, /hermandades\/\$\{brotherhoodId\}\/escudo/)
  assert.match(action, /getPublicUrl\(storagePath\)/)
  assert.match(action, /update\(\{ crest_path: publicUrl \}\)/)
  assert.match(action, /upload_mode: 'signed_direct'/)
  assert.doesNotMatch(action, /formData\.get\('file'\)/)
  assert.doesNotMatch(action, /instanceof File/)
})

test('los SVG se validan antes de publicarse y el escudo se revalida en Panel y ficha pública', async () => {
  const action = await source('app/panel/(protected)/hermandades/[id]/crest-actions.js')

  assert.match(action, /assertSafeSvg/)
  assert.match(action, /script\|foreignObject\|iframe\|object\|embed/)
  assert.match(action, /javascript\\s\*:/)
  assert.match(action, /revalidatePath\(`\/panel\/hermandades\/\$\{context\.brotherhoodId\}`\)/)
  assert.match(action, /revalidatePath\(`\/hermandades\/\$\{context\.entity\.slug\}`\)/)
  assert.match(action, /return \{ saved: true, publicUrl \}/)
  assert.match(action, /return \{ removed: true \}/)
})

test('actualizar el escudo no abandona la ficha ni pisa otros cambios pendientes', async () => {
  const editor = await source('components/panel/BrotherhoodCrestEditor.js')
  const action = await source('app/panel/(protected)/hermandades/[id]/crest-actions.js')

  assert.match(editor, /syncHiddenCrestPath/)
  assert.match(editor, /setDisplayPath\(result\.publicUrl\)/)
  assert.match(editor, /data-panel-edit-state="ignore"/)
  assert.match(editor, /Puedes seguir editando la ficha sin perder cambios/)
  assert.doesNotMatch(action, /redirect\(/)
})

test('la presentación del escudo es responsive para móvil y escritorio', async () => {
  const css = await source('components/panel/BrotherhoodCrestEditor.module.css')

  assert.match(css, /grid-template-columns: 240px minmax\(0, 1fr\)/)
  assert.match(css, /@media \(max-width: 860px\)/)
  assert.match(css, /grid-template-columns: 1fr/)
  assert.match(css, /min-height: 48px/)
})
