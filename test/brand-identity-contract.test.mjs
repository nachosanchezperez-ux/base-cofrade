import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el logo de cabecera usa el activo oficial con las proporciones canónicas de Hilo Cofrade', () => {
  const header = source('components/HiloHeader.module.css')
  const component = source('components/HiloHeader.js')

  assert.match(header, /--hc-app-header-height:70px/)
  assert.match(header, /\.inner\{min-height:68px;[^}]*gap:22px\}/)
  assert.match(header, /\.brand\{display:flex;align-items:center;flex:0 0 auto;white-space:nowrap;min-width:0\}/)
  assert.match(header, /\.brandLogo\{display:block;width:148px;height:auto\}/)
  assert.match(header, /@media\(max-width:390px\)[\s\S]*\.brandLogo\{width:132px\}/)
  assert.match(header, /@media\(min-width:860px\)[\s\S]*--hc-app-header-height:78px/)
  assert.match(header, /@media\(min-width:860px\)[\s\S]*\.brandLogo\{width:158px\}/)

  assert.match(component, /import Image from 'next\/image'/)
  assert.match(component, /src="\/brand\/logo-header\.svg"/)
  assert.doesNotMatch(component, /brandRail|brandLine|brandNode|brandWord/)
})

test('el navegador usa el icono gráfico oficial de Hilo Cofrade', () => {
  const icon = source('app/icon.svg')

  assert.match(icon, /viewBox="0 0 512 512"/)
  assert.match(icon, /fill="#112339"/)
  assert.match(icon, /stroke="#B01B32"/)
  assert.match(icon, /<circle cx="346" cy="256" r="34" fill="#B01B32"\/?>/)
})
