import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const CANDIDATES = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_DB_URL',
  'DATABASE_URL',
  'DIRECT_URL',
  'POSTGRES_URL',
  'POSTGRES_URL_NON_POOLING',
  'POSTGRES_PRISMA_URL',
  'SUPABASE_ACCESS_TOKEN',
  'SUPABASE_PROJECT_REF',
]

export async function GET() {
  if (process.env.VERCEL_ENV !== 'preview') {
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.json({
    environment: process.env.VERCEL_ENV,
    branch: process.env.VERCEL_GIT_COMMIT_REF || null,
    commit: process.env.VERCEL_GIT_COMMIT_SHA || null,
    present: Object.fromEntries(CANDIDATES.map((name) => [name, Boolean(process.env[name])])),
  }, {
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
