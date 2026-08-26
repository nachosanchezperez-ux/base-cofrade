function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function directSupportKind(path = []) {
  const key = normalize(Array.isArray(path) ? path.join('|') : path)

  if (key === 'hermandad|titularidad|imagenes') return 'brotherhood_images'
  if (key === 'hermandad|pasos|relaciones') return 'brotherhood_steps'
  if (key === 'profesional|paso|hermandad') return 'step_personnel_agent'
  if (key === 'paso|personal|profesionales') return 'step_personnel_step'
  if (key === 'hermandad|acompanamiento|banda') return 'music_brotherhood'
  if (key === 'banda|acompanamientos|hermandades') return 'music_band'
  if (/^contexto anterior\|\d+ imagen(?:es)?\|autoria$/.test(key)) return 'image_authorships'
  if (/^contexto anterior\|\d+ imagen(?:es)?\|restauraciones$/.test(key)) return 'image_restorations'
  if (key === 'hermandad|imagenes|datacion') return 'brotherhood_images'

  return null
}

export function supportReferenceLabel(kind = '') {
  const labels = {
    brotherhood_images: 'Fuente del vínculo Hermandad–Imagen',
    brotherhood_steps: 'Fuente del vínculo Hermandad–Paso',
    step_personnel_agent: 'Fuente del cargo actual',
    step_personnel_step: 'Fuente del cargo actual',
    music_brotherhood: 'Fuente del acompañamiento',
    music_band: 'Fuente del acompañamiento',
    image_authorships: 'Fuente de la autoría',
    image_restorations: 'Fuente de la restauración',
  }
  return labels[kind] || 'Fuente de la relación'
}
