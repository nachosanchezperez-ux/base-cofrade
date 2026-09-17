import assert from 'node:assert/strict'
import test from 'node:test'

import { freeDirectIntent } from '../lib/tira-free-direct.js'
import { publishedContentIntent } from '../lib/tira-published-content.js'
import { relationalV2Intent } from '../lib/tira-relational-v2.js'
import { marchRelationsV3Intent } from '../lib/tira-march-relations-v3.js'
import { patrimonyV4Intent } from '../lib/tira-authors-patrimony-v4.js'
import { brotherhoodCalendarV5Intent } from '../lib/tira-brotherhood-calendar-v5.js'
import { crossFiltersV6Intent } from '../lib/tira-cross-filters-v6.js'

const brotherhoodSet = { resultSet: { entityType: 'brotherhood', entityIds: ['h1', 'h2'] } }
const bandContext = { entityId: 'b1', entityType: 'band', name: 'Banda de Música Santa Ana de Dos Hermanas' }
const marchContext = { entityId: 'm1', entityType: 'march', name: 'Salud Siempre' }
const agentContext = { entityId: 'a1', entityType: 'agent', name: 'Luis Ortega Bru' }
const imageContext = { entityId: 'i1', entityType: 'image', name: 'Nuestra Señora de la Salud' }
const brotherhoodContext = { entityId: 'h1', entityType: 'brotherhood', name: 'Hermandad de San Gonzalo' }

const cases = [
  // Colecciones públicas / Agenda
  ['published', 'Rosarios en Utrera', null, 'agenda'],
  ['published', 'Procesiones en La Rinconada', null, 'agenda'],
  ['published', 'Conciertos en Sevilla', null, 'agenda'],
  ['published', 'Traslados en Dos Hermanas', null, 'agenda'],
  ['published', 'Besamanos hoy', null, 'agenda'],
  ['published', 'Procesiones de Gloria en Sevilla', null, 'glory_processions'],
  ['published', 'Procesiones de Gloria de septiembre', null, 'glory_processions'],
  ['published', 'Salidas extraordinarias de Sevilla', null, 'extraordinary_outings'],
  ['published', 'Quinarios de Sevilla', null, 'cults'],
  ['published', 'Crucetas musicales publicadas', null, 'musical_repertoires'],

  // Datos directos de Marchas
  ['direct', '¿A quién está dedicada Salud Siempre?', null, 'march_dedication'],
  ['direct', 'Dedicatoria de Salud Siempre', null, 'march_dedication'],
  ['direct', '¿Cuándo se estrenó Salud Siempre?', null, 'march_premiere'],
  ['direct', '¿Dónde se estrenó Salud Siempre?', null, 'march_premiere'],
  ['direct', '¿De qué año es Salud Siempre?', null, 'march_composition_date'],
  ['direct', '¿Cuándo se compuso Salud Siempre?', null, 'march_composition_date'],
  ['direct', '¿Qué tipo de marcha es Salud Siempre?', null, 'march_type'],
  ['direct', '¿A quién?', marchContext, 'march_dedication'],

  // Relaciones V2
  ['v2', '¿Qué banda toca detrás de la Virgen de la Salud de San Gonzalo?', null, 'music_for_subject'],
  ['v2', '¿Cuál banda acompaña al paso de palio de la Salud?', null, 'music_for_subject'],
  ['v2', '¿Qué bandas han acompañado a San Bernardo?', null, 'music_history'],
  ['v2', '¿A qué hermandades ha acompañado Santa Ana?', null, 'music_history'],
  ['v2', '¿Y antes?', bandContext, 'music_history'],
  ['v2', '¿A qué hermandades acompaña Santa Ana?', null, 'current_band_brotherhoods'],
  ['v2', '¿Dónde toca Santa Ana?', null, 'current_band_brotherhoods'],
  ['v2', '¿Qué marchas aparecen en la cruceta de San Gonzalo 2026?', null, 'repertoire_entries'],
  ['v2', '¿Cuáles tienen banda?', brotherhoodSet, 'brotherhoods_with_music'],
  ['v2', '¿Cuáles de ellas tienen música?', brotherhoodSet, 'brotherhoods_with_music'],

  // Hilo musical V3
  ['v3', '¿En qué crucetas aparece Salud Siempre?', null, 'march_repertoires'],
  ['v3', '¿Dónde ha sonado esta marcha?', marchContext, 'march_repertoires'],
  ['v3', '¿Qué bandas han interpretado Salud Siempre?', null, 'march_bands'],
  ['v3', '¿Qué bandas la han interpretado?', marchContext, 'march_bands'],
  ['v3', '¿Qué marchas de Manuel Marvizón aparecen en crucetas?', null, 'agent_repertoire_marches'],
  ['v3', '¿En qué crucetas aparecen marchas de Manuel Marvizón?', null, 'agent_repertoires'],
  ['v3', '¿Qué otras marchas del mismo compositor aparecen en crucetas?', marchContext, 'same_author_repertoire_marches'],
  ['v3', '¿Quién compuso Salud Siempre?', null, null],

  // Autores y Patrimonio V4
  ['v4', '¿Qué imágenes hizo Luis Ortega Bru?', null, 'agent_images'],
  ['v4', '¿Qué otras imágenes hizo?', agentContext, 'agent_images'],
  ['v4', '¿En qué pasos trabajó Antonio Castillo Lastrucci?', null, 'agent_steps'],
  ['v4', '¿Y en qué otros pasos?', agentContext, 'agent_steps'],
  ['v4', '¿Qué restauraciones tiene?', imageContext, 'image_interventions'],
  ['v4', '¿En qué hermandades hay obras de Luis Ortega Bru?', null, 'agent_brotherhoods'],
  ['v4', '¿Qué relación hay entre Luis Ortega Bru y la Hermandad de San Gonzalo?', null, 'agent_brotherhood_works'],
  ['v4', '¿Qué otras imágenes de la misma hermandad son del mismo autor?', imageContext, 'same_author_images_in_brotherhood'],
  ['v4', '¿Quién restauró esta imagen?', imageContext, null],

  // Hermandad, Cultos e Historia V5
  ['v5', '¿Qué tiene próximamente San Gonzalo?', null, 'brotherhood_upcoming'],
  ['v5', '¿Qué cultos quedan de San Gonzalo?', null, 'brotherhood_upcoming'],
  ['v5', 'Cultos de octubre de San Gonzalo', null, 'brotherhood_upcoming'],
  ['v5', '¿Qué cultos tiene San Gonzalo?', null, 'brotherhood_cults'],
  ['v5', 'Quinarios y triduos de San Gonzalo', null, 'brotherhood_cults'],
  ['v5', 'Acontecimientos históricos de San Gonzalo', null, 'brotherhood_history'],
  ['v5', '¿Y su historia?', brotherhoodContext, 'brotherhood_history'],
  ['v5', '¿Y los próximos?', brotherhoodContext, 'brotherhood_upcoming'],
  ['v5', '¿Qué hay en Tomares este fin de semana?', null, null],

  // Cruces V6
  ['v6', 'Hermandades del Lunes Santo con Santa Ana', null, 'brotherhoods_by_day_band'],
  ['v6', '¿Qué hermandades del Lunes Santo acompaña Santa Ana?', null, 'brotherhoods_by_day_band'],
  ['v6', 'Imágenes de Castillo Lastrucci que procesionan el Miércoles Santo', null, 'images_by_agent_day'],
  ['v6', 'Virgenes de Castillo Lastrucci del Miércoles Santo', null, 'images_by_agent_day'],
  ['v6', 'Marchas de Manuel Marvizón interpretadas por Santa Ana', null, 'marches_by_agent_band'],
  ['v6', 'Obras de Marvizón tocadas por Santa Ana', null, 'marches_by_agent_band'],
  ['v6', 'Hermandades del Lunes Santo en Sevilla', null, null],
]

const runners = {
  published: (question) => publishedContentIntent(question)?.kind || null,
  direct: (question, context) => freeDirectIntent(question, context?.entityType || '') || null,
  v2: (question, context) => relationalV2Intent(question, context)?.kind || null,
  v3: (question, context) => marchRelationsV3Intent(question, context)?.kind || null,
  v4: (question, context) => patrimonyV4Intent(question, context)?.kind || null,
  v5: (question, context) => brotherhoodCalendarV5Intent(question, context)?.kind || null,
  v6: (question, context) => crossFiltersV6Intent(question, context)?.kind || null,
}

test('el banco mantiene al menos 60 formulaciones naturales', () => {
  assert.ok(cases.length >= 60, `El banco solo contiene ${cases.length} preguntas`)
})

test('las preguntas conservan su intención determinista', () => {
  for (const [layer, question, context, expected] of cases) {
    assert.equal(runners[layer](question, context), expected, `${layer}: ${question}`)
  }
})
