import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityCoverEditor from '@/components/panel/EntityCoverEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelEntityCover } from '@/lib/panel/entity-cover'
import { getStepEditorData } from '@/lib/panel/steps'
import { saveEntityCoverAction } from '../../media-actions'
import { updateStepAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }

export const metadata = { title: 'Editar paso · Panel' }

export default async function StepEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const [data, cover] = await Promise.all([
    getStepEditorData(id),
    getPanelEntityCover(id),
  ])
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/pasos">Pasos</Link>
          <span>→</span>
          <strong>{data.entity.name}</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Editar paso</span>
            <h1>{data.entity.name}</h1>
            <p>{data.step.step_type || 'Tipo de paso pendiente de documentar'}</p>
          </div>
          <div className={styles.editorHeaderActions}>
            <span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>
            {data.entity.status === 'published' && data.entity.slug ? (
              <Link className={styles.secondaryButton} href={`/pasos/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link>
            ) : null}
          </div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando el paso como colaborador. Un editor debe realizar los cambios.</div> : null}

      <section className={styles.editorSection} id="portada">
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Presentación visual</span><h2>Portada</h2></div>
          <p>Controla el plano general del paso y evita recortes por ficha o por slug.</p>
        </div>
        <EntityCoverEditor entity={{ id: data.entity.id, type: 'step' }} cover={cover} canEdit={canEdit} action={saveEntityCoverAction} />
      </section>

      <section className={styles.editorSection} id="general">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Identidad</span>
            <h2>Información básica</h2>
          </div>
          <p>Este primer editor no gestiona relaciones, patrimonio, fuentes ni publicación.</p>
        </div>

        <form action={updateStepAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="step_id" value={data.entity.id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}>
              <span>Nombre del paso</span>
              <input name="name" defaultValue={data.entity.name} required />
            </label>
            <label>
              <span>Tipo de paso</span>
              <input name="step_type" defaultValue={data.step.step_type || ''} placeholder="Misterio, palio, Cristo…" />
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
