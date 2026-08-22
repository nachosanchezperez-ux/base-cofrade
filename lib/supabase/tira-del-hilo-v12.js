import 'server-only'

import { askHiloCofradeV11 } from '@/lib/supabase/tira-del-hilo-v11'
import { askHiloCofradeFreeDirect } from '@/lib/supabase/tira-del-hilo-free-direct'
import {
  askHiloCofradeFreeFacts,
  askHiloCofradeFreeSet,
} from '@/lib/supabase/tira-del-hilo-free-facts'
import {
  planSemanticQuestion,
  semanticModel,
  synthesizeGroundedAnswer,
} from '@/lib/openai/hilo-semantic'
import {
  planFreeCompoundQuestion,
  mergeFreeCompoundResponses,
} from '@/lib/tira-free-planner'
import {
  groundedPacket,
  mergeGroundedResponses,
  shouldUseSemanticLayer,
} from '@/lib/tira-semantic'

function semanticMeta(plan, extra = {}) {
  return {
    model: semanticModel(),
    planMode: plan?.mode || 'fallback',
    planSummary: plan?.summary || '',
    queries: plan?.queries || [],
    ...extra,
  }
}

async function askFree(query, context) {
  return (await askHiloCofradeFreeSet(query, context))
    || (await askHiloCofradeFreeDirect(query, context))
    || (await askHiloCofradeFreeFacts(query, context))
    || askHiloCofradeV11(query, context)
}

async function executeFreeCompoundPlan(question, context) {
  const plan = planFreeCompoundQuestion(question)
  if (!plan?.queries?.length) return null

  const responses = []
  let activeContext = context

  for (const query of plan.queries) {
    const response = await askFree(query, activeContext)
    responses.push(response)

    if (response?.kind === 'answer' && Object.prototype.hasOwnProperty.call(response, 'context')) {
      activeContext = response.context || activeContext
    }
  }

  return mergeFreeCompoundResponses(responses, plan, activeContext)
}

async function executePlan(question, context, plan) {
  if (!plan || !['single', 'multi'].includes(plan.mode) || !plan.queries.length) return null

  const pairs = await Promise.all(
    plan.queries.map(async (query) => ({
      query,
      response: await askFree(query, context),
    }))
  )
  const answeredPairs = pairs.filter(({ response }) => response?.kind === 'answer')
  if (!answeredPairs.length) return null
  const answered = answeredPairs.map(({ response }) => response)

  let synthesis = null
  if (answered.length > 1) {
    const packet = groundedPacket(answered).map((item, index) => ({
      ...item,
      canonical_query: answeredPairs[index]?.query || '',
    }))
    synthesis = await synthesizeGroundedAnswer(question, packet)
  }

  return mergeGroundedResponses(
    answered,
    synthesis,
    semanticMeta(plan, {
      plannedCount: plan.queries.length,
      answeredCount: answered.length,
      partial: answered.length < plan.queries.length,
    })
  )
}

async function semanticFallback(question, context, deterministic = null) {
  const plan = await planSemanticQuestion(question, context)
  if (!plan || plan.mode === 'delegate' || plan.mode === 'unsupported') return deterministic

  const planned = await executePlan(question, context, plan)
  return planned || deterministic
}

export async function askHiloCofradeV12(question, context = null) {
  const clean = String(question || '').trim()

  // Antes de cualquier capa de pago intentamos resolver consultas compuestas
  // encadenando varios turnos gratuitos. El contexto de cada paso alimenta al
  // siguiente, igual que si el usuario preguntara turno a turno.
  const freeCompound = await executeFreeCompoundPlan(clean, context)
  if (freeCompound) return freeCompound

  // Operaciones gratuitas sobre un conjunto previamente conversado: por ahora,
  // coincidencias estructuradas compartidas por todas las entidades del conjunto.
  const freeSet = await askHiloCofradeFreeSet(clean, context)
  if (freeSet) return freeSet

  // Datos directos de Marchas incorporados en 2.8.
  const freeDirect = await askHiloCofradeFreeDirect(clean, context)
  if (freeDirect) return freeDirect

  // Hechos estructurados de Hermandades, Bandas, Imágenes y Pasos, además de
  // opciones de escucha de Marchas. Todo sale de Supabase y no usa modelos.
  const freeFacts = await askHiloCofradeFreeFacts(clean, context)
  if (freeFacts) return freeFacts

  // Las consultas complejas que no cubre el motor gratuito pueden pasar por la
  // capa semántica solo cuando existe opt-in explícito. Si no, V11 sigue intacto.
  if (shouldUseSemanticLayer(clean)) {
    const semantic = await semanticFallback(clean, context)
    if (semantic) return semantic
    return askHiloCofradeV11(clean, context)
  }

  // Para preguntas normales preservamos la ruta rápida y determinista. Solo si
  // V11 no puede documentarlas intentamos una reformulación semántica opt-in.
  const deterministic = await askHiloCofradeV11(clean, context)
  if (deterministic?.kind === 'answer') return deterministic

  return (await semanticFallback(clean, context, deterministic)) || deterministic
}
