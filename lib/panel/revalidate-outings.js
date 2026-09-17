import 'server-only'

import { revalidatePath } from 'next/cache'

function unique(values = []) {
  return [...new Set(values.filter(Boolean))]
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
}

function slugify(value) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function publicSurface(outing) {
  if (outing?.character === 'extraordinary') return 'extraordinary'
  if (outing?.character === 'ordinary' && normalize(outing.outing_type).includes('procesion de gloria')) return 'glory'
  return ''
}

export async function revalidateOutingPages(supabase, outingIds = [], previousOutings = []) {
  const ids = unique(outingIds)
  let currentOutings = []

  if (ids.length) {
    const result = await supabase
      .from('outings')
      .select('id, slug, brotherhood_entity_id, character, outing_type, title, outing_date')
      .in('id', ids)

    if (result.error) {
      console.error('[Hilo Cofrade] No se pudieron invalidar las fichas de salidas', result.error)
    } else {
      currentOutings = result.data || []
    }
  }

  let hasExtraordinary = false
  let hasGlory = false
  const outings = [...previousOutings, ...currentOutings]
  const brotherhoodIds = unique(outings.map((outing) => outing.brotherhood_entity_id))
  let brotherhoodSlugById = new Map()

  if (brotherhoodIds.length) {
    const result = await supabase
      .from('entities')
      .select('id, slug')
      .eq('entity_type', 'brotherhood')
      .in('id', brotherhoodIds)

    if (result.error) {
      console.error('[Hilo Cofrade] No se pudieron resolver las URLs de las Glorias', result.error)
    } else {
      brotherhoodSlugById = new Map((result.data || []).map((entity) => [entity.id, entity.slug || '']))
    }
  }

  for (const outing of outings) {
    const surface = publicSurface(outing)
    if (surface === 'extraordinary') {
      hasExtraordinary = true
      if (outing.slug) revalidatePath(`/extraordinarias/${outing.slug}`)
    }
    if (surface === 'glory') {
      hasGlory = true
      const fallbackBase = [
        brotherhoodSlugById.get(outing.brotherhood_entity_id) || outing.title || 'procesion-de-gloria',
        outing.outing_date,
      ].filter(Boolean).join('-')
      const slug = outing.slug || slugify(fallbackBase) || `procesion-de-gloria-${String(outing.id || '').slice(0, 8)}`
      revalidatePath(`/procesiones-de-gloria/${slug}`)
    }
  }

  if (hasExtraordinary) revalidatePath('/extraordinarias')
  if (hasGlory) revalidatePath('/procesiones-de-gloria')
  if (hasExtraordinary || hasGlory) revalidatePath('/agenda-cofrade')
}
