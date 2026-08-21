import { NextResponse } from 'next/server'
import { searchHiloEntities } from '@/lib/supabase/search-live'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const term = String(request.nextUrl.searchParams.get('q') || '').trim()
  if (term.length < 2) {
    return NextResponse.json({ items: [] }, { headers: { 'Cache-Control': 'no-store' } })
  }

  try {
    const items = await searchHiloEntities(term, 8)
    return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[Hilo Cofrade] Error en autocompletado de Tira del hilo', {
      term,
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ items: [] }, { status: 200, headers: { 'Cache-Control': 'no-store' } })
  }
}
