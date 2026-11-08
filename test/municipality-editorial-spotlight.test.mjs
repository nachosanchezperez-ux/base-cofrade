import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { getMunicipalityEditorial } from '../lib/municipality-editorial.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('el piloto solo presenta contenido editorial en Dos Hermanas y Utrera', () => {
  assert.ok(getMunicipalityEditorial('dos-hermanas'))
  assert.ok(getMunicipalityEditorial('utrera'))
  for (const slug of ['ecija', 'la-rinconada', 'sevilla-capital', '']) {
    assert.equal(getMunicipalityEditorial(slug), null)
  }
})

test('cada guía tiene relato propio, fuentes y relaciones internas documentadas', () => {
  for (const slug of ['dos-hermanas', 'utrera']) {
    const editorial = getMunicipalityEditorial(slug)
    assert.ok(editorial.title.length > 20)
    assert.ok(editorial.paragraphs.length >= 2)
    assert.ok(editorial.paragraphs.every((paragraph) => paragraph.length > 80))
    assert.ok(editorial.sources.length >= 2)
    assert.ok(editorial.sources.every((source) => source.href.startsWith('https://')))
    assert.ok(editorial.related.length >= 3)
    assert.ok(editorial.related.every((link) => link.href.startsWith('/hermandades/')))
    assert.equal(new Set(editorial.related.map((link) => link.href)).size, editorial.related.length)
  }

  const dosHermanas = getMunicipalityEditorial('dos-hermanas')
  assert.match(dosHermanas.paragraphs.join(' '), /Santa Ana/)
  assert.match(dosHermanas.paragraphs.join(' '), /Valme/)
  assert.ok(dosHermanas.sources.some((source) => source.href.includes('juntadeandalucia.es/boja/')))
  assert.equal(dosHermanas.highlight, undefined)

  const utrera = getMunicipalityEditorial('utrera')
  assert.match(utrera.paragraphs.join(' '), /Consolación/)
  assert.match(utrera.highlight.text, /2027/)
  assert.equal(utrera.highlight.href, '/el-hilo-se-mueve/buena-muerte-gitanos-via-crucis-utrera-2027')
})

test('el bloque aparece tras la agenda y preserva la plantilla municipal compartida', () => {
  const hub = read('components/MunicipalityAgendaHub.js')
  const editorial = read('components/MunicipalityEditorialSpotlight.js')
  assert.match(hub, /<MunicipalityEditorialSpotlight slug=\{hub\.slug\} label=\{hub\.label\} \/>/)
  assert.ok(hub.indexOf('<MunicipalityEditorialSpotlight') > hub.indexOf('id="proximas-citas"'))
  assert.ok(hub.indexOf('<MunicipalityEditorialSpotlight') < hub.indexOf('className={styles.entities}'))
  assert.match(editorial, /if \(!editorial\) return null/)
  assert.match(editorial, /aria-labelledby="municipality-editorial-title"/)
  assert.match(editorial, /rel="noopener noreferrer"/)
})
