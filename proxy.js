import { updateSession } from '@/lib/supabase/proxy'
import { NextResponse } from 'next/server'

export async function proxy(request) {
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0].trim()
  const requestHost = forwardedHost || request.headers.get('host') || request.nextUrl.hostname
  const hostname = requestHost.split(':')[0]

  if (hostname === 'www.hilocofrade.es') {
    const canonicalUrl = request.nextUrl.clone()
    canonicalUrl.hostname = 'hilocofrade.es'
    canonicalUrl.protocol = 'https:'
    canonicalUrl.port = ''

    return NextResponse.redirect(canonicalUrl, 308)
  }

  const gloryBridgePrefix = '/extraordinarias/gloria/'
  if (request.nextUrl.pathname.startsWith(gloryBridgePrefix)) {
    const glorySlug = request.nextUrl.pathname.slice(gloryBridgePrefix.length)
    if (glorySlug) {
      const gloryUrl = request.nextUrl.clone()
      gloryUrl.pathname = `/procesiones-de-gloria/${glorySlug}`
      return NextResponse.redirect(gloryUrl, 308)
    }
  }

  if (request.nextUrl.pathname.startsWith('/panel')) {
    return updateSession(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
