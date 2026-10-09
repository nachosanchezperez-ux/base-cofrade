import Link from 'next/link'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import JsonLd from '@/components/JsonLd'
import HiloMovementCards from '@/components/HiloMovementCards'
import { getPublicHiloMovements } from '@/lib/supabase/hilo-movements'
import { HILO_MOVEMENTS_PATH, HILO_TOPIC_LABELS, filterHiloMovements } from '@/lib/hilo-movements'
import { breadcrumbJsonLd, socialMetadata, filteredViewRobots } from '@/lib/seo'
import styles from '@/components/HiloMovements.module.css'

export const revalidate = 60
const TITLE = 'El Hilo se mueve · Actualidad cofrade de nuestras hermandades'
const DESCRIPTION = 'Relevos de sones, renovaciones y noticias de las hermandades, con sus protagonistas y el contexto para seguir tirando del hilo cofrade.'
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
      <header className={styles.hero}><div className={styles.heroCopy}><span className={styles.eyebrow}>Actualidad cofrade · al compás de las Hermandades</span><h1>El Hilo se mueve</h1><p>Relevos de sones, renovaciones y noticias que marcan una nueva etapa. Sigue cada historia desde el anuncio hasta las bandas, titulares y hermandades que la protagonizan.</p><div className={styles.heroGuide} aria-label="Recorrido de cada historia"><span>El anuncio</span><b aria-hidden="true">→</b><span>El cortejo</span><b aria-hidden="true">→</b><span>Sus protagonistas</span></div></div><div className={styles.heroSeal} aria-hidden="true"><span>H</span><small>Hilo<br/>Cofrade</small></div></header>
      {unavailable ? <p className={styles.empty} role="status">No hemos podido recuperar las novedades. Puedes consultar las <Link href="/hermandades">hermandades</Link> y la <Link href="/agenda-cofrade">agenda</Link>.</p> : <>
        <form key={JSON.stringify(filters)} className={styles.filters} action={HILO_MOVEMENTS_PATH} method="get" role="search" aria-label="Buscar novedades de hermandades">
          <label>Hermandad, banda o protagonista<input type="search" name="q" maxLength={120} defaultValue={filters.q} placeholder="Ej. San Esteban, Santa Ana, relevo de sones" /></label>
          <label>Localidad<select name="municipio" defaultValue={filters.municipio}><option value="">Todos los municipios</option>{filters.municipio && !municipalities.includes(filters.municipio) ? <option value={filters.municipio}>{filters.municipio}</option> : null}{municipalities.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
          <label>Tipo de novedad<select name="tema" defaultValue={filters.tema}><option value="">Todos los temas</option>{filters.tema && !topics.includes(filters.tema) ? <option value={filters.tema}>{HILO_TOPIC_LABELS[filters.tema] || 'Otro tema'}</option> : null}{topics.map((topic) => <option key={topic} value={topic}>{HILO_TOPIC_LABELS[topic]}</option>)}</select></label>
          <button type="submit">Tirar del hilo</button><Link className={styles.more} href={HILO_MOVEMENTS_PATH} prefetch={false}>Ver el cortejo completo</Link>
        </form>
        <p className={styles.results}>{selected.length} {selected.length === 1 ? 'historia cofrade' : 'historias cofrades'} · Ordenadas por la fecha del anuncio, cuando se conoce.</p>
        {selected.length ? <HiloMovementCards items={selected} headingLevel={2} /> : <p className={styles.empty}>No hay historias en este tramo con esos filtros. <Link href={HILO_MOVEMENTS_PATH} prefetch={false}>Volver a tirar del hilo</Link>.</p>}
      </>}
    </div>
  </div>
}
