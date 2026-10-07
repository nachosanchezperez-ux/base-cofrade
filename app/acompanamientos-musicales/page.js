import { connection } from 'next/server'
import JsonLd from '@/components/JsonLd'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import MusicDashboard from '@/components/MusicDashboard'
import { getPublicMusicAccompanimentSummary } from '@/lib/supabase/public-directory-cache'
import { DASHBOARD_PATH, dashboardFilters, dashboardHref, selectMusicDashboard } from '@/lib/music-dashboard'
import { breadcrumbJsonLd, collectionPageJsonLd, filteredViewRobots, socialMetadata } from '@/lib/seo'
import styles from '@/components/MusicDashboard.module.css'

export const revalidate = 300
const DESCRIPTION = 'Datos y estadísticas de acompañamientos musicales por banda en Sevilla y provincia: reparto territorial, formaciones, municipios y tabla de registros documentados.'

export async function generateMetadata({ searchParams } = {}) {
  const params = await searchParams
  const { year } = dashboardFilters(params)
  const title = `Panel de acompañamientos musicales · ${year === 2027 ? 'Avance 2027' : 'Semana Santa 2026'}`
  const robots = filteredViewRobots(params, ['temporada', 'q', 'tipo', 'orden', 'ambito', 'municipio', 'banda', 'pagina'])
  return { title, description: DESCRIPTION, ...socialMetadata({ title, description: DESCRIPTION, path: DASHBOARD_PATH }), ...(robots ? { robots } : {}) }
}

export default async function AcompanamientosMusicalesPage({ searchParams } = {}) {
  await connection()
  const initialFilters = dashboardFilters(await searchParams)
  // Sequential calls reuse the same cached public period snapshot. No per-band fetches or client credentials.
  const summaries = { 2026: await getPublicMusicAccompanimentSummary(2026), 2027: await getPublicMusicAccompanimentSummary(2027) }
  const data = selectMusicDashboard(summaries[initialFilters.year], initialFilters)
  const path = dashboardHref({ ...initialFilters, page: data.page })
  return <div className={styles.dashboard}>
    <JsonLd data={breadcrumbJsonLd([{ name: 'Inicio', path: '/' }, { name: 'Bandas', path: '/bandas' }, { name: 'Acompañamientos musicales', path: DASHBOARD_PATH }])} />
    <JsonLd data={collectionPageJsonLd({ path, name: `Panel de acompañamientos musicales · ${initialFilters.year}`, description: DESCRIPTION, items: data.pageRows.map((band) => ({ name: band.name, path: `${path}#banda-${band.id}` })) })} />
    <div className={styles.inner}>
      <SiteBreadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Bandas', href: '/bandas' }, { label: 'Acompañamientos musicales' }]} showAccent={false} />
      <MusicDashboard summaries={summaries} initialFilters={initialFilters} />
    </div>
  </div>
}
