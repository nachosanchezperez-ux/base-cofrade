import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { backslashPathResolution } from '../lib/backslash-path.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// Auditoría de seguimiento P2-C (18/10/2026).
test('el Banco editorial comprueba el rol antes de escribir', () => {
  const source = read('app/panel/(protected)/hoy/banco/actions.js')
  for (const name of ['saveBankEditorialContentAction', 'archiveBankEditorialContentAction']) {
    const body = source.slice(source.indexOf(`export async function ${name}`))
    const firstStatement = body.slice(body.indexOf('{') + 1).trim().split('\n')[0]
    assert.equal(firstStatement, 'await requirePanelEditor()', name)
  }
})

// Auditoría de seguimiento P3 (18/10/2026): rutas con «\» daban error 500.
test('las rutas con barra invertida redirigen o dan 404', () => {
  assert.equal(backslashPathResolution('/pregunta'), null)
  assert.deepEqual(backslashPathResolution('/pregunta%5C'), { redirect: '/pregunta' })
  assert.deepEqual(backslashPathResolution('/crucetas-musicales%5C%5C%5C'), { redirect: '/crucetas-musicales' })
  assert.deepEqual(backslashPathResolution('/%5c'), { redirect: '/' })
  assert.deepEqual(backslashPathResolution('/hermandades%5Cmacarena'), { notFound: true })
  const proxy = read('proxy.js')
  assert.match(proxy, /backslashPathResolution\(request\.nextUrl\.pathname\)/)
  assert.match(proxy, /NextResponse\.redirect\(cleanUrl, 308\)/)
  assert.match(proxy, /status: 404/)
})
