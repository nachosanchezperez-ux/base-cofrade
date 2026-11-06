import 'server-only'
import { unstable_cache } from 'next/cache'
import { createPublicClient } from '@/lib/supabase/public'

// Escudos de bandas por slug, para pintarlos junto a su nombre (acompañamiento
// actual, «Tira del hilo»). Una sola consulta por ficha; si falla, sin escudos.
async function loadBandLogosBySlug(slugs = []) {
  const unique = [...new Set(slugs.filter(Boolean))].sort()
  if (!unique.length) return {}
  const supabase = createPublicClient()
  const { data: entities, error } = await supabase
    .from('entities')
    .select('id, slug')
    .eq('entity_type', 'band')
    .eq('status', 'published')
    .in('slug', unique)
  if (error || !entities?.length) return {}
  const { data: bands, error: bandsError } = await supabase
    .from('bands')
    .select('entity_id, logo_path, logo_background_color')
    .in('entity_id', entities.map((entity) => entity.id))
  if (bandsError) return {}
  const slugById = new Map(entities.map((entity) => [entity.id, entity.slug]))
  return Object.fromEntries((bands || [])
    .filter((band) => band.logo_path)
    .map((band) => [slugById.get(band.entity_id), { logoPath: band.logo_path, background: band.logo_background_color || '' }]))
}

const cachedBandLogos = unstable_cache(
  (key) => loadBandLogosBySlug(key.split('|')),
  ['hilo-cofrade-band-logos-by-slug-v1'],
  { revalidate: 3600, tags: ['public-band-detail'] }
)

export async function getBandLogosBySlug(slugs = []) {
  const key = [...new Set(slugs.filter(Boolean))].sort().join('|')
  if (!key) return {}
  return cachedBandLogos(key).catch(() => ({}))
}
