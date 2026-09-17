export function normalizeCrossFilterText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const DAYS = [
  'Viernes de Dolores', 'Sábado de Pasión', 'Domingo de Ramos', 'Lunes Santo',
  'Martes Santo', 'Miércoles Santo', 'Jueves Santo', 'Madrugada', 'Viernes Santo', 'Sábado Santo',
]

export function crossFilterDay(question = '') {
  const q = normalizeCrossFilterText(question)
  return DAYS.find((day) => q.includes(normalizeCrossFilterText(day))) || ''
}

export function crossFiltersV6Intent(question = '') {
  const q = normalizeCrossFilterText(question)
  if (!q) return null
  const day = crossFilterDay(q)
  const brotherhoods = /\b(hermandad|hermandades|cofradia|cofradias)\b/.test(q)
  const images = /\b(imagen|imagenes|virgen|virgenes|cristo|cristos|titular|titulares)\b/.test(q)
  const marches = /\b(marcha|marchas|composicion|composiciones|obra|obras)\b/.test(q)

  if (brotherhoods && day && /\b(con|acompan|toca|musica|banda)\w*/.test(q)) {
    return { kind: 'brotherhoods_by_day_band', day }
  }

  if (images && day && /\b(de|por|autor|escultor|imaginero|hizo|realizo|tallo)\b/.test(q)) {
    return { kind: 'images_by_agent_day', day }
  }

  if (marches && /\b(interpreta|interpretadas|interpretados|toca|tocadas|tocados|cruceta|crucetas|banda)\w*/.test(q)) {
    return { kind: 'marches_by_agent_band' }
  }

  return null
}
