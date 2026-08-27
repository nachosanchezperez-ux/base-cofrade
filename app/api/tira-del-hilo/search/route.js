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
    const items = prioritizeHiloNavigationItems(await searchPublicHiloEntities(term, 8))
    return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    console.error('[Hilo Cofrade] Error en autocompletado de Tira del hilo')
    return NextResponse.json({ items: [] }, { status: 200, headers: { 'Cache-Control': 'no-store' } })
  }
}
