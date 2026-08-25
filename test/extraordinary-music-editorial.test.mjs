import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const actions = readFileSync(
  new URL('../app/panel/(protected)/extraordinarias/[id]/musica/actions.js', import.meta.url),
  'utf8'
)

const detailCss = readFileSync(
  new URL('../app/extraordinarias/[slug]/extraordinary-detail.module.css', import.meta.url),
  'utf8'
)

test('el Panel exige normalizar referencias documentales antes de publicar notas musicales', () => {
  assert.match(actions, /SOURCE_FRAMING_PATTERN/)
  assert.match(actions, /Normaliza el texto público/)
  assert.match(actions, /referencia documental para Fuentes/)
})

test('el programa musical mantiene tamaños de lectura altos también en móvil', () => {
  assert.match(detailCss, /\.musicRow a,\.musicRow strong\{font-size:18px/)
  assert.match(detailCss, /\.musicRow small\{margin-top:7px;font-size:13px/)
  assert.match(detailCss, /@media\(max-width:620px\)[\s\S]*\.musicRow a,\.musicRow strong\{font-size:16px/)
})
