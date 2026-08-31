import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('Glory directory renders outing photographs when hero images exist', async () => {
  const component = await read('components/GloryDirectory.js')

  assert.match(component, /featured\.heroImagePath/)
  assert.match(component, /outing\.heroImagePath/)
  assert.match(component, /alt=\{outing\.heroImageAlt\}/)
  assert.match(component, /unoptimized=\{outing\.heroImagePath\.startsWith\('\/'\)\}/)
  assert.match(component, /!featured\.heroImagePath && featured\.crestPath/)
})

test('Glory procession photographs stay visible on mobile cards', async () => {
  const css = await read('components/GloryDirectoryPhotos.module.css')

  assert.match(css, /@media \(max-width: 820px\)/)
  assert.match(css, /\.cardMainWithPhoto\s*\{[^}]*padding-right:/s)
  assert.match(css, /\.cardPhoto\s*\{[^}]*position:\s*absolute/s)
  assert.match(css, /@media \(max-width: 560px\)/)
})
