import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
  canonicalSemanaSantaDay,
  musicChangeDaySlug,
  musicChangeKind,
  musicChangePositionLabel,
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

test('compacta la repetición exacta del paso conservando la orientación', () => {
  assert.equal(musicChangePositionLabel({
    stepName: 'Paso de palio de Nuestra Señora de la Esperanza de Triana',
    position: 'Tras el paso de palio de Nuestra Señora de la Esperanza de Triana',
  }), 'Tras el paso')
  assert.equal(musicChangePositionLabel({
    stepName: 'Paso de Nuestra Señora de la Esperanza',
    position: 'Tras Nuestra Señora de la Esperanza',
  }), 'Tras el paso')
  assert.equal(musicChangePositionLabel({
    stepName: 'Paso del Santísimo Cristo de la Salud',
    position: 'Tras el Santísimo Cristo de la Salud',
  }), 'Tras el paso')
  assert.equal(musicChangePositionLabel({
    stepName: 'Paso de Cristo',
    position: 'Delante del paso de Cristo',
  }), 'Delante del paso')
  assert.equal(musicChangePositionLabel({
    stepName: 'Paso de Cristo',
    position: 'Detrás del paso de Cristo',
  }), 'Detrás del paso')
  assert.equal(musicChangePositionLabel({
    stepName: 'Cruz de Guía',
    position: 'Cruz de Guía',
  }), '')
  assert.equal(musicChangePositionLabel(), '')
})

test('conserva posiciones distintas, acompañamientos compartidos y matices de recorrido', () => {
  const cases = [
    {
      stepName: 'Paso de Nuestro Padre Jesús del Gran Poder',
      position: 'Tras el paso del Señor del Gran Poder',
    },
    {
      stepName: 'Paso de Nuestro Padre Jesús de la Pasión',
      position: 'Acompañamiento compartido tras Nuestro Padre Jesús de la Pasión · Bondad',
    },
    {
      stepName: 'Paso de Nuestra Señora de la Esperanza',
      position: 'Tras Nuestra Señora de la Esperanza durante la ida',
    },
    { stepName: 'Paso de Cristo', position: 'Cruz de Guía' },
    { stepName: 'Paso de Cristo', position: 'Tras el paso de otro titular' },
    { stepName: '', position: 'Cruz de Guía' },
  ]
  for (const change of cases) {
    assert.equal(musicChangePositionLabel(change), change.position)
  }
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

  assert.match(page, /Cambios y renovaciones no son lo mismo/)
  assert.match(page, /nunca incrementan el contador de cambios/)
})


test('el especial 2027 prioriza listado, filtros y contenido SEO útil', async () => {
  const page = await read('app/semana-santa/2027/cambios-musicales/page.js')

  assert.match(page, /Música 2027: cambios y renovaciones/)
  assert.match(page, /Música de la Semana Santa de Sevilla 2027: cambios y renovaciones/)
  assert.match(page, /name="municipio"/)
  assert.match(page, /name="tipo"/)
  assert.match(page, /name="q"/)
  assert.match(page, /filteredViewRobots\(await searchParams, \['jornada', 'ambito', 'municipio', 'tipo', 'q'\]\)/)
  assert.doesNotMatch(page, /Panorama 2027/)
  assert.doesNotMatch(page, /Preguntas frecuentes/)
  assert.doesNotMatch(page, /<main\b/)
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


test('el listado conserva el resumen territorial', async () => {
  const page = await read('app/semana-santa/2027/cambios-musicales/page.js')

  assert.match(page, /function municipalityRanking\(changes, limit = 6\)/)
  assert.match(page, /Municipios con más cambios/)
  assert.match(page, /cambios confirmados/)
  assert.match(page, /municipalityTop\.map/)
})
