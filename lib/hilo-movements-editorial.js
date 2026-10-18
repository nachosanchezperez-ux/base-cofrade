// Noticias del Panel (public.editorial_content, content_type = 'news') en la
// forma que espera buildHiloMovements, que les aplica sus reglas: protagonista
// publicado, fuentes https, fechas válidas y nunca futuras.
// Módulo puro: recibe filas ya leídas y no consulta nada.

export const NEWS_RELATION_PROTAGONIST = 'about'
export const NEWS_RELATION_RELATED = 'related'
export const NEWS_PROTAGONIST_TYPES = ['brotherhood', 'band']

// Tipos de ficha que El Hilo se mueve sabe enlazar (lib/hilo-movements.js).
const RELATION_TYPES = { brotherhood: 'brotherhood', band: 'band', image: 'image', step: 'step', agent: 'author', march: 'march' }

const text = (value) => (typeof value === 'string' ? value.trim() : '')

export function newsRelationType(entityType = '') {
  return RELATION_TYPES[entityType] || ''
}

export function editorialNewsToMovements({ contents = [], links = [], entities = [], municipalities = [], sources = [] } = {}) {
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))
  const municipalityById = new Map(municipalities.map((item) => [item.id, item.name]))
  const linksByContent = new Map()
  for (const link of links) {
    if (!linksByContent.has(link.editorial_content_id)) linksByContent.set(link.editorial_content_id, [])
    linksByContent.get(link.editorial_content_id).push(link)
  }
  const sourcesByContent = new Map()
  for (const source of sources) {
    if (!sourcesByContent.has(source.editorial_content_id)) sourcesByContent.set(source.editorial_content_id, [])
    sourcesByContent.get(source.editorial_content_id).push(source)
  }

  return contents
    .filter((row) => row && row.content_type === 'news' && row.status === 'published' && text(row.slug))
    .map((row) => {
      const rowLinks = linksByContent.get(row.id) || []
      const primary = rowLinks.find((link) => link.is_primary && link.relation_type === NEWS_RELATION_PROTAGONIST && NEWS_PROTAGONIST_TYPES.includes(entityById.get(link.entity_id)?.entity_type))
      const protagonist = primary ? entityById.get(primary.entity_id) : null
      const relations = rowLinks
        .filter((link) => link !== primary && link.relation_type === NEWS_RELATION_RELATED)
        .flatMap((link) => {
          const entity = entityById.get(link.entity_id)
          const type = newsRelationType(entity?.entity_type)
          if (!entity || !type) return []
          return [{ id: entity.id, type, label: text(entity.name), role: text(link.notes) || 'Relacionado' }]
        })
      // Protagonista sin ficha propia (Consejo, Ayuntamiento…): solo si no hay
      // Hermandad o banda protagonista.
      const subjectLabel = text(row.subject_label)
      const subjectKind = text(row.subject_kind)
      const editorialSubject = !protagonist && subjectLabel && subjectKind ? { label: subjectLabel, kind: subjectKind } : null
      const discoverLabel = text(row.discover_label)
      const discoverHref = text(row.discover_href)
      return {
        id: text(row.slug),
        eventKey: `editorial:${row.id}`,
        editorialContentId: row.id,
        status: 'published',
        announcedOn: row.announced_on || null,
        documentedOn: row.publish_date || null,
        eventDate: row.event_date || null,
        featuredUntil: row.featured_until || null,
        topic: text(row.news_topic),
        kind: text(row.news_kind) || 'Noticia',
        municipality: municipalityById.get(row.municipality_id) || '',
        subject: protagonist ? { id: protagonist.id, type: protagonist.entity_type, label: text(protagonist.name) } : null,
        brotherhood: protagonist?.entity_type === 'brotherhood' ? { id: protagonist.id, label: text(protagonist.name), slug: protagonist.slug } : null,
        ...(editorialSubject ? { editorialException: true, editorialSubject } : {}),
        title: text(row.title),
        summary: text(row.summary),
        context: text(row.body),
        effectiveLabel: text(row.effective_label),
        relations,
        discover: discoverLabel && discoverHref ? { label: discoverLabel, href: discoverHref } : null,
        sources: (sourcesByContent.get(row.id) || []).map((source) => ({ label: text(source.label), href: text(source.href) })),
      }
    })
}

// Las noticias del Panel sustituyen a las del código con el mismo identificador,
// para poder migrar una noticia sin duplicarla.
export function mergeHiloMovementRecords(codeRecords = [], panelRecords = []) {
  const panelIds = new Set(panelRecords.map((record) => record.id))
  return [...panelRecords, ...codeRecords.filter((record) => !panelIds.has(record.id))]
}

// Lo que impide publicar una noticia, en el lenguaje del Panel. Coincide con lo
// que exige buildHiloMovements para mostrarla.
export function newsPublicationIssues({ content = {}, protagonist = null, sources = [], today = '' } = {}) {
  const issues = []
  if (!text(content.slug)) issues.push('Falta el identificador (slug).')
  if (!text(content.title)) issues.push('Falta el titular.')
  if (!text(content.summary)) issues.push('Falta la entradilla.')
  if (!text(content.body)) issues.push('Falta el contexto.')
  if (!['musica', 'agenda', 'patrimonio', 'hermandad'].includes(content.news_topic)) issues.push('Falta el tema.')
  if (!content.municipality_id) issues.push('Falta la localidad.')
  if (!content.publish_date) issues.push('Falta la fecha de publicación.')
  if (text(content.subject_kind) && !text(content.subject_label)) issues.push('Falta el nombre del protagonista sin ficha.')
  if (content.announced_on && content.publish_date && content.announced_on > content.publish_date) issues.push('La fecha del anuncio no puede ser posterior a la de publicación.')
  if (today && content.announced_on && content.announced_on > today) issues.push('La fecha del anuncio no puede ser futura.')
  const editorialSubject = text(content.subject_label) && text(content.subject_kind)
  if (!protagonist) {
    if (!editorialSubject) issues.push('Falta la Hermandad o banda protagonista (o, si no tiene ficha, el protagonista sin ficha y su tipo).')
  } else if (!NEWS_PROTAGONIST_TYPES.includes(protagonist.entity_type)) issues.push('El protagonista debe ser una Hermandad o una banda.')
  else if (protagonist.status !== 'published') issues.push('La ficha protagonista no está publicada.')
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(protagonist.slug || '')) issues.push('La ficha protagonista no tiene un enlace público válido.')
  const validSources = sources.filter((source) => {
    try { return text(source.label) && new URL(source.href).protocol === 'https:' } catch { return false }
  })
  if (!validSources.length) issues.push('Falta al menos una fuente con enlace https.')
  return issues
}

// Aviso del Panel: la fecha del acto ya pasó y el texto puede seguir en futuro.
export function newsNeedsTenseReview(content = {}, today = '') {
  return content.status === 'published' && /^\d{4}-\d{2}-\d{2}$/.test(content.event_date || '') && Boolean(today) && content.event_date < today
}
