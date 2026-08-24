import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la subida rápida móvil conserva el formulario y devuelve los errores en contexto', async () => {
  const form = await source('app/panel/(protected)/hermandades/[id]/multimedia/QuickMediaUploadForm.js')
  const page = await source('app/panel/(protected)/hermandades/[id]/multimedia/page.js')
  const action = await source('app/panel/(protected)/hermandades/[id]/multimedia/actions.js')
  const css = await source('app/panel/(protected)/hermandades/[id]/multimedia/media.module.css')

  assert.match(page, /QuickMediaUploadForm/)
  assert.match(form, /'use client'/)
  assert.match(form, /useTransition/)
  assert.match(form, /event\.preventDefault\(\)/)
  assert.match(form, /new FormData\(form\)/)
  assert.match(form, /URL\.createObjectURL\(file\)/)
  assert.match(form, /panel-action-error/)
  assert.match(form, /aria-busy=\{pending\}/)
  assert.match(form, /Subiendo…/)
  assert.match(form, /La imagen elegida se conserva si hay que corregir algún dato/)
  assert.match(action, /return \{ error: message \}/)
  assert.match(action, /redirect\(destination\)/)
  assert.match(css, /\.filePicker/)
  assert.match(css, /\.uploadError/)
  assert.match(css, /min-height: 48px/)
})

test('la autenticación queda fuera de la recuperación local de errores de subida', async () => {
  const action = await source('app/panel/(protected)/hermandades/[id]/multimedia/actions.js')
  const persistenceStart = action.indexOf('async function persistBrotherhoodRelatedMedia')
  const persistenceEnd = action.indexOf('function uploadErrorMessage')
  const persistenceBody = action.slice(persistenceStart, persistenceEnd)

  assert.match(action, /export async function uploadBrotherhoodRelatedMediaAction\(formData\) \{\s*const user = await requirePanelEditor\(\)/)
  assert.match(action, /persistBrotherhoodRelatedMedia\(formData, user\)/)
  assert.doesNotMatch(persistenceBody, /requirePanelEditor/)
})

test('el Panel móvil respeta el área segura y mantiene una sola interfaz responsive', async () => {
  const layout = await source('app/panel/(protected)/layout.js')
  const mobileCss = await source('app/panel/panel-mobile.css')
  const nav = await source('components/panel/PanelNav.js')
  const workspace = await source('components/panel/EntityWorkspaceNav.js')

  assert.match(layout, /panel-mobile\.css/)
  assert.match(mobileCss, /env\(safe-area-inset-bottom, 0px\)/)
  assert.match(mobileCss, /Navegación rápida del panel/)
  assert.match(mobileCss, /data-panel-toast-root/)
  assert.match(mobileCss, /min-height: 44px/)
  assert.match(nav, /mobileBar/)
  assert.match(workspace, /mobilePicker/)
  assert.doesNotMatch(`${layout}\n${mobileCss}\n${nav}\n${workspace}`, /pastora-de-cantillana|san-benito|el-baratillo/)
})
