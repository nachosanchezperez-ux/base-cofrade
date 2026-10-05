function timeValue(value = '') {
  if (!value) return 0
  const parsed = Date.parse(`${String(value).slice(0, 10)}T00:00:00Z`)
  return Number.isFinite(parsed) ? parsed : 0
}

export function mapEditorialCuriosities(contentRows = [], linkRows = []) {
  const linkByContent = new Map()

  for (const link of linkRows) {
    if (!link?.editorial_content_id) continue
    const current = linkByContent.get(link.editorial_content_id)
    if (!current || (!current.is_primary && link.is_primary)) {
      linkByContent.set(link.editorial_content_id, link)
    }
  }

  return contentRows
    .filter((item) => item?.id && item.content_type === 'curiosity')
    .filter((item) => String(item.title || '').trim())
    .filter((item) => String(item.body || item.summary || '').trim())
    .map((item) => ({
      id: item.id,
      titulo: String(item.title).trim(),
      texto: String(item.body || item.summary).trim(),
      categoria: String(item.subtitle || 'Curiosidad documentada').trim(),
      fecha: item.publish_date || '',
      relacion: linkByContent.get(item.id)?.relation_type || '',
      principal: Boolean(linkByContent.get(item.id)?.is_primary),
    }))
    .sort((first, second) => (
      Number(second.principal) - Number(first.principal)
      || timeValue(second.fecha) - timeValue(first.fecha)
      || first.titulo.localeCompare(second.titulo, 'es')
    ))
}


function guideTimestamp(value = '') {
  if (!value) return 0
  const parsed = Date.parse(String(value))
  return Number.isFinite(parsed) ? parsed : 0
}

export function mapEditorialGuides(
  contentRows = [],
  linkRows = [],
  entityRows = [],
  brotherhoodId = ''
) {
  const entityById = new Map(entityRows.map((entity) => [entity.id, entity]))
  const linksByContent = new Map()

  for (const link of linkRows) {
    if (!link?.editorial_content_id) continue
    const items = linksByContent.get(link.editorial_content_id) || []
    items.push(link)
    linksByContent.set(link.editorial_content_id, items)
  }

  return contentRows
    .filter((item) => item?.id && item.content_type === 'article')
    .filter((item) => String(item.title || '').trim())
    .filter((item) => String(item.body || item.summary || '').trim())
    .map((item) => {
      const links = linksByContent.get(item.id) || []
      const guideLink = links.find((link) => (
        link.entity_id === brotherhoodId
        && link.relation_type === 'brotherhood_guide'
      ))
      if (!guideLink) return null

      const relatedEntities = links
        .filter((link) => link.entity_id && link.entity_id !== brotherhoodId)
        .map((link) => {
          const entity = entityById.get(link.entity_id)
          if (!entity?.slug || entity.status !== 'published') return null
          return {
            id: entity.id,
            name: entity.name,
            slug: entity.slug,
            entityType: entity.entity_type,
            relationType: link.relation_type || 'related',
            isPrimary: Boolean(link.is_primary),
          }
        })
        .filter(Boolean)
        .sort((first, second) => (
          Number(second.isPrimary) - Number(first.isPrimary)
          || first.name.localeCompare(second.name, 'es')
        ))

      return {
        id: item.id,
        title: String(item.title).trim(),
        subtitle: String(item.subtitle || '').trim(),
        summary: String(item.summary || '').trim(),
        body: String(item.body || '').trim(),
        publishDate: item.publish_date || '',
        authorName: String(item.author_name || '').trim(),
        principal: Boolean(guideLink.is_primary),
        relatedEntities,
        createdAt: item.created_at || '',
      }
    })
    .filter(Boolean)
    .sort((first, second) => (
      Number(second.principal) - Number(first.principal)
      || guideTimestamp(second.publishDate || second.createdAt) - guideTimestamp(first.publishDate || first.createdAt)
      || first.title.localeCompare(second.title, 'es')
    ))
}
