import 'server-only'

import { askHiloCofradeV11 } from '@/lib/supabase/tira-del-hilo-v11'
import {
  planSemanticQuestion,
  semanticModel,
  synthesizeGroundedAnswer,
} from '@/lib/openai/hilo-semantic'
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

async function executePlan(question, context, plan) {
  if (!plan || !['single', 'multi'].includes(plan.mode) || !plan.queries.length) return null

  const pairs = await Promise.all(
    plan.queries.map(async (query) => ({
      query,
      response: await askHiloCofradeV11(query, context),
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

  // Las consultas complejas se interpretan antes de pasar al motor. Si la capa
  // semántica no está configurada o falla, el comportamiento V11 permanece intacto.
  if (shouldUseSemanticLayer(clean)) {
    const semantic = await semanticFallback(clean, context)
    if (semantic) return semantic
    return askHiloCofradeV11(clean, context)
  }

  // Para preguntas normales preservamos la ruta rápida y determinista. Solo si
  // V11 no puede documentarlas intentamos una reformulación semántica.
  const deterministic = await askHiloCofradeV11(clean, context)
  if (deterministic?.kind === 'answer') return deterministic

  return (await semanticFallback(clean, context, deterministic)) || deterministic
}
