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
  const [entitiesResult, outingsResult, crewEntitiesResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, entity_type, status')
      .in('entity_type', Object.keys(ROUTES))
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(14),
    supabase
      .from('outings')
      .select('id, title, outing_type, event_status, status, outing_date')
      .eq('character', 'extraordinary')
      .ilike('title', `%${query}%`)
      .order('outing_date', { ascending: false })
      .limit(4),
    supabase
      .from('entities')
      .select('id, name, status, events!inner(event_category, event_date, event_type)')
      .eq('entity_type', 'event')
      .eq('events.event_category', 'crew_call')
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(6),
  ])

  if (entitiesResult.error) {
    console.error('[Hilo Cofrade] Error en la búsqueda rápida del Panel', entitiesResult.error)
    return response({ error: 'No se pudo buscar en el Panel.' }, 500)
  }

  if (outingsResult.error) {
    console.error('[Hilo Cofrade] Error buscando extraordinarias en el Panel', outingsResult.error)
  }

  if (crewEntitiesResult.error) {
    console.error('[Hilo Cofrade] Error buscando igualás y ensayos en el Panel', crewEntitiesResult.error)
  }

  const entities = (entitiesResult.data || []).map((item) => {
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

  const outings = (outingsResult.data || []).map((item) => ({
    id: item.id,
    name: item.title || item.outing_type || 'Extraordinaria',
    type: 'extraordinary',
    typeLabel: 'Extraordinaria',
    status: item.event_status || item.status || '',
    href: `/panel/extraordinarias/${item.id}`,
  }))

  const crewEvents = (crewEntitiesResult.data || []).map((item) => ({
    id: item.id,
    name: item.name,
    type: 'crew_event',
    typeLabel: 'Igualá / ensayo',
    status: item.status || '',
    href: `/panel/igualas-y-ensayos/${item.id}`,
  }))

  return response({ results: [...entities, ...outings, ...crewEvents].slice(0, 16) })
}
