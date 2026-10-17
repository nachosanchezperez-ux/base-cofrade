// Títulos, descripciones e intérpretes de las fichas de acto conservadas
// (Glorias, Extraordinarias, Rosarios). Módulo puro, probado con node --test.
//
// El título debe conservar lo que la gente busca: qué acto es, de quién, dónde y
// de qué año. Antes se recortaba a 44 caracteres y se perdían municipio y fecha
// («Procesión de Nuestra Señora del Santo…»).

const ACT_WORDS = /\b(?:procesi[oó]n|salida|rosario|traslado|v[ií]a\s+crucis|coronaci[oó]n|misi[oó]n|cultos?|regreso|romer[ií]a|ofrenda|abrazos|carreritas|participaci[oó]n|peregrinaci[oó]n|besamanos|besapi[eé]s|magna|bajada|subida)\b/iu

const PLACEHOLDER_NAMES = /^(?:hermandad (?:por confirmar|organizadora)|por confirmar)$/iu

const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const lower = (value) => clean(value).toLocaleLowerCase('es')
const includesText = (haystack, needle) => Boolean(needle) && lower(haystack).includes(lower(needle))

// Quita «Histórico ·» y el año final («… · 2026», «… 2026»), y los separadores
// que queden colgando («… Macarena ·»).
export function cleanAgendaEventTitle(title = '', year = null) {
  let text = clean(title).replace(/^hist[oó]rico\s*·\s*/iu, '')
  const expected = Number(year)
  const yearPattern = expected ? String(expected) : '(?:19|20)\\d{2}'
  text = text.replace(new RegExp(`(?:\\s*[·,–-]\\s*|\\s+)${yearPattern}$`, 'u'), '')
  return text.replace(/[\s·,:;–-]+$/u, '').trim() || clean(title)
}

// Nombre corto de la Hermandad para desambiguar («Cerro del Águila»).
export function shortBrotherhoodContext(name = '') {
  const text = clean(name)
  if (!text || PLACEHOLDER_NAMES.test(text)) return ''
  const short = text
    .replace(/^(?:(?:pontificia|real|ilustre|antigua|primitiva|fervorosa|venerable|humilde|muy|y|,)\s+)*/iu, '')
    .replace(/^(?:hermandad(?:es)?|cofrad[ií]a|agrupaci[oó]n parroquial|asociaci[oó]n parroquial)(?:\s+(?:sacramental|de penitencia|de gloria|y cofrad[ií]a de nazarenos))?\s+/iu, '')
    .replace(/^(?:de\s+(?:la|los|las|el)\s+|del\s+|de\s+)/iu, '')
    .trim()
  return short.length && short.length <= 30 ? short : ''
}

const STOP_TOKENS = new Set(['nuestra', 'nuestro', 'señora', 'señor', 'santísima', 'santísimo', 'maría', 'padre', 'hermandad', 'cofradía', 'santo', 'santa', 'sevillana', 'real', 'virgen'])

function tokens(value) {
  return lower(value).split(/[^a-záéíóúüñ]+/u).filter((token) => token.length >= 4 && !STOP_TOKENS.has(token))
}

// «Real Cofradía Sevillana de Nuestra Señora de la Cabeza» comparte advocación
// con «Procesión de Nuestra Señora de la Cabeza»: no aporta como contexto.
function sharesAdvocation(context, title) {
  const ctxTokens = tokens(context)
  if (!ctxTokens.length) return true
  const titleTokens = new Set(tokens(title))
  const shared = ctxTokens.filter((token) => titleTokens.has(token)).length
  return shared / ctxTokens.length >= 0.5
}

function fit(candidates, maxLength) {
  return candidates.map(clean).filter(Boolean).find((candidate) => candidate.length <= maxLength) || ''
}

function truncateWords(value, maxLength) {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 1).replace(/\s+\S*$/u, '').replace(/[\s·,:;–-]+$/u, '')}…`
}

// prefix: tipo de acto para títulos que solo nombran la imagen
// («Nuestra Señora de los Dolores» → «Procesión de Nuestra Señora de los Dolores»).
export function agendaEventSeoTitle({
  title = '',
  year = null,
  municipality = '',
  brotherhoodName = '',
  prefix = '',
  maxLength = 70,
} = {}) {
  const raw = cleanAgendaEventTitle(title, year)
  if (!raw) return ''
  const withPrefix = prefix && !ACT_WORDS.test(raw) ? `${prefix} ${raw}` : raw
  const yearText = Number(year) ? String(year) : ''
  const ctxCandidate = shortBrotherhoodContext(brotherhoodName)
  const ctx = ctxCandidate && !includesText(raw, ctxCandidate) && !sharesAdvocation(ctxCandidate, raw) ? ctxCandidate : ''
  const muni = clean(municipality)
  const muniInTitle = muni && includesText(raw, muni)
  const showMuni = muni && !muniInTitle
  const tail = (parts) => parts.filter(Boolean).join(' ')
  const cores = [...new Set([withPrefix, raw])]

  const candidates = []
  if (ctx) {
    const ctxHasMuni = includesText(ctx, muni)
    for (const core of cores) {
      candidates.push(tail([`${core} · ${ctx}`, showMuni && !ctxHasMuni ? `(${muni})` : '', yearText]))
      candidates.push(tail([`${core} · ${ctx}`, yearText]))
    }
  }
  for (const core of cores) candidates.push(tail([core, showMuni ? `(${muni})` : '', yearText]))
  for (const core of cores) candidates.push(tail([core, yearText]))

  const fitted = fit(candidates, maxLength)
  if (fitted) return fitted
  // Nombres largos: mejor el nombre completo (hasta 90) que cortarlo.
  const long = fit(cores.map((core) => tail([core, yearText])), 90)
  if (long) return long

  // Último recurso: recortar el nombre y conservar municipio y año.
  const suffix = tail([showMuni ? `(${muni})` : '', yearText])
  const room = maxLength - (suffix ? suffix.length + 1 : 0)
  return tail([truncateWords(raw, Math.max(room, 20)), suffix])
}

const WEEKDAY_DATE = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid',
})

export function agendaEventLongDate(value = '') {
  const date = clean(value)
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) return ''
  return WEEKDAY_DATE.format(new Date(`${date}T12:00:00Z`))
}

function placeWithArticle(place) {
  const text = clean(place)
  if (!text || /^(?:la|el|los|las)\s/iu.test(text)) return text
  if (/^(?:real |insigne |s\.\s?i\.\s?)*(?:parroquia|bas[ií]lica|iglesia|capilla|catedral|ermita|casa|plaza|santa iglesia)\b/iu.test(text)) return `la ${text}`
  if (/^(?:real |antiguo )*(?:convento|monasterio|templo|oratorio|santuario|colegio|hospital)\b/iu.test(text)) return `el ${text}`
  return text
}

// «Procesión de Gloria de La Macarena en Sevilla el domingo, 25 de octubre de
// 2026, con salida a las 17:30 desde la Basílica… Recorrido, horario y música.»
export function agendaEventSeoDescription({
  title = '',
  year = null,
  kindLabel = '',
  brotherhoodName = '',
  municipality = '',
  date = '',
  time = '',
  origin = '',
  coverage = [],
  summary = '',
} = {}) {
  const raw = cleanAgendaEventTitle(title, year)
  const longDate = agendaEventLongDate(date)
  const muni = clean(municipality)
  const ctxCandidate = shortBrotherhoodContext(brotherhoodName)
  const ctx = ctxCandidate && !includesText(raw, ctxCandidate) && !sharesAdvocation(ctxCandidate, raw) ? ctxCandidate : ''
  const kind = clean(kindLabel)
  // Si el título solo nombra la imagen, se antepone el tipo de acto.
  const head = kind && !ACT_WORDS.test(raw) ? `${kind} de ${raw}` : raw
  const parts = [
    head,
    ctx ? ` (${ctx})` : '',
    muni && !includesText(raw, muni) && !includesText(ctx, muni) ? ` en ${muni}` : '',
    longDate ? ` el ${longDate}` : '',
    clean(time) ? `, con salida a las ${clean(time)}` : '',
    clean(origin) && clean(time) ? ` desde ${placeWithArticle(origin)}` : '',
    '.',
  ]
  const lead = parts.join('').replace(/\s+\./u, '.')
  const coverageText = coverage.filter(Boolean)
  const tailText = coverageText.length
    ? ` ${coverageText.join(', ').replace(/^./u, (char) => char.toLocaleUpperCase('es'))}.`
    : ''
  const summaryText = clean(summary)
  return `${lead}${tailText}${summaryText ? ` ${summaryText}` : ''}`.trim()
}

// Bandas con ficha como intérpretes del acto (schema.org/performer).
export function agendaEventPerformers(music = []) {
  const seen = new Set()
  const performers = []
  for (const item of music || []) {
    const name = clean(item?.name)
    const href = clean(item?.href)
    if (!name || !href.startsWith('/bandas/') || seen.has(href)) continue
    seen.add(href)
    performers.push({ '@type': 'MusicGroup', name, url: `https://hilocofrade.es${href.replace(/[#?].*$/u, '')}` })
  }
  return performers
}
