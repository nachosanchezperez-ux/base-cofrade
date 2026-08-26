import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createPublicClient } from '@/lib/supabase/public'
import { isPublicSupabaseRead } from '@/lib/supabase/public-read-context'

export async function createClient() {
  if (isPublicSupabaseRead()) return createPublicClient()

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet, _headers) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // En Server Components no siempre se pueden escribir cookies.
          }
        },
      },
    }
  )
}
