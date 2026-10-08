import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const target = '/acompanamientos-musicales'
const header = read('components/HiloHeader.js')
const directory = read('app/directorio/page.js')

test('el panel tiene una entrada única en la configuración compartida de los menús', () => {
  const config = header.match(/const directoryLinks = \[([\s\S]*?)\n\];/)[1]
  const links = [...config.matchAll(/\['([^']+)', '([^']+)'\]/g)]
  assert.equal(links.filter((match) => match[1] === target).length, 1)
  assert.equal(links.find((match) => match[1] === target)[2], 'Estadísticas musicales')
  assert.equal(new Set(links.map((match) => match[1])).size, links.length)
  assert.equal((header.match(/directoryLinks\.map/g) || []).length, 2)
  assert.match(header, /directoryLinks\.some\(\(\[href\]\) => pathname\.startsWith\(href\)\)/)
})

test('el directorio enlaza el panel una sola vez y lo declara en hasPart', () => {
  assert.equal((directory.match(/href="\/acompanamientos-musicales"/g) || []).length, 1)
  assert.match(directory, /name: 'Estadísticas musicales', url: absoluteUrl\('\/acompanamientos-musicales'\)/)
})

test('se conservan los accesos desde bandas y desde el avance 2027', () => {
  assert.match(read('app/bandas/page.js'), /href="\/acompanamientos-musicales"/)
  assert.match(read('app/semana-santa/2027/cambios-musicales/page.js'), /href="\/acompanamientos-musicales\?temporada=2027"/)
})

test('el menú ampliado permite desplazamiento vertical en pantallas bajas', () => {
  assert.match(read('components/HiloHeader.module.css'), /\.directoryPopover\{max-height:calc\(100dvh[^}]+overflow-y:auto/)
})
