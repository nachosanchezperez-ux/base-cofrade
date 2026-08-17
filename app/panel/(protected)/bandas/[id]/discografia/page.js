import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import DiscographyReleaseEditor from './ReleaseEditor'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
export const metadata = { title: 'Discografía de banda · Panel' }

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

async function getData(bandId) {
  const supabase = await createClient()
  const entityResult = await supabase.from('entities').select('id, name, slug, status').eq('id', bandId).eq('entity_type', 'band').maybeSingle()
  if (entityResult.error) throw new Error(`No se pudo cargar la banda: ${entityResult.error.message}`)
  if (!entityResult.data) return null

  const [releasesResult, sourcesResult, marchesResult] = await Promise.all([
    supabase.from('band_releases').select('*').eq('band_entity_id', bandId).neq('status', 'archived').order('release_year', { ascending: false, nullsFirst: false }).order('release_date', { ascending: false, nullsFirst: false }),
    supabase.from('sources').select('id, name, url, author_or_publisher').order('name'),
    supabase.from('entities').select('id, name, slug, status').eq('entity_type', 'march').neq('status', 'archived').order('name'),
  ])
  const releases = rows(releasesResult, 'No se pudieron cargar los lanzamientos')
  const sources = rows(sourcesResult, 'No se pudieron cargar las fuentes')
  const marches = rows(marchesResult, 'No se pudieron cargar las Marchas')
  const ids = releases.map((item) => item.id)
  const [tracksResult, linksResult] = await Promise.all([
    ids.length ? supabase.from('band_release_tracks').select('*').in('release_id', ids).order('sequence_no') : Promise.resolve({ data: [], error: null }),
    ids.length ? supabase.from('band_release_sources').select('release_id, source_id, scope').in('release_id', ids) : Promise.resolve({ data: [], error: null }),
  ])
  const tracks = rows(tracksResult, 'No se pudieron cargar las pistas')
  const links = rows(linksResult, 'No se pudieron cargar las fuentes vinculadas')
  const sourceById = new Map(sources.map((item) => [item.id, item]))

  return {
    entity: entityResult.data,
    sources,
    marches,
    releases: releases.map((release) => ({
      ...release,
      tracks: tracks.filter((track) => track.release_id === release.id),
      sources: links.filter((link) => link.release_id === release.id).map((link) => ({ ...link, source: sourceById.get(link.source_id) })).filter((link) => link.source),
    })),
  }
}

export default async function BandDiscographyEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return <div className={styles.pageWrap}>
    <header className={styles.editorHeader}>
      <div className={styles.breadcrumb}><Link href="/panel/bandas">Bandas</Link><span>→</span><Link href={`/panel/bandas/${data.entity.id}`}>{data.entity.name}</Link><span>→</span><strong>Discografía</strong></div>
      <div className={styles.editorTitleRow}>
        <div><span className={styles.eyebrow}>Patrimonio sonoro</span><h1>Discografía</h1><p>{data.entity.name} · lanzamientos, pistas, Spotify y Fuentes.</p></div>
        <div className={styles.editorHeaderActions}><span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span><Link className={styles.secondaryButton} href={`/panel/bandas/${data.entity.id}`}>Editar banda</Link>{data.entity.slug ? <Link className={styles.secondaryButton} href={`/bandas/${data.entity.slug}#discografia`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}</div>
      </div>
    </header>
    {query?.saved ? <div className={styles.savedNotice} role="status">Cambios de Discografía guardados correctamente.</div> : null}
    {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando Discografía como colaborador. Un editor debe realizar los cambios.</div> : null}
    <section className={styles.editorSection} id="discografia">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Banda → Disco → Marcha</span><h2>Lanzamientos</h2></div><p>Spotify permite escuchar. Las autorías y dedicatorias pertenecen a la entidad Marcha y no se duplican en el disco.</p></div>
      <div className={styles.editorStack}>{data.releases.map((release) => <DiscographyReleaseEditor key={release.id} item={release} data={data} canEdit={canEdit} />)}{canEdit ? <DiscographyReleaseEditor data={data} canEdit /> : null}</div>
    </section>
  </div>
}
