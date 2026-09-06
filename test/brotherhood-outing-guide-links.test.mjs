import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const page = readFileSync(new URL('../app/hermandades/[slug]/page.js', import.meta.url), 'utf8')
const outings = readFileSync(new URL('../components/BrotherhoodOutingsSection.js', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../components/BrotherhoodOutingsSection.module.css', import.meta.url), 'utf8')

test('las salidas enlazan su guía extraordinaria desde la propia tarjeta', () => {
  assert.match(page, /<BrotherhoodOutingsSection outings=\{h\.salidas\} \/>/)
  assert.match(outings, /return `\/extraordinarias\/\$\{slug\}`/)
  assert.match(outings, /Abrir guía de la salida/)
  assert.match(styles, /\.guide/)
})

test('el carácter no repite extraordinaria cuando ya forma parte del tipo', () => {
  assert.match(outings, /function characterLabel/)
  assert.match(outings, /normalized\(outing\?\.tipo\)\.includes\(normalized\(character\)\) \? '' : character/)
  assert.doesNotMatch(outings, /\{outing\.caracter && <small>\{outing\.caracter\}<\/small>\}/)
})

test('las procesiones de gloria abren su ficha pública y no la guía de extraordinarias', () => {
  assert.match(outings, /slug\.startsWith\('gloria\/'\)/)
  assert.match(outings, /`\/procesiones-de-gloria\/\$\{slug\.slice\('gloria\/'\.length\)\}`/)
})
