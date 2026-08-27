import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const read = (path) => readFileSync(path, 'utf8')

const bandList = read('app/panel/(protected)/bandas/page.js')
const bandCreatePage = read('app/panel/(protected)/bandas/nueva/page.js')
const bandCreateActions = read('app/panel/(protected)/bandas/nueva/actions.js')
const imageCreatePage = read('app/panel/(protected)/imagenes/nueva/page.js')
const imageCreateActions = read('app/panel/(protected)/imagenes/nueva/actions.js')
const stepCreatePage = read('app/panel/(protected)/pasos/nuevo/page.js')
const stepCreateActions = read('app/panel/(protected)/pasos/nuevo/actions.js')
const brotherhoodImagesPage = read('app/panel/(protected)/hermandades/[id]/titulares/page.js')
const brotherhoodStepsPage = read('app/panel/(protected)/hermandades/[id]/pasos/page.js')
const creationRegistry = read('lib/panel/creation.js')
const commandPalette = read('components/panel/PanelCommandPalette.js')
const panelNav = read('components/panel/PanelNav.js')
const panelLayout = read('app/panel/(protected)/layout.js')

test('Bandas dispone de alta mínima segura desde el Panel', () => {
  assert.match(bandList, /href="\/panel\/bandas\/nueva"/)
  assert.match(bandCreatePage, /Nueva banda/)
  assert.match(bandCreatePage, /createBandAction/)
  assert.match(bandCreatePage, /MunicipalitySelect/)
  assert.match(bandCreatePage, /Banda de Música/)
  assert.match(bandCreatePage, /Cornetas y Tambores/)
  assert.match(bandCreatePage, /Agrupación Musical/)

  assert.match(bandCreateActions, /requirePanelEditor/)
  assert.match(bandCreateActions, /entity_type: 'band'/)
  assert.match(bandCreateActions, /status: 'draft'/)
  assert.match(bandCreateActions, /from\('entities'\)\.insert/)
  assert.match(bandCreateActions, /from\('bands'\)/)
  assert.match(bandCreateActions, /from\('band_names'\)\.insert/)
  assert.match(bandCreateActions, /ensureUniqueBand/)
  assert.match(bandCreateActions, /validateMunicipality/)
  assert.match(bandCreateActions, /rollbackDraftBand/)
  assert.match(bandCreateActions, /object_type: 'band'/)
  assert.match(bandCreateActions, /redirect\(`\/panel\/bandas\/\$\{bandId\}\?saved=created#general`\)/)
})

test('Nuevo usa un registro canónico y cubre entidades, documentación y datos maestros', () => {
  for (const expected of [
    'Nueva hermandad',
    'Nueva imagen',
    'Nuevo paso',
    'Nueva banda',
    'Nueva marcha',
    'Nueva persona',
    'Nuevo acontecimiento',
    'Nueva fuente',
    'Nueva advocación',
    'Nuevo municipio',
    'Nuevo lugar',
    'Nueva curiosidad o dato',
  ]) {
    assert.match(creationRegistry, new RegExp(expected))
  }

  assert.doesNotMatch(creationRegistry, /#crear-/)
  assert.match(commandPalette, /PANEL_CREATE_ITEMS/)
  assert.match(commandPalette, /getPanelNavigationGroups/)
  assert.doesNotMatch(commandPalette, /const CREATE_ITEMS\s*=/)
  assert.doesNotMatch(commandPalette, /const MODULES\s*=/)
  assert.match(panelLayout, /role=\{user\.role\}/)
  assert.match(panelNav, /Nuevo contenido/)
  assert.match(panelNav, /openCommand\('new'\)/)
})

test('Titulares y Pasos pueden crearse desde la Hermandad y quedar vinculados', () => {
  assert.match(brotherhoodImagesPage, /\/panel\/imagenes\/nueva\?brotherhood=\$\{id\}/)
  assert.match(imageCreatePage, /name="brotherhood_id"/)
  assert.match(imageCreatePage, /Crear y vincular/)
  assert.match(imageCreateActions, /from\('brotherhood_images'\)/)
  assert.match(imageCreateActions, /relation_type: 'titular'/)
  assert.match(imageCreateActions, /status: 'draft'/)
  assert.match(imageCreateActions, /created-linked/)
  assert.match(imageCreateActions, /created-unlinked/)

  assert.match(brotherhoodStepsPage, /\/panel\/pasos\/nuevo\?brotherhood=\$\{id\}/)
  assert.match(stepCreatePage, /name="brotherhood_id"/)
  assert.match(stepCreatePage, /Crear y vincular/)
  assert.match(stepCreateActions, /from\('brotherhood_steps'\)/)
  assert.match(stepCreateActions, /relation_type: 'processional_step'/)
  assert.match(stepCreateActions, /status: 'draft'/)
  assert.match(stepCreateActions, /created-linked/)
  assert.match(stepCreateActions, /created-unlinked/)
})

test('los elementos dependientes de una ficha mantienen creación contextual', () => {
  const contextualContracts = [
    ['app/panel/(protected)/hermandades/[id]/cultos/page.js', /Crear culto/],
    ['app/panel/(protected)/hermandades/[id]/salidas/page.js', /saveOutingAction/],
    ['app/panel/(protected)/hermandades/[id]/salidas/recurrentes/page.js', /saveOutingSeriesAction/],
    ['app/panel/(protected)/hermandades/[id]/patrimonio/page.js', /Crear pieza patrimonial/],
    ['app/panel/(protected)/bandas/[id]/acompanamientos/page.js', /Crear acompañamiento/],
    ['app/panel/(protected)/bandas/[id]/discografia/page.js', /DiscographyReleaseEditor/],
    ['app/panel/(protected)/imagenes/[id]/autorias/page.js', /ImageAuthorshipEditor/],
    ['app/panel/(protected)/pasos/[id]/patrimonio/page.js', /saveStepPhaseAction/],
    ['app/panel/(protected)/marchas/[id]/dedicatorias/page.js', /saveMarchDedicationAction/],
  ]

  for (const [path, pattern] of contextualContracts) {
    assert.equal(existsSync(path), true, `Debe existir ${path}`)
    assert.match(read(path), pattern, `Debe conservar alta contextual en ${path}`)
  }

  assert.match(creationRegistry, /PANEL_CONTEXTUAL_CREATION/)
  assert.match(creationRegistry, /Salida o procesión/)
  assert.match(creationRegistry, /Acompañamiento musical/)
  assert.match(creationRegistry, /Pieza patrimonial/)
})
