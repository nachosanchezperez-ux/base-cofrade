import 'server-only'

import { mapEditorialCuriosities } from '@/lib/brotherhood-editorial-content'
import { createPublicClient } from '@/lib/supabase/public'

export async function enrichBrotherhoodEditorialSections(brotherhood) {
  if (!brotherhood?.id) return brotherhood

  const supabase = createPublicClient()
  const linksResult = await supabase
    .from('editorial_content_links')
    .select('id, editorial_content_id, relation_type, is_primary')
    .eq('entity_id', brotherhood.id)

  if (linksResult.error) {
    throw new Error(`No se pudieron consultar las relaciones editoriales: ${linksResult.error.message}`)
  }

  const links = linksResult.data || []
  const contentIds = [...new Set(links.map((item) => item.editorial_content_id).filter(Boolean))]

  if (!contentIds.length) {
    return { ...brotherhood, curiosidades: [] }
  }

  const contentResult = await supabase
    .from('editorial_content')
    .select('id, content_type, title, subtitle, summary, body, publish_date, status')
    .in('id', contentIds)
    .eq('content_type', 'curiosity')
    .eq('status', 'published')

  if (contentResult.error) {
    throw new Error(`No se pudieron consultar las curiosidades publicadas: ${contentResult.error.message}`)
  }

  return {
    ...brotherhood,
    curiosidades: mapEditorialCuriosities(contentResult.data || [], links),
  }
}
