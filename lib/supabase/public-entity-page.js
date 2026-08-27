export const PUBLIC_ENTITY_PROFILE_TABLES = Object.freeze({
  brotherhood: 'brotherhoods',
  band: 'bands',
  image: 'images',
  step: 'steps',
})

export function filterPublicPageEntities(entities = [], profileRowsByType = {}) {
  const readyIdsByType = new Map(
    Object.entries(profileRowsByType).map(([entityType, rows]) => [
      entityType,
      new Set((rows || []).map((row) => row.entity_id).filter(Boolean)),
    ])
  )

  return entities.filter((entity) => (
    readyIdsByType.get(entity.entity_type)?.has(entity.id) === true
  ))
}

export function isPublicEntityPageReady(entity, profile) {
  return entity?.status === 'published' && Boolean(entity.slug) && Boolean(profile)
}
