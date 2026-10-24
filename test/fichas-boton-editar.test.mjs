import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { hasPanelSessionCookie, panelEditHref } from '../lib/panel-session-cookie.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const ID = '0b5c8d7e-1f2a-4b3c-9d8e-7f6a5b4c3d2e'

test('solo se reconoce la cookie de sesión del Panel', () => {
  assert.equal(hasPanelSessionCookie(''), false)
  assert.equal(hasPanelSessionCookie('_ga=GA1.1; hc_follow=triana'), false)
  assert.equal(hasPanelSessionCookie('sb-kcevwkucqzcyrqaimyhl-auth-token=base64-abc'), true)
  assert.equal(hasPanelSessionCookie('_ga=1; sb-kcevwkucqzcyrqaimyhl-auth-token.0=base64-abc; sb-kcevwkucqzcyrqaimyhl-auth-token.1=def'), true)
  // El verificador PKCE del inicio de sesión no es una sesión abierta.
  assert.equal(hasPanelSessionCookie('sb-kcevwkucqzcyrqaimyhl-auth-token-code-verifier=xyz'), false)
  // Una cookie vaciada al cerrar sesión tampoco cuenta.
  assert.equal(hasPanelSessionCookie('sb-kcevwkucqzcyrqaimyhl-auth-token=; other=1'), false)
})

test('el enlace lleva al editor del Panel y rechaza identificadores raros', () => {
  assert.equal(panelEditHref('brotherhood', ID), `/panel/hermandades/${ID}`)
  assert.equal(panelEditHref('band', ID), `/panel/bandas/${ID}`)
  assert.equal(panelEditHref('band', ''), '')
  assert.equal(panelEditHref('band', '../admin'), '')
  assert.equal(panelEditHref('march', ID), '')
})

test('las fichas de hermandad y banda pasan el enlace a su cabecera', () => {
  assert.match(read('app/hermandades/[slug]/page.js'), /editHref=\{panelEditHref\('brotherhood', h\.id\)\}/)
  assert.match(read('app/bandas/[slug]/page.js'), /editHref=\{panelEditHref\('band', band\.id\)\}/)
  for (const hero of ['components/BrotherhoodProgramHero.js', 'components/RelationalEntityHero.js']) {
    assert.match(read(hero), /<HeroTopRow editHref=\{editHref\}>/)
  }
})

test('el botón se decide en el navegador y no precarga el Panel', () => {
  const link = read('components/PanelEditLink.js')
  assert.match(link, /^'use client'/)
  assert.match(link, /useState\(false\)/)
  assert.match(link, /hasPanelSessionCookie\(document\.cookie\)/)
  assert.doesNotMatch(link, /from 'next\/link'/)
  assert.match(link, /rel="nofollow"/)
})
