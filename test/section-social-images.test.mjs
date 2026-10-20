import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import {
  SECTION_SOCIAL_IMAGES,
  SECTION_SOCIAL_THEMES,
  sectionSocialImageConfig,
  sectionTitleFontSize,
} from '../lib/section-social-copy.js'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

function luminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map((value) => {
    const channel = parseInt(value, 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (light + 0.05) / (dark + 0.05)
}

const SECTION_ROUTES = [
  ['app/agenda-cofrade', 'agenda'],
  ['app/agenda-cofrade/hoy', 'today'],
  ['app/agenda-cofrade/manana', 'tomorrow'],
  ['app/agenda-cofrade/fin-de-semana', 'weekend'],
  ['app/igualas-y-ensayos', 'crewEvents'],
]

test('cada sección compartible tiene imagen propia para Open Graph y X', () => {
  for (const [dir, key] of SECTION_ROUTES) {
    for (const kind of ['opengraph', 'twitter']) {
      const source = read(`${dir}/${kind}-image.js`)
      assert.match(source, /renderSectionSocialImage/, `${dir}/${kind}-image.js`)
      assert.match(source, new RegExp(`renderSectionSocialImage\\('${key}'\\)`), `${dir}/${kind}-image.js`)
    }
  }
  assert.match(read('app/opengraph-image.js'), /renderSectionSocialImage\('home'\)/)
})

test('los textos no caducan: sin fechas, días ni años dentro de la imagen', () => {
  const dated = /\d|lunes|martes|miércoles|jueves|viernes|temporada/i
  for (const [key, config] of Object.entries(SECTION_SOCIAL_IMAGES)) {
    const text = [config.kicker, ...config.title, config.subtitle].join(' ')
    assert.doesNotMatch(text, dated, key)
  }
})

test('el texto siempre cumple el contraste mínimo y el rojo queda solo para el hilo', () => {
  for (const [name, theme] of Object.entries(SECTION_SOCIAL_THEMES)) {
    assert.ok(contrast(theme.ink, theme.background) >= 7, `${name}: título`)
    assert.ok(contrast(theme.soft, theme.background) >= 4.5, `${name}: etiquetas`)
  }
  const renderer = read('lib/section-social-image.js')
  assert.doesNotMatch(renderer, /color: colors\.accent/)
})

test('«Hoy» se distingue en blanco y el resto va en azul corporativo', () => {
  assert.equal(sectionSocialImageConfig('today').theme, 'light')
  for (const key of ['agenda', 'tomorrow', 'weekend', 'crewEvents', 'home']) {
    assert.equal(sectionSocialImageConfig(key).theme, 'dark', key)
  }
  assert.equal(SECTION_SOCIAL_THEMES.dark.background, '#112339')
  assert.equal(SECTION_SOCIAL_THEMES.light.background, '#FFFFFF')
})

test('los títulos usan tamaños legibles en móvil', () => {
  assert.equal(sectionTitleFontSize(['Hoy']), 150)
  for (const config of Object.values(SECTION_SOCIAL_IMAGES)) {
    assert.ok(config.title.length <= 2)
    assert.ok(sectionTitleFontSize(config.title) >= 100)
  }
})

test('las imágenes usan Open Sans, la tipografía de la web, con su licencia', () => {
  assert.match(read('app/typography.css'), /--font-sans: 'Open Sans'/)
  for (const file of ['OpenSans-Regular.ttf', 'OpenSans-SemiBold.ttf', 'OpenSans-ExtraBold.ttf', 'OFL.txt']) {
    assert.ok(existsSync(new URL(`../assets/og-fonts/${file}`, import.meta.url)), file)
  }
})

test('Agenda e Igualás piden la tarjeta grande al compartirse', () => {
  assert.match(read('app/agenda-cofrade/page.js'), /twitter: \{ card: 'summary_large_image'/)
  assert.match(read('app/igualas-y-ensayos/page.js'), /twitter: \{ card: 'summary_large_image'/)
})
