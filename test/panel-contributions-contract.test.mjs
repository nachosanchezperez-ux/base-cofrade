import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('el Panel incorpora una cola privada de aportaciones', () => {
  const navigation = read('lib/panel/navigation.js')
  const page = read('app/panel/(protected)/aportaciones/page.js')
  assert.match(navigation, /href: '\/panel\/aportaciones'/)
  assert.match(page, /getPanelContributions/)
  assert.match(page, /Nada|nunca modifica una ficha automáticamente/i)
  assert.match(page, /rel="noopener noreferrer"/)
  assert.doesNotMatch(page, /dangerouslySetInnerHTML/)
})

test('solo editor o administrador puede resolver y cada cambio se audita', () => {
  const actions = read('app/panel/(protected)/aportaciones/actions.js')
  assert.match(actions, /requirePanelEditor/)
  assert.match(actions, /from\('audit_log'\)\.insert/)
  assert.match(actions, /resolution_summary/)
  assert.doesNotMatch(actions, /from\(['"]entities['"]\)\.(?:insert|update)/)
})

