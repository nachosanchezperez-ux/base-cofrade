import { NextResponse } from 'next/server'
import { searchPublicHiloEntities } from '@/lib/supabase/tira-public'
import { getHiloLookupIntent, prioritizeHiloNavigationItems } from '@/lib/tira-search-intent'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const rawTerm = String(request.nextUrl.searchParams.get('q') || '').trim()
  if (rawTerm.length < 2) {
    return NextResponse.json({ items: [] }, { headers: { 'Cache-Control': 'no-store' } })
  }

  const intent = getHiloLookupIntent(rawTerm, { allowBare: false })
  const term = intent?.term || rawTerm

  try {
    let items = await searchPublicHiloEntities(term, 8)
    if (intent?.explicitNavigation) items = prioritizeHiloNavigationItems(items)
    return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[Hilo Cofrade] Error en autocompletado de Tira del hilo', {
      rawTerm,
      term,
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ items: [] }, { status: 200, headers: { 'Cache-Control': 'no-store' } })
  }
}
