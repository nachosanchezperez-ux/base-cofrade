import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

export async function getExtraordinaryGuideSlugs(slugs = []) {
  const requestedSlugs = unique(slugs.map((slug) => String(slug || '').trim()).filter(Boolean))
  if (!requestedSlugs.length) return new Set()

  const supabase = createPublicClient()
  const result = await supabase
    .from('extraordinary_outings_directory')
    .select('slug')
    .in('slug', requestedSlugs)

  if (result.error) {
    throw new Error(`No se pudo comprobar la disponibilidad de guías extraordinarias: ${result.error.message}`)
  }

  return new Set((result.data || []).map((item) => item.slug).filter(Boolean))
}
