import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { authorshipCertaintyLabel, authorshipRoleLabel, marchAuthorRoleLabel, sentenceCase } from '../lib/public-labels.js'

test('los valores internos se traducen o no se muestran', () => {
  assert.equal(marchAuthorRoleLabel('composer'), 'Composición')
  assert.equal(marchAuthorRoleLabel('arranger'), 'Arreglo')
  assert.equal(authorshipCertaintyLabel('documented'), '')
  assert.equal(authorshipCertaintyLabel('attributed'), 'Atribuida')
  assert.equal(authorshipRoleLabel('composer'), 'Composición')
  assert.equal(authorshipRoleLabel('escultor'), 'Escultor')
  assert.equal(authorshipRoleLabel('attributed_to'), 'Atribuida')
  assert.equal(authorshipRoleLabel('some_new_code'), '')
  assert.equal(sentenceCase('imaginero'), 'Imaginero')
})

test('no se publican avisos internos ni jerga', () => {
  const files = [
    'app/autores/[slug]/page.js', 'app/autores/page.js', 'components/RelationalEntityHeroMedia.js', 'app/pregunta/page.js',
    'components/MunicipalityAgendaHub.js', 'components/MunicipalityTemporalSpotlight.js', 'components/AgendaTemporalLanding.js',
    'lib/image-restoration-display.js', 'lib/supabase/rosary-outings.js', 'lib/supabase/kissing-devotions.js',
    'lib/supabase/general-public-outings.js', 'lib/supabase/agenda-cofrade.js', 'components/AgendaCofradeDirectoryV4.js',
  ]
  const banned = /Dato pendiente de documentación|Identidad visual pendiente|Perfiles indexables|del grafo|Volver a la Home|Hermandad organizadora|'Entidad organizadora'|Fecha asociada actualmente|cuatro calendarios públicos|bajar a la cronología|selección editorial manual|mark: 'DEV'/
  for (const file of files) assert.doesNotMatch(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), banned, file)
})
