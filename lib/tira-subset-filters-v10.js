export function normalizeSubsetFilterText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function subsetFiltersV10Intent(question = '', context = null) {
  const q = normalizeSubsetFilterText(question)
  const setType = context?.resultSet?.entityType || ''
  const ids = Array.isArray(context?.resultSet?.entityIds) ? context.resultSet.entityIds : []
  if (!q || setType !== 'brotherhood' || ids.length < 2) return null

  const filtering = /\b(solo|solamente|unicamente|quedate|quedarme|filtra|filtrar|muestra|muestrame|de esas|de estas)\b/.test(q)
  if (!filtering) return null

  if (/\bagrupaciones parroquiales\b/.test(q)) {
    return { kind: 'brotherhood_set_filter_type', brotherhoodType: 'Agrupación Parroquial' }
  }
  if (/\b(?:de )?penitencia\b/.test(q)) {
    return { kind: 'brotherhood_set_filter_type', brotherhoodType: 'Penitencia' }
  }
  if (/\bgloria(?:s)?\b/.test(q)) {
    return { kind: 'brotherhood_set_filter_type', brotherhoodType: 'Gloria' }
  }
  if (/\bsacramental(?:es)?\b/.test(q)) {
    return { kind: 'brotherhood_set_filter_type', brotherhoodType: 'Sacramental' }
  }

  const music = /\b(banda|bandas|musica|acompanamiento|acompanamientos)\b/.test(q)
  const musicVerb = /\b(llevan|lleva|tienen|tiene|cuentan|cuenta|con)\b/.test(q)
  const negative = /\b(no|sin|ninguna)\b/.test(q)
  if (music && musicVerb && negative) {
    return { kind: 'brotherhood_set_filter_without_music' }
  }

  const cults = /\b(culto|cultos|quinario|quinarios|triduo|triduos|novena|novenas|besamanos|besapies)\b/.test(q)
  const future = /\b(proximo|proximos|proxima|proximas|proximamente|futuro|futuros|futura|futuras|quedan|agenda)\b/.test(q)
  if (cults && future) {
    return { kind: negative ? 'brotherhood_set_filter_without_future_cults' : 'brotherhood_set_filter_with_future_cults' }
  }

  if (/\b(?:solo|solamente|unicamente|quedate|muestra|muestrame|de esas|de estas)\b.*\b(?:las|los)?\s*de\s+/.test(q)) {
    return { kind: 'brotherhood_set_filter_municipality' }
  }

  return null
}
