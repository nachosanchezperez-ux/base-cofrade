import 'server-only'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let publicClient = null

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error('Faltan las variables públicas de Supabase para el cliente de lectura.')
  }

  if (!publicClient) {
    publicClient = createSupabaseClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'hilo-cofrade-public-server',
        },
      },
    })
  }

  return publicClient
}

export const createPublicClient = createClient
