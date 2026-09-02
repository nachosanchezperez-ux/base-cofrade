import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync(new URL('../app/bandas/[slug]/page.js', import.meta.url), 'utf8')
const rail = readFileSync(new URL('../app/bandas/[slug]/HistoricalAccompanimentsRail.js', import.meta.url), 'utf8')
const css = readFileSync(new URL('../app/bandas/bandas.module.css', import.meta.url), 'utf8')

test('presenta el histórico como un carril cronológico genérico sin condiciones por banda', () => {
  assert.match(page, /HistoricalAccompanimentsRail count=\{historicalAccompaniments\.length\}/)
  assert.match(page, /presentAccompanimentLocation\(item\)/)
  assert.doesNotMatch(page, /slug\s*===/)
  assert.match(css, /scroll-snap-type:\s*x mandatory/)
  assert.match(css, /grid-auto-flow:\s*column/)
  assert.match(css, /grid-auto-columns:\s*calc\(100% - 34px\)/)
})

test('el carril conserva navegación táctil, por teclado y con controles accesibles', () => {
  assert.match(rail, /aria-label="Archivo cronológico de acompañamientos históricos"/)
  assert.match(rail, /aria-label="Ver acompañamientos históricos anteriores"/)
  assert.match(rail, /aria-label="Ver más acompañamientos históricos"/)
  assert.match(rail, /event\.key !== 'ArrowLeft'/)
  assert.match(rail, /aria-live="polite"/)
})
