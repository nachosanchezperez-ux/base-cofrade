import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

for (const section of ['hermandades', 'bandas']) {
  test(`las fichas de ${section} usan ISR y no fuerzan renderizado dinámico`, () => {
    const layout = read(`app/${section}/[slug]/layout.js`)
    const page = read(`app/${section}/[slug]/page.js`)

    assert.match(layout, /export const dynamic = ['"]force-static['"]/)
    assert.doesNotMatch(layout, /force-dynamic/)
    assert.match(page, /export const revalidate = 900[;]?/)
  })
}

test('las fichas de Hermandades precalientan los slugs conocidos', () => {
  const page = read('app/hermandades/[slug]/page.js')

  assert.match(page, /export function generateStaticParams\(\)/)
  assert.match(page, /hermandades\.map\(\(item\) => \(\{ slug: item\.slug \}\)\)/)
})
