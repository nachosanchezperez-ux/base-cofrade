import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (name) => readFileSync(new URL(`../components/${name}`, import.meta.url), 'utf8')
const base = read('ImageHeroV2.module.css')
const room = read('ImageHeroV2Room.module.css')

test('image hero derives its veil from the inherited brotherhood dark color', () => {
  assert.match(base, /--hero-deep: var\(--brotherhood-dark,/)
  assert.match(base, /--hero-veil: color-mix\(in srgb, var\(--hero-deep\) 80%, #000\)/)
  assert.match(base, /linear-gradient\(135deg, var\(--hero-deep\), var\(--hero-veil\) 74%\)/)
})

test('neither image hero layer hardcodes a navy overlay over the inherited palette', () => {
  for (const css of [base, room]) {
    for (const match of css.matchAll(/rgba\(\s*(\d+),\s*(\d+),\s*(\d+),/g)) {
      const [, red, green, blue] = match
      assert.ok(red === green && green === blue, `Non-neutral hardcoded overlay: ${match[0]}`)
    }
    assert.doesNotMatch(css, /#061321/)
  }
})

test('all image veil declarations use the same corporate hue at every breakpoint', () => {
  let count = 0
  for (const css of [base, room]) {
    for (const match of css.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
      const [, selector, body] = match
      if (!/\.(?:photoVeil|containedVeil)/.test(selector)) continue
      assert.match(body, /var\(--hero-veil\)/, selector)
      assert.doesNotMatch(body, /rgba\(/, selector)
      count++
    }
  }
  assert.equal(count, 11)
})

test('image relation and fact surfaces inherit the palette too', () => {
  assert.match(base, /background: color-mix\(in srgb, var\(--hero-veil\) 56%, transparent\)/)
  assert.match(base, /background: color-mix\(in srgb, var\(--hero-veil\) 70%, transparent\)/)
  assert.match(base, /background: color-mix\(in srgb, var\(--hero-veil\) 52%, transparent\)/)
})

test('photo framing and mobile masks remain neutral and unchanged', () => {
  assert.match(base, /object-position: var\(--image-mobile-focus-x\) var\(--image-mobile-focus-y\)/)
  assert.match(room, /aspect-ratio: var\(--image-aspect, \.82\)/)
  assert.match(room, /-webkit-mask-image: linear-gradient\(90deg,/)
  assert.match(room, /rgba\(0, 0, 0, \.58\) 97%/)
})
