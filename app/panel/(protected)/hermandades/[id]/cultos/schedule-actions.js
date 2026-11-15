'use server'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import { scheduleChangePayload } from '@/lib/panel/schedule-change-core'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveCultScheduleAction(form) {
  await requirePanelEditor()
  const supabase = await createClient()
  const id = String(form.get('occurrence_id') || '')
  const brotherhoodId = String(form.get('brotherhood_id') || '')
  const result = await supabase.from('cult_occurrences').select('*, cults!inner(brotherhood_entity_id)').eq('id', id).eq('cults.brotherhood_entity_id', brotherhoodId).single()
  if (result.error || !result.data) throw new Error('No se pudo cargar la edición de culto de esta hermandad.')
  const previous = result.data
  const date = String(form.get('start_date') || '')
  const end = String(form.get('end_date') || '')
  const status = String(form.get('event_status') || '')
  const valid = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value
  if (!valid(date) || (end && (!valid(end) || end < date))) throw new Error('Revisa el intervalo de fechas del culto.')
  const payload = { ...scheduleChangePayload(form, previous, date, status, 'start_date'), start_date: date, end_date: end || null, event_status: status }
  const saved = await supabase.from('cult_occurrences').update(payload).eq('id', id).eq('updated_at', previous.updated_at).select('id').single()
  if (saved.error) throw new Error(`No se guardó el cambio; recarga y revisa la edición: ${saved.error.message}`)
  revalidatePath('/agenda-cofrade', 'layout')
  revalidatePath('/hermandades', 'layout')
  revalidatePath('/calendario', 'layout')
  revalidatePath(`/panel/hermandades/${brotherhoodId}/cultos`)
  revalidatePath('/')
  revalidateTag('public-brotherhood-detail', { expire: 0 })
  revalidateTag('home-public', { expire: 0 })
  redirect(`/panel/hermandades/${brotherhoodId}/cultos?saved=schedule`)
}
