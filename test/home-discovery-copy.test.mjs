// «Hoy en Hilo Cofrade»: la ficha del día dice el tema y cuenta el dato, en vez
// de «Hilo para descubrir» + el nombre suelto de la entidad (21/10/2026).
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { brotherhoodArticle, brotherhoodInPhrase, discoveryCopy, threadTopicLabel, withPreposition } from '../lib/home-discovery-copy.js'

const row = (activity_kind, root_type, root_name, relation_count, secondary_count = 0) =>
  ({ activity_kind, root_type, root_name, relation_count, secondary_count })

test('patrimonio musical: el dato en el titular, en singular y en plural', () => {
  assert.deepEqual(discoveryCopy(row('musical_heritage', 'brotherhood', 'San Bernardo', 19)), {
    label: 'Patrimonio musical',
    title: 'Las 19 marchas dedicadas a San Bernardo',
    summary: 'Con sus autores, en su ficha.',
  })
  assert.equal(discoveryCopy(row('musical_heritage', 'brotherhood', 'San Benito', 1)).title, 'La marcha dedicada a San Benito')
  assert.equal(discoveryCopy(row('musical_heritage', 'brotherhood', 'Olivares', 0, 2)).title, 'Las 2 piezas dedicadas a Olivares')
  assert.equal(discoveryCopy(row('musical_heritage', 'brotherhood', 'El Museo', 12, 3)).summary, 'Y 3 piezas más, con sus autores y grabaciones.')
})

test('preposiciones: contracciones y artículos', () => {
  assert.equal(withPreposition('a', 'El Museo', 'brotherhood'), 'al Museo')
  assert.equal(withPreposition('de', 'El Museo', 'brotherhood'), 'del Museo')
  assert.equal(withPreposition('de', 'Los Gitanos', 'brotherhood'), 'de los Gitanos')
  assert.equal(withPreposition('de', 'Paso de palio de Nuestra Señora de los Dolores', 'step'), 'del paso de palio de Nuestra Señora de los Dolores')
  assert.equal(withPreposition('de', 'Andas de plata de María Santísima de Setefilla', 'step'), 'de las andas de plata de María Santísima de Setefilla')
  assert.equal(withPreposition('de', 'Santísimo Cristo de la Sed', 'image'), 'del Santísimo Cristo de la Sed')
  assert.equal(withPreposition('de', 'Nuestra Señora del Patrocinio', 'image'), 'de Nuestra Señora del Patrocinio')
  assert.equal(withPreposition('de', 'Antigua Nuestra Señora de la Piedad', 'image'), 'de la Antigua Nuestra Señora de la Piedad')
  assert.equal(withPreposition('de', 'Antiguo Cristo de la Expiración', 'image'), 'del Antiguo Cristo de la Expiración')
})

test('cada tipo de hilo tiene rótulo temático y titular con el dato', () => {
  const cases = [
    [row('posters', 'brotherhood', 'Las Siete Palabras', 4), 'Cartelería', 'Los 4 carteles de las Siete Palabras'],
    [row('band_brotherhoods', 'band', 'Banda del Sol', 1), 'Música', 'Banda del Sol: la hermandad que acompaña'],
    [row('step_personnel', 'brotherhood', 'La Carretería', 3, 2), 'Capataces', 'Quién manda los pasos de la Carretería'],
    [row('titularity', 'brotherhood', 'Servitas', 3), 'Titulares', 'Los 3 titulares de Servitas'],
    [row('brotherhood_steps', 'brotherhood', 'Los Gitanos', 2), 'Pasos', 'Los 2 pasos de los Gitanos'],
    [row('discography', 'band', 'Banda del Sol', 4, 41), 'Discografía', 'Banda del Sol: 4 discos y 41 grabaciones'],
    [row('image_authorship', 'image', 'Santísimo Cristo de la Sed', 2), 'Imaginería', 'La autoría del Santísimo Cristo de la Sed'],
    [row('step_phases', 'step', 'Paso de palio de Nuestra Señora de los Dolores', 5), 'Pasos', 'La historia del paso de palio de Nuestra Señora de los Dolores'],
    [row('heritage_interventions', 'brotherhood', 'El Museo', 17, 4), 'Patrimonio', 'Las 17 intervenciones en el patrimonio del Museo'],
    [row('heritage_interventions', 'step', 'Paso de palio de María Santísima del Refugio', 1), 'Patrimonio', 'La intervención sobre el paso de palio de María Santísima del Refugio'],
    [row('heritage_updates', 'image', 'Santísimo Cristo de la Salud', 2), 'Patrimonio', 'Novedades en el patrimonio del Santísimo Cristo de la Salud'],
  ]
  for (const [input, label, title] of cases) {
    const copy = discoveryCopy(input)
    assert.equal(copy.label, label, input.activity_kind)
    assert.equal(copy.title, title, input.activity_kind)
    assert.ok(copy.summary.endsWith('.'), input.activity_kind)
  }
  assert.equal(discoveryCopy(row('entity_new', 'band', 'X', 1)), null)
})

test('tarjeta de reserva: rótulo con el último tramo de la relación', () => {
  assert.equal(threadTopicLabel('Banda → hermandades'), 'Hermandades')
  assert.equal(threadTopicLabel('Cruceta → repertorio interpretado'), 'Repertorio interpretado')
  assert.equal(threadTopicLabel(''), 'Para descubrir')
})

test('la portada ya no muestra «Hilo para descubrir»', () => {
  const v2 = readFileSync(new URL('../lib/supabase/home-v2.js', import.meta.url), 'utf8')
  assert.match(v2, /const copy = discoveryCopy\(row\)\n  return copy \? \{ \.\.\.card, \.\.\.copy \} : card/)
  const snapshot = readFileSync(new URL('../lib/supabase/home-snapshot.js', import.meta.url), 'utf8')
  assert.match(snapshot, /label: copy\?\.label \|\| threadTopicLabel\(thread\.label\),/)
  assert.match(snapshot, /title: copy\?\.title \|\| thread\.title,/)
  assert.match(readFileSync(new URL('../lib/supabase/home.js', import.meta.url), 'utf8'), /copySource: \{\s*activity_kind: row\.activity_kind,/)
})

test('hermandades: siempre con su artículo dentro de la frase', () => {
  assert.equal(withPreposition('de', 'El Baratillo', 'brotherhood'), 'del Baratillo')
  assert.equal(withPreposition('a', 'El Baratillo', 'brotherhood'), 'al Baratillo')
  assert.equal(withPreposition('a', 'Esperanza de Triana', 'brotherhood'), 'a la Esperanza de Triana')
  assert.equal(withPreposition('de', 'Gran Poder', 'brotherhood'), 'del Gran Poder')
  assert.equal(withPreposition('de', 'Vera-Cruz de Lebrija', 'brotherhood'), 'de la Vera-Cruz de Lebrija')
  assert.equal(withPreposition('de', 'Estudiantes', 'brotherhood'), 'de los Estudiantes')
  assert.equal(withPreposition('de', 'Tres Caídas de Dos Hermanas', 'brotherhood'), 'de las Tres Caídas de Dos Hermanas')
  assert.equal(withPreposition('a', 'Hermandad de la Humillación', 'brotherhood'), 'a la Hermandad de la Humillación')
  assert.equal(withPreposition('a', 'San Bernardo', 'brotherhood'), 'a San Bernardo')
  assert.equal(withPreposition('de', 'Pasión', 'brotherhood'), 'de Pasión')
  assert.equal(withPreposition('de', 'Jesús Despojado', 'brotherhood'), 'de Jesús Despojado')
  assert.equal(brotherhoodArticle('Aguas Santas de Villaverde del Río'), '')
  assert.equal(brotherhoodInPhrase('El Baratillo'), 'el Baratillo')
  assert.equal(discoveryCopy(row('musical_heritage', 'brotherhood', 'Esperanza de Triana', 1)).title, 'La marcha dedicada a la Esperanza de Triana')
  assert.match(readFileSync(new URL('../components/HomeTodayV2.js', import.meta.url), 'utf8'), /En \{brotherhoodInPhrase\(card\.visual\.contextName\)\}/)
})
