export function filterPublicPageEntities(entities = [], publicProfiles = []) {
  const readyIds = new Set(
    publicProfiles.map((profile) => profile.entity_id || profile.id).filter(Boolean)
  )
  return entities.filter((entity) => readyIds.has(entity.id))
}

export function isPublicEntityPageReady(entity, profile) {
  return entity?.status === 'published' && Boolean(entity.slug) && Boolean(profile)
}
