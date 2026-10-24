// Portada: letra mínima legible (12 px) y escudo pequeño en la ficha del día sin foto.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las hojas de la portada no bajan de 12 px', () => {
  for (const file of ['components/HomeTodayV2.module.css', 'components/HomeKnowledgeThreads.module.css', 'components/HiddenThreadTeaser.module.css', 'components/HomeAgendaNow.module.css', 'components/HomeUpdatesLink.module.css', 'components/HomeDiscover.module.css']) {
    const sizes = [...read(file).matchAll(/font-size:\s*([\d.]+)px/g)].map((m) => Number(m[1]))
    assert.ok(sizes.every((size) => size >= 12), `${file}: ${sizes.filter((size) => size < 12).join(', ')}`)
  }
})

test('la ficha del día sin foto lleva el escudo pequeño en la esquina en móvil', () => {
  const css = read('components/HomeTodayV2.module.css')
  assert.match(css, /\.featureCard > \.featureVisual:not\(\[data-home-visual-kind="photo"\]\) \{[^}]*position: absolute !important;[^}]*width: 56px !important;/)
})
