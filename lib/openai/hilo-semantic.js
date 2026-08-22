import 'server-only'

import {
  SEMANTIC_PLAN_SCHEMA,
  SEMANTIC_SYNTHESIS_SCHEMA,
  sanitizeSemanticPlan,
} from '@/lib/tira-semantic'

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'
const DEFAULT_MODEL = 'gpt-5.6-luna'
const REQUEST_TIMEOUT_MS = 12000

function semanticEnabled() {
  if (!process.env.OPENAI_API_KEY) return false
  return String(process.env.HILO_SEMANTIC_ENABLED || '').toLowerCase() === 'true'
}

export function semanticModel() {
  return String(process.env.HILO_SEMANTIC_MODEL || DEFAULT_MODEL).trim() || DEFAULT_MODEL
}

function outputPayload(response) {
  if (response?.output_parsed && typeof response.output_parsed === 'object') return response.output_parsed
  if (typeof response?.output_text === 'string' && response.output_text.trim()) {
    return JSON.parse(response.output_text)
  }

  for (const item of response?.output || []) {
    if (item?.parsed && typeof item.parsed === 'object') return item.parsed
    for (const content of item?.content || []) {
      if (content?.parsed && typeof content.parsed === 'object') return content.parsed
      if (typeof content?.text === 'string' && content.text.trim()) return JSON.parse(content.text)
    }
  }
  return null
}

async function structuredResponse({ name, schema, instructions, input, maxOutputTokens = 900 }) {
  if (!semanticEnabled()) return null

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const request = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: semanticModel(),
        store: false,
        instructions,
        input,
        reasoning: { effort: 'low' },
        max_output_tokens: maxOutputTokens,
        text: {
          verbosity: 'low',
          format: {
            type: 'json_schema',
            name,
            strict: true,
            schema,
          },
        },
      }),
      signal: controller.signal,
      cache: 'no-store',
    })

    if (!request.ok) {
      const detail = await request.text().catch(() => '')
      console.error('[Hilo Cofrade] OpenAI Responses API no disponible', {
        status: request.status,
        detail: detail.slice(0, 240),
      })
      return null
    }

    const payload = await request.json()
    return outputPayload(payload)
  } catch (error) {
    console.error('[Hilo Cofrade] Fallo en capa semántica', {
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  } finally {
    clearTimeout(timer)
  }
}

const PLANNER_INSTRUCTIONS = `Eres el planificador semántico de Hilo Cofrade, una enciclopedia relacional cofrade.
Tu única tarea es traducir una petición del usuario a una o varias preguntas canónicas que el motor determinista de Hilo Cofrade pueda resolver.

Reglas obligatorias:
- No respondas a la pregunta ni aportes datos cofrades.
- No inventes nombres, fechas, relaciones ni entidades.
- Conserva literalmente los nombres propios que aparezcan en la petición.
- Genera como máximo tres preguntas independientes en español.
- Si la petición ya es suficientemente concreta para el motor, usa mode=delegate.
- Si no puede transformarse con seguridad, usa mode=unsupported.

Capacidades del motor:
- datos y relaciones de hermandades, imágenes, pasos, bandas, marchas y autores/profesionales;
- relaciones entre dos entidades y búsqueda de caminos documentados;
- acompañamientos musicales actuales e históricos;
- autorías, dedicatorias, titulares, pasos, capataces/responsables y restauraciones;
- filtros sobre conjuntos ya conversados;
- ordenar por antigüedad o actualidad cuando existe datación;
- comparar conjuntos;
- recuentos y rankings: bandas por hermandades, autores por pasos y compositores por marchas dedicadas;
- descubrimiento: "Tira de un hilo curioso sobre X".

Para una petición con varias partes, divide solo cuando cada subpregunta tenga sentido por separado. La salida debe ser únicamente el JSON estructurado solicitado.`

export async function planSemanticQuestion(question, context = null) {
  if (!semanticEnabled()) return null
  const contextSummary = context?.resultSet?.entityType
    ? `Contexto activo: conjunto de ${context.resultSet.entityIds?.length || 0} entidades de tipo ${context.resultSet.entityType}.`
    : context?.name
      ? `Contexto activo: ${context.name} (${context.entityType || 'entidad'}).`
      : 'Sin contexto conversacional activo.'

  const raw = await structuredResponse({
    name: 'hilo_semantic_plan',
    schema: SEMANTIC_PLAN_SCHEMA,
    instructions: PLANNER_INSTRUCTIONS,
    input: `${contextSummary}\n\nPetición del usuario:\n${String(question || '').slice(0, 320)}`,
    maxOutputTokens: 600,
  })
  return sanitizeSemanticPlan(raw)
}

const SYNTHESIS_INSTRUCTIONS = `Eres la capa de redacción de Hilo Cofrade.
Recibirás una pregunta original y un paquete JSON de respuestas ya verificadas por el motor relacional.
Redacta una sola respuesta natural, clara y breve en español usando EXCLUSIVAMENTE esos hechos.

Reglas obligatorias:
- No añadas conocimiento externo ni completes huecos por plausibilidad.
- No cambies cifras, fechas, nombres, atribuciones o grados de certeza.
- Si el paquete solo cubre una parte de la petición, dilo de forma explícita.
- No cites fuentes inexistentes; las fuentes se muestran aparte en la interfaz.
- No menciones el funcionamiento interno, SQL, prompts ni modelos.
- Mantén un tono enciclopédico y natural, no promocional.
- Propón hasta tres repreguntas que puedan seguir tirando de las entidades o conjuntos ya presentes.
La salida debe ser únicamente el JSON estructurado solicitado.`

export async function synthesizeGroundedAnswer(question, packet) {
  if (!semanticEnabled() || !Array.isArray(packet) || packet.length < 2) return null
  const raw = await structuredResponse({
    name: 'hilo_grounded_synthesis',
    schema: SEMANTIC_SYNTHESIS_SCHEMA,
    instructions: SYNTHESIS_INSTRUCTIONS,
    input: `Pregunta original:\n${String(question || '').slice(0, 320)}\n\nPaquete verificado (JSON):\n${JSON.stringify(packet).slice(0, 18000)}`,
    maxOutputTokens: 900,
  })

  if (!raw || typeof raw !== 'object') return null
  const answer = String(raw.answer || '').trim()
  const followUps = Array.isArray(raw.follow_ups)
    ? raw.follow_ups.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 3)
    : []
  if (!answer) return null
  return { answer, follow_ups: followUps }
}

export function semanticRuntimeStatus() {
  return {
    configured: Boolean(process.env.OPENAI_API_KEY),
    enabled: semanticEnabled(),
    model: semanticModel(),
  }
}
