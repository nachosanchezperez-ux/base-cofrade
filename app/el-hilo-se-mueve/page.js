import Link from 'next/link'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import JsonLd from '@/components/JsonLd'
import HiloMovementCards from '@/components/HiloMovementCards'
import { getPublicHiloMovements } from '@/lib/supabase/hilo-movements'
import { HILO_MOVEMENTS_PATH, HILO_TOPIC_LABELS, filterHiloMovements } from '@/lib/hilo-movements'
import { breadcrumbJsonLd, socialMetadata, filteredViewRobots } from '@/lib/seo'
import styles from '@/components/HiloMovements.module.css'

export const revalidate = 60
const TITLE = 'El Hilo se mueve · Novedades de nuestras hermandades'
const DESCRIPTION = 'La vida de nuestras hermandades, conectada: novedades documentadas, contexto y protagonistas para seguir tirando del hilo.'
const value = (input) => String(Array.isArray(input) ? input[0] || '' : input || '').slice(0, 120)

export async function generateMetadata({ searchParams }) {
  const params = await searchParams
  return { title: TITLE, description: DESCRIPTION, ...socialMetadata({ title: TITLE, description: DESCRIPTION, path: HILO_MOVEMENTS_PATH }), robots: filteredViewRobots(params, ['q', 'municipio', 'tema']) }
}

export default async function HiloMovementsPage({ searchParams }) {
  const params = await searchParams || {}
  const filters = { q: value(params.q), municipio: value(params.municipio), tema: value(params.tema) }
  let items = []
  let unavailable = false
  try { items = await getPublicHiloMovements() } catch { unavailable = true }
  const selected = filterHiloMovements(items, filters)
  const municipalities = [...new Set(items.map((item) => item.municipality))].sort((a, b) => a.localeCompare(b, 'es'))
  const topics = [...new Set(items.map((item) => item.topic))]
  return <div className={styles.hub}>
    <div className="shell">
      <SiteBreadcrumb items={[{ label: 'El Hilo se mueve' }]} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Inicio', path: '/' }, { name: 'El Hilo se mueve', path: HILO_MOVEMENTS_PATH }])} />
      <header className={styles.hero}><span className={styles.eyebrow}>Entre varales y cornetas</span><h1>El Hilo se mueve</h1><p>Un relevo tras el palio, unos sones que siguen, un nuevo capítulo en la hermandad. Aquí te contamos qué se mueve y te llevamos a quienes forman parte de cada historia.</p><div className={styles.heroGuide}><span>La novedad</span><b aria-hidden="true">→</b><span>Sus protagonistas</span><b aria-hidden="true">→</b><span>Su historia</span></div></header>
      {unavailable ? <p className={styles.empty} role="status">No hemos podido recuperar las novedades. Puedes consultar las <Link href="/hermandades">hermandades</Link> y la <Link href="/agenda-cofrade">agenda</Link>.</p> : <>
        <form key={JSON.stringify(filters)} className={styles.filters} action={HILO_MOVEMENTS_PATH} method="get" role="search" aria-label="Buscar novedades de hermandades">
          <label>Hermandad, banda o novedad<input type="search" name="q" maxLength={120} defaultValue={filters.q} placeholder="¿De qué hilo quieres tirar?" /></label>
          <label>Municipio<select name="municipio" defaultValue={filters.municipio}><option value="">Todos los municipios</option>{filters.municipio && !municipalities.includes(filters.municipio) ? <option value={filters.municipio}>{filters.municipio}</option> : null}{municipalities.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
          <label>Tema<select name="tema" defaultValue={filters.tema}><option value="">Todos los temas</option>{filters.tema && !topics.includes(filters.tema) ? <option value={filters.tema}>{HILO_TOPIC_LABELS[filters.tema] || 'Otro tema'}</option> : null}{topics.map((topic) => <option key={topic} value={topic}>{HILO_TOPIC_LABELS[topic]}</option>)}</select></label>
          <button type="submit">Buscar novedades</button><Link className={styles.more} href={HILO_MOVEMENTS_PATH} prefetch={false}>Quitar filtros</Link>
        </form>
        <p className={styles.results}>{selected.length} {selected.length === 1 ? 'novedad documentada' : 'novedades documentadas'} · Ordenadas por fecha del anuncio, cuando se conoce.</p>
        {selected.length ? <HiloMovementCards items={selected} headingLevel={2} /> : <p className={styles.empty}>No hay novedades publicadas con estos filtros. <Link href={HILO_MOVEMENTS_PATH} prefetch={false}>Ver todas las novedades</Link>.</p>}
      </>}
    </div>
  </div>
}
