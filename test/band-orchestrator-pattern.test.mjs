import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { externalReleaseLinkLabel, presentReleaseType } from '../lib/bands/discography.js'
import { mergeBandInterestLinks } from '../lib/bands/official-links.js'
import { presentBandPremiere } from '../lib/bands/premieres.js'

const page = readFileSync(new URL('../app/bandas/[slug]/page.js', import.meta.url), 'utf8')
const loader = readFileSync(new URL('../lib/supabase/bands-core.js', import.meta.url), 'utf8')

test('normaliza la naturaleza documentada sin inventar valores desconocidos', () => {
  assert.deepEqual(presentBandPremiere('Tipo de novedad: adaptación. Contexto documentado.'), {
    type: 'Adaptación',
    description: 'Contexto documentado.',
  })
  assert.deepEqual(presentBandPremiere('Tipo de novedad: recuperación. Nota conservada.'), {
    type: 'Novedad musical',
    description: 'Tipo de novedad: recuperación. Nota conservada.',
  })
})

test('completa los canales oficiales sin duplicar los ya publicados', () => {
  const links = mergeBandInterestLinks([
    { id: 'web', platform: 'website', url: 'https://lascigarreras.net/', label: 'Sitio oficial' },
    { id: 'spotify', platform: 'spotify', url: 'https://open.spotify.com/artist/cigarreras' },
  ], {
    websiteUrl: 'https://lascigarreras.net',
    youtubeUrl: 'https://www.youtube.com/@LasCigarrerasOficial',
  })
  assert.deepEqual(links.map((link) => link.platform), ['website', 'spotify', 'youtube'])
  assert.equal(links.filter((link) => link.platform === 'website').length, 1)
})

test('presenta lanzamientos y plataformas con etiquetas editoriales', () => {
  assert.equal(presentReleaseType('album'), 'Álbum')
  assert.equal(presentReleaseType('live'), 'En directo')
  assert.equal(externalReleaseLinkLabel('https://music.apple.com/es/album/ejemplo/1'), 'Escuchar en Apple Music ↗')
})

test('la ficha patrón respeta la jerarquía editorial de Bandas', () => {
  const card = page.slice(page.indexOf('{hasStepDetail ?'), page.indexOf('function HistoricalIcon'))
  assert.ok(card.indexOf('relationshipStepType') < card.indexOf('step.name'))
  assert.match(page, /label: 'Dónde suena'/)
  assert.match(page, /<h2>Estrenos y novedades<\/h2>/)
  assert.match(page, /open=\{year === currentYear\}/)
  assert.match(page, /item\.type \|\| 'Novedad musical'/)
  assert.match(loader, /description: entity\.summary \|\| item\.description \|\| ''/)
})
