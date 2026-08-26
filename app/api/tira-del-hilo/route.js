import { NextResponse } from 'next/server'
import { askPublicHiloCofrade, searchPublicHiloEntities } from '@/lib/supabase/tira-public'
import { getHiloLookupIntent, selectHiloNavigationItems } from '@/lib/tira-search-intent'

export const dynamic = 'force-dynamic'

const VALID_ENTITY_TYPES = new Set([
  'brotherhood',
  'image',
  'step',
  'band',
  'march',
  'agent',
  'event',
  'heritage_asset',
  'advocation',
])

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function safeUuid(value) {
  const text = String(value || '').trim()
  return UUID_PATTERN.test(text) ? text : null
}

function safeType(value) {
  const text = String(value || '').trim()
  return VALID_ENTITY_TYPES.has(text) ? text : null
}

function sanitizeContext(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null

  const entityId = safeUuid(raw.entityId)
  const entityType = safeType(raw.entityType)
  const context = {
    entityId,
    entityType,
    name: String(raw.name || '').trim().slice(0, 160),
  }

  const rawSet = raw.resultSet
  if (rawSet && typeof rawSet === 'object' && !Array.isArray(rawSet)) {
    const setType = safeType(rawSet.entityType)
    const entityIds = Array.isArray(rawSet.entityIds)
      ? [...new Set(rawSet.entityIds.map(safeUuid).filter(Boolean))].slice(0, 12)
      : []

    if (setType && entityIds.length) {
      context.resultSet = {
        entityType: setType,
        entityIds,
        sourceIntent: String(rawSet.sourceIntent || '').trim().slice(0, 64),
      }
    }
  }

  return context.entityId || context.resultSet ? context : null
}

function directLookupResponse(intent, matches) {
  const selected = selectHiloNavigationItems(matches, intent.term, {
    explicitNavigation: intent.explicitNavigation,
    limit: 5,
  })
  if (!selected.length) return null

  const primary = selected[0]
  const entityId = safeUuid(primary.entityId)
  const entityType = safeType(primary.entityType)
  const directContext = selected.length === 1 && entityId && entityType
    ? { entityId, entityType, name: String(primary.title || '').slice(0, 160) }
    : null

  return {
    kind: 'search_results',
    answer: selected.length === 1
      ? `He encontrado esta ficha en Hilo Cofrade para «${intent.term}».`
      : `He encontrado ${selected.length} fichas relacionadas con «${intent.term}».`,
    path: ['Búsqueda directa'],
    entities: [],
    items: selected.map((item) => ({
      label: item.title,
      meta: [item.type, item.subtitle].filter(Boolean).join(' · '),
      href: item.href,
    })),
    evidence: [],
    references: [],
    followUps: directContext ? [`Cuéntame sobre ${primary.title}`] : [],
    context: directContext,
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const question = String(body?.question || '').trim()
    const context = sanitizeContext(body?.context)

    if (!question) {
      return NextResponse.json({ error: 'Escribe una pregunta o búsqueda para empezar.' }, { status: 400 })
    }

    if (question.length > 320) {
      return NextResponse.json({ error: 'La consulta es demasiado larga.' }, { status: 400 })
    }

    const lookupIntent = getHiloLookupIntent(question)
    if (lookupIntent) {
      const matches = await searchPublicHiloEntities(lookupIntent.term, 8)
      const directResponse = directLookupResponse(lookupIntent, matches)
      if (directResponse) {
        return NextResponse.json(directResponse, {
          headers: {
            'Cache-Control': 'no-store',
          },
        })
      }
    }

    const response = await askPublicHiloCofrade(question, context)
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[Hilo Cofrade] Error en API Tira del hilo', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      {
        kind: 'not_documented',
        answer: 'No he podido resolver esa consulta ahora mismo. Prefiero no completar la respuesta con información no documentada.',
        path: [],
        entities: [],
        items: [],
        followUps: [],
        context: null,
      },
      { status: 500 }
    )
  }
}
