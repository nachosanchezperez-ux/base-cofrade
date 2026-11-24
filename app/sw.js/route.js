import { buildServiceWorker } from '@/lib/service-worker'
import { PROGRAMME_DAYS, dayPath } from '@/lib/holy-week-programme'

// Service worker en /sw.js (24/11/2026). Estático por despliegue: cada versión
// nueva sustituye a la anterior y limpia sus cachés.
export const dynamic = 'force-static'

const VERSION = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_DEPLOYMENT_ID || 'local').slice(0, 12)

export function GET() {
  const programmeUrls = [dayPath(), ...PROGRAMME_DAYS.map((day) => dayPath(day.id))]
  return new Response(buildServiceWorker({ version: VERSION, programmeUrls }), {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Service-Worker-Allowed': '/',
    },
  })
}
