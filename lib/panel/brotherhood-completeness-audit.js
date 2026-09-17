import 'server-only'

import { createClient } from '@/lib/supabase/server'

export const BROTHERHOOD_COMPLETENESS_SIGNALS = [
  ['identity', 'Identidad'],
  ['crest', 'Escudo'],
  ['canonical_see', 'Sede canónica'],
  ['procession_day', 'Jornada procesional'],
  ['images', 'Imágenes'],
  ['steps', 'Pasos'],
  ['cults', 'Cultos'],
  ['outings', 'Salidas'],
  ['music', 'Música'],
  ['sources', 'Fuentes'],
]

export function brotherhoodMissingSignals(row = {}) {
  return BROTHERHOOD_COMPLETENESS_SIGNALS
    .filter(([key]) => row[key] !== true)
    .map(([key, label]) => ({ key, label }))
}

export function prepareBrotherhoodCompletenessAudit(rows = [], entities = [], limit = 20) {
  const entityById = new Map(entities.map((entity) => [entity.id, entity]))
  const published = rows
    .map((row) => ({ row, entity: entityById.get(row.entity_id) }))
    .filter(({ entity }) => entity?.status === 'published')
    .map(({ row, entity }) => ({
      entityId: row.entity_id,
      name: entity.name,
      slug: entity.slug || '',
      completionPercentage: Number(row.completion_percentage || 0),
      missing: brotherhoodMissingSignals(row),
      editHref: `/panel/hermandades/${row.entity_id}`,
      publicHref: entity.slug ? `/hermandades/${entity.slug}` : '',
    }))
    .sort((a, b) => a.completionPercentage - b.completionPercentage || a.name.localeCompare(b.name, 'es'))

  const incomplete = published.filter((item) => item.completionPercentage < 100)
  const average = published.length
    ? published.reduce((total, item) => total + item.completionPercentage, 0) / published.length
    : 0

  return {
    total: published.length,
    complete: published.length - incomplete.length,
    incomplete: incomplete.length,
    averageCompletion: Math.round(average * 10) / 10,
    minimumCompletion: published.length ? published[0].completionPercentage : 0,
    items: incomplete.slice(0, Math.max(0, limit)),
  }
}

export async function getPanelBrotherhoodCompletenessAudit({ limit = 20 } = {}) {
  const supabase = await createClient()
  const [completenessResult, entitiesResult] = await Promise.all([
    supabase
      .from('brotherhood_completeness')
      .select('entity_id, completion_percentage, identity, crest, canonical_see, procession_day, images, steps, cults, outings, music, sources'),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'brotherhood')
      .neq('status', 'archived'),
  ])

  if (completenessResult.error) throw new Error(`No se pudo cargar la completitud de Hermandades: ${completenessResult.error.message}`)
  if (entitiesResult.error) throw new Error(`No se pudieron cargar las Hermandades de la auditoría: ${entitiesResult.error.message}`)

  return prepareBrotherhoodCompletenessAudit(completenessResult.data || [], entitiesResult.data || [], limit)
}
