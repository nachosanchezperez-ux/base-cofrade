import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function getPanelUser() {
  const supabase = await createClient()
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub

  if (claimsError || !userId) return null

  const { data: profile, error: profileError } = await supabase
    .from('panel_users')
    .select('user_id, display_name, role, active')
    .eq('user_id', userId)
    .maybeSingle()

  if (profileError) {
    console.error('[Hilo Cofrade] No se pudo cargar el perfil del panel', profileError)
    return null
  }

  if (!profile?.active) return null

  return {
    id: userId,
    email: claimsData.claims.email || '',
    name: profile.display_name,
    role: profile.role,
  }
}

export async function requirePanelUser() {
  const user = await getPanelUser()
  if (!user) redirect('/panel/login')
  return user
}

export async function requirePanelEditor() {
  const user = await requirePanelUser()
  if (!['admin', 'editor'].includes(user.role)) {
    throw new Error('Tu perfil puede consultar el panel, pero no modificar este contenido.')
  }
  return user
}

export async function requirePanelAdmin() {
  const user = await requirePanelUser()
  if (user.role !== 'admin') {
    throw new Error('Esta acción está reservada al perfil administrador.')
  }
  return user
}
