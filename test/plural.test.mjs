import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { plural, pluralWord } from '../lib/plural.js'

test('concuerda en singular solo con una unidad', () => {
  assert.equal(plural(1, 'marcha documentada', 'marchas documentadas'), '1 marcha documentada')
  assert.equal(plural(2, 'marcha documentada', 'marchas documentadas'), '2 marchas documentadas')
  assert.equal(plural(0, 'paso', 'pasos'), '0 pasos')
  assert.equal(plural('1', 'paso', 'pasos'), '1 paso')
  assert.equal(pluralWord(1, 'composición', 'composiciones'), 'composición')
  assert.equal(pluralWord(3, 'composición', 'composiciones'), 'composiciones')
})

test('no quedan copias locales de la función de plural', () => {
  const offenders = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name)
      if (statSync(path).isDirectory()) walk(path)
      else if (path.endsWith('.js') && /function plural\s*\(/.test(readFileSync(path, 'utf8'))) offenders.push(path)
    }
  }
  for (const dir of ['app', 'components', 'lib']) walk(new URL(`../${dir}`, import.meta.url).pathname)
  assert.deepEqual(offenders.filter((path) => !path.endsWith('/lib/plural.js')), [])
})

test('los contadores corregidos de la ficha de hermandad usan concordancia', () => {
  const heritage = readFileSync(new URL('../components/BrotherhoodMusicalHeritage.js', import.meta.url), 'utf8')
  assert.doesNotMatch(heritage, /\{group\.noun\} documentadas/)
  assert.match(heritage, /'himno documentado', 'himnos documentados'/)
  assert.match(heritage, /'composición documentada', 'composiciones documentadas'/)
})

test('los listados del Panel usan concordancia en sus contadores', () => {
  const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
  assert.match(read('app/panel/(protected)/pasos/page.js'), /plural\(steps\.length, 'paso', 'pasos'\)/)
  assert.match(read('app/panel/(protected)/hermandades/page.js'), /plural\(brotherhoods\.length, 'hermandad', 'hermandades'\)/)
  assert.doesNotMatch(read('app/panel/(protected)/imagenes/page.js'), /\{images\.length\} imágenes/)
})

test('el resto de la web pública concuerda y no muestra textos internos', () => {
  const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
  assert.doesNotMatch(read('components/MusicDashboard.js'), /\{number\(data\.bandsCount\)\} bandas/)
  assert.match(read('app/semana-santa/2027/cambios-musicales/page.js'), /pluralWord\(changes\.length, 'cambio', 'cambios'\)/)
  assert.match(read('components/MunicipalityAgendaHub.js'), /filter\(\(\[count\]\) => count > 0\)/)
  const author = read('app/autores/[slug]/page.js')
  assert.doesNotMatch(author, /fuera de indexación/)
  assert.match(author, /filter\(\(item\) => Number\(item\.value\) > 0\)/)
})
