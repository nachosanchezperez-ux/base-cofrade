import { HOLY_WEEK_DAYS } from './brotherhood-directory.js'

const MUNICIPALITY_QUERY_ALIASES = [
  { alias: 'san jose de la rinconada', municipality: 'la rinconada' },
  { alias: 'san jose rinconada', municipality: 'la rinconada' },
]

export function normalizeFreeFactText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function matchHolyWeekDay(question = '') {
  const normalizedQuestion = ` ${normalizeFreeFactText(question)} `
  return [...HOLY_WEEK_DAYS]
    .sort((first, second) => second.length - first.length)
    .find((day) => normalizedQuestion.includes(` ${normalizeFreeFactText(day)} `)) || ''
}

function contextualTypes(contextEntityType, allowed) {
  return allowed.includes(contextEntityType) ? [contextEntityType] : allowed
}

export function freeFactIntent(question = '', contextEntityType = '') {
  const q = normalizeFreeFactText(question)
  if (!q) return null
  const processionDay = matchHolyWeekDay(q)

  const bandCollection = /\b(bandas|formaciones musicales)\b/.test(q)
  const asksForBandCollection = /\b(cuales|que)\b.*\b(bandas|formaciones musicales)\b.*\b(son|hay|tiene|de|en)\b/.test(q)
    || /\b(lista|listado|muestra|muestrame|dime)\b.*\b(bandas|formaciones musicales)\b/.test(q)
    || /^(?:(?:todas?|todos?)\s+)?(?:las?\s+)?(?:bandas|formaciones musicales)\s+(?:de|del|en)\b/.test(q)
  const asksForBandRelation = /\b(acompanan|acompanamiento|tocan|suenan)\b/.test(q)
  if (bandCollection && asksForBandCollection && !asksForBandRelation) {
    return { kind: 'bands_by_municipality', entityTypes: ['band'] }
  }

  const collectionName = '(?:hermandades|cofradias|corporaciones cofrades|agrupaciones parroquiales|glorias|sacramentales)'
  const collectionPrefix = '(?:(?:todas?|todos?)\\s+)?(?:las?\\s+)?'
  const brotherhoodCollection = new RegExp(`\\b${collectionName}\\b`).test(q)
  const asksForCollection = new RegExp(`\\b(cuales|que)\\b.*\\b${collectionName}\\b.*\\b(son|hay|tiene|de|del|en)\\b`).test(q)
    || new RegExp(`\\b(lista|listado|muestra|muestrame|dime)\\b.*\\b${collectionName}\\b`).test(q)
    || new RegExp(`^${collectionPrefix}${collectionName}\\s+(?:de|del|en)\\b`).test(q)
  const asksForAnotherRelation = /\b(bandas?|musica|acompanamientos?|pasos?|imagenes?|titulares?)\b/.test(q)
  const directDayCollection = processionDay && new RegExp(
    `^(?:(?:el|la)\\s+)?${normalizeFreeFactText(processionDay)}(?:\\s+(?:de|en)\\b|$)`
  ).test(q)
  if (((brotherhoodCollection && asksForCollection) || directDayCollection) && !asksForAnotherRelation) {
    let brotherhoodType = ''
    if (/\bagrupaciones parroquiales\b/.test(q)) brotherhoodType = 'Agrupación Parroquial'
    else if (/\bpenitencia\b/.test(q)) brotherhoodType = 'Penitencia'
    else if (/\bgloria(?:s)?\b/.test(q)) brotherhoodType = 'Gloria'
    else if (/\bsacramental(?:es)?\b/.test(q)) brotherhoodType = 'Sacramental'

    return {
      kind: 'brotherhoods_by_municipality',
      entityTypes: ['brotherhood'],
      ...(brotherhoodType ? { brotherhoodType } : {}),
      ...(processionDay ? { processionDay } : {}),
    }
  }

  const asksForPublishedContent = /\b(agenda|actos?|eventos?|procesiones?|rosarios?|besamanos|besapies|conciertos?|traslados?|cultos?|quinarios?|triduos?|novenas?|hoy|manana|fin de semana|finde|esta semana)\b/.test(q)
  if (/^(que hay|que puedo encontrar|que tiene)\s+(en|de)\b/.test(q) && !asksForPublishedContent) {
    return { kind: 'municipality_overview', entityTypes: ['brotherhood', 'band'] }
  }

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

export function matchMunicipalityName(question = '', municipalityNames = []) {
  const q = ` ${normalizeFreeFactText(question)} `
  if (!q.trim()) return ''

  const candidates = [...new Set(municipalityNames.map((name) => String(name || '').trim()).filter(Boolean))]
    .map((name) => ({ name, normalized: normalizeFreeFactText(name) }))

  const direct = candidates
    .filter((item) => item.normalized.length >= 3 && q.includes(` ${item.normalized} `))
    .sort((a, b) => b.normalized.length - a.normalized.length || a.name.localeCompare(b.name, 'es'))[0]
  if (direct?.name) return direct.name

  for (const entry of MUNICIPALITY_QUERY_ALIASES) {
    if (!q.includes(` ${entry.alias} `)) continue
    const canonical = candidates.find((item) => item.normalized === entry.municipality)
    if (canonical?.name) return canonical.name
  }

  return ''
}

export function freeSetIntent(question = '', contextEntityType = '') {
  const q = normalizeFreeFactText(question)
  if (!q || !contextEntityType) return null
  if (/\b(que tienen en comun|que comparten|en que coinciden|coincidencias|rasgos comunes|elementos comunes)\b/.test(q)) {
    return { kind: 'set_common', entityType: contextEntityType }
  }
  return null
}
