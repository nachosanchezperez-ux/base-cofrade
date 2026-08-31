import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el logo de cabecera usa el activo oficial con una firma visible y compacta', () => {
  const header = source('components/HiloHeader.module.css')
  const component = source('components/HiloHeader.js')
  const logo = source('public/brand/logo-header.svg')

  assert.match(header, /--hc-app-header-height:70px/)
  assert.match(header, /\.inner\{min-height:68px;[^}]*gap:22px\}/)
  assert.match(header, /\.brand\{display:flex;align-items:center;flex:0 0 auto;white-space:nowrap;min-width:0\}/)
  assert.match(header, /\.brandLogo\{display:block;width:170px;height:auto\}/)
  assert.match(header, /@media\(max-width:859px\)[\s\S]*\.brandLogo\{width:200px\}/)
  assert.match(header, /@media\(max-width:390px\)[\s\S]*\.inner\{gap:8px\}[\s\S]*\.brandLogo\{width:194px\}/)
  assert.match(header, /@media\(max-width:340px\)[\s\S]*\.brandLogo\{width:174px\}/)
  assert.match(header, /@media\(min-width:860px\)[\s\S]*--hc-app-header-height:78px/)
  assert.match(header, /@media\(min-width:860px\)[\s\S]*\.brandLogo\{width:170px\}/)

  assert.match(component, /import Image from 'next\/image'/)
  assert.match(component, /src="\/brand\/logo-header\.svg"/)
  assert.match(component, /width=\{510\}/)
  assert.match(component, /height=\{72\}/)
  assert.doesNotMatch(component, /brandRail|brandLine|brandNode|brandWord/)

  assert.match(logo, /viewBox="80 116 510 72"/)
  assert.match(logo, /fill="#112339">Hilo /)
  assert.match(logo, /fill="#112339">Cofrade/)
})

test('el footer móvil centra la marca y cierra la página con aire inferior intencional', () => {
  const footer = source('components/HiloFooter.module.css')

  assert.match(footer, /@media\(max-width:859px\)[\s\S]*\.inner\{[^}]*align-items:center;[^}]*padding:28px 0 calc\(30px \+ env\(safe-area-inset-bottom,0px\)\);[^}]*text-align:center\}/)
  assert.match(footer, /@media\(max-width:859px\)[\s\S]*\.brand\{width:100%;justify-content:center\}/)
  assert.match(footer, /@media\(max-width:859px\)[\s\S]*\.brandLogo\{width:216px\}/)
  assert.match(footer, /@media\(max-width:859px\)[\s\S]*\.meta\{width:100%;justify-items:center;gap:12px\}/)
  assert.match(footer, /@media\(max-width:859px\)[\s\S]*\.meta nav\{max-width:330px;justify-content:center;/)
  assert.match(footer, /@media\(max-width:390px\)[\s\S]*\.brandLogo\{width:208px\}/)
})

test('el navegador usa el icono gráfico oficial de Hilo Cofrade', () => {
  const icon = source('app/icon.svg')

  assert.match(icon, /viewBox="0 0 512 512"/)
  assert.match(icon, /fill="#112339"/)
  assert.match(icon, /stroke="#B01B32"/)
  assert.match(icon, /<circle cx="346" cy="256" r="34" fill="#B01B32"\/?>/)
})
