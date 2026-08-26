import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const publicFiles = [
  'app/procesiones-de-gloria/page.js',
  'components/GloryDirectory.js',
  'app/procesiones-de-gloria/[slug]/page.js',
]

const forbidden = [
  'Hilo Cofrade reúne',
  'Guía en crecimiento',
  'no sustituye al directorio',
  'se amplía a medida',
  'En móvil',
  'Datos documentados',
  'Trazabilidad',
  'pendiente de documentar',
  'por documentar',
  'pendientes de incorporar',
  'Procesión de Gloria documentada en Hilo Cofrade',
]

test('Procesiones de Gloria usa un tono editorial y no explica la herramienta', () => {
  const combined = publicFiles.map((file) => readFileSync(file, 'utf8')).join('\n')

  for (const phrase of forbidden) {
    assert.doesNotMatch(
      combined,
      new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      `No debe aparecer lenguaje de producto: ${phrase}`
    )
  }

  assert.match(combined, /Calendario anual/)
  assert.match(combined, /Datos de la salida/)
  assert.match(combined, /Fuentes consultadas/)
  assert.match(combined, /Acompañamiento musical por confirmar\./)
})

test('los textos de reserva públicos evitan el lenguaje de documentación interna', () => {
  const loader = readFileSync('lib/supabase/glory-directory.js', 'utf8')

  assert.match(loader, /Hermandad por confirmar/)
  assert.match(loader, /Acompañamiento musical por confirmar/)
  assert.doesNotMatch(loader, /Hermandad por documentar/)
  assert.doesNotMatch(loader, /Acompañamiento por documentar/)
})
