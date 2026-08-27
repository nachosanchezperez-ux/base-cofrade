export function filterPublicPageEntities(entities = [], publicProfiles = []) {
  const readySlugs = new Set(publicProfiles.map((profile) => profile.slug).filter(Boolean))
  return entities.filter((entity) => readySlugs.has(entity.slug))
}

export function isPublicEntityPageReady(entity, profile) {
  return entity?.status === 'published' && Boolean(entity.slug) && Boolean(profile)
}
