import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodEditorData } from '@/lib/panel/data'
import { MonthSelect, PlaceSelect, SaveBar, StatusSelect, STATUS_LABELS } from '@/components/panel/brotherhood/BrotherhoodEditorPrimitives'
import { archiveCultAction, saveCultAction } from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Cultos · Hermandad · Panel' }

function CultForm({ item, data, canEdit }) {
  const isNew = !item?.id
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div><span className={styles.eyebrow}>{isNew ? 'Nuevo culto' : item.cult_type}</span><h3>{isNew ? 'Añadir culto' : item.title}</h3></div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}
      </div>
      <form action={saveCultAction} className={styles.editorForm}>
        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
        <input type="hidden" name="cult_id" value={item?.id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Título</span><input name="title" defaultValue={item?.title || ''} required /></label>
          <label><span>Tipo</span><input name="cult_type" defaultValue={item?.cult_type || ''} placeholder="triduo, novena, función…" required /></label>
          <label><span>Fecha concreta</span><input name="cult_date" type="date" defaultValue={item?.cult_date || ''} /></label>
          <label><span>Mes</span><MonthSelect defaultValue={item?.month} /></label>
          <label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? ''} /></label>
          <label className={styles.fieldWide}><span>Regla de fecha</span><input name="date_rule" defaultValue={item?.date_rule || ''} placeholder="Ej. Segundo domingo de noviembre" /></label>
          <label><span>Horario</span><input name="time_text" defaultValue={item?.time_text || ''} /></label>
          <label><span>Lugar</span><PlaceSelect places={data.places} name="place_id" defaultValue={item?.place_id} /></label>
          <label><span>Etiqueta recurrente</span><input name="recurrence_label" defaultValue={item?.recurrence_label || ''} /></label>
          <label className={styles.checkField}><input name="is_recurring" type="checkbox" defaultChecked={item?.is_recurring ?? true} /><span>Se celebra de forma recurrente</span></label>
          <label className={styles.fieldWide}><span>Descripción</span><textarea name="description" defaultValue={item?.description || ''} rows="3" /></label>
          <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" defaultValue={item?.notes || ''} rows="2" /></label>
          <label><span>Estado</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
        </div>
        <SaveBar label={isNew ? 'Crear culto' : 'Guardar culto'} canEdit={canEdit} />
      </form>
      {!isNew && canEdit && item.status !== 'archived' ? (
        <form action={archiveCultAction} className={styles.archiveForm}>
          <input type="hidden" name="brotherhood_id" value={data.entity.id} />
          <input type="hidden" name="cult_id" value={item.id} />
          <button type="submit">Archivar este culto</button>
        </form>
      ) : null}
    </article>
  )
}

export default async function BrotherhoodCultsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/hermandades">Hermandades</Link><span>→</span><Link href={`/panel/hermandades/${id}`}>{data.brotherhood?.popular_name || data.entity.name}</Link><span>→</span><strong>Cultos</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Vida de hermandad</span><h1>Cultos</h1><p>Definiciones recurrentes, fechas concretas, lugares y orden público.</p></div>
          {data.entity.slug ? <Link className={styles.secondaryButton} href={`/hermandades/${data.entity.slug}#cultos`} target="_blank" rel="noreferrer">Ver en el Front ↗</Link> : null}
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cultos actualizados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Calendario litúrgico</span><h2>Cultos registrados</h2></div><p>{data.cults.length} culto{data.cults.length === 1 ? '' : 's'} activo{data.cults.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>
          {data.cults.map((item) => <CultForm key={item.id} item={item} data={data} canEdit={canEdit} />)}
          {canEdit ? <CultForm data={data} canEdit /> : null}
        </div>
      </section>
    </div>
  )
}
