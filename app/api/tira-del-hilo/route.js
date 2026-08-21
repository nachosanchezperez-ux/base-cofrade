import { NextResponse } from 'next/server'
import { askHiloCofradeV2 } from '@/lib/supabase/tira-del-hilo-v2'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const body = await request.json()
    const question = String(body?.question || '').trim()
    const context = body?.context && typeof body.context === 'object'
      ? {
          entityId: body.context.entityId || null,
          entityType: body.context.entityType || null,
          name: body.context.name || '',
        }
      : null

    if (!question) {
      return NextResponse.json({ error: 'Escribe una pregunta para empezar.' }, { status: 400 })
    }

    if (question.length > 320) {
      return NextResponse.json({ error: 'La consulta es demasiado larga.' }, { status: 400 })
    }

    const response = await askHiloCofradeV2(question, context)
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
