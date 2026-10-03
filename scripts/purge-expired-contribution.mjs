import { createClient } from '@supabase/supabase-js'
import { purgeExpiredContribution } from '../lib/contributions/retention.js'

const args = process.argv.slice(2)
if (args.length < 1 || args.length > 2 || (args[1] && args[1] !== '--apply')) {
  console.error('Uso: node scripts/purge-expired-contribution.mjs UUID [--apply]. Sin --apply solo inspecciona.')
  process.exitCode = 1
} else {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Private Supabase configuration unavailable')
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    console.log(JSON.stringify(await purgeExpiredContribution(client, args[0], { apply: args[1] === '--apply' })))
  } catch {
    console.error('No se pudo completar la operación de conservación. No se imprimen datos privados ni detalles de credenciales.')
    process.exitCode = 1
  }
}
