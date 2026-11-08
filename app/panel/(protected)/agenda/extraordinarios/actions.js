'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { revalidateAgendaPhotos } from '@/lib/panel/revalidate-agenda'
import { extraordinaryKindLabel, normalizeExtraordinaryKind } from '@/lib/agenda-extraordinary'
import { createClient } from '@/lib/supabase/server'

const UUID = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const TABLES = {
  outing: { table: 'outings', objectType: 'outing', brotherhood: async (supabase, row) => row.brotherhood_entity_id, select: 'id, title, brotherhood_entity_id, extraordinary_kind' },
  occurrence: {
    table: 'cult_occurrences',
    objectType: 'cult_occurrence',
    select: 'id, cult_id, title_override, extraordinary_kind',
    brotherhood: async (supabase, row) => {
      const cult = await supabase.from('cults').select('brotherhood_entity_id').eq('id', row.cult_id).maybeSingle()
      return cult.data?.brotherhood_entity_id || ''
    },
  },
}

function back(params = {}) {
  const search = new URLSearchParams(params)
  redirect(`/panel/agenda/extraordinarios${search.size ? `?${search}` : ''}`)
}

// Marca (o retira) un acto como extraordinario. Solo cambia esa columna del
// acto elegido; queda en el registro de auditoría.
export async function setExtraordinaryKindAction(formData) {
  const user = await requirePanelEditor()
  const target = TABLES[String(formData.get('table') || '')]
  const id = String(formData.get('id') || '')
  const rawKind = String(formData.get('kind') || '')
  const kind = normalizeExtraordinaryKind(rawKind)
  const returnTo = { q: String(formData.get('q') || '').slice(0, 80) }
  if (!returnTo.q) delete returnTo.q

  if (!target || !UUID.test(id)) back({ ...returnTo, error: 'Acto no válido.' })
  if (rawKind && !kind) back({ ...returnTo, error: 'Tipo de acto extraordinario no válido.' })

  const supabase = await createClient()
  const current = await supabase.from(target.table).select(target.select).eq('id', id).maybeSingle()
  if (current.error || !current.data) back({ ...returnTo, error: 'No se encontró el acto.' })
  const previous = normalizeExtraordinaryKind(current.data.extraordinary_kind)
  if (previous === kind) back({ ...returnTo, guardado: '1' })

  const updated = await supabase.from(target.table).update({ extraordinary_kind: kind || null }).eq('id', id).select('id').maybeSingle()
  if (updated.error || !updated.data) back({ ...returnTo, error: `No se pudo guardar la marca${updated.error ? `: ${updated.error.message}` : '.'}` })

  const audit = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: 'update',
    object_type: target.objectType,
    object_id: id,
    summary: kind ? `Acto extraordinario: ${extraordinaryKindLabel(kind)}` : 'Acto extraordinario retirado',
    changed_fields: { extraordinary_kind: { from: previous || null, to: kind || null } },
  })
  if (audit.error) console.error('[Hilo Cofrade] No se pudo auditar la marca de acto extraordinario', audit.error)

  revalidateAgendaPhotos()
  const brotherhoodId = await target.brotherhood(supabase, current.data)
  if (brotherhoodId) {
    const entity = await supabase.from('entities').select('slug').eq('id', brotherhoodId).maybeSingle()
    if (entity.data?.slug) revalidatePath(`/hermandades/${entity.data.slug}`)
  }
  revalidatePath('/panel/agenda/extraordinarios')
  back({ ...returnTo, guardado: '1' })
}
