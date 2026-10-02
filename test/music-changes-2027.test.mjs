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
  assert.match(loader, /public_band_name/)
  assert.match(loader, /newBandPublished/)
  assert.match(loader, /brotherhoodPublished/)
  assert.match(loader, /band_type/)
  assert.match(loader, /newBandType/)
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


test('el especial 2027 prioriza listado, filtros y contenido SEO útil', async () => {
  const page = await read('app/semana-santa/2027/cambios-musicales/page.js')
  const styles = await read('app/semana-santa/2027/cambios-musicales/cambios-musicales.module.css')

  assert.match(page, /Cambios musicales 2027/)
  assert.match(page, /Cambios de bandas en la Semana Santa de Sevilla 2027/)
  assert.match(page, /name="municipio"/)
  assert.match(page, /name="tipo"/)
  assert.match(page, /name="q"/)
  assert.match(page, /filteredViewRobots\(await searchParams, \['jornada', 'ambito', 'municipio', 'tipo', 'q'\]\)/)
  assert.doesNotMatch(page, /Panorama 2027/)
  assert.doesNotMatch(page, /Preguntas frecuentes/)
  assert.doesNotMatch(page, /<main\b/)
  assert.match(styles, /\.searchPanel[\s\S]*flex-wrap: wrap/)
  assert.match(styles, /\.movement[\s\S]*grid-template-columns: minmax\(170px, \.9fr\) minmax\(0, 1fr\) 30px minmax\(0, 1fr\)/)
  assert.match(styles, /\.heroCopy h1[\s\S]*font-size: clamp\(38px, 5vw, 58px\)/)
  assert.match(styles, /@media \(max-width: 700px\)[\s\S]*\.movement[\s\S]*grid-template-columns: minmax\(0, 1fr\) 28px minmax\(0, 1fr\)/)
  assert.match(styles, /@media \(max-width: 520px\)[\s\S]*\.movement[\s\S]*grid-template-columns: 1fr/)
})


test('los cambios de una misma Hermandad siguen agrupados sin duplicar cabeceras', async () => {
  const page = await read('app/semana-santa/2027/cambios-musicales/page.js')
  const styles = await read('app/semana-santa/2027/cambios-musicales/cambios-musicales.module.css')

  assert.match(page, /function groupBrotherhoodChanges\(items = \[\]\)/)
  assert.match(page, /brotherhoods: groupBrotherhoodChanges\(items\)/)
  assert.match(page, /group\.brotherhoods\.map/)
  assert.match(page, /brotherhood\.changes\.map/)
  assert.match(page, /brotherhood\.changes\.length > 1/)
  assert.match(styles, /\.brotherhoodCluster/)
  assert.match(styles, /\.clusterHeader/)
  assert.match(styles, /\.clusterChanges/)
  assert.doesNotMatch(styles, /\.clusterCount/)
  assert.doesNotMatch(styles, /\.movementNumber/)
})
