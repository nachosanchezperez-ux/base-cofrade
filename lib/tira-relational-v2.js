export function normalizeRelationalText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const GENERIC_NAME_TOKENS = new Set([
  'agrupacion', 'banda', 'cofradia', 'de', 'del', 'el', 'hermandad', 'la', 'las',
  'los', 'musica', 'nuestra', 'nuestro', 'padre', 'paso', 'palio', 'santisima',
  'santisimo', 'senor', 'senora', 'virgen', 'y',
])

function meaningfulTokens(value = '') {
  return normalizeRelationalText(value)
    .split(' ')
    .filter((token) => token.length >= 4 && !GENERIC_NAME_TOKENS.has(token))
}

function nameVariants(name = '', entityType = '') {
  const normalized = normalizeRelationalText(name)
  const variants = new Set([normalized])
  if (entityType === 'brotherhood') {
    variants.add(normalized.replace(/^hermandad de /, ''))
    variants.add(normalized.replace(/^hermandad /, ''))
  }
  if (entityType === 'band') {
    variants.add(normalized.replace(/^banda de musica /, ''))
    variants.add(normalized.replace(/^banda de /, ''))
    variants.add(normalized.replace(/^banda /, ''))
  }
  if (entityType === 'image') {
    variants.add(normalized.replace(/^nuestra senora de /, ''))
    variants.add(normalized.replace(/^nuestra senora /, ''))
    variants.add(normalized.replace(/^santisima virgen de /, ''))
  }
  if (entityType === 'step') {
    variants.add(normalized.replace(/^paso de palio de /, ''))
    variants.add(normalized.replace(/^paso de misterio de /, ''))
    variants.add(normalized.replace(/^paso de /, ''))
  }
  return [...variants].map((value) => value.trim()).filter((value) => value.length >= 3)
}

export function relationalEntityScore(name = '', question = '', entityType = '') {
  const q = normalizeRelationalText(question)
  if (!q) return 0
  const variants = nameVariants(name, entityType)
  const direct = variants
    .filter((variant) => variant.length >= 4 && q.includes(variant))
    .sort((a, b) => b.length - a.length)[0]
  if (direct) return 1000 + direct.length

  const tokens = meaningfulTokens(name)
  if (!tokens.length) return 0
  const matched = tokens.filter((token) => q.includes(` ${token} `) || q.startsWith(`${token} `) || q.endsWith(` ${token}`) || q === token)
  if (!matched.length) return 0
  return Math.round((matched.length / tokens.length) * 500) + matched.length * 40
}

export function relationalV2Intent(question = '', context = null) {
  const q = normalizeRelationalText(question)
  if (!q) return null

  const setType = context?.resultSet?.entityType || ''
  if (setType === 'brotherhood') {
    const asksWhich = /\b(cuales|cual|que hermandades|de ellas|estas|esas|las anteriores|solo)\b/.test(q)
    const asksMusic = /\b(banda|bandas|musica|acompanamiento|acompanamientos)\b/.test(q)
    const possession = /\b(tienen|tiene|llevan|lleva|cuentan|cuenta|con)\b/.test(q)
    if (asksWhich && asksMusic && possession) return { kind: 'brotherhoods_with_music' }
  }

  const repertoire = /\b(cruceta|crucetas|repertorio|repertorios)\b/.test(q)
  const asksWorks = /\b(marcha|marchas|obra|obras|pieza|piezas|sono|sonaron|interpreto|interpretaron|interpretada|interpretadas|tocada|tocadas|que sono|que tocaron)\b/.test(q)
  if (repertoire && asksWorks) return { kind: 'repertoire_entries' }

  const asksMusicRelation = /\b(banda|bandas|musica|acompanamiento|acompanamientos)\b/.test(q)
  const historical = /\b(historic|historica|historicas|historico|historicos|historia|anteriores|anteriormente|acompanaron|acompanaba|acompanaban|ha acompanado|han acompanado|a lo largo)\b/.test(q)
  if (asksMusicRelation && historical) return { kind: 'music_history' }

  const asksBand = /\b(que banda|cual banda|banda que|banda toca|banda acompana|banda va)\b/.test(q)
  const positional = /\b(detras|tras|acompanando|acompanar|acompan[a-z]*|toca|suena|va)\b/.test(q)
  const preciseSubject = /\b(virgen|senora|cristo|jesus|misterio|palio|paso|titular)\b/.test(q)
  if (asksBand && positional && preciseSubject) return { kind: 'music_for_subject' }

  return null
}

export function relationalRequestedYear(question = '') {
  const match = String(question || '').match(/\b(20\d{2}|19\d{2})\b/)
  return match ? Number(match[1]) : null
}

export function relationalRepertoireScore(repertoire = {}, question = '') {
  const q = normalizeRelationalText(question)
  if (!q) return 0
  const requestedYear = relationalRequestedYear(question)
  if (requestedYear && Number(repertoire.year) !== requestedYear) return -1000

  let score = requestedYear && Number(repertoire.year) === requestedYear ? 700 : 0
  const identities = [
    [repertoire.brotherhoodName || repertoire.brotherhood?.name, 'brotherhood', 650],
    [repertoire.bandName || repertoire.band?.name, 'band', 450],
    [repertoire.stepName || repertoire.step?.name, 'step', 400],
    [repertoire.displayTitle, '', 300],
    [repertoire.title, '', 250],
  ]

  for (const [name, type, weight] of identities) {
    if (!name) continue
    const entityScore = relationalEntityScore(name, q, type)
    if (entityScore >= 1000) score += weight
    else if (entityScore >= 250) score += Math.round(weight * 0.55)
  }

  return score
}

export function relationalPeriodLabel(row = {}) {
  const start = String(row.date_from_text || row.year_from || '').trim()
  const end = String(row.date_to_text || row.year_to || '').trim()
  if (start && end) return `${start} → ${end}`
  if (start && row.is_current) return `${start} · vigente`
  if (start) return start
  if (end) return `Hasta ${end}`
  return row.is_current ? 'Vigente' : 'Periodo documentado'
}
