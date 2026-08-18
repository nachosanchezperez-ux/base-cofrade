import 'server-only'

import { createHash } from 'node:crypto'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

export const IMPORT_ENTITY_LABELS = {
  brotherhood: 'Hermandad',
  advocation: 'Identidad devocional',
  image: 'Imagen',
  step: 'Paso',
  agent: 'Agente',
  band: 'Banda',
  march: 'Marcha',
  event: 'Acontecimiento',
  heritage_asset: 'Patrimonio',
}

export const CREATABLE_IMPORT_TYPES = new Set([
  'advocation',
  'image',
  'step',
  'agent',
  'band',
  'march',
  'heritage_asset',
])

const MAX_SOURCE_BYTES = 1_500_000
const MAX_MODEL_CHARS = 60_000
const MAX_EVIDENCE_CHARS = 220
const MAX_REDIRECTS = 5
const FETCH_TIMEOUT_MS = 12_000

const ANALYSIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['source', 'summary', 'entities', 'relations', 'warnings'],
  properties: {
    source: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'publisher', 'source_type', 'publication_date'],
      properties: {
        title: { type: ['string', 'null'] },
        publisher: { type: ['string', 'null'] },
        source_type: {
          type: 'string',
          enum: ['official_website', 'website', 'article', 'document', 'other'],
        },
        publication_date: { type: ['string', 'null'] },
      },
    },
    summary: { type: 'string' },
    entities: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'local_id',
          'entity_type',
          'name',
          'description',
          'attributes',
          'evidence',
          'confidence',
        ],
        properties: {
          local_id: { type: 'string' },
          entity_type: {
            type: 'string',
            enum: [
              'brotherhood',
              'advocation',
              'image',
              'step',
              'agent',
              'band',
              'march',
              'event',
              'heritage_asset',
            ],
          },
          name: { type: 'string' },
          description: { type: ['string', 'null'] },
          attributes: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['key', 'value', 'evidence'],
              properties: {
                key: { type: 'string' },
                value: { type: 'string' },
                evidence: { type: 'string' },
              },
            },
          },
          evidence: { type: 'string' },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
        },
      },
    },
    relations: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'source_ref',
          'target_ref',
          'relation_type',
          'notes',
          'evidence',
          'confidence',
        ],
        properties: {
          source_ref: { type: 'string' },
          target_ref: { type: 'string' },
          relation_type: {
            type: 'string',
            enum: [
              'has_titular',
              'titular',
              'belongs_to_brotherhood',
              'processional_step',
              'processes_on',
              'authored_by',
              'intervened_by',
              'dedicated_to',
              'located_at',
              'other',
            ],
          },
          notes: { type: ['string', 'null'] },
          evidence: { type: 'string' },
          confidence: { type: 'number', minimum: 0, maximum: 1 },
        },
      },
    },
    warnings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['type', 'message', 'evidence'],
        properties: {
          type: {
            type: 'string',
            enum: ['uncertain', 'conflict', 'unsupported', 'missing_source', 'other'],
          },
          message: { type: 'string' },
          evidence: { type: ['string', 'null'] },
        },
      },
    },
  },
}

function text(value, max = 800) {
  const normalized = String(value || '').replace(/\s+/g, ' ').trim()
  return normalized.slice(0, max)
}

function evidence(value) {
  return text(value, MAX_EVIDENCE_CHARS)
}

export function normalizeIdentity(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

export function slugifyImportName(value) {
  return normalizeIdentity(value).replace(/\s+/g, '-').replace(/(^-|-$)/g, '')
}

export function normalizeSourceUrl(candidate) {
  const raw = String(candidate || '').trim()
  if (!raw) throw new Error('La URL de la fuente es obligatoria.')
  const prepared = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`

  let url
  try {
    url = new URL(prepared)
  } catch {
    throw new Error('La URL de la fuente no es válida.')
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Solo se admiten fuentes públicas http o https.')
  }
  if (url.username || url.password) {
    throw new Error('No se admiten URLs con credenciales incrustadas.')
  }
  url.hash = ''
  url.hostname = url.hostname.toLowerCase()
  return url.toString()
}

function isPrivateIpv4(address) {
  const parts = address.split('.').map(Number)
  if (parts.length !== 4 || parts.some((item) => !Number.isInteger(item))) return true
  const [a, b] = parts
  return (
    a === 0
    || a === 10
    || a === 127
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 100 && b >= 64 && b <= 127)
    || a >= 224
  )
}

function isPrivateIpv6(address) {
  const normalized = address.toLowerCase()
  if (normalized === '::1' || normalized === '::') return true
  if (normalized.startsWith('fc') || normalized.startsWith('fd') || normalized.startsWith('fe8') || normalized.startsWith('fe9') || normalized.startsWith('fea') || normalized.startsWith('feb')) return true
  if (normalized.startsWith('::ffff:')) {
    const mapped = normalized.slice('::ffff:'.length)
    return isIP(mapped) === 4 ? isPrivateIpv4(mapped) : true
  }
  return false
}

function isPrivateAddress(address) {
  const version = isIP(address)
  if (version === 4) return isPrivateIpv4(address)
  if (version === 6) return isPrivateIpv6(address)
  return true
}

async function assertPublicUrl(url) {
  const hostname = url.hostname.toLowerCase()
  if (['localhost', 'localhost.localdomain'].includes(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    throw new Error('La fuente debe estar alojada en Internet público.')
  }

  if (isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw new Error('No se permiten direcciones privadas o locales.')
    return
  }

  let addresses
  try {
    addresses = await lookup(hostname, { all: true, verbatim: true })
  } catch {
    throw new Error('No se pudo resolver el dominio de la fuente.')
  }
  if (!addresses.length || addresses.some((item) => isPrivateAddress(item.address))) {
    throw new Error('El dominio resuelve a una dirección no pública.')
  }
}

function decodeHtmlEntities(value) {
  const named = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
    aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú',
    Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú',
    ntilde: 'ñ', Ntilde: 'Ñ', laquo: '«', raquo: '»', ndash: '–', mdash: '—',
  }
  return String(value || '').replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const hex = code[1]?.toLowerCase() === 'x'
      const parsed = Number.parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10)
      return Number.isFinite(parsed) ? String.fromCodePoint(parsed) : match
    }
    return named[code] ?? named[code.toLowerCase()] ?? match
  })
}

function htmlToText(html) {
  return decodeHtmlEntities(
    String(html || '')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|noscript|svg|iframe)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<(br|p|div|section|article|main|h[1-6]|li|tr|blockquote)\b[^>]*>/gi, '\n')
      .replace(/<\/\s*(p|div|section|article|main|h[1-6]|li|tr|blockquote)\s*>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function htmlTitle(html) {
  const match = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return match ? text(decodeHtmlEntities(match[1]), 300) : null
}

export async function fetchDocumentSource(candidateUrl) {
  let current = new URL(normalizeSourceUrl(candidateUrl))

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    await assertPublicUrl(current)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    let response
    try {
      response = await fetch(current, {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal,
        headers: {
          'user-agent': 'HiloCofrade/1.0 (+https://hilocofrade.es)',
          accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.1',
        },
      })
    } catch (error) {
      if (error?.name === 'AbortError') throw new Error('La fuente tardó demasiado en responder.')
      throw new Error('No se pudo descargar la fuente indicada.')
    } finally {
      clearTimeout(timer)
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (!location) throw new Error('La fuente respondió con una redirección inválida.')
      if (redirectCount === MAX_REDIRECTS) throw new Error('La fuente encadena demasiadas redirecciones.')
      current = new URL(location, current)
      continue
    }

    if (!response.ok) throw new Error(`La fuente respondió con HTTP ${response.status}.`)

    const contentType = String(response.headers.get('content-type') || '').toLowerCase()
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml') && !contentType.includes('text/plain')) {
      throw new Error('Este MVP admite páginas HTML o texto. PDF y documentos se incorporarán en una fase posterior.')
    }

    const declaredLength = Number(response.headers.get('content-length') || 0)
    if (declaredLength > MAX_SOURCE_BYTES) throw new Error('La página es demasiado grande para este importador.')

    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.byteLength > MAX_SOURCE_BYTES) throw new Error('La página supera el tamaño máximo permitido.')

    const raw = buffer.toString('utf8')
    const extracted = contentType.includes('text/plain') ? raw : htmlToText(raw)
    if (extracted.length < 40) throw new Error('No se ha encontrado texto suficiente para analizar la fuente.')

    const modelText = extracted.slice(0, MAX_MODEL_CHARS)
    return {
      url: current.toString(),
      title: contentType.includes('text/plain') ? null : htmlTitle(raw),
      text: modelText,
      truncated: extracted.length > MAX_MODEL_CHARS,
      contentSha256: createHash('sha256').update(extracted).digest('hex'),
      fetchedAt: new Date().toISOString(),
    }
  }

  throw new Error('No se pudo completar la descarga de la fuente.')
}

function responseOutputText(payload) {
  for (const item of payload?.output || []) {
    if (item?.type !== 'message') continue
    for (const part of item.content || []) {
      if (part?.type === 'output_text' && typeof part.text === 'string') return part.text
    }
  }
  return ''
}

function sanitizeAnalysis(result, fallbackTitle = null) {
  const entities = Array.isArray(result?.entities) ? result.entities : []
  const relations = Array.isArray(result?.relations) ? result.relations : []
  const warnings = Array.isArray(result?.warnings) ? result.warnings : []
  const seenIds = new Set()

  return {
    source: {
      title: text(result?.source?.title || fallbackTitle, 300) || null,
      publisher: text(result?.source?.publisher, 240) || null,
      source_type: ['official_website', 'website', 'article', 'document', 'other'].includes(result?.source?.source_type)
        ? result.source.source_type
        : 'website',
      publication_date: text(result?.source?.publication_date, 80) || null,
    },
    summary: text(result?.summary, 1200),
    entities: entities
      .map((item, index) => {
        let localId = text(item?.local_id, 50) || `e${index + 1}`
        while (seenIds.has(localId) || localId === '$target') localId = `${localId}_${index + 1}`
        seenIds.add(localId)
        return {
          local_id: localId,
          entity_type: IMPORT_ENTITY_LABELS[item?.entity_type] ? item.entity_type : 'heritage_asset',
          name: text(item?.name, 300),
          description: text(item?.description, 1200) || null,
          attributes: (Array.isArray(item?.attributes) ? item.attributes : []).slice(0, 30).map((attribute) => ({
            key: text(attribute?.key, 100),
            value: text(attribute?.value, 600),
            evidence: evidence(attribute?.evidence),
          })).filter((attribute) => attribute.key && attribute.value),
          evidence: evidence(item?.evidence),
          confidence: Math.max(0, Math.min(1, Number(item?.confidence) || 0)),
        }
      })
      .filter((item) => item.name),
    relations: relations.slice(0, 80).map((item) => ({
      source_ref: text(item?.source_ref, 60),
      target_ref: text(item?.target_ref, 60),
      relation_type: text(item?.relation_type, 80),
      notes: text(item?.notes, 800) || null,
      evidence: evidence(item?.evidence),
      confidence: Math.max(0, Math.min(1, Number(item?.confidence) || 0)),
    })),
    warnings: warnings.slice(0, 40).map((item) => ({
      type: text(item?.type, 40) || 'other',
      message: text(item?.message, 800),
      evidence: evidence(item?.evidence) || null,
    })).filter((item) => item.message),
  }
}

export async function analyzeDocumentSource({ source, target = null }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('Falta configurar OPENAI_API_KEY en el entorno de Hilo Cofrade.')
  }
  const model = process.env.HILO_IMPORT_MODEL || 'gpt-5.6'
  const targetContext = target
    ? `Entidad objetivo ya existente: $target = ${target.entity_type} · ${target.name} · id ${target.id}. No la repitas como entidad candidata.`
    : 'No hay una entidad objetivo preseleccionada.'

  const developerPrompt = `Eres el extractor documental de Hilo Cofrade, una enciclopedia cofrade relacional.\n\nReglas obligatorias:\n- Extrae SOLO hechos explícitamente respaldados por el texto proporcionado. No completes por conocimiento previo.\n- Distingue entidad física de identidad conceptual: una talla/imagen material es image; una identidad devocional o titular no físico es advocation.\n- No inventes fechas, autores, propietarios, relaciones ni responsables. Si son inciertos, indícalo en warnings.\n- Cada entidad y relación debe incluir una evidencia breve tomada del texto, de máximo 180 caracteres.\n- Los atributos deben usar claves snake_case y conservar dataciones textuales cuando no exista fecha exacta.\n- Para agentes usa, cuando esté documentado, el atributo agent_kind con person, workshop, company o institution.\n- Si existe entidad objetivo, usa literalmente $target como endpoint de las relaciones y no la repitas en entities.\n- Usa local_id e1, e2, e3... para entidades nuevas detectadas.\n- No fuerces una relación cuando el texto solo sugiera una posibilidad.\n- relation_type debe expresar semántica, no nombres de tablas.\n- Una Hermandad titular de una Imagen física debe usar titular; una titularidad conceptual debe usar has_titular.\n- El resultado es una PROPUESTA para revisión humana, nunca una publicación.`

  const userPrompt = `${targetContext}\n\nURL de la fuente: ${source.url}\nTítulo HTML detectado: ${source.title || 'No disponible'}\nTexto${source.truncated ? ' (recortado por límite técnico)' : ''}:\n\n${source.text}`

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      store: false,
      input: [
        { role: 'developer', content: developerPrompt },
        { role: 'user', content: userPrompt },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'hilo_document_import',
          description: 'Entidades, atributos, relaciones y alertas extraídas de una fuente documental para revisión editorial.',
          strict: true,
          schema: ANALYSIS_SCHEMA,
        },
      },
      max_output_tokens: 12000,
    }),
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const detail = text(payload?.error?.message, 500)
    throw new Error(detail ? `OpenAI: ${detail}` : `El analizador respondió con HTTP ${response.status}.`)
  }

  const output = responseOutputText(payload)
  if (!output) throw new Error('El analizador no devolvió una propuesta estructurada.')

  let parsed
  try {
    parsed = JSON.parse(output)
  } catch {
    throw new Error('El analizador devolvió un resultado que no se pudo interpretar.')
  }

  return {
    model,
    analysis: sanitizeAnalysis(parsed, source.title),
  }
}

function tokenSimilarity(a, b) {
  if (a === b) return 1
  const left = new Set(a.split(' ').filter(Boolean))
  const right = new Set(b.split(' ').filter(Boolean))
  if (!left.size || !right.size) return 0
  let intersection = 0
  left.forEach((token) => { if (right.has(token)) intersection += 1 })
  return (2 * intersection) / (left.size + right.size)
}

export async function enrichAnalysisWithMatches(supabase, analysis) {
  const types = [...new Set(analysis.entities.map((item) => item.entity_type))]
  if (!types.length) return analysis

  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, status')
    .in('entity_type', types)
    .neq('status', 'archived')
    .limit(5000)
  if (result.error) throw new Error(`No se pudieron buscar posibles duplicados: ${result.error.message}`)

  const existing = result.data || []
  return {
    ...analysis,
    entities: analysis.entities.map((candidate) => {
      const normalizedCandidate = normalizeIdentity(candidate.name)
      const matches = existing
        .filter((item) => item.entity_type === candidate.entity_type)
        .map((item) => {
          const normalizedExisting = normalizeIdentity(item.name)
          return {
            id: item.id,
            entity_type: item.entity_type,
            name: item.name,
            slug: item.slug,
            status: item.status,
            score: tokenSimilarity(normalizedCandidate, normalizedExisting),
            exact: normalizedCandidate === normalizedExisting,
          }
        })
        .filter((item) => item.exact || item.score >= 0.42)
        .sort((a, b) => Number(b.exact) - Number(a.exact) || b.score - a.score)
        .slice(0, 4)

      const exactMatches = matches.filter((item) => item.exact)
      return {
        ...candidate,
        matches,
        recommended_match_id: exactMatches.length === 1 ? exactMatches[0].id : null,
        match_conflict: exactMatches.length > 1,
        can_create_draft: CREATABLE_IMPORT_TYPES.has(candidate.entity_type),
      }
    }),
  }
}

export async function getImportTargets(supabase) {
  const result = await supabase
    .from('entities')
    .select('id, entity_type, name, slug, status')
    .neq('status', 'archived')
    .order('name')
    .limit(5000)
  if (result.error) throw new Error(`No se pudieron cargar las entidades objetivo: ${result.error.message}`)
  return (result.data || []).map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug || '',
    meta: `${IMPORT_ENTITY_LABELS[item.entity_type] || item.entity_type} · ${item.status}`,
  }))
}

export function attributeMap(candidate) {
  return Object.fromEntries((candidate?.attributes || []).map((item) => [item.key, item.value]))
}

export function classifyImportRelation(relation, typeByRef, target = null) {
  const sourceType = relation.source_ref === '$target' ? target?.entity_type : typeByRef.get(relation.source_ref)
  const targetType = relation.target_ref === '$target' ? target?.entity_type : typeByRef.get(relation.target_ref)
  if (!sourceType || !targetType) return null

  const pair = new Set([sourceType, targetType])
  if (pair.has('brotherhood') && pair.has('advocation') && ['has_titular', 'titular'].includes(relation.relation_type)) {
    return { kind: 'has_titular', sourceType: 'brotherhood', targetType: 'advocation' }
  }
  if (pair.has('brotherhood') && pair.has('image') && ['titular', 'has_titular'].includes(relation.relation_type)) {
    return { kind: 'brotherhood_image', sourceType: 'brotherhood', targetType: 'image' }
  }
  if (pair.has('brotherhood') && pair.has('step') && relation.relation_type === 'processional_step') {
    return { kind: 'brotherhood_step', sourceType: 'brotherhood', targetType: 'step' }
  }
  if (pair.has('image') && pair.has('step') && relation.relation_type === 'processes_on') {
    return { kind: 'image_step', sourceType: 'image', targetType: 'step' }
  }
  if (pair.has('band') && pair.has('brotherhood') && relation.relation_type === 'belongs_to_brotherhood') {
    return { kind: 'belongs_to_brotherhood', sourceType: 'band', targetType: 'brotherhood' }
  }
  return null
}
