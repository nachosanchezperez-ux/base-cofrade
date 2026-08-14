import Link from 'next/link'
import { notFound } from 'next/navigation'
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
          <Link href="/panel/imagenes">Imágenes</Link>
          <span>→</span>
          <strong>{data.entity.name}</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Editar imagen</span>
            <h1>{data.entity.name}</h1>
            <p>{data.image.image_type || 'Tipo de imagen pendiente de documentar'}</p>
          </div>
          <div className={styles.editorHeaderActions}>
            <span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>
            {data.entity.status === 'published' && data.entity.slug ? (
              <Link className={styles.secondaryButton} href={`/imagenes/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link>
            ) : null}
          </div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando la imagen como colaborador. Un editor debe realizar los cambios.</div> : null}

      <section className={styles.editorSection} id="general">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Identidad</span>
            <h2>Información básica</h2>
          </div>
          <p>Este primer editor no gestiona relaciones, fuentes ni publicación.</p>
        </div>

        <form action={updateImageAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="image_id" value={data.entity.id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}>
              <span>Nombre de la imagen</span>
              <input name="name" defaultValue={data.entity.name} required />
            </label>
            <label>
              <span>Tipo de imagen</span>
              <input name="image_type" defaultValue={data.image.image_type || ''} placeholder="Cristo, Virgen, Santo…" />
            </label>
            <label>
              <span>Slug</span>
              <input name="slug" defaultValue={data.entity.slug || ''} required />
            </label>
          </div>
          <div className={styles.formActions}>
            <small>{canEdit ? 'El estado editorial no cambia al guardar.' : 'Tu perfil tiene acceso de consulta.'}</small>
            {canEdit ? <button className={styles.primaryButton} type="submit">Guardar cambios</button> : null}
          </div>
        </form>
      </section>
    </div>
  )
}
