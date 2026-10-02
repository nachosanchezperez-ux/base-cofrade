import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
  canonicalSemanaSantaDay,
  musicChangeDaySlug,
  musicChangeKind,
  sortMusicChanges,
} from '../lib/music-changes.js'

const root = new URL('../', import.meta.url)

async function read(path) {
  return readFile(new URL(path, root), 'utf8')
}

test('normaliza las jornadas de Semana Santa sin perder la Madrugá', () => {
  assert.equal(canonicalSemanaSantaDay('Domingo de Ramos · tarde'), 'Domingo de Ramos')
  assert.equal(canonicalSemanaSantaDay('Madrugada del Viernes Santo'), 'Madrugá')
  assert.equal(musicChangeDaySlug('Sábado Santo'), 'sabado-santo')
})

test('distingue el relevo ordinario del cambio en Cruz de Guía', () => {
  assert.equal(musicChangeKind({
    position: 'Tras el paso de misterio',
    previousBandName: 'Las Cigarreras',
  }), 'relevo')

  assert.equal(musicChangeKind({
    position: 'Cruz de Guía',
    previousBandName: 'Sagrada Columna y Azotes',
  }), 'cruz-guia')

  assert.equal(musicChangeKind({
    position: 'Tras el paso',
    previousBandName: '',
  }), 'incorporacion')
})

test('ordena los cambios por jornada y después por Hermandad', () => {
  const sorted = sortMusicChanges([
    { day: 'Sábado Santo', brotherhoodName: 'Trinidad', position: 'Cruz de Guía' },
    { day: 'Domingo de Ramos', brotherhoodName: 'Jesús Despojado', position: 'Palio' },
    { day: 'Sábado Santo', brotherhoodName: 'Santo Entierro', position: 'Paso' },
  ])

  assert.deepEqual(
    sorted.map((item) => item.brotherhoodName),
    ['Jesús Despojado', 'Santo Entierro', 'Trinidad'],
  )
})

test('la sección se alimenta del grafo musical y limita el alcance a Sevilla', async () => {
  const loader = await read('lib/supabase/music-changes.js')
  assert.match(loader, /music_accompaniment_periods/)
  assert.match(loader, /\.eq\('year_from', year\)/)
  assert.match(loader, /\.eq\('year_to', year - 1\)/)
  assert.match(loader, /province !== 'Sevilla'/)
  assert.match(loader, /previousBandHref/)
  assert.match(loader, /newBandHref/)
})

test('Cambios musicales 2027 queda descubrible e indexable', async () => {
  const header = await read('components/HiloHeader.js')
  const directory = await read('app/directorio/page.js')
  const sitemap = await read('app/sitemap.js')
  const page = await read('app/semana-santa/2027/cambios-musicales/page.js')

  for (const source of [header, directory, sitemap, page]) {
    assert.match(source, /\/semana-santa\/2027\/cambios-musicales/)
  }

  assert.match(page, /Las renovaciones sin cambio de formación no aparecen aquí/)
  assert.match(page, /negociaciones, candidaturas o continuidades no confirmadas/)
})
