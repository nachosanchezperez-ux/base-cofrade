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
