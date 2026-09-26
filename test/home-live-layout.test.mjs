import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el directo múltiple usa un único bloque azul y no repite una cabecera interna', () => {
  const home = read('components/HomePageV2.js')
  const styles = read('components/HomeExtraordinaryLive.module.css')

  assert.match(home, /multipleLive \? liveStyles\.multipleLiveSection/)
  assert.match(home, /Varias procesiones están en la calle/)
  assert.doesNotMatch(home, /className=\{liveStyles\.multipleLiveHead\}/)
  assert.match(styles, /\.multipleLiveSection\.multipleLiveSection/)
  assert.match(styles, /linear-gradient\(145deg, #0a2139/)
  assert.match(styles, /color: #fff/)
})

test('con salidas en curso la secuencia es directo, otros actos y después próximas citas', () => {
  const home = read('components/HomePageV2.js')

  assert.match(home, /buildComplementaryHomeTemporal\(homeTemporal, upcomingAgenda\)/)
  const liveBranch = home.slice(home.indexOf('{liveOutings.length ? ('))
  const direct = liveBranch.indexOf('{upcomingSection}')
  const other = liveBranch.indexOf('{temporalSection}')
  const after = liveBranch.indexOf('{followingSection}')
  const editorial = liveBranch.indexOf('{todaySection}')

  assert.ok(direct >= 0 && other > direct && after > other && editorial > after)
})
