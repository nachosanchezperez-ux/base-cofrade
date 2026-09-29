import 'server-only'

import {
  mapEditorialCuriosities,
  mapEditorialGuides,
} from '@/lib/brotherhood-editorial-content'
import { createPublicClient } from '@/lib/supabase/public'

export async function enrichBrotherhoodEditorialSections(brotherhood) {
  if (!brotherhood?.id) return brotherhood

  const supabase = createPublicClient()
  const brotherhoodLinksResult = await supabase
    .from('editorial_content_links')
    .select('id, editorial_content_id, entity_id, relation_type, is_primary')
    .eq('entity_id', brotherhood.id)

  if (brotherhoodLinksResult.error) {
    throw new Error(`No se pudieron consultar las relaciones editoriales: ${brotherhoodLinksResult.error.message}`)
  }

  const brotherhoodLinks = brotherhoodLinksResult.data || []
  const contentIds = [...new Set(
    brotherhoodLinks.map((item) => item.editorial_content_id).filter(Boolean)
  )]

  if (!contentIds.length) {
    return {
      ...brotherhood,
      curiosidades: [],
      editorialGuide: null,
    }
  }

  const [contentResult, contentLinksResult] = await Promise.all([
    supabase
      .from('editorial_content')
      .select('id, content_type, title, subtitle, summary, body, publish_date, author_name, created_at, status')
      .in('id', contentIds)
      .in('content_type', ['curiosity', 'article'])
      .eq('status', 'published'),
    supabase
      .from('editorial_content_links')
      .select('id, editorial_content_id, entity_id, relation_type, is_primary')
      .in('editorial_content_id', contentIds),
  ])

  if (contentResult.error) {
    throw new Error(`No se pudo consultar el contenido editorial publicado: ${contentResult.error.message}`)
  }
  if (contentLinksResult.error) {
    throw new Error(`No se pudieron consultar las relaciones del contenido editorial: ${contentLinksResult.error.message}`)
  }

  const allLinks = contentLinksResult.data || []
  const relatedEntityIds = [...new Set(
    allLinks
      .map((item) => item.entity_id)
      .filter((id) => id && id !== brotherhood.id)
  )]

  const entitiesResult = relatedEntityIds.length
    ? await supabase
        .from('entities')
        .select('id, name, slug, entity_type, status')
        .in('id', relatedEntityIds)
        .eq('status', 'published')
    : { data: [], error: null }

  if (entitiesResult.error) {
    throw new Error(`No se pudieron resolver las entidades relacionadas del contenido editorial: ${entitiesResult.error.message}`)
  }

  const contentRows = contentResult.data || []
  const guides = mapEditorialGuides(
    contentRows,
    allLinks,
    entitiesResult.data || [],
    brotherhood.id
  )

  return {
    ...brotherhood,
    curiosidades: mapEditorialCuriosities(contentRows, brotherhoodLinks),
    editorialGuide: guides[0] || null,
  }
}
