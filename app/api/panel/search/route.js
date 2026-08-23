import { getPanelUser } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const ROUTES = {
  brotherhood: ['Hermandad', 'hermandades'],
  image: ['Imagen', 'imagenes'],
  step: ['Paso', 'pasos'],
  band: ['Banda', 'bandas'],
  march: ['Marcha', 'marchas'],
  agent: ['Persona', 'agentes'],
}

function response(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
}

export async function GET(request) {
  const user = await getPanelUser()
  if (!user) return response({ error: 'No autorizado.' }, 401)

  const query = String(new URL(request.url).searchParams.get('q') || '')
    .trim()
    .replace(/[%_]/g, '')
    .slice(0, 80)

  if (query.length < 2) return response({ results: [] })

  const supabase = await createClient()
  const entitiesResult = await supabase
    .from('entities')
    .select('id, name, entity_type, status')
    .in('entity_type', Object.keys(ROUTES))
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(16)

  if (entitiesResult.error) {
    console.error('[Hilo Cofrade] Error en la búsqueda rápida del Panel', entitiesResult.error)
    return response({ error: 'No se pudo buscar en el Panel.' }, 500)
  }

  const results = (entitiesResult.data || []).map((item) => {
    const [typeLabel, segment] = ROUTES[item.entity_type]
    return {
      id: item.id,
      name: item.name,
      type: item.entity_type,
      typeLabel,
      status: item.status || '',
      href: `/panel/${segment}/${item.id}`,
    }
  })

  return response({ results })
}
