import { getPanelUser } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import { getHermandadBySlug } from '@/lib/data'
import { loadBrotherhoodSearchData } from '@/lib/panel/ficha-search-data'
import { buildBrotherhoodSearchIndex, fichaSearchTokens, searchFichaIndex } from '@/lib/panel/ficha-search'

export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'private, no-store', 'Vary': 'Cookie' }
function json(body, status = 200) { return Response.json(body, { status, headers }) }

export async function GET(request, { params }) {
  const user = await getPanelUser()
  if (!user) return json({ error: 'Inicia sesión en el panel para buscar.' }, 401)
  const { id } = await params
  const query = new URL(request.url).searchParams.get('q')?.trim() || ''
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return json({ error: 'Ficha no válida.' }, 400)
  if (query.length < 2 || query.length > 120 || !fichaSearchTokens(query).length) return json({ error: 'Escribe entre 2 y 120 caracteres y alguna palabra significativa.' }, 400)
  try {
    const data = await loadBrotherhoodSearchData(await createClient(), id)
    if (!data) return json({ error: 'No se encontró la ficha.' }, 404)
    // Same precedence as the Historia editor, including intentional empty strings.
    data.history = data.brotherhood?.history_text ?? getHermandadBySlug(data.entity.slug)?.historia ?? data.brotherhood?.notes ?? ''
    return json({ ...searchFichaIndex(buildBrotherhoodSearchIndex(data), query, { context: data.entity.name }), canEdit: ['admin', 'editor'].includes(user.role) })
  } catch {
    return json({ error: 'No se pudo completar la búsqueda. Vuelve a intentarlo.' }, 503)
  }
}
