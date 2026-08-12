'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signInAction(_previousState, formData) {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')
  const next = String(formData.get('next') || '/panel')

  if (!email || !password) {
    return { error: 'Escribe tu correo y tu contraseña.' }
  }

  const supabase = await createClient()
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !authData.user?.id) {
    return { error: 'No hemos podido validar esos datos de acceso.' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('panel_users')
    .select('active')
    .eq('user_id', authData.user.id)
    .maybeSingle()

  if (profileError || !profile?.active) {
    await supabase.auth.signOut()
    return { error: 'La cuenta es válida, pero todavía no tiene acceso al panel.' }
  }

  const destination = next.startsWith('/panel') ? next : '/panel'
  redirect(destination)
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/panel/login')
}
