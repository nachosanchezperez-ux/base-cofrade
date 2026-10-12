'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import { parseHomeFeaturedInput } from '@/lib/home-featured-form'

function value(formData, name) { return String(formData.get(name) || '').trim() }

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar el cambio de destacado', error)
}

async function refreshHome() {
  updateTag('home-public')
  revalidatePath('/panel/hoy')
  revalidatePath('/panel/hoy/destacados')
  revalidatePath('/')
}

// RLS puede rechazar una actualización sin devolver error (0 filas). Se exige
// que la fila vuelva para no informar de un guardado que no ha ocurrido.
function assertUpdated(result, message) {
  if (result.error) throw new Error(`${message}: ${result.error.message}`)
  if (!result.data?.length) throw new Error(`${message}: tu perfil no puede modificar esta salida o ya no existe.`)
  return result.data[0]
}

export async function saveHomeFeaturedAction(formData) {
  const user = await requirePanelEditor()
  const input = parseHomeFeaturedInput({
    outingId: value(formData, 'outing_id'),
    startsOn: value(formData, 'starts_on'),
    endsOn: value(formData, 'ends_on'),
    priority: value(formData, 'priority'),
  })
  const supabase = await createClient()

  const outing = await supabase.from('outings').select('id, title, status').eq('id', input.outingId).maybeSingle()
  if (outing.error || !outing.data) throw new Error('La salida seleccionada no existe.')
  if (outing.data.status !== 'published') throw new Error('Solo se pueden destacar salidas publicadas.')

  const updated = assertUpdated(
    await supabase
      .from('outings')
      .update({
        home_featured_starts_on: input.startsOn,
        home_featured_ends_on: input.endsOn,
        home_featured_priority: input.priority,
      })
      .eq('id', input.outingId)
      .select('id'),
    'No se pudo guardar el destacado'
  )

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'outing',
    object_id: updated.id,
    changed_fields: { home_featured_starts_on: input.startsOn, home_featured_ends_on: input.endsOn, home_featured_priority: input.priority },
    summary: `Destacado en portada del ${input.startsOn} al ${input.endsOn} (prioridad ${input.priority}): ${outing.data.title}`,
  })
  await refreshHome()
  redirect('/panel/hoy/destacados?saved=featured')
}

export async function clearHomeFeaturedAction(formData) {
  const user = await requirePanelEditor()
  const outingId = value(formData, 'outing_id')
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(outingId)) throw new Error('Identificador de salida no válido.')
  const supabase = await createClient()

  const updated = assertUpdated(
    await supabase
      .from('outings')
      .update({ home_featured_starts_on: null, home_featured_ends_on: null, home_featured_priority: 0 })
      .eq('id', outingId)
      .select('id, title'),
    'No se pudo retirar el destacado'
  )

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'outing',
    object_id: updated.id,
    changed_fields: { home_featured_starts_on: null, home_featured_ends_on: null, home_featured_priority: 0 },
    summary: `Destacado retirado de la portada: ${updated.title || updated.id}`,
  })
  await refreshHome()
  redirect('/panel/hoy/destacados?saved=featured-cleared')
}
