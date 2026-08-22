function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function evidence(key, label, detail) {
  return { key, label, detail }
}

function pushUnique(items, item) {
  if (!items.some((current) => current.key === item.key)) items.push(item)
}

export function buildTiraEvidence(response = {}) {
  if (response.kind !== 'answer') return []

  const path = normalize((response.path || []).join(' | '))
  const answer = normalize(response.answer || '')
  const result = []
  const itemCount = Array.isArray(response.items) ? response.items.length : 0
  const entityCount = Array.isArray(response.entities) ? response.entities.length : 0

  if (/camino documentado/.test(answer)) {
    pushUnique(result, evidence(
      'public_graph',
      'Grafo público',
      `${itemCount || 0} ${itemCount === 1 ? 'relación publicada encadenada' : 'relaciones publicadas encadenadas'}`
    ))
  }

  if (/acompanamientos historicos|acompanamiento historico/.test(path)) {
    pushUnique(result, evidence('music_periods', 'Acompañamientos históricos', 'Periodos musicales publicados'))
  } else if (/acompanamiento|acompanamientos|bandas/.test(path) && !/autor[ií]a musical|composit/.test(path)) {
    pushUnique(result, evidence('current_music', 'Acompañamientos actuales', 'Relaciones musicales vigentes publicadas'))
  }

  if (/fases de paso|pasos compartidos|autores \/ profesionales/.test(path)) {
    pushUnique(result, evidence('step_phases', 'Fases de paso', 'Trabajos y autorías estructuradas por fase'))
  }

  if (/personal actual|personal |profesionales/.test(path) && /paso/.test(path)) {
    pushUnique(result, evidence('step_personnel', 'Personal actual', 'Responsables actuales documentados por paso'))
  }

  if (/titularidad/.test(path)) {
    pushUnique(result, evidence('titularity', 'Titularidad', 'Relaciones publicadas entre hermandades e imágenes'))
  }

  if (/imagenes/.test(path) && /datacion|cronolog/.test(path)) {
    pushUnique(result, evidence('image_dates', 'Datación de imágenes', 'Fechas y siglos documentados en las fichas'))
    pushUnique(result, evidence('brotherhood_images', 'Hermandad ↔ imagen', 'Relaciones públicas de pertenencia o titularidad'))
  }

  if (/restauracion|restauraciones|intervencion/.test(path)) {
    pushUnique(result, evidence('image_restorations', 'Restauraciones', 'Intervenciones publicadas en el patrimonio'))
  }

  if (/autor[ií]a|autorias|compositor|compositores|composicion/.test(path) && /marcha|marchas|autor/.test(path)) {
    pushUnique(result, evidence('march_authors', 'Autorías musicales', 'Relaciones publicadas entre marchas y autores'))
  }

  if (/marchas dedicadas|dedicatoria/.test(path)) {
    pushUnique(result, evidence('march_dedications', 'Dedicatorias musicales', 'Marchas vinculadas a sus destinatarios publicados'))
  }

  if (/hermandad/.test(path) && /pasos/.test(path)) {
    pushUnique(result, evidence('brotherhood_steps', 'Hermandad ↔ paso', 'Relaciones públicas entre hermandades y pasos'))
  }

  if (/tipo de formacion/.test(path)) {
    pushUnique(result, evidence('band_profile', 'Ficha de banda', 'Tipo de formación documentado'))
  }

  if (/datacion|orden cronologico|mas antiguo|mas reciente/.test(path) && !/imagenes/.test(path)) {
    pushUnique(result, evidence('temporal_fields', 'Datación estructurada', 'Fechas o periodos publicados para el conjunto'))
  }

  if (/recuento/.test(path)) {
    pushUnique(result, evidence('derived_count', 'Cálculo sobre el grafo', 'Recuento derivado de relaciones publicadas'))
  }

  if (/comparacion/.test(path)) {
    pushUnique(result, evidence('structured_comparison', 'Comparación estructurada', 'Campos homogéneos disponibles para el conjunto'))
  }

  if (!result.length && (entityCount || itemCount)) {
    pushUnique(result, evidence('published_entities', 'Entidades publicadas', 'Datos visibles y relaciones disponibles en Hilo Cofrade'))
  }

  return result.slice(0, 4)
}

export function withTiraEvidence(response = {}) {
  if (!response || typeof response !== 'object') return response
  const built = buildTiraEvidence(response)
  return built.length ? { ...response, evidence: built } : response
}
