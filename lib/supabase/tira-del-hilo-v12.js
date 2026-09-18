import 'server-only'

import { askHiloCofradeV11 } from '@/lib/supabase/tira-del-hilo-v11'
import { askHiloCofradeBandLinksV2 } from '@/lib/supabase/tira-del-hilo-band-links-v2'
import { askHiloCofradeFreeDirect } from '@/lib/supabase/tira-del-hilo-free-direct'
import { askHiloCofradeFreeFacts, askHiloCofradeFreeSet } from '@/lib/supabase/tira-del-hilo-free-facts'
import { askHiloCofradePublishedContent } from '@/lib/supabase/tira-del-hilo-published-content'
import { askHiloCofradeRelationalV2 } from '@/lib/supabase/tira-del-hilo-relational-v2'
import { askHiloCofradeRepertoireEntries } from '@/lib/supabase/tira-del-hilo-repertoire-entries'
import { askHiloCofradeMarchRelationsV3 } from '@/lib/supabase/tira-del-hilo-march-relations-v3'
import { askHiloCofradeAuthorsPatrimonyV4 } from '@/lib/supabase/tira-del-hilo-authors-patrimony-v4'
import { askHiloCofradeBrotherhoodCalendarV5 } from '@/lib/supabase/tira-del-hilo-brotherhood-calendar-v5'
import { askHiloCofradeCrossFiltersV6 } from '@/lib/supabase/tira-del-hilo-cross-filters-v6'
import { askHiloCofradeSetReasoningV8 } from '@/lib/supabase/tira-del-hilo-set-reasoning-v8'
import { askHiloCofradeSetCrossesV9 } from '@/lib/supabase/tira-del-hilo-set-crosses-v9'
import { askHiloCofradeSubsetFiltersV10 } from '@/lib/supabase/tira-del-hilo-subset-filters-v10'
import { planSemanticQuestion, semanticModel, synthesizeGroundedAnswer } from '@/lib/openai/hilo-semantic'
import { planFreeCompoundQuestion, mergeFreeCompoundResponses } from '@/lib/tira-free-planner'
import { groundedPacket, mergeGroundedResponses, shouldUseSemanticLayer } from '@/lib/tira-semantic'

function semanticMeta(plan, extra = {}) { return { model: semanticModel(), planMode: plan?.mode || 'fallback', planSummary: plan?.summary || '', queries: plan?.queries || [], ...extra } }
function withExternalLinks(response) {
  if (!response?.items?.some((item) => item?.externalUrl && !item?.href)) return response
  return { ...response, items: response.items.map((item) => item?.externalUrl && !item?.href ? { ...item, href: item.externalUrl, external: true } : item) }
}

async function askFree(query, context) {
  const response = (await askHiloCofradeFreeSet(query, context))
    || (await askHiloCofradeSubsetFiltersV10(query, context))
    || (await askHiloCofradeSetReasoningV8(query, context))
    || (await askHiloCofradeSetCrossesV9(query, context))
    || (await askHiloCofradeRepertoireEntries(query))
    || (await askHiloCofradeFreeDirect(query, context))
    || (await askHiloCofradeCrossFiltersV6(query, context))
    || (await askHiloCofradeMarchRelationsV3(query, context))
    || (await askHiloCofradeBandLinksV2(query, context))
    || (await askHiloCofradeRelationalV2(query, context))
    || (await askHiloCofradeFreeFacts(query, context))
    || (await askHiloCofradeAuthorsPatrimonyV4(query, context))
    || (await askHiloCofradeBrotherhoodCalendarV5(query, context))
    || (await askHiloCofradePublishedContent(query, context))
    || await askHiloCofradeV11(query, context)
  return withExternalLinks(response)
}

async function executeFreeCompoundPlan(question, context) {
  const plan = planFreeCompoundQuestion(question)
  if (!plan?.queries?.length) return null
  const responses = []
  let activeContext = context
  for (const query of plan.queries) {
    const response = await askFree(query, activeContext)
    responses.push(response)
    if (response?.kind === 'answer' && Object.prototype.hasOwnProperty.call(response, 'context')) activeContext = response.context || activeContext
  }
  return mergeFreeCompoundResponses(responses, plan, activeContext)
}

async function executePlan(question, context, plan) {
  if (!plan || !['single', 'multi'].includes(plan.mode) || !plan.queries.length) return null
  const pairs = await Promise.all(plan.queries.map(async (query) => ({ query, response: await askFree(query, context) })))
  const answeredPairs = pairs.filter(({ response }) => response?.kind === 'answer')
  if (!answeredPairs.length) return null
  const answered = answeredPairs.map(({ response }) => response)
  let synthesis = null
  if (answered.length > 1) {
    const packet = groundedPacket(answered).map((item, index) => ({ ...item, canonical_query: answeredPairs[index]?.query || '' }))
    synthesis = await synthesizeGroundedAnswer(question, packet)
  }
  return mergeGroundedResponses(answered, synthesis, semanticMeta(plan, { plannedCount: plan.queries.length, answeredCount: answered.length, partial: answered.length < plan.queries.length }))
}

async function semanticFallback(question, context, deterministic = null) {
  const plan = await planSemanticQuestion(question, context)
  if (!plan || plan.mode === 'delegate' || plan.mode === 'unsupported') return deterministic
  return (await executePlan(question, context, plan)) || deterministic
}

export async function askHiloCofradeV12(question, context = null) {
  const clean = String(question || '').trim()
  const freeCompound = await executeFreeCompoundPlan(clean, context)
  if (freeCompound) return withExternalLinks(freeCompound)
  const freeSet = await askHiloCofradeFreeSet(clean, context)
  if (freeSet) return withExternalLinks(freeSet)
  const subsetFiltersV10 = await askHiloCofradeSubsetFiltersV10(clean, context)
  if (subsetFiltersV10) return withExternalLinks(subsetFiltersV10)
  const setReasoningV8 = await askHiloCofradeSetReasoningV8(clean, context)
  if (setReasoningV8) return withExternalLinks(setReasoningV8)
  const setCrossesV9 = await askHiloCofradeSetCrossesV9(clean, context)
  if (setCrossesV9) return withExternalLinks(setCrossesV9)
  const repertoireEntries = await askHiloCofradeRepertoireEntries(clean)
  if (repertoireEntries) return withExternalLinks(repertoireEntries)
  const freeDirect = await askHiloCofradeFreeDirect(clean, context)
  if (freeDirect) return withExternalLinks(freeDirect)
  const crossFiltersV6 = await askHiloCofradeCrossFiltersV6(clean, context)
  if (crossFiltersV6) return withExternalLinks(crossFiltersV6)
  const marchRelationsV3 = await askHiloCofradeMarchRelationsV3(clean, context)
  if (marchRelationsV3) return withExternalLinks(marchRelationsV3)
  const bandLinksV2 = await askHiloCofradeBandLinksV2(clean, context)
  if (bandLinksV2) return withExternalLinks(bandLinksV2)
  const relationalV2 = await askHiloCofradeRelationalV2(clean, context)
  if (relationalV2) return withExternalLinks(relationalV2)
  const freeFacts = await askHiloCofradeFreeFacts(clean, context)
  if (freeFacts) return withExternalLinks(freeFacts)
  const authorsPatrimonyV4 = await askHiloCofradeAuthorsPatrimonyV4(clean, context)
  if (authorsPatrimonyV4) return withExternalLinks(authorsPatrimonyV4)
  const brotherhoodCalendarV5 = await askHiloCofradeBrotherhoodCalendarV5(clean, context)
  if (brotherhoodCalendarV5) return withExternalLinks(brotherhoodCalendarV5)
  const publishedContent = await askHiloCofradePublishedContent(clean, context)
  if (publishedContent) return withExternalLinks(publishedContent)
  if (shouldUseSemanticLayer(clean)) {
    const semantic = await semanticFallback(clean, context)
    if (semantic) return withExternalLinks(semantic)
    return askHiloCofradeV11(clean, context)
  }
  const deterministic = await askHiloCofradeV11(clean, context)
  if (deterministic?.kind === 'answer') return withExternalLinks(deterministic)
  return withExternalLinks((await semanticFallback(clean, context, deterministic)) || deterministic)
}
