'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const RECOVERY_COOKIE = 'hc-password-recovery'
const MIN_PASSWORD_LENGTH = 10

function expireRecoveryCookie(cookieStore) {
  cookieStore.set(RECOVERY_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/panel/restablecer-contrasena',
    maxAge: 0,
  })
}

export async function updateRecoveredPasswordAction(_previousState, formData) {
  const password = String(formData.get('password') || '')
  const confirmation = String(formData.get('password_confirmation') || '')
  const cookieStore = await cookies()

  if (cookieStore.get(RECOVERY_COOKIE)?.value !== '1') {
    return { error: 'El enlace de recuperación no es válido o ha caducado.' }
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.` }
  }
  if (password !== confirmation) {
    return { error: 'Las dos contraseñas no coinciden.' }
  }

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    expireRecoveryCookie(cookieStore)
    return { error: 'La sesión de recuperación ha caducado. Solicita un enlace nuevo.' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('panel_users')
    .select('active')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profileError || !profile?.active) {
    expireRecoveryCookie(cookieStore)
    await supabase.auth.signOut()
    return { error: 'Esta cuenta no tiene acceso activo al Panel.' }
  }

  const { error: updateError } = await supabase.auth.updateUser({ password })
  if (updateError) {
    console.error('[Hilo Cofrade] Falló el cambio de contraseña recuperada', {
      code: updateError.code || null,
      status: updateError.status || null,
      message: updateError.message,
    })
    return { error: 'No hemos podido guardar la nueva contraseña. Solicita otro enlace e inténtalo de nuevo.' }
  }

  expireRecoveryCookie(cookieStore)
  await supabase.auth.signOut({ scope: 'global' })
  redirect('/panel/login?reset=1')
}
