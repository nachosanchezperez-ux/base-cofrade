import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const RECOVERY_COOKIE = 'hc-password-recovery'

function invalidRecoveryRedirect(request) {
  const url = request.nextUrl.clone()
  url.pathname = '/panel/login'
  url.search = ''
  url.searchParams.set('recovery', 'invalid')
  return NextResponse.redirect(url)
}

export async function GET(request) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) return invalidRecoveryRedirect(request)

  const supabase = await createClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  if (exchangeError) return invalidRecoveryRedirect(request)

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return invalidRecoveryRedirect(request)

  const { data: profile, error: profileError } = await supabase
    .from('panel_users')
    .select('active')
    .eq('user_id', user.id)
    .maybeSingle()

  if (profileError || !profile?.active) {
    await supabase.auth.signOut()
    return invalidRecoveryRedirect(request)
  }

  const url = request.nextUrl.clone()
  url.pathname = '/panel/restablecer-contrasena'
  url.search = ''

  const response = NextResponse.redirect(url)
  response.cookies.set(RECOVERY_COOKIE, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/panel/restablecer-contrasena',
    maxAge: 15 * 60,
  })
  return response
}
