import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { getImageEditorData } from '@/lib/panel/images'
import { updateImageAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }

export const metadata = { title: 'Editar imagen · Panel' }

export default async function ImageEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getImageEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/imagenes">Imágenes</Link><span>→</span><strong>{data.entity.name}</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Editar imagen</span><h1>{data.entity.name}</h1><p>{data.image.image_type || 'Tipo de imagen pendiente de documentar'}</p></div>
          <div className={styles.editorHeaderActions}>
            <span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>
            {data.entity.status === 'published' && data.entity.slug ? <Link className={styles.secondaryButton} href={`/imagenes/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
          </div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando la imagen como colaborador. Un editor debe realizar los cambios.</div> : null}

      <section className={styles.editorSection} id="general">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Identidad física y devocional</span><h2>Información básica</h2></div><p>La Imagen es una pieza física. Su identidad devocional se relaciona de forma independiente.</p></div>
        <form action={updateImageAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="image_id" value={data.entity.id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Nombre de la imagen</span><input name="name" defaultValue={data.entity.name} required /></label>
            <label><span>Tipo de imagen</span><input name="image_type" defaultValue={data.image.image_type || ''} placeholder="Cristo, Virgen, Santo…" /></label>
            <label><span>Slug</span><input name="slug" defaultValue={data.entity.slug || ''} required /></label>
            <EntityPicker className={styles.fieldWide} name="advocation_entity_id" items={data.advocationOptions} label="Identidad devocional representada" placeholder="Buscar advocación o identidad conceptual…" emptyLabel="Sin identidad devocional vinculada" defaultValue={data.image.advocation_entity_id || ''} required={false} />
          </div>
          <div className={styles.formActions}><small>{canEdit ? 'La titularidad de una Hermandad se gestiona aparte; aquí solo se vincula la pieza física con la identidad devocional.' : 'Tu perfil tiene acceso de consulta.'}</small>{canEdit ? <button className={styles.primaryButton} type="submit">Guardar cambios</button> : null}</div>
        </form>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Documentación relacionada</span><h2>Autorías e intervenciones</h2></div><p>Las atribuciones y las intervenciones mantienen su propia procedencia documental.</p></div>
        <div className={styles.dashboardGrid}>
          <div className={styles.panelCard}><h3>Autorías</h3><p className={styles.emptyText}>Autor documentado, atribución, taller, círculo o escuela.</p><Link className={styles.secondaryButton} href={`/panel/imagenes/${data.entity.id}/autorias`}>Gestionar autorías</Link></div>
          <div className={styles.panelCard}><h3>Intervenciones</h3><p className={styles.emptyText}>Restauraciones e intervenciones, incluso cuando el responsable sea desconocido.</p><Link className={styles.secondaryButton} href={`/panel/imagenes/${data.entity.id}/intervenciones`}>Gestionar intervenciones</Link></div>
        </div>
      </section>
    </div>
  )
}
