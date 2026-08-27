import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el logo de cabecera conserva las proporciones canónicas de Hilo Cofrade', () => {
  const header = source('components/HiloHeader.module.css')

  assert.match(header, /--hc-app-header-height:70px/)
  assert.match(header, /\.inner\{min-height:68px;[^}]*gap:22px\}/)
  assert.match(header, /\.brand\{[^}]*gap:14px;/)
  assert.match(header, /\.brandLine\{width:28px;height:3px;/)
  assert.match(header, /\.brandNode\{width:6px;height:6px;/)
  assert.match(header, /\.brandWord\{[^}]*gap:6px;font-size:18px;/)

  assert.match(header, /@media\(max-width:390px\)[\s\S]*\.brandLine\{width:23px\}/)
  assert.match(header, /@media\(max-width:390px\)[\s\S]*\.brandWord\{gap:5px;font-size:17px\}/)

  assert.match(header, /@media\(min-width:860px\)[\s\S]*--hc-app-header-height:78px/)
  assert.match(header, /@media\(min-width:860px\)[\s\S]*\.brandLine\{width:30px\}/)
  assert.match(header, /@media\(min-width:860px\)[\s\S]*\.brandWord\{font-size:19px\}/)
})

test('el navegador usa la marca gráfica canónica de Hilo Cofrade', () => {
  const icon = source('app/icon.svg')

  assert.match(icon, /viewBox="0 0 64 64"/)
  assert.match(icon, /stroke="#b71f37"/)
  assert.match(icon, /<circle cx="51" cy="32" r="5" fill="#b71f37"\/?>/)
  assert.match(icon, /aria-label="Hilo Cofrade"/)
})
