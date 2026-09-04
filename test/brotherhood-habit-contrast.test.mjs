import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Túnica mantiene una superficie oscura legible sin depender de la paleta de la Hermandad', () => {
  const css = source('app/habit-layout.css')

  assert.match(css, /#tunica\.brotherhood-dark\s*\{[\s\S]*#10263d[\s\S]*#18304b/)
  assert.match(css, /#tunica \.section-heading h2,[\s\S]*#tunica \.habit-copy h3[\s\S]*color:\s*#fff/)
  assert.match(css, /#tunica \.section-heading p[\s\S]*color:\s*#d5e0ea/)
  assert.match(css, /#tunica \.habit-copy dt[\s\S]*color:\s*#c8d3de/)
  assert.match(css, /#tunica \.habit-copy dd[\s\S]*color:\s*#f7fafc/)
  assert.equal(/#tunica\.brotherhood-dark[\s\S]{0,180}var\(--(?:bc|brotherhood)-dark\)/.test(css), false)
})

test('la protección de Túnica es común y no contiene excepciones por Hermandad', () => {
  const css = source('app/habit-layout.css')

  assert.equal(/la-paz|baratillo|trinidad|san-benito/i.test(css), false)
})
