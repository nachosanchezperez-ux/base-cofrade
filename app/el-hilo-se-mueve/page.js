import Link from 'next/link'
import SiteBreadcrumb from '@/components/SiteBreadcrumb'
import JsonLd from '@/components/JsonLd'
import HiloMovementCards from '@/components/HiloMovementCards'
import { getPublicHiloMovements } from '@/lib/supabase/hilo-movements'
import { HILO_MOVEMENTS_PATH, HILO_TOPIC_LABELS, filterHiloMovements } from '@/lib/hilo-movements'
import { breadcrumbJsonLd, collectionPageJsonLd, socialMetadata, filteredViewRobots } from '@/lib/seo'
import styles from '@/components/HiloMovements.module.css'

export const revalidate = 60
// Tarjetas completas (con foto y botones de compartir); el resto, en filas breves
// que conservan su ancla (#id) para los enlaces antiguos.
const HILO_INDEX_CARDS = 12
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
      {!unavailable && items.length ? <JsonLd data={collectionPageJsonLd({ path: HILO_MOVEMENTS_PATH, name: 'El Hilo se mueve', description: DESCRIPTION, items: items.map((item) => ({ name: item.title, path: item.href })) })} /> : null}
      <header className={styles.hero}>
        <div><span className={styles.eyebrow}>La actualidad también tiene su hilo</span><h1>El Hilo <em>se mueve</em></h1><p>Lo que cambia en nuestras hermandades. Los sones que llegan, el patrimonio que vuelve y las historias que siguen.</p></div>
        <a className={styles.heroLink} href="#novedades">Tira del hilo <span aria-hidden="true">↓</span></a>
      </header>
      {unavailable ? <p className={styles.empty} role="status">No hemos podido recuperar las novedades. Puedes consultar las <Link href="/hermandades">hermandades</Link> y la <Link href="/agenda-cofrade">agenda</Link>.</p> : <>
        <nav className={styles.topicNav} aria-label="Novedades por tema"><Link href={HILO_MOVEMENTS_PATH} aria-current={!filters.tema ? 'page' : undefined}>Todo el hilo</Link>{topics.map((topic) => <Link key={topic} href={`${HILO_MOVEMENTS_PATH}?tema=${topic}`} aria-current={filters.tema === topic ? 'page' : undefined}>{HILO_TOPIC_LABELS[topic]}</Link>)}</nav>
        <details className={styles.filterDisclosure} open={!!(filters.q || filters.municipio || filters.tema)}><summary>Busca tu hermandad, banda o municipio <span aria-hidden="true">+</span></summary>
        <form key={JSON.stringify(filters)} className={styles.filters} action={HILO_MOVEMENTS_PATH} method="get" role="search" aria-label="Buscar novedades de hermandades">
          <label>Hermandad, banda o novedad<input type="search" name="q" maxLength={120} defaultValue={filters.q} placeholder="¿De qué hilo quieres tirar?" /></label>
          <label>Municipio<select name="municipio" defaultValue={filters.municipio}><option value="">Todos los municipios</option>{filters.municipio && !municipalities.includes(filters.municipio) ? <option value={filters.municipio}>{filters.municipio}</option> : null}{municipalities.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
          <label>Tema<select name="tema" defaultValue={filters.tema}><option value="">Todos los temas</option>{filters.tema && !topics.includes(filters.tema) ? <option value={filters.tema}>{HILO_TOPIC_LABELS[filters.tema] || 'Otro tema'}</option> : null}{topics.map((topic) => <option key={topic} value={topic}>{HILO_TOPIC_LABELS[topic]}</option>)}</select></label>
          <button type="submit">Buscar novedades</button><Link className={styles.more} href={HILO_MOVEMENTS_PATH} prefetch={false}>Quitar filtros</Link>
        </form></details>
        <p id="novedades" className={styles.results}>{selected.length} {selected.length === 1 ? 'novedad documentada' : 'novedades documentadas'} · Ordenadas por fecha del anuncio, cuando se conoce.</p>
        {selected.length ? <>
          <HiloMovementCards items={selected.slice(0, 1)} headingLevel={2} featured />
          {selected.length > 1 ? <section aria-labelledby="el-hilo-sigue"><header className={styles.followHeader}><h2 id="el-hilo-sigue">El hilo sigue</h2><p>Más capítulos de la vida cofrade</p></header><HiloMovementCards items={selected.slice(1, HILO_INDEX_CARDS)} headingLevel={3} secondary /></section> : null}
          {selected.length > HILO_INDEX_CARDS ? <section className={styles.archive} aria-labelledby="el-hilo-archivo"><header className={styles.followHeader}><h2 id="el-hilo-archivo">Archivo del hilo</h2><p>Novedades anteriores, en formato breve</p></header><HiloMovementCards items={selected.slice(HILO_INDEX_CARDS)} headingLevel={3} compact anchors /></section> : null}
        </> : <p className={styles.empty}>No hay novedades publicadas con estos filtros. <Link href={HILO_MOVEMENTS_PATH} prefetch={false}>Ver todas las novedades</Link>.</p>}
      </>}
    </div>
  </div>
}
