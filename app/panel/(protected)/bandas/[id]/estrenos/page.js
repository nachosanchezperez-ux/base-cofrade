import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBandEditorData } from '@/lib/panel/data'
import { SaveBar, SourceFields, StatusSelect, STATUS_LABELS } from '@/components/panel/band/BandEditorPrimitives'
import { archiveBandPremiereAction, saveBandPremiereAction } from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Estrenos · Banda · Panel' }

function PremiereForm({ item, bandId, canEdit }) {
  const isNew = !item?.id
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div><span className={styles.eyebrow}>{isNew ? 'Nuevo estreno' : item.premiere_year}</span><h3>{isNew ? 'Añadir estreno' : item.title}</h3></div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}
      </div>
      <form action={saveBandPremiereAction} className={styles.editorForm}>
        <input type="hidden" name="band_id" value={bandId} />
        <input type="hidden" name="premiere_id" value={item?.id || ''} />
        <input type="hidden" name="march_entity_id" value={item?.march_entity_id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Título de la marcha</span><input name="title" defaultValue={item?.title || ''} required /></label>
          <label><span>Compositor</span><input name="composer_name" defaultValue={item?.composerName || item?.composer_name || ''} required /></label>
          <label><span>Adaptador</span><input name="adapter_name" defaultValue={item?.adapterName || ''} placeholder="Solo cuando corresponda" /></label>
          <label><span>Año del estreno</span><input name="premiere_year" type="number" min="1800" max="2200" defaultValue={item?.premiere_year || new Date().getFullYear()} required /></label>
          <label><span>Fecha exacta</span><input name="premiere_date" type="date" defaultValue={item?.premiere_date || ''} /></label>
          <label><span>Lugar</span><input name="venue_text" defaultValue={item?.venue_text || ''} placeholder="Parroquia o auditorio" /></label>
          <label><span>Municipio</span><input name="municipality_text" defaultValue={item?.municipality_text || ''} /></label>
          <label className={styles.fieldWide}><span>Enlace de YouTube</span><input name="video_url" type="url" defaultValue={item?.video_url || ''} /></label>
          <label className={styles.fieldWide}><span>Descripción</span><textarea name="description" defaultValue={item?.description || ''} rows="3" /></label>
          <label><span>Orden</span><input name="display_order" type="number" min="0" defaultValue={item?.display_order || 0} /></label>
          <label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
          <SourceFields source={item?.source} />
        </div>
        <SaveBar label={isNew ? 'Crear estreno' : 'Guardar estreno'} canEdit={canEdit} note="Cada estreno mantiene su marcha, autoría y fuente documental conectadas." />
      </form>
      {!isNew && item.status !== 'archived' && canEdit ? (
        <form action={archiveBandPremiereAction} className={styles.archiveForm}>
          <input type="hidden" name="band_id" value={bandId} />
          <input type="hidden" name="premiere_id" value={item.id} />
          <button type="submit">Archivar este estreno</button>
        </form>
      ) : null}
    </article>
  )
}

export default async function BandPremieresPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBandEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const displayName = data.popularName?.name || data.entity.name

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/bandas">Bandas</Link><span>→</span><Link href={`/panel/bandas/${id}`}>{displayName}</Link><span>→</span><strong>Estrenos</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Patrimonio musical</span><h1>Estrenos</h1><p>Marchas, autoría, datación, vídeo y fuente documental.</p></div>
          <Link className={styles.secondaryButton} href={`/panel/bandas/${id}/discografia`}>Abrir Discografía</Link>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Estrenos actualizados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Catálogo de estrenos</span><h2>Marchas estrenadas</h2></div><p>{data.premieres.length} estreno{data.premieres.length === 1 ? '' : 's'} documentado{data.premieres.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>{data.premieres.map((item) => <PremiereForm key={item.id} item={item} bandId={data.entity.id} canEdit={canEdit} />)}{canEdit ? <PremiereForm bandId={data.entity.id} canEdit /> : null}</div>
      </section>
    </div>
  )
}
