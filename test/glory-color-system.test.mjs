import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const files = [
  'app/procesiones-de-gloria/glory-page.module.css',
  'components/GloryDirectory.module.css',
  'app/procesiones-de-gloria/[slug]/glory-detail.module.css',
]

const legacyPalette = [
  '#7d5e18',
  '#6d5520',
  '#eee8d9',
  '#f4f1e9',
  '#efe7d2',
  '#f7f3e8',
  '#ece3cb',
  '#aa8b45',
]

test('Procesiones de Gloria usa el sistema cromático público de Hilo', () => {
  const contents = files.map((file) => readFileSync(file, 'utf8'))
  const combined = contents.join('\n')

  assert.match(combined, /#123a67/i, 'Debe conservar el azul principal de Hilo')
  assert.match(combined, /#b71f37/i, 'Debe conservar el rojo de acento de Hilo')
  assert.match(combined, /#f7fafc/i, 'Debe utilizar las superficies frías del sistema público')

  for (const color of legacyPalette) {
    assert.doesNotMatch(
      combined,
      new RegExp(color.replace('#', '#'), 'i'),
      `No debe reaparecer el color heredado ${color}`
    )
  }
})

test('la paleta se aplica al listado y a la ficha individual', () => {
  const directory = readFileSync('components/GloryDirectory.module.css', 'utf8')
  const detail = readFileSync('app/procesiones-de-gloria/[slug]/glory-detail.module.css', 'utf8')

  assert.match(directory, /var\(--hc-blue/)
  assert.match(directory, /var\(--hc-red/)
  assert.match(detail, /--hc-blue:\s*#123a67/i)
  assert.match(detail, /--hc-red:\s*#b71f37/i)
})
