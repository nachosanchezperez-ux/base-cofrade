import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const config = readFileSync(new URL('../next.config.mjs', import.meta.url), 'utf8')

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function assertPermanentRedirect(source, destination) {
  const pattern = new RegExp(
    `source: '${escapeRegExp(source)}',[\\s\\S]*?destination: '${escapeRegExp(destination)}',[\\s\\S]*?permanent: true`,
  )

  assert.match(config, pattern)
}

test('las URLs históricas verificadas conservan un destino permanente', () => {
  const redirects = [
    [
      '/bandas/escolania-salesiana-capilla-musical-maria-auxiliadora',
      '/bandas/escolania-salesiana-maria-auxiliadora-sevilla',
    ],
    [
      '/extraordinarias/padre-pio-divina-gracia-salida-extraordinaria-2026-10-11',
      '/extraordinarias/sevilla-divina-gracia-2026',
    ],
    [
      '/hermandades/hermandad-san-esteban-sevilla',
      '/hermandades/san-esteban',
    ],
    [
      '/hermandades/hermandad-de-san-benito',
      '/hermandades/san-benito',
    ],
    [
      '/imagenes/nuestra-senora-santa-maria-aguas-santas-coronada-villaverde',
      '/imagenes/nuestra-senora-aguas-santas-villaverde-del-rio',
    ],
  ]

  for (const [source, destination] of redirects) {
    assertPermanentRedirect(source, destination)
  }
})

test('los borradores huérfanos no reciben redirects inventados', () => {
  for (const slug of [
    'agrupacion-parroquial-humildad-sevilla-este',
    'cristo-amor-entrada-triunfal-huevar',
    'hermandad-servita-cautivo-alcala-guadaira',
    'santa-cruz-cerrillo-santa-elena-villalba-alcor',
  ]) {
    assert.doesNotMatch(config, new RegExp(`source: '/hermandades/${escapeRegExp(slug)}'`))
  }
})
