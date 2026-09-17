export function normalizeMarchRelationText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function marchRelationsV3Intent(question = '', context = null) {
  const q = normalizeMarchRelationText(question)
  if (!q) return null

  const marchContext = context?.entityType === 'march'
  const agentContext = context?.entityType === 'agent'
  const repertoireWords = /\b(cruceta|crucetas|repertorio|repertorios)\b/.test(q)
  const marchWords = /\b(marcha|marchas|obra|obras|pieza|piezas)\b/.test(q)

  if (/\b(dedicad[ao]s?|dedicatoria|dedicatorias|a quien va dedicada|para quien fue compuesta)\b/.test(q)) {
    return { kind: 'march_dedications' }
  }

  if (marchContext && repertoireWords && /\b(otra|otras)\b/.test(q) && /\b(mismo autor|mismo compositor|su autor|su compositor)\b/.test(q)) {
    return { kind: 'same_author_repertoire_marches' }
  }

  const asksAgentMarches = marchWords && repertoireWords
    && /\b(de|del|por|compuestas? por|compuso|compositor|autor)\b/.test(q)
  if (asksAgentMarches || (agentContext && marchWords && repertoireWords)) {
    const asksRepertoires = /\b(que|cuales|en que|donde)\s+(crucetas|repertorios)\b/.test(q)
    return { kind: asksRepertoires ? 'agent_repertoires' : 'agent_repertoire_marches' }
  }

  if (repertoireWords && /\b(aparece|aparecen|esta|estan|incluid[ao]s?|figura|figuran|suena|sono|sonaron|interpreto|interpretaron|tocad[ao]s?)\b/.test(q)) {
    return { kind: 'march_repertoires' }
  }

  const asksBands = /\b(que|cuales|cuantas?)\s+bandas?\b/.test(q) || /^bandas?\b/.test(q)
  const performance = /\b(interpreta|interpretan|interpreto|interpretaron|interpretado|interpretada|tocan|toco|tocaron|tocado|tocada|grabado|grabada|grabaron)\b/.test(q)
  if (asksBands && performance) return { kind: 'march_bands' }

  if (marchContext && /\b(donde|en que)\b/.test(q) && /\b(ha sonado|sono|se ha tocado|se interpreto|aparece)\b/.test(q)) {
    return { kind: 'march_repertoires' }
  }

  return null
}

export function marchRelationEntityScore(name = '', question = '') {
  const target = normalizeMarchRelationText(name)
  const q = normalizeMarchRelationText(question)
  if (!target || !q) return 0
  if (q === target) return 2000
  if (q.includes(target)) return 1500 + Math.min(target.length, 100)

  const generic = new Set([
    'banda', 'carvallo', 'compositor', 'de', 'del', 'el', 'la', 'las', 'los',
    'manuel', 'marcha', 'musica', 'nuestra', 'nuestro', 'senora', 'virgen', 'y',
  ])
  const tokens = target.split(' ').filter((token) => token.length >= 4 && !generic.has(token))
  if (!tokens.length) return 0
  const matched = tokens.filter((token) => q.includes(token)).length
  if (!matched) return 0
  return matched * 180 + Math.round((matched / tokens.length) * 300)
}

export function marchUsageKey(row = {}) {
  return [row.march_entity_id || row.marchId, row.repertoire_id || row.repertoireId]
    .filter(Boolean)
    .join('|')
}
