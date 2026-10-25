import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { UNIFIED_AUTHOR_REDIRECTS, unifiedAuthorRedirects } from '../lib/unified-author-redirects.mjs'

test('las 22 fichas unificadas redirigen de forma permanente a la conservada', () => {
  const redirects = unifiedAuthorRedirects()
  assert.equal(redirects.length, 22)
  for (const redirect of redirects) {
    assert.match(redirect.source, /^\/autores\/[a-z0-9-]+$/)
    assert.match(redirect.destination, /^\/autores\/[a-z0-9-]+$/)
    assert.notEqual(redirect.source, redirect.destination)
    assert.equal(redirect.permanent, true)
  }
})

test('ninguna ficha es a la vez origen y destino (sin cadenas ni bucles)', () => {
  const sources = new Set(UNIFIED_AUTHOR_REDIRECTS.map(([from]) => from))
  const targets = new Set(UNIFIED_AUTHOR_REDIRECTS.map(([, to]) => to))
  assert.equal(sources.size, 22)
  for (const target of targets) assert.equal(sources.has(target), false, target)
})

test('los nombres decididos por el editor conservan su ficha', () => {
  const map = new Map(UNIFIED_AUTHOR_REDIRECTS)
  assert.equal(map.get('francisco-javier-sanchez-de-los-reyes'), 'javier-sanchez-de-los-reyes')
  assert.equal(map.get('juan-antonio-gonzalez-garcia-ventura'), 'juan-ventura')
})

test('next.config incorpora las redirecciones', () => {
  const config = readFileSync(new URL('../next.config.mjs', import.meta.url), 'utf8')
  assert.match(config, /\.\.\.unifiedAuthorRedirects\(\)/)
})
