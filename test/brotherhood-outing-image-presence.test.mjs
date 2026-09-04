import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const styles = fs.readFileSync(new URL('../app/hermandades/[slug]/outing-image-presence.module.css', import.meta.url), 'utf8')

test('las salidas con fotografía usan una composición editorial contenida', () => {
  assert.match(styles, /grid-template-columns:\s*1fr/)
  assert.match(styles, /\.outing-type\)[\s\S]*background:\s*transparent/)
  assert.match(styles, /\.outing-photo\)[\s\S]*height:\s*clamp\(/)
  assert.match(styles, /max-height:\s*400px/)
  assert.doesNotMatch(styles, /grid-template-columns:\s*150px/)
  assert.doesNotMatch(styles, /min-height:\s*300px/)
})

test('el tipo de salida se integra como cabecera y no como franja lateral', () => {
  assert.match(styles, /\.outing-type\)[\s\S]*flex-direction:\s*row/)
  assert.match(styles, /\.outing-type::after\)[\s\S]*width:\s*36px/)
  assert.match(styles, /\.outing-type small\)[\s\S]*margin-top:\s*0/)
})
