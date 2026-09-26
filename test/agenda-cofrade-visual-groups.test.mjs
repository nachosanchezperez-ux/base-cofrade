import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la Agenda separa los meses como bloques editoriales navegables', () => {
  const source = read('components/AgendaCofradeDirectoryV4.js')
  const styles = read('components/AgendaCofradeDirectoryV4.module.css')

  assert.match(source, /monthNavigation/)
  assert.match(source, /Ir directamente a un mes/)
  assert.match(source, /monthIdentity/)
  assert.match(source, /group\.items\.length/)
  assert.match(styles, /\.monthNavigation/)
  assert.match(styles, /\.monthHeading/)
  assert.match(styles, /border-left:5px solid #b01b32/)
})

test('cada mes resume y cada tarjeta conserva el color de su tipo de acto', () => {
  const source = read('components/AgendaCofradeDirectoryV4.js')
  const styles = read('components/AgendaCofradeDirectoryV4.module.css')

  assert.match(source, /categoryBreakdown/)
  assert.match(source, /monthTypeSummary/)
  assert.match(source, /data-category=\{type\.value\}/)
  assert.match(styles, /data-category="processions"/)
  assert.match(styles, /data-category="transfers"/)
  assert.match(styles, /data-category="rosaries"/)
  assert.match(styles, /data-category="romeries"/)
  assert.match(styles, /data-category="devotions"/)
  assert.match(styles, /data-category="concerts"/)
  assert.match(styles, /--category-accent/)
  assert.match(styles, /--category-soft/)
})
