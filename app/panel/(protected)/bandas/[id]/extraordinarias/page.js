import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBandEditorData } from '@/lib/panel/data'
import { BrotherhoodSelect, MunicipalitySelect, SaveBar, StatusSelect, STATUS_LABELS } from '@/components/panel/band/BandEditorPrimitives'
import { archiveBandOutingAction, saveBandOutingAction } from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Extraordinarias · Banda · Panel' }

function OutingForm({ item, data, canEdit }) {
  const isNew = !item?.id
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div><span className={styles.eyebrow}>{isNew ? 'Nueva extraordinaria' : item.outing_date}</span><h3>{isNew ? 'Añadir próxima salida' : item.title}</h3></div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}
      </div>
      <form action={saveBandOutingAction} className={styles.editorForm}>
        <input type="hidden" name="band_id" value={data.entity.id} />
        <input type="hidden" name="outing_id" value={item?.id || ''} />
        <input type="hidden" name="position_id" value={item?.position?.id || ''} />
        <input type="hidden" name="assignment_id" value={item?.assignment?.id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Título</span><input name="title" defaultValue={item?.title || ''} required /></label>
          <label><span>Ficha de hermandad</span><BrotherhoodSelect brotherhoods={data.brotherhoods} defaultValue={item?.brotherhood_entity_id} required={false} /></label>
          <label><span>Organiza / corporación</span><input name="organizer_name" defaultValue={item?.organizer_name || ''} placeholder="Nombre si todavía no tiene ficha" /></label>
          <label><span>Tipo de salida</span><input name="outing_type" defaultValue={item?.outing_type || 'Procesión extraordinaria'} required /></label>
          <label><span>Ubicación de la Banda</span><input name="position_label" defaultValue={item?.position?.position_label || ''} placeholder="Solo si está documentada" /></label>
          <label><span>Participación</span><select name="participation_mode" defaultValue={item?.assignment?.participation_mode || 'unspecified'}><option value="unspecified">Sin precisar</option><option value="full_route">Recorrido completo</option><option value="alternating">Alternancia</option><option value="segment">Por tramo</option></select></label>
          <label><span>Fecha</span><input name="outing_date" type="date" defaultValue={item?.outing_date || ''} required /></label>
          <label><span>Hora de salida</span><input name="departure_time" type="time" defaultValue={item?.departure_time?.slice(0, 5) || ''} /></label>
          <label><span>Localidad</span><MunicipalitySelect municipalities={data.municipalities} defaultValue={item?.municipality_id} /></label>
          <label><span>Estado del evento</span><select name="event_status" defaultValue={item?.event_status || 'announced'}><option value="announced">Anunciado</option><option value="held">Celebrado</option><option value="cancelled">Cancelado</option></select></label>
          <label className={styles.fieldWide}><span>Motivo</span><input name="reason" defaultValue={item?.reason || ''} /></label>
          <label className={styles.fieldWide}><span>Descripción</span><textarea name="description" defaultValue={item?.description || ''} rows="3" /></label>
          <label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
        </div>
        <SaveBar label={isNew ? 'Crear salida extraordinaria' : 'Guardar salida extraordinaria'} canEdit={canEdit} />
      </form>
      {!isNew && item.status !== 'archived' && canEdit ? (
        <form action={archiveBandOutingAction} className={styles.archiveForm}>
          <input type="hidden" name="band_id" value={data.entity.id} />
          <input type="hidden" name="outing_id" value={item.id} />
          <button type="submit">Archivar esta salida</button>
        </form>
      ) : null}
    </article>
  )
}

export default async function BandExtraordinaryOutingsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBandEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const displayName = data.popularName?.name || data.entity.name

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/bandas">Bandas</Link><span>→</span><Link href={`/panel/bandas/${id}`}>{displayName}</Link><span>→</span><strong>Extraordinarias</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Agenda</span><h1>Salidas extraordinarias</h1><p>Citas especiales, participación de la Banda, localidad y posición en el cortejo.</p></div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Extraordinarias actualizadas correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Agenda documentada</span><h2>Salidas registradas</h2></div><p>{data.outings.length} cita{data.outings.length === 1 ? '' : 's'} vinculada{data.outings.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>{data.outings.map((item) => <OutingForm key={item.id} item={item} data={data} canEdit={canEdit} />)}{canEdit ? <OutingForm data={data} canEdit /> : null}</div>
      </section>
    </div>
  )
}
