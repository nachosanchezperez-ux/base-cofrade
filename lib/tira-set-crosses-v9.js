export function normalizeSetCrossText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function setCrossesV9Intent(question = '', context = null) {
  const q = normalizeSetCrossText(question)
  const setType = context?.resultSet?.entityType || ''
  const ids = Array.isArray(context?.resultSet?.entityIds) ? context.resultSet.entityIds : []
  if (!q || setType !== 'brotherhood' || ids.length < 2) return null

  const repeated = /\b(repiten|repite|repetidas|repetidos|comparten|compartidas|compartidos|comun|comunes|coinciden|misma|mismas|mismo|mismos)\b/.test(q)

  if (/\b(banda|bandas|formacion|formaciones)\b/.test(q) && repeated) {
    return { kind: 'brotherhood_set_repeated_bands' }
  }

  const marches = /\b(marcha|marchas|composicion|composiciones|obra|obras)\b/.test(q)
  const dedication = /\b(dedicad|dedicatoria|dedicatorias|dedicacion|dedicaciones)\w*/.test(q)
  if (marches && dedication) {
    return { kind: 'brotherhood_set_dedicated_marches' }
  }

  const images = /\b(imagen|imagenes|titular|titulares)\b/.test(q)
  const author = /\b(autor|autores|autoria|autorias|escultor|escultores|imaginero|imagineros)\b/.test(q)
  if (images && author && /\b(mismo|misma|mismos|mismas|comparten|comun|comunes|coinciden)\b/.test(q)) {
    return { kind: 'brotherhood_set_shared_author_images' }
  }

  if (/^(comparalas|comparalos|compara|comparar)\b/.test(q)
    || /\b(comparacion|diferencias|diferencian|diferencia entre ellas|diferencias entre ellas)\b/.test(q)) {
    return { kind: 'brotherhood_set_compare' }
  }

  return null
}
