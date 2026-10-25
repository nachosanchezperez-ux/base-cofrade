import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { selectAllRows } from '@/lib/supabase/query-all'

// Datos del formulario de alta rápida: Hermandades (con su localidad), localidades
// de Sevilla y lugares. Lecturas en paralelo, una sola vez por carga.
// Una aportación pública como punto de partida (título y texto). El editor
// revisa y decide: nada se publica solo (contrato de Aportaciones).
export async function getQuickActContribution(id = '') {
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(String(id))) return null
  const supabase = await createClient()
  const { data, error } = await supabase.from('contributions').select('id, title, description').eq('id', id).maybeSingle()
  if (error || !data) return null
  return { id: data.id, title: String(data.title || '').slice(0, 160), description: String(data.description || '').slice(0, 2000) }
}

export async function getQuickActFormData() {
  const supabase = await createClient()
  const results = await Promise.all([
    selectAllRows(() => supabase.from('entities').select('id, name, status').eq('entity_type', 'brotherhood').neq('status', 'archived').order('name')),
    selectAllRows(() => supabase.from('brotherhoods').select('entity_id, popular_name, municipality_id').order('entity_id'), { tieBreaker: 'entity_id' }),
    supabase.from('municipalities').select('id, name, province').eq('province', 'Sevilla').order('name'),
    selectAllRows(() => supabase.from('places').select('id, name, municipality_id').order('name')),
  ])
  // selectAllRows conserva el contrato { data, error }; no devuelve un Array.
  const labels = ['las entidades', 'las Hermandades', 'las localidades', 'los lugares']
  const [entities, brotherhoods, municipalities, places] = results.map((result, index) => {
    if (result.error) throw new Error(`No se pudieron cargar ${labels[index]}: ${result.error.message}`)
    if (!Array.isArray(result.data)) throw new Error(`Respuesta no válida al cargar ${labels[index]}.`)
    return result.data
  })
  const byEntity = new Map(brotherhoods.map((row) => [row.entity_id, row]))
  return {
    brotherhoods: entities.map((entity) => ({
      id: entity.id,
      name: byEntity.get(entity.id)?.popular_name || entity.name,
      fullName: entity.name,
      municipalityId: byEntity.get(entity.id)?.municipality_id || '',
      status: entity.status,
    })).sort((a, b) => a.name.localeCompare(b.name, 'es')),
    municipalities,
    places,
  }
}
