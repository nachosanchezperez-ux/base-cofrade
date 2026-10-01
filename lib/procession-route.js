function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[“”"'’`]/g, '')
    .replace(/[^a-zA-Z0-9áéíóúñü\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('es')
}

function cleanLabel(value) {
  return String(value || '').replace(/\s+/g, ' ').replace(/[.;]+$/g, '').trim()
}

function samePlace(first, second) {
  const left = normalizeText(first)
  const right = normalizeText(second)
  return Boolean(left && right && left === right)
}

function placeMatches(first, second) {
  const left = normalizeText(first)
  const right = normalizeText(second)
  if (!left || !right) return false
  if (left === right) return true
  if (Math.min(left.length, right.length) < 8) return false
  return left.includes(right) || right.includes(left)
}

function splitLegacyPoints(value) {
  const text = cleanLabel(value)
  if (!text) return []

  return text
    .split(/\s*→\s*|;\s*|,\s*|\s+y\s+(?=(?:entrada|llegada|regreso)\b|[A-ZÁÉÍÓÚÑ])/u)
    .map(cleanLabel)
    .filter(Boolean)
}

function sectionIdentity(value, index) {
  const label = cleanLabel(value)
  const normalized = normalizeText(label)

  if (normalized === 'ida') return { id: 'outbound', label: 'Ida' }
  if (normalized === 'regreso') return { id: 'return', label: 'Regreso' }
  if (normalized === 'vuelta') return { id: 'return', label: 'Vuelta' }
  if (normalized === 'manana') return { id: 'morning', label: 'Mañana' }
  if (normalized === 'por la tarde') return { id: 'afternoon', label: 'Por la tarde' }
  if (normalized === 'tarde') return { id: 'afternoon', label: 'Tarde' }

  return { id: `section-${index + 1}`, label: label || `Tramo ${index + 1}` }
}

export function routeSummarySections(value) {
  const summary = String(value || '').trim()
  if (!summary) return []

  const marker = /(?:^|[.;]\s*)(Ida|Regreso|Vuelta|Mañana|Por la tarde|Tarde)(?:\s*\(([^)]+)\))?\s*:\s*/giu
  const matches = [...summary.matchAll(marker)]

  if (matches.length) {
    return matches
      .map((match, index) => {
        const start = match.index + match[0].length
        const end = matches[index + 1]?.index ?? summary.length
        const identity = sectionIdentity(match[1], index)
        const qualifier = cleanLabel(match[2] || '')
        const points = splitLegacyPoints(summary.slice(start, end).replace(/^[.;\s]+|[.;\s]+$/g, ''))

        if (!points.length) return null
        return {
          ...identity,
          label: qualifier ? `${identity.label} · ${qualifier}` : identity.label,
          points,
        }
      })
      .filter(Boolean)
  }

  const points = splitLegacyPoints(summary)
  if (points.length < 3) return []
  return [{ id: 'route', label: 'Recorrido', points }]
}

function normalizePoint(point, index) {
  if (typeof point === 'string') {
    return {
      id: `point-${index + 1}`,
      label: cleanLabel(point),
      detail: '',
      role: 'stop',
      lat: null,
      long: null,
      annotations: [],
    }
  }

  const label = cleanLabel(point?.label || point?.name || point?.place || '')
  if (!label) return null

  const lat = Number(point?.lat)
  const long = Number(point?.long)

  return {
    id: String(point?.id || `point-${index + 1}`),
    label,
    detail: cleanLabel(point?.detail || point?.note || ''),
    role: String(point?.role || 'stop'),
    lat: Number.isFinite(lat) ? lat : null,
    long: Number.isFinite(long) ? long : null,
    annotations: Array.isArray(point?.annotations)
      ? point.annotations.filter((annotation) => annotation?.type !== 'music')
      : [],
  }
}

function structuredLegs(route) {
  if (!route || typeof route !== 'object') return []
  const rows = Array.isArray(route.itineraries)
    ? route.itineraries
    : Array.isArray(route.legs)
      ? route.legs
      : []

  return rows
    .map((leg, index) => {
      const points = Array.isArray(leg?.points)
        ? leg.points.map(normalizePoint).filter(Boolean)
        : []
      if (!points.length) return null
      const label = cleanLabel(leg?.label || leg?.title || (index === 0 ? 'Ida' : index === 1 ? 'Regreso' : `Tramo ${index + 1}`))
      const identity = sectionIdentity(label, index)
      const rawId = String(leg?.id || '')
      const normalizedId = normalizeText(rawId)
      const canonicalId = ['ida', 'outbound'].includes(normalizedId)
        ? 'outbound'
        : ['regreso', 'vuelta', 'return'].includes(normalizedId)
          ? 'return'
          : rawId || identity.id

      return {
        id: canonicalId,
        label,
        points,
      }
    })
    .filter(Boolean)
}

function legacyLegs(routeSummary) {
  return routeSummarySections(routeSummary)
    .map((section) => ({
      id: section.id,
      label: section.label,
      points: section.points.map(normalizePoint).filter(Boolean),
    }))
    .filter((leg) => leg.points.length)
}

function structuredPhases(route) {
  if (!route || typeof route !== 'object' || !Array.isArray(route.phases)) return []

  return route.phases
    .map((phase, index) => {
      const title = cleanLabel(phase?.title || '')
      const summary = cleanLabel(phase?.summary || '')
      const places = Array.isArray(phase?.places)
        ? phase.places.map(cleanLabel).filter(Boolean)
        : []

      if (!title && !summary && !places.length) return null

      return {
        id: String(phase?.id || `phase-${index + 1}`),
        eyebrow: cleanLabel(phase?.eyebrow || ''),
        title: title || `Fase ${index + 1}`,
        time: cleanLabel(phase?.time || ''),
        summary,
        places,
      }
    })
    .filter(Boolean)
}

function ensurePointAtStart(points, label) {
  if (!label) return points
  if (points.some((point, index) => index === 0 && placeMatches(point.label, label))) return points
  return [normalizePoint(label, -1), ...points]
}

function arrivalLike(label) {
  const value = normalizeText(label)
  return value.startsWith('entrada en ') || value.startsWith('llegada a ') || value.startsWith('regreso a ')
}

function ensurePointAtEnd(points, label) {
  if (!label) return points
  const last = points.at(-1)
  if (last && placeMatches(last.label, label)) return points
  if (last && arrivalLike(last.label)) {
    return [
      ...points.slice(0, -1),
      {
        ...last,
        label,
        detail: last.detail || last.label,
      },
    ]
  }
  return [...points, normalizePoint(label, points.length)]
}

function pointAnnotation(point, schedule = [], context = {}) {
  const annotations = [...(point.annotations || [])]

  schedule.forEach((item) => {
    if (!item?.place || !placeMatches(point.label, item.place)) return

    const label = cleanLabel(item.label)
    const normalized = normalizeText(label)
    const isDeparture = normalized.includes('salida') || normalized.startsWith('inicio')
    const isArrival = normalized.includes('entrada') || normalized.includes('llegada') || normalized.includes('fin de la procesion')

    if (isDeparture && context.role !== 'start') return
    if (isArrival && context.role !== 'end') return

    annotations.push({
      type: 'schedule',
      label,
      time: cleanLabel(item.time || item.timeText),
    })
  })

  const seen = new Set()
  return annotations.filter((annotation) => {
    if (annotation?.type === 'music') return false
    const key = `${annotation.type || ''}|${annotation.time || ''}|${annotation.label || ''}`
    if (seen.has(key)) return false
    seen.add(key)
    return annotation.label || annotation.time
  })
}

function prepareLegs({ legs, origin, destination, circuit, schedule }) {
  if (!legs.length) return []

  return legs.map((leg, index) => {
    let points = [...leg.points]
    const isOutbound = leg.id === 'outbound' || index === 0
    const isReturn = leg.id === 'return' || index === 1

    if (isOutbound) {
      points = ensurePointAtStart(points, origin)
      if (!circuit && destination) points = ensurePointAtEnd(points, destination)
    }

    if (isReturn) {
      points = ensurePointAtStart(points, circuit ? legs[0]?.points?.at(-1)?.label : destination)
      points = ensurePointAtEnd(points, origin || destination)
    }

    const finalPoints = points.map((point, pointIndex) => {
      let role = point.role || 'stop'
      if (pointIndex === 0) role = 'start'
      if (pointIndex === points.length - 1) role = 'end'
      if (circuit && isOutbound && pointIndex === points.length - 1) role = 'turnaround'
      if (circuit && isReturn && pointIndex === 0) role = 'turnaround'

      return {
        ...point,
        id: `${leg.id}-${point.id || pointIndex + 1}`,
        role,
        annotations: pointAnnotation(point, schedule, { role, legId: leg.id, circuit }),
      }
    })

    return {
      ...leg,
      points: finalPoints,
      start: finalPoints[0]?.label || '',
      end: finalPoints.at(-1)?.label || '',
      geocodedPoints: finalPoints.filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.long)).length,
    }
  })
}

export function buildProcessionRoute({
  route,
  routeSummary,
  origin,
  destination,
  schedule = [],
} = {}) {
  const start = cleanLabel(origin)
  const end = cleanLabel(destination)
  const circuit = samePlace(start, end)
  const structured = structuredLegs(route)
  const legacy = structured.length ? [] : legacyLegs(routeSummary)
  const rawLegs = structured.length ? structured : legacy
  const legs = prepareLegs({
    legs: rawLegs,
    origin: start,
    destination: end,
    circuit,
    schedule,
  })

  const geocodedPoints = legs.reduce((total, leg) => total + leg.geocodedPoints, 0)
  const phases = structuredPhases(route)
  const totalPoints = legs.reduce((total, leg) => total + leg.points.length, 0)

  return {
    kind: circuit ? 'circuit' : 'transfer',
    circuit,
    origin: start,
    destination: end,
    baseLocation: circuit ? start || end : '',
    legs,
    phases,
    totalPoints,
    summary: String(routeSummary || '').trim(),
    source: structured.length ? 'structured' : legs.length ? 'legacy' : phases.length ? 'phases' : 'summary',
    mapReady: geocodedPoints >= 2,
  }
}
