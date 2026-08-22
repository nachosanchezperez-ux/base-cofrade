import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBandEditorData } from '@/lib/panel/data'
import { SaveBar } from '@/components/panel/band/BandEditorPrimitives'
import { archiveBandDirectionAction, saveBandDirectionAction } from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Dirección · Banda · Panel' }

function DirectionForm({ item, bandId, canEdit }) {
  const isNew = !item?.id
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div><span className={styles.eyebrow}>{isNew ? 'Nueva responsabilidad' : item.is_current ? 'Dirección actual' : 'Histórico'}</span><h3>{isNew ? 'Añadir a la dirección' : item.agent?.name || 'Persona no disponible'}</h3>{!isNew ? <p>{item.role_name}</p> : null}</div>
      </div>
      <form action={saveBandDirectionAction} className={styles.editorForm}>
        <input type="hidden" name="band_id" value={bandId} />
        <input type="hidden" name="band_agent_id" value={item?.id || ''} />
        <input type="hidden" name="agent_entity_id" value={item?.agent_entity_id || ''} />
        <div className={styles.formGrid}>
          <label><span>Nombre</span><input name="person_name" defaultValue={item?.agent?.name || ''} required /></label>
          <label><span>Responsabilidad</span><input name="role_name" defaultValue={item?.role_name || ''} placeholder="Dirección musical" required /></label>
          <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item?.notes || ''} rows="2" /></label>
        </div>
        <SaveBar label={isNew ? 'Añadir responsabilidad' : 'Guardar responsabilidad'} canEdit={canEdit} />
      </form>
      {!isNew && item.is_current && canEdit ? (
        <form action={archiveBandDirectionAction} className={styles.archiveForm}>
          <input type="hidden" name="band_id" value={bandId} />
          <input type="hidden" name="band_agent_id" value={item.id} />
          <button type="submit">Retirar de la dirección actual</button>
        </form>
      ) : null}
    </article>
  )
}

export default async function BandDirectionPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBandEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const displayName = data.popularName?.name || data.entity.name
  const current = data.direction.filter((item) => item.is_current)
  const historical = data.direction.filter((item) => !item.is_current)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/bandas">Bandas</Link><span>→</span><Link href={`/panel/bandas/${id}`}>{displayName}</Link><span>→</span><strong>Dirección</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Organización</span><h1>Dirección y responsables</h1><p>Responsabilidades ejecutivas, musicales, de personal y comunicación.</p></div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Dirección actualizada correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Equipo actual</span><h2>Responsabilidades vigentes</h2></div><p>{current.length} responsabilidad{current.length === 1 ? '' : 'es'} activa{current.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>{current.map((item) => <DirectionForm key={item.id} item={item} bandId={data.entity.id} canEdit={canEdit} />)}{canEdit ? <DirectionForm bandId={data.entity.id} canEdit /> : null}</div>
      </section>

      {historical.length ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Histórico</span><h2>Responsabilidades anteriores</h2></div><p>Se conserva la trayectoria de la organización sin perder relaciones previas.</p></div>
          <div className={styles.editorStack}>{historical.map((item) => <DirectionForm key={item.id} item={item} bandId={data.entity.id} canEdit={canEdit} />)}</div>
        </section>
      ) : null}
    </div>
  )
}
