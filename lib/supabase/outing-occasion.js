// Jornada extraordinaria de una salida: si la Hermandad tiene ese mismo día un
// acontecimiento histórico (una Coronación, un aniversario…), se reúnen las
// piezas de patrimonio y las marchas enlazadas a él con la relación
// «commemorates». Solo datos publicados; sin acontecimiento o sin piezas
// enlazadas, no hay nada que destacar (null).

const PUBLISHED = 'published'

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

// «23 de octubre de 2026, Real Parroquia…» → común a todas las marchas o vacío.
export function sharedPremiere(marches = []) {
  const texts = [...new Set(marches.map((march) => march.premiere).filter(Boolean))]
  return texts.length === 1 && marches.every((march) => march.premiere) ? texts[0] : ''
}

// Créditos de una pieza agrupados por disciplina, en el orden en que llegan:
// «Orfebrería: Joaquín Ossorio».
export function pieceCredits(interventions = [], agentNameById = new Map()) {
  const byDiscipline = new Map()
  for (const row of interventions) {
    const name = agentNameById.get(row.agent_entity_id)
    if (!name) continue
    const discipline = row.discipline || 'Intervención'
    if (!byDiscipline.has(discipline)) byDiscipline.set(discipline, [])
    if (!byDiscipline.get(discipline).includes(name)) byDiscipline.get(discipline).push(name)
  }
  return [...byDiscipline].map(([discipline, names]) => ({ discipline, names }))
}

export async function loadOutingOccasion(supabase, { brotherhoodId, date, brotherhoodHref = '' } = {}) {
  if (!brotherhoodId || !date) return null

  const events = rows(
    await supabase
      .from('events')
      .select('entity_id, event_type')
      .eq('brotherhood_entity_id', brotherhoodId)
      .eq('event_date', date)
      .eq('event_category', 'historical'),
    'No se pudo consultar el acontecimiento de la salida'
  )
  if (!events.length) return null
  const eventIds = events.map((event) => event.entity_id)

  const [eventEntities, relations] = await Promise.all([
    supabase.from('entities').select('id, name, status').in('id', eventIds).eq('status', PUBLISHED),
    supabase
      .from('entity_relations')
      .select('source_entity_id, target_entity_id')
      .eq('relation_type', 'commemorates')
      .eq('status', PUBLISHED)
      .in('target_entity_id', eventIds),
  ]).then(([entitiesResult, relationsResult]) => [
    rows(entitiesResult, 'No se pudo consultar el acontecimiento de la salida'),
    rows(relationsResult, 'No se pudieron consultar las piezas del acontecimiento'),
  ])

  const event = eventEntities.find((entity) => relations.some((relation) => relation.target_entity_id === entity.id))
  if (!event) return null
  const ids = [...new Set(relations.filter((relation) => relation.target_entity_id === event.id).map((relation) => relation.source_entity_id))]

  const [entities, assets, marches, interventions, authors] = await Promise.all([
    supabase.from('entities').select('id, name, slug, entity_type, status').in('id', ids).eq('status', PUBLISHED),
    supabase.from('heritage_assets').select('entity_id, asset_type, date_from_text, description, materials, display_order, public_image_path, public_image_alt, public_image_credit').in('entity_id', ids),
    supabase.from('marches').select('entity_id, premiere_date_text, premiered_by_band_entity_id').in('entity_id', ids),
    supabase.from('heritage_interventions').select('target_entity_id, discipline, agent_entity_id').in('target_entity_id', ids).eq('status', PUBLISHED),
    supabase.from('march_authors').select('march_entity_id, agent_entity_id').in('march_entity_id', ids).eq('status', PUBLISHED),
  ]).then((results) => results.map((result) => rows(result, 'No se pudieron consultar las piezas del acontecimiento')))

  const entityById = new Map(entities.map((entity) => [entity.id, entity]))
  const agentIds = [...new Set([
    ...interventions.map((row) => row.agent_entity_id),
    ...authors.map((row) => row.agent_entity_id),
    ...marches.map((row) => row.premiered_by_band_entity_id),
  ].filter(Boolean))]
  const agents = agentIds.length
    ? rows(await supabase.from('entities').select('id, name, slug, entity_type, status').in('id', agentIds).eq('status', PUBLISHED), 'No se pudieron consultar los autores')
    : []
  const agentById = new Map(agents.map((agent) => [agent.id, agent]))
  const agentNameById = new Map(agents.map((agent) => [agent.id, agent.name]))

  const pieces = assets
    .filter((asset) => entityById.has(asset.entity_id))
    .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    .map((asset) => ({
      id: asset.entity_id,
      name: entityById.get(asset.entity_id).name,
      type: asset.asset_type || '',
      date: asset.date_from_text || '',
      description: asset.description || '',
      materials: asset.materials || '',
      // Foto subida desde el panel (opcional).
      image: asset.public_image_path
        ? { src: asset.public_image_path, alt: asset.public_image_alt || entityById.get(asset.entity_id).name, credit: asset.public_image_credit || '' }
        : null,
      credits: pieceCredits(interventions.filter((row) => row.target_entity_id === asset.entity_id), agentNameById),
      href: brotherhoodHref ? `${brotherhoodHref}#patrimonio` : '',
    }))

  const marchList = marches
    .filter((march) => entityById.has(march.entity_id))
    .map((march) => {
      const entity = entityById.get(march.entity_id)
      const band = agentById.get(march.premiered_by_band_entity_id) || null
      return {
        id: march.entity_id,
        name: entity.name,
        href: entity.slug ? `/marchas/${entity.slug}` : '',
        composers: authors.filter((row) => row.march_entity_id === march.entity_id).map((row) => agentNameById.get(row.agent_entity_id)).filter(Boolean),
        premiere: march.premiere_date_text || '',
        bandId: band?.id || '',
        bandName: band?.name || '',
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'es'))

  if (!pieces.length && !marchList.length) return null
  return {
    id: event.id,
    name: event.name,
    type: events.find((row) => row.entity_id === event.id)?.event_type || '',
    pieces,
    marches: marchList,
  }
}
