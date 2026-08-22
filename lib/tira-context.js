export function normalizeTira(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function refersToPreviousSet(question = '') {
  const q = normalizeTira(question)
  return /\b(cada uno|cada una|cada cual|cual|cuales|ellos|ellas|estos|estas|esos|esas|los anteriores|las anteriores|los resultados|las encontradas|los encontrados|todas|todos|entre ellas|entre ellos|de ellas|de ellos|de esas|de esos|solo|solamente)\b/.test(q)
    || /^y\b/.test(q)
    || /\bcompara(melos|melas|los|las)?\b/.test(q)
}

export function disciplineFromQuestion(question = '') {
  const q = normalizeTira(question)
  const disciplines = [
    ['orfebreria', /\borfebr(e|es|eria|erias)\b/],
    ['bordado', /\bbordad(or|ora|ores|oras|o|os|a|as)?\b/],
    ['talla', /\b(talla|tallista|tallistas)\b/],
    ['dorado', /\b(dorado|dorador|doradores)\b/],
    ['escultura', /\b(escultura|escultor|escultores|imagineria|imaginero|imagineros)\b/],
    ['composicion', /\b(composicion|compositor|compositores|musica|musical)\b/],
    ['arquitectura', /\b(arquitectura|arquitecto|arquitectos)\b/],
    ['pintura', /\b(pintura|pintor|pintores)\b/],
    ['fotografia', /\b(fotografia|fotografo|fotografos)\b/],
    ['restauracion', /\b(restauracion|restaurador|restauradores)\b/],
  ]
  return disciplines.find(([, pattern]) => pattern.test(q))?.[0] || ''
}

export function genericSetIntent(question = '', entityType = '') {
  const q = normalizeTira(question)
  const refers = refersToPreviousSet(q)
  const compare = /\b(comparar|comparacion|diferencias|diferencian|compara(melos|melas|los|las)?)\b/.test(q)

  if (entityType === 'band') {
    if (refers && /\b(de musica|musica|musical)\b/.test(q) && /\b(cuales|solo|son|quedan|muestra|ensena)\b/.test(q)) return 'band_filter_music'
    if (refers && /\b(desde cuando|desde que|inicio|antiguedad)\b/.test(q) && /\b(acompan|toca|relacion)\w*/.test(q)) return 'band_accompaniment_since'
    if ((refers || /\b(cual|quien)\b/.test(q)) && /\b(mas|mayor)\b/.test(q) && /\b(hermandad|hermandades)\b/.test(q)) return 'band_most_brotherhoods'
    if (compare) return 'band_compare'
  }

  if (entityType === 'agent') {
    if (refers && disciplineFromQuestion(q)) return 'agent_filter_discipline'
    if (/\b(quien|cual)\b/.test(q) && /\b(mas|mayor)\b/.test(q) && /\b(paso|pasos)\b/.test(q)) return 'agent_most_steps'
    if (compare) return 'agent_compare'
  }

  if (entityType === 'step') {
    if (refers && /\b(quien|capataz|lleva|dirige|manda|personal)\b/.test(q)) return 'step_personnel'
    if (refers && /\b(banda|bandas|musica|acompanamiento|acompanamientos)\b/.test(q)) return 'step_bands'
    if (compare) return 'step_compare'
  }

  if (entityType === 'brotherhood') {
    if (refers && /\b(banda|bandas|musica|acompanamiento|acompanamientos)\b/.test(q)) return 'brotherhood_bands'
    if (refers && /\b(paso|pasos|cuantos pasos|cuantas pasos)\b/.test(q)) return 'brotherhood_steps'
    if (compare) return 'brotherhood_compare'
  }

  if (entityType === 'march') {
    if (refers && /\b(quien|autor|autores|compositor|compositores|compuso)\b/.test(q)) return 'march_authors'
    if (compare) return 'march_compare'
  }

  return null
}

export function typeNoun(entityType = '', count = 2) {
  const singular = count === 1
  const nouns = {
    brotherhood: singular ? 'hermandad' : 'hermandades',
    image: singular ? 'imagen' : 'imágenes',
    step: singular ? 'paso' : 'pasos',
    band: singular ? 'banda' : 'bandas',
    march: singular ? 'marcha' : 'marchas',
    agent: singular ? 'autor o profesional' : 'autores o profesionales',
  }
  return nouns[entityType] || (singular ? 'entidad' : 'entidades')
}
