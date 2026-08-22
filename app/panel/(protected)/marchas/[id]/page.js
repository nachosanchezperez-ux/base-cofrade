import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import { MARCH_SAVED_MESSAGES, STATUS_LABELS, StatusSelect } from '@/components/panel/march/MarchEditorPrimitives'
import { requirePanelUser } from '@/lib/panel/auth'
import { getMarchEditorData } from '@/lib/panel/marches'
import { archiveMarchAction, updateMarchAction } from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Editar Marcha · Panel' }

function ModuleRow({ href, label, count, note }) {
  return (
    <div>
      <span><strong>{label}</strong>{note ? <small style={{ display: 'block', marginTop: 3 }}>{note}</small> : null}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><b>{count}</b><Link className={styles.rowLink} href={href}>Abrir <span>→</span></Link></span>
    </div>
  )
}

export default async function MarchEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getMarchEditorData(id)
  if (!data) notFound()

  const savedRoute = {
    author: 'autoria',
    'author-archived': 'autoria',
    dedication: 'dedicatorias',
    'dedication-archived': 'dedicatorias',
    recording: 'grabaciones',
    'recording-archived': 'grabaciones',
  }[query?.saved]
  if (savedRoute) redirect(`/panel/marchas/${id}/${savedRoute}?saved=${query.saved}`)

  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = MARCH_SAVED_MESSAGES[query?.saved]
  const { entity, march, coverage } = data

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/marchas">Marchas</Link><span>→</span><strong>{entity.name}</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Resumen de ficha</span><h1>{entity.name}</h1><p>{[march.music_type, march.composition_year || march.composition_date_text].filter(Boolean).join(' · ') || 'Ficha musical por completar'}</p></div>
          <div className={styles.editorHeaderActions}>
            <span className={`${styles.statusBadge} ${styles[entity.status]}`}>{STATUS_LABELS[entity.status]}</span>
            <Link className={styles.primaryButton} href="/panel/hoy">Gestionar en Home</Link>
          </div>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura de la Marcha">
        <article className={styles.metricCard}><span>Autorías</span><strong>{coverage.authors}</strong><small>compositores y adaptadores</small></article>
        <article className={styles.metricCard}><span>Dedicatorias</span><strong>{coverage.dedications}</strong><small>Hermandades e Imágenes</small></article>
        <article className={styles.metricCard}><span>Grabaciones</span><strong>{coverage.recordings}</strong><small>registros audiovisuales</small></article>
        <article className={styles.metricCard}><span>Documentación</span><strong>{coverage.sources + coverage.media}</strong><small>{coverage.sources} fuentes · {coverage.media} recursos</small></article>
      </section>

      <section className={styles.editorSection} id="general">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Fuente de verdad</span><h2>Ficha musical</h2></div><p>Identidad, composición, estreno y configuración para Marcha del día.</p></div>
        <form action={updateMarchAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="march_id" value={id} />
          <datalist id="music-types"><option value="Banda de Música" /><option value="Cornetas y Tambores" /><option value="Agrupación Musical" /><option value="Marcha procesional" /></datalist>
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Título</span><input name="name" defaultValue={entity.name} required /></label>
            <label><span>Slug</span><input name="slug" defaultValue={entity.slug || ''} required /></label>
            <label><span>Estado editorial</span><StatusSelect defaultValue={entity.status} /></label>
            <label><span>Tipo / formación</span><input name="music_type" list="music-types" defaultValue={march.music_type || ''} /></label>
            <label><span>Año de composición</span><input name="composition_year" type="number" min="1800" max="2200" defaultValue={march.composition_year ?? ''} /></label>
            <label><span>Datación textual</span><input name="composition_date_text" defaultValue={march.composition_date_text || ''} /></label>
            <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" defaultValue={entity.summary || ''} rows="3" /></label>
            <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" defaultValue={march.description || ''} rows="4" /></label>
            <label><span>Fecha de estreno</span><input name="premiere_date" type="date" defaultValue={march.premiere_date || ''} /></label>
            <label><span>Estreno en texto</span><input name="premiere_date_text" defaultValue={march.premiere_date_text || ''} placeholder="Ej. Cuaresma de 2026" /></label>
            <label><span>Lugar de estreno</span><select name="premiere_place_id" defaultValue={march.premiere_place_id || ''}><option value="">Sin lugar vinculado</option>{data.places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label>
            <EntityPicker className={styles.fieldWide} name="premiered_by_band_entity_id" items={data.bandOptions} label="Banda que la estrenó (opcional)" emptyLabel="Sin Banda de estreno vinculada" required={false} defaultValue={march.premiered_by_band_entity_id || ''} />
            <label className={styles.fieldWide}><span>ID de vídeo de YouTube principal</span><input name="youtube_video_id" defaultValue={march.youtube_video_id || ''} placeholder="Solo el ID, no la URL completa" /></label>
            <label className={styles.checkField}><input name="eligible_for_daily" type="checkbox" defaultChecked={march.eligible_for_daily ?? true} /><span>Elegible como Marcha del día</span></label>
            <label><span>Prioridad diaria</span><input name="daily_priority" type="number" min="0" defaultValue={march.daily_priority ?? 0} /></label>
          </div>
          <div className={styles.formActions}><small>Desmarcar “elegible” la excluye de la rotación automática, pero sigue siendo una Marcha publicada.</small>{canEdit ? <button className={styles.primaryButton} type="submit">Guardar ficha musical</button> : null}</div>
        </form>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Cobertura editorial</span><h2>Completar la Marcha</h2></div><p>Las relaciones y el archivo documental se administran en módulos propios.</p></div>
        <div className={styles.panelCard}><div className={styles.moduleList}>
          <ModuleRow href={`/panel/marchas/${id}/autoria`} label="Autoría" count={coverage.authors} note="Compositores, adaptadores y sus Fuentes" />
          <ModuleRow href={`/panel/marchas/${id}/dedicatorias`} label="Dedicatorias" count={coverage.dedications} note="Hermandades e Imágenes vinculadas" />
          <ModuleRow href={`/panel/marchas/${id}/grabaciones`} label="Grabaciones" count={coverage.recordings} note="Escuchas, Bandas y grabación destacada" />
          <ModuleRow href={`/panel/multimedia?entity=${id}`} label="Multimedia" count={coverage.media} note="Archivo visual reutilizable" />
          <ModuleRow href={`/panel/fuentes?entity=${id}`} label="Fuentes" count={coverage.sources} note="Documentación directa de la Marcha" />
        </div></div>
      </section>

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Archivo</span><h2>Retirar Marcha</h2></div><p>Archivar la oculta del Front sin borrar autorías, dedicatorias ni grabaciones.</p></div>
          <form action={archiveMarchAction} className={styles.archiveForm}><input type="hidden" name="march_id" value={id} /><button type="submit">Archivar Marcha</button></form>
        </section>
      ) : null}
    </div>
  )
}
