import 'server-only'
import { unstable_cache } from 'next/cache'
import { buildHiloMovements } from '@/lib/hilo-movements'
import { editorialNewsToMovements } from '@/lib/hilo-movements-editorial'
import { createPublicClient } from '@/lib/supabase/public'
import { getPublishedBrotherhoodCrestPath } from '@/lib/supabase/brotherhood-public-authority'
import { getPublishedEntityCoverMediaMap } from '@/lib/supabase/entity-media'

const NEWS_COLUMNS = 'id, content_type, status, slug, title, summary, body, publish_date, announced_on, news_topic, news_kind, municipality_id, effective_label, discover_label, discover_href, event_date, subject_label, subject_kind'

// Noticias publicadas desde el Panel. La política pública de editorial_content ya
// oculta lo que está en borrador o programado a una fecha futura.
async function loadPanelNews(supabase) {
  const contentsResult = await supabase.from('editorial_content').select(NEWS_COLUMNS).eq('content_type', 'news').eq('status', 'published').not('slug', 'is', null)
  if (contentsResult.error) throw new Error('No se pudieron consultar las noticias del Panel')
  const contents = contentsResult.data || []
  if (!contents.length) return { contents, links: [], sources: [], municipalities: [] }
  const ids = contents.map((row) => row.id)
  const municipalityIds = [...new Set(contents.map((row) => row.municipality_id).filter(Boolean))]
  const [linksResult, sourceLinksResult, municipalitiesResult] = await Promise.all([
    supabase.from('editorial_content_links').select('editorial_content_id, entity_id, relation_type, is_primary, notes').in('editorial_content_id', ids),
    supabase.from('source_links').select('editorial_content_id, source_id').in('editorial_content_id', ids),
    municipalityIds.length ? supabase.from('municipalities').select('id, name').in('id', municipalityIds) : Promise.resolve({ data: [] }),
  ])
  if (linksResult.error || sourceLinksResult.error || municipalitiesResult.error) throw new Error('No se pudieron consultar las relaciones de las noticias del Panel')
  const sourceIds = [...new Set((sourceLinksResult.data || []).map((row) => row.source_id).filter(Boolean))]
  const sourcesResult = sourceIds.length ? await supabase.from('sources').select('id, name, url').in('id', sourceIds) : { data: [] }
  if (sourcesResult.error) throw new Error('No se pudieron consultar las fuentes de las noticias del Panel')
  const sourceById = new Map((sourcesResult.data || []).map((row) => [row.id, row]))
  const sources = (sourceLinksResult.data || []).flatMap((link) => {
    const source = sourceById.get(link.source_id)
    return source?.url ? [{ editorial_content_id: link.editorial_content_id, label: source.name, href: source.url }] : []
  })
  return { contents, links: linksResult.data || [], sources, municipalities: municipalitiesResult.data || [] }
}

async function loadHiloMovementData() {
  const supabase = createPublicClient()
  // Todas las noticias viven en el Panel. Si la lectura falla, el error sube:
  // la caché no guarda un índice vacío y la página muestra su aviso.
  const panel = await loadPanelNews(supabase)
  const ids = [...new Set(panel.links.map((link) => link.entity_id).filter(Boolean))]
  if (!ids.length) return { panel, entities: [], crests: {}, covers: {} }
  const { data, error } = await supabase.from('entities').select('id, name, slug, entity_type, status').in('id', ids).eq('status', 'published')
  if (error) throw new Error('No se pudieron consultar los protagonistas de El Hilo se mueve')
  const entities = data || []
  const roots = entities.filter((entity) => entity.entity_type === 'brotherhood')
  const bandIds = entities.filter((entity) => entity.entity_type === 'band').map((entity) => entity.id)
  const protagonistIds = [...roots.map((root) => root.id), ...bandIds]
  const entityTypesById = Object.fromEntries(entities.map((entity) => [entity.id, entity.entity_type]))
  const [paths, bands, coverMap] = await Promise.all([
    Promise.all(roots.map((root) => getPublishedBrotherhoodCrestPath(root.id))),
    bandIds.length ? supabase.from('bands').select('entity_id, logo_path').in('entity_id', bandIds) : { data: [] },
    // Foto de cabecera de la ficha del protagonista: imagen de la noticia cuando
    // no tiene una propia. Solo fotos con derechos públicos (entity-media).
    getPublishedEntityCoverMediaMap(protagonistIds, { entityTypesById }),
  ])
  const covers = Object.fromEntries([...coverMap].map(([id, media]) => [id, {
    path: media.path || '', alt: media.alt || '', credit: media.credit || '', width: media.width || null, height: media.height || null, focusPosition: media.focusPosition || '50% 50%',
  }]).filter(([, media]) => media.path))
  return { panel, entities, covers, crests: Object.fromEntries([
    ...roots.map((root, index) => [root.id, paths[index] || '']),
    ...(bands.data || []).map((band) => [band.entity_id, band.logo_path || '']),
  ]) }
}

// Reuses the public invalidation channel, never a privileged client. Las acciones
// del Panel de noticias invalidan esta misma etiqueta.
const getHiloMovementData = unstable_cache(loadHiloMovementData, ['hilo-editorial-movements-v4'], { revalidate: 60, tags: ['public-platform-updates'] })

export async function getPublicHiloMovements() {
  const { panel, entities, crests, covers = {} } = await getHiloMovementData()
  const records = editorialNewsToMovements({ ...panel, entities })
  // Date gates are outside the data cache. A refresh does not date a story.
  return buildHiloMovements(records, entities).map((item) => ({ ...item, crestPath: crests[item.protagonist?.id] || '', cover: covers[item.protagonist?.id] || null }))
}
