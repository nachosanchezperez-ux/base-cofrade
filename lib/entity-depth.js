export const ENTITY_DEPTH_TYPES = ['brotherhood', 'band', 'march', 'agent', 'image', 'step']

export const ENTITY_DEPTH_TYPE_LABELS = {
  brotherhood: 'Hermandad',
  band: 'Banda',
  march: 'Marcha',
  agent: 'Autor / Agente',
  image: 'Imagen',
  step: 'Paso',
}

export const ENTITY_DEPTH_DIMENSIONS = {
  identity: { label: 'Identidad', weight: 15 },
  description: { label: 'Contexto', weight: 15 },
  chronology: { label: 'Cronología', weight: 15 },
  relations: { label: 'Relaciones', weight: 25 },
  sources: { label: 'Fuentes', weight: 15 },
  activity: { label: 'Uso', weight: 10 },
  support: { label: 'Apoyo', weight: 5 },
}

export const ENTITY_DEPTH_LEVELS = {
  deep: { label: 'Profunda', min: 80 },
  solid: { label: 'Sólida', min: 65 },
  developing: { label: 'En desarrollo', min: 45 },
  priority: { label: 'Prioritaria', min: 0 },
}

const RELATION_TARGETS = {
  brotherhood: 8,
  band: 6,
  march: 4,
  agent: 5,
  image: 4,
  step: 5,
}

const SOURCE_TARGETS = {
  brotherhood: 3,
  band: 2,
  march: 2,
  agent: 2,
  image: 2,
  step: 2,
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function roundedRatio(current, target, maxScore) {
  if (!target || maxScore <= 0) return 0
  return Math.round(clamp(Number(current) || 0, 0, target) / target * maxScore)
}

function signalScore(signals = [], maxScore = 0) {
  if (!signals.length || maxScore <= 0) return 0
  const present = signals.filter((signal) => signal.present).length
  return Math.round(present / signals.length * maxScore)
}

function textScore(value, bands = []) {
  const length = String(value || '').trim().length
  for (const [minimum, score] of bands) {
    if (length >= minimum) return score
  }
  return 0
}

function gap(key, dimension, label, impact) {
  return { key, dimension, label, impact }
}

export function entityDepthLevel(score) {
  const value = Number(score) || 0
  if (value >= ENTITY_DEPTH_LEVELS.deep.min) return 'deep'
  if (value >= ENTITY_DEPTH_LEVELS.solid.min) return 'solid'
  if (value >= ENTITY_DEPTH_LEVELS.developing.min) return 'developing'
  return 'priority'
}

export function scoreEntityDepth({
  entityType,
  identity = [],
  summary = '',
  detail = '',
  chronology = [],
  relationCount = 0,
  keyRelations = [],
  sourceCount = 0,
  activityStrength = 0,
  supportStrength = 0,
} = {}) {
  const identityScore = signalScore(identity, ENTITY_DEPTH_DIMENSIONS.identity.weight)
  const summaryScore = textScore(summary, [[120, 5], [60, 4], [1, 2]])
  const detailScore = textScore(detail, [[300, 10], [160, 8], [80, 5], [1, 3]])
  const descriptionScore = summaryScore + detailScore
  const chronologyScore = signalScore(chronology, ENTITY_DEPTH_DIMENSIONS.chronology.weight)

  const relationTarget = RELATION_TARGETS[entityType] || 5
  const relationDensityScore = roundedRatio(relationCount, relationTarget, 15)
  const relationQualityScore = signalScore(keyRelations, 10)
  const relationsScore = relationDensityScore + relationQualityScore

  const sourceTarget = SOURCE_TARGETS[entityType] || 2
  const sourcesScore = roundedRatio(sourceCount, sourceTarget, ENTITY_DEPTH_DIMENSIONS.sources.weight)
  const activityScore = clamp(Number(activityStrength) || 0, 0, 2) * 5
  const supportScore = Number(supportStrength) > 0 ? ENTITY_DEPTH_DIMENSIONS.support.weight : 0

  const dimensions = {
    identity: { ...ENTITY_DEPTH_DIMENSIONS.identity, score: identityScore },
    description: { ...ENTITY_DEPTH_DIMENSIONS.description, score: descriptionScore },
    chronology: { ...ENTITY_DEPTH_DIMENSIONS.chronology, score: chronologyScore },
    relations: { ...ENTITY_DEPTH_DIMENSIONS.relations, score: relationsScore },
    sources: { ...ENTITY_DEPTH_DIMENSIONS.sources, score: sourcesScore },
    activity: { ...ENTITY_DEPTH_DIMENSIONS.activity, score: activityScore },
    support: { ...ENTITY_DEPTH_DIMENSIONS.support, score: supportScore },
  }

  const score = Object.values(dimensions).reduce((total, dimension) => total + dimension.score, 0)
  const gaps = []

  for (const signal of identity.filter((item) => !item.present)) {
    gaps.push(gap(`identity:${signal.key}`, 'identity', signal.label, ENTITY_DEPTH_DIMENSIONS.identity.weight))
  }

  if (String(summary || '').trim().length < 60) {
    gaps.push(gap('description:summary', 'description', 'Ampliar resumen propio', 5))
  }
  if (String(detail || '').trim().length < 80) {
    gaps.push(gap('description:detail', 'description', 'Añadir contexto documental', 10))
  }

  for (const signal of chronology.filter((item) => !item.present)) {
    gaps.push(gap(`chronology:${signal.key}`, 'chronology', signal.label, ENTITY_DEPTH_DIMENSIONS.chronology.weight))
  }

  for (const signal of keyRelations.filter((item) => !item.present)) {
    gaps.push(gap(`relations:${signal.key}`, 'relations', signal.label, ENTITY_DEPTH_DIMENSIONS.relations.weight))
  }

  if ((Number(sourceCount) || 0) < sourceTarget) {
    gaps.push(gap('sources:coverage', 'sources', `Reforzar Fuentes (${sourceCount}/${sourceTarget})`, ENTITY_DEPTH_DIMENSIONS.sources.weight))
  }

  if ((Number(activityStrength) || 0) <= 0) {
    gaps.push(gap('activity:documented-use', 'activity', 'Documentar uso o actividad relacionada', ENTITY_DEPTH_DIMENSIONS.activity.weight))
  }

  if ((Number(supportStrength) || 0) <= 0) {
    gaps.push(gap('support:asset', 'support', 'Añadir apoyo visual o documental', ENTITY_DEPTH_DIMENSIONS.support.weight))
  }

  gaps.sort((a, b) => b.impact - a.impact || a.label.localeCompare(b.label, 'es'))

  const dimensionList = Object.entries(dimensions).map(([key, value]) => ({
    key,
    ...value,
    percent: value.weight ? Math.round(value.score / value.weight * 100) : 0,
  }))
  const weakestDimension = [...dimensionList]
    .sort((a, b) => a.percent - b.percent || b.weight - a.weight)[0] || null

  return {
    score,
    level: entityDepthLevel(score),
    dimensions,
    dimensionList,
    weakestDimension,
    gaps,
    targets: {
      relations: relationTarget,
      sources: sourceTarget,
    },
  }
}
