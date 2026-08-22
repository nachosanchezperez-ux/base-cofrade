export function normalizeFreeFactText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function contextualTypes(contextEntityType, allowed) {
  return allowed.includes(contextEntityType) ? [contextEntityType] : allowed
}

export function freeFactIntent(question = '', contextEntityType = '') {
  const q = normalizeFreeFactText(question)
  if (!q) return null

  if (/\b(donde (puedo )?(escuchar|oir)|como (puedo )?(escuchar|oir)|escucharla|escucharlo|oirla|oirlo|spotify|youtube|grabacion|grabaciones|audio)\b/.test(q)) {
    return { kind: 'march_listen', entityTypes: ['march'] }
  }

  if (/\b(cuando se fundo|cuando fue fundad[ao]|fecha de fundacion|ano de fundacion|fundacion de|desde cuando existe)\b/.test(q)) {
    return { kind: 'foundation', entityTypes: contextualTypes(contextEntityType, ['brotherhood', 'band']) }
  }

  if (/\b(que tipo de hermandad|tipos? de hermandad)\b/.test(q)) {
    return { kind: 'brotherhood_type', entityTypes: ['brotherhood'] }
  }

  if (/\b(que dia (sale|procesiona|hace estacion)|dia de salida|jornada procesional|cuando procesiona)\b/.test(q)) {
    return { kind: 'brotherhood_day', entityTypes: ['brotherhood'] }
  }

  if (/\b(sede canonica|donde tiene su sede|donde esta su sede|en que templo|en que iglesia)\b/.test(q)) {
    return { kind: 'headquarters', entityTypes: contextualTypes(contextEntityType, ['brotherhood', 'band']) }
  }

  if (/\b(de donde es|de que localidad|de que municipio|localidad de|municipio de)\b/.test(q)) {
    return { kind: 'location', entityTypes: contextualTypes(contextEntityType, ['band', 'brotherhood']) }
  }

  if (/\b(que tipo de banda|tipo de banda|tipo de formacion)\b/.test(q)) {
    return { kind: 'band_type', entityTypes: ['band'] }
  }

  if (/\b(donde ensaya|donde tiene la sede|sede de la banda|sede de)\b/.test(q) && contextEntityType === 'band') {
    return { kind: 'headquarters', entityTypes: ['band'] }
  }

  if (/\b(que tipo de imagen|tipo de imagen|tipologia de la imagen)\b/.test(q)) {
    return { kind: 'image_type', entityTypes: ['image'] }
  }

  if (/\b(de que material|material de|materiales de)\b/.test(q)) {
    return { kind: 'material', entityTypes: contextualTypes(contextEntityType, ['image', 'step']) }
  }

  if (/\b(que tecnica|tecnica de|como esta realizada|como esta hecho|como esta hecha)\b/.test(q)) {
    return { kind: 'image_technique', entityTypes: ['image'] }
  }

  if (/\b(iconografia|que representa|representacion iconografica)\b/.test(q)) {
    return { kind: 'image_iconography', entityTypes: ['image'] }
  }

  if (/\b(cuanto mide|cuanto mide la imagen|dimensiones|altura de|anchura de|ancho de)\b/.test(q)) {
    return { kind: 'dimensions', entityTypes: contextualTypes(contextEntityType, ['image', 'step']) }
  }

  if (/\b(que tipo de paso|tipo de paso|tipologia del paso)\b/.test(q)) {
    return { kind: 'step_type', entityTypes: ['step'] }
  }

  if (/\b(que estilo|estilo del paso|estilo de)\b/.test(q)) {
    return { kind: 'step_style', entityTypes: ['step'] }
  }

  if (/\b(cuantas trabajaderas|numero de trabajaderas|trabajaderas tiene)\b/.test(q)) {
    return { kind: 'step_workbenches', entityTypes: ['step'] }
  }

  if (/\b(sistema de porteo|como se porta|como se lleva el paso|costal|trabajaderas o ruedas)\b/.test(q)) {
    return { kind: 'step_carrier', entityTypes: ['step'] }
  }

  if (/\b(de que ano es|de cuando es|cuando se hizo|cuando fue realizad[ao]|fecha de ejecucion|antiguedad de)\b/.test(q)) {
    const types = contextualTypes(contextEntityType, ['image', 'step', 'brotherhood', 'band'])
    return { kind: 'entity_date', entityTypes: types }
  }

  if (/\b(que tipo es|de que tipo es)\b/.test(q) && contextEntityType) {
    const byType = {
      brotherhood: 'brotherhood_type',
      band: 'band_type',
      image: 'image_type',
      step: 'step_type',
    }
    return byType[contextEntityType]
      ? { kind: byType[contextEntityType], entityTypes: [contextEntityType] }
      : null
  }

  return null
}

export function freeSetIntent(question = '', contextEntityType = '') {
  const q = normalizeFreeFactText(question)
  if (!q || !contextEntityType) return null
  if (/\b(que tienen en comun|que comparten|en que coinciden|coincidencias|rasgos comunes|elementos comunes)\b/.test(q)) {
    return { kind: 'set_common', entityType: contextEntityType }
  }
  return null
}
