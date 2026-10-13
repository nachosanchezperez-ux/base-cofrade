import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const robots = read('app/robots.js')

// Google robots.txt matching: `*` is any sequence, `$` anchors the end,
// otherwise prefix match; the longest matching rule wins (allow on ties).
function patternToRegExp(pattern) {
  const anchored = pattern.endsWith('$')
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*')
  return new RegExp(`^${body}${anchored ? '$' : ''}`)
}

function isAllowed(path, { allow, disallow }) {
  const best = (patterns) => patterns
    .filter((pattern) => patternToRegExp(pattern).test(path))
    .reduce((length, pattern) => Math.max(length, pattern.length), -1)
  return best(allow) >= best(disallow)
}

function rulesFor(userAgent) {
  const block = robots.split('userAgent:').find((chunk) => chunk.trimStart().startsWith(`'${userAgent}'`))
  assert.ok(block, `robots.js declara reglas para ${userAgent}`)
  const disallow = [...block.match(/disallow:\s*\[([^\]]*)\]/)[1].matchAll(/'([^']+)'/g)].map((match) => match[1])
  const allow = [...block.match(/allow:\s*'([^']+)'/g)].map((match) => match.match(/'([^']+)'/)[1])
  return { allow, disallow }
}

for (const userAgent of ['*', 'OAI-SearchBot']) {
  test(`robots (${userAgent}) bloquea las precargas RSC de Next.js`, () => {
    const rules = rulesFor(userAgent)
    for (const path of [
      '/marchas?_rsc=bO0dIPaLELRfXr25',
      '/hermandades/consolacion-osuna?_rsc=_8GFENqueI6hmr6J',
      '/marchas?pagina=2&_rsc=abc',
    ]) {
      assert.equal(isAllowed(path, rules), false, `${path} debe quedar bloqueada`)
    }
  })

  test(`robots (${userAgent}) mantiene rastreables las páginas públicas`, () => {
    const rules = rulesFor(userAgent)
    for (const path of [
      '/',
      '/marchas',
      '/marchas?pagina=2',
      '/imagenes/santisimo-cristo-expiracion-cachorro',
      '/agenda-cofrade/localidad/sevilla-capital',
      '/sitemap.xml',
      '/sitemaps/marchas.xml',
      '/_next/static/chunks/main.js',
    ]) {
      assert.equal(isAllowed(path, rules), true, `${path} debe seguir permitida`)
    }
    for (const path of ['/api/search', '/panel/hoy']) {
      assert.equal(isAllowed(path, rules), false, `${path} sigue reservada`)
    }
  })
}
