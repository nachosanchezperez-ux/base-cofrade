import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { DIRECTORY_TYPES } from '../lib/brotherhood-directory.js'
import { meetsPublicEditorialMinimum } from '../lib/supabase/public-entity-page.js'

const folder = new URL('../docs/evidence/modelado-utrera-2026-09-27/', import.meta.url)
export function readUtreraModel() {
  return ['model-review.json', 'gloria-and-closure.json'].map((name) => JSON.parse(readFileSync(new URL(name, folder), 'utf8')))
}

// Offline documentary checks only: no credentials, network, SQL or production writes.
export function validateUtreraModel(base, refinement) {
  const assert = (condition, message) => { if (!condition) throw new Error(`UTRERA_MODEL: ${message}`) }
  const keyed = (rows, label) => {
    const map = new Map(rows.map((row) => [row.key, row]))
    assert(map.size === rows.length && !map.has(undefined), `claves duplicadas o ausentes: ${label}`)
    return map
  }
  const sources = keyed([...base.sources, ...refinement.sources], 'fuentes')
  const corporations = keyed([...base.corporations, ...base.municipal_census_review], 'corporaciones')
  const places = keyed([...base.places, ...refinement.places], 'sedes')
  const images = keyed([...base.images, ...refinement.images], 'imágenes')
  const steps = keyed(base.steps, 'pasos')
  const assets = keyed(refinement.heritage_assets, 'patrimonio')
  const outings = keyed([...base.outings, ...refinement.outings], 'salidas')
  const bands = keyed(base.bands, 'bandas')
  const validTypes = new Set(DIRECTORY_TYPES.map(({ type }) => type))
  const checkTypes = (row) => assert(Array.isArray(row.brotherhood_types)
    && row.brotherhood_types.length > 0
    && row.brotherhood_types.every((value) => validTypes.has(value))
    && new Set(row.brotherhood_types).size === row.brotherhood_types.length, `tipos: ${row.key}`)
  for (const row of corporations.values()) checkTypes(row)
  for (const profile of refinement.corporations) {
    assert(corporations.has(profile.key), `perfil fuera de universo: ${profile.key}`)
    checkTypes(profile)
    assert(JSON.stringify(profile.brotherhood_types) === JSON.stringify(corporations.get(profile.key).brotherhood_types), `tipos divergentes: ${profile.key}`)
    assert(places.has(profile.place), `sede: ${profile.key}`)
    for (const key of profile.images || []) assert(images.has(key), `imagen de ${profile.key}: ${key}`)
    for (const key of profile.heritage || []) assert(assets.has(key), `patrimonio de ${profile.key}: ${key}`)
    for (const key of profile.outings || []) assert(outings.has(key), `salida de ${profile.key}: ${key}`)
  }
  for (const row of [...images.values(), ...steps.values(), ...outings.values()]) {
    assert(corporations.has(row.brotherhood), `Hermandad desconocida en ${row.key}`)
  }
  for (const row of assets.values()) assert(corporations.has(row.parent), `propietario de ${row.key}`)
  for (const row of steps.values()) for (const key of row.images) assert(images.has(key), `imagen de ${row.key}: ${key}`)
  const positions = []
  for (const outing of outings.values()) {
    for (const position of outing.positions) {
      positions.push(position)
      const step = steps.get(position.step_key)
      assert(step && step.brotherhood === outing.brotherhood && step.positions.includes(position.key), `posición: ${position.key}`)
      if (position.music) assert(position.music === 'SILENCE' || bands.has(position.music), `música: ${position.key}`)
    }
  }
  keyed(positions, 'posiciones')
  for (const step of steps.values()) for (const key of step.positions) assert(positions.some((p) => p.key === key && p.step_key === step.key), `posición inversa: ${key}`)
  const scanSources = (value) => {
    if (!value || typeof value !== 'object') return
    for (const [name, item] of Object.entries(value)) {
      if (name === 'source' && typeof item === 'string') assert(sources.has(item), `fuente inexistente: ${item}`)
      if (name === 'sources' || name.endsWith('_sources')) {
        for (const key of item || []) if (typeof key === 'string') assert(sources.has(key), `fuente inexistente: ${key}`)
      }
      scanSources(item)
    }
  }
  scanSources(base)
  scanSources(refinement)
  const statuses = new Map()
  for (const row of refinement.temporal_decisions) {
    for (const key of row.outings) {
      assert(outings.has(key) && !statuses.has(key), `decisión temporal duplicada/inexistente: ${key}`)
      assert(row.event_status === 'announced' || (row.event_status === 'held' && row.sources.length > 0), `estado sin evidencia: ${key}`)
      statuses.set(key, row.event_status)
    }
  }
  for (const row of refinement.outings) {
    assert(!statuses.has(row.key), `doble decisión temporal: ${row.key}`)
    assert(row.event_status === 'announced' || (row.event_status === 'held' && row.held_sources.length > 0), `held sin evidencia: ${row.key}`)
    statuses.set(row.key, row.event_status)
    for (const key of ['departure_place', 'return_place']) if (row[key]) assert(places.has(row[key]), `lugar de ${row.key}`)
  }
  assert(statuses.size === outings.size, 'salidas sin decisión temporal')
  const decision = refinement.processional_relation_decision
  assert(decision.include_brotherhood_titular_relation && !decision.include_image_step_relation && !decision.include_outing_image_relation, 'Concepción: relación no demostrada')
  assert(images.has(decision.image) && images.get(decision.image).brotherhood === decision.brotherhood, 'Concepción: identidad')
  assert(steps.has(decision.step) && outings.has(decision.outing), 'Concepción: contexto inexistente')
  assert(!steps.get(decision.step).images.includes(decision.image), 'Concepción añadida al Paso')
  const fatima = outings.get('O18')
  assert(fatima.departure_time === null && fatima.departure_place === null, 'Fátima: conflicto sustituido por certeza')
  assert(statuses.get('O17') === 'announced', 'regreso del Rocío elevado sin nueva evidencia')
  const minima = []
  for (const profile of refinement.corporations) minima.push({key: profile.key, ready: meetsPublicEditorialMinimum({identity: profile.popular_name, type: profile.brotherhood_types.join(' · '), context: 'Utrera', summary: profile.summary, relations: [profile.heritage], sources: profile.sources, publicValues: [profile.summary, profile.history_text]})})
  for (const profile of refinement.images) minima.push({key: profile.key, ready: meetsPublicEditorialMinimum({identity: profile.name, type: profile.image_type, context: 'Utrera', summary: profile.description, relations: [profile.brotherhood], sources: profile.sources, publicValues: profile.description})})
  for (const profile of refinement.step_refinements) {
    const original = steps.get(profile.key)
    assert(original && (!profile.id || profile.id === original.id), `ID de Paso alterado: ${profile.key}`)
    minima.push({key: profile.key, ready: meetsPublicEditorialMinimum({identity: original.name, type: profile.step_type, context: 'Utrera', summary: profile.description, relations: [original.brotherhood, original.images], sources: profile.sources, publicValues: profile.description})})
  }
  assert(minima.every((row) => row.ready), 'mínimo editorial candidato insuficiente')
  assert(base.meta.production_writes === 0 && refinement.meta.production_writes === 0, 'fotografía de solo modelado incoherente')
  assert(!base.meta.model_frozen && !refinement.meta.model_frozen && !base.execution_gates.apply, 'certificación anticipada')
  return {
    structural_validation: 'PASS', corporations_in_core: base.corporations.length,
    corporations_in_institutional_review: corporations.size, gloria_profiles_completed: refinement.corporations.length,
    outings_in_model: outings.size, held_with_linked_evidence: [...statuses.values()].filter((s) => s === 'held').length,
    announced_historical: [...statuses.values()].filter((s) => s === 'announced').length,
    step_positions: positions.length, proposed_physical_steps: steps.size, identified_images: images.size,
    additional_heritage_assets: assets.size, source_records: sources.size,
    nonempty_valid_types: corporations.size, candidate_editorial_minima: minima,
    production_writes: 0, model_frozen: false, apply_gate: 'NO_GO',
    open_gates: base.blockers.map(({key}) => key),
    note: 'Validación offline del candidato: no acredita publicación, QA web/SEO ni censo municipal exhaustivo.'
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { process.stdout.write(`${JSON.stringify(validateUtreraModel(...readUtreraModel()), null, 2)}\n`) }
  catch (error) { console.error(error.message); process.exitCode = 1 }
}
