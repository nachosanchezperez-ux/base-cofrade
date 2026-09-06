import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  isLightLogoBackgroundColor,
  isValidLogoBackgroundColor,
  normalizeLogoBackgroundColor,
} from '../lib/bands/logo-background.js'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('normaliza únicamente colores HEX completos y mantiene vacío como ausencia de fondo', () => {
  assert.equal(normalizeLogoBackgroundColor('#ab12ef'), '#AB12EF')
  assert.equal(normalizeLogoBackgroundColor(''), '')
  assert.equal(normalizeLogoBackgroundColor('#123'), '')
  assert.equal(isValidLogoBackgroundColor('#A0B1C2'), true)
  assert.equal(isValidLogoBackgroundColor('A0B1C2'), false)
  assert.equal(isLightLogoBackgroundColor('#FFFFFF'), true)
  assert.equal(isLightLogoBackgroundColor('#111111'), false)
})

test('la migración añade un campo nullable independiente de los colores corporativos', () => {
  const migration = source('supabase/migrations/20260831072000_add_band_logo_background_color.sql')
  assert.match(migration, /add column if not exists logo_background_color text/)
  assert.match(migration, /logo_background_color is null/)
  assert.match(migration, /\^#\[0-9A-F\]\{6\}\$/)
  assert.doesNotMatch(migration, /update public\.bands/)
})

test('Panel y directorio comparten el campo sin convertir la cabecera en una caja', () => {
  const panel = source('components/panel/band/BandLogoBackgroundField.js')
  const action = source('app/panel/(protected)/bandas/[id]/actions.js')
  const loader = source('lib/supabase/bands-core.js')
  const directory = source('components/RelationalEntityDirectory.js')
  const hero = source('components/RelationalEntityHero.js')
  const heroCss = source('components/RelationalEntityHeroBand.module.css')

  assert.match(panel, /name="logo_background_color"/)
  assert.match(panel, />Sin fondo</)
  assert.match(panel, />Restablecer</)
  assert.match(action, /logo_background_color:/)
  assert.match(loader, /logoBackgroundColor: band\.logo_background_color \|\| ''/)
  assert.match(directory, /item\.logoBackgroundColor/)
  assert.doesNotMatch(hero, /backgroundColor=\{media\.logoBackgroundColor\}/)
  assert.doesNotMatch(hero, /data-custom-background/)
  assert.doesNotMatch(heroCss, /\.logoStage\[data-custom-background='true'\]/)
  assert.match(heroCss, /object-fit: contain/)
})
