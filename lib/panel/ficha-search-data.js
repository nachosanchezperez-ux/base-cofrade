// Called only after panel authorization. Reads through the caller's RLS session.
import { selectAllRows, selectRowsByIds } from '../supabase/query-all.js'

function checked(result) {
  if (result.error) throw new Error('No se pudo leer el contenido de la ficha')
  return result.data
}

export async function loadBrotherhoodSearchData(supabase, id) {
  const entity = checked(await supabase.from('entities').select('id,name,slug,summary,status').eq('id', id).eq('entity_type', 'brotherhood').maybeSingle())
  if (!entity) return null
  const specs = [
    ['assets', 'heritage_assets', 'parent_entity_id', 'entity_id', false],
    ['heritage', 'heritage_updates', 'brotherhood_entity_id', 'id', false],
    ['cults', 'cults', 'brotherhood_entity_id', 'id', false],
    ['outings', 'outings', 'brotherhood_entity_id', 'id', true],
    ['series', 'outing_series', 'brotherhood_entity_id', 'id', false],
    ['habits', 'brotherhood_habits', 'brotherhood_entity_id', 'id', true],
    ['stats', 'brotherhood_procession_stats', 'brotherhood_entity_id', 'id', true],
    ['images', 'brotherhood_images', 'brotherhood_entity_id', 'id', false],
    ['steps', 'brotherhood_steps', 'brotherhood_entity_id', 'id', false],
    ['channels', 'entity_social_links', 'entity_id', 'id', false],
  ]
  const [brotherhoodResult, ...collections] = await Promise.all([
    supabase.from('brotherhoods').select('*').eq('entity_id', id).maybeSingle(),
    ...specs.map(([, table, parent, tieBreaker, excludeArchived]) => selectAllRows(() => {
      let query = supabase.from(table).select('*').eq(parent, id)
      if (excludeArchived) query = query.neq('status', 'archived')
      return query
    }, { tieBreaker })),
  ])
  const data = { entity, brotherhood: checked(brotherhoodResult) }
  specs.forEach(([key], i) => { data[key] = checked(collections[i]) || [] })
  const assetIds = data.assets.map((row) => row.entity_id)
  data.contributions = checked(await selectRowsByIds(assetIds, (ids) => selectAllRows(() => supabase.from('heritage_interventions').select('*').in('target_entity_id', ids)))) || []
  const relatedIds = [...assetIds, ...data.images.map((row) => row.image_entity_id), ...data.steps.map((row) => row.step_entity_id), ...data.contributions.map((row) => row.agent_entity_id)]
  data.relatedEntities = checked(await selectRowsByIds(relatedIds, (ids) => supabase.from('entities').select('id,name,summary,status').in('id', ids))) || []
  return data
}
