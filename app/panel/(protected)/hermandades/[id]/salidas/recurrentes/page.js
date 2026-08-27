import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodEditorData } from '@/lib/panel/data'
import { MonthSelect, PlaceSelect, SaveBar, StatusSelect, STATUS_LABELS } from '@/components/panel/brotherhood/BrotherhoodEditorPrimitives'
import { archiveOutingSeriesAction, saveMovementAction, saveOutingSeriesAction } from '../../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Salidas habituales · Hermandad · Panel' }

function HabitualOutingForm({ item, data, canEdit }) {
  const isNew = !item?.id
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div><span className={styles.eyebrow}>{isNew ? 'Nueva salida habitual' : item.outing_type}</span><h3>{isNew ? 'Añadir salida habitual' : item.title}</h3></div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}
      </div>
      <form action={saveOutingSeriesAction} className={styles.editorForm}>
        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
        <input type="hidden" name="series_id" value={item?.id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Título</span><input name="title" defaultValue={item?.title || ''} required placeholder="Ej. Vía Crucis anual del Señor" /></label>
          <label><span>Tipo de salida</span><input name="outing_type" list="habitual-outing-types" defaultValue={item?.outing_type || ''} required placeholder="Vía Crucis, Rosario, Traslado…" /></label>
          <label><span>Carácter</span><select name="character" defaultValue={item?.character || 'ordinary'}><option value="ordinary">Ordinaria</option><option value="extraordinary">Extraordinaria</option></select></label>
          <label><span>Mes</span><MonthSelect defaultValue={item?.month} /></label>
          <label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? ''} /></label>
          <label className={styles.fieldWide}><span>Regla anual de fecha</span><input name="date_rule" defaultValue={item?.date_rule || ''} placeholder="Ej. Segundo sábado de septiembre" /></label>
          <label><span>Horario habitual</span><input name="time_text" defaultValue={item?.time_text || ''} placeholder="Ej. 20:30" /></label>
          <label><span>Localidad</span><select name="municipality_id" defaultValue={item?.municipality_id || data.brotherhood?.municipality_id || ''}><option value="">Sin localidad</option>{data.municipalities.map((municipality) => <option key={municipality.id} value={municipality.id}>{municipality.name}</option>)}</select></label>
          <label><span>Origen habitual</span><PlaceSelect places={data.places} name="origin_place_id" defaultValue={item?.origin_place_id} /></label>
          <label><span>Destino habitual</span><PlaceSelect places={data.places} name="destination_place_id" defaultValue={item?.destination_place_id} /></label>
          <label className={styles.fieldWide}><span>Recorrido habitual</span><textarea name="route_summary" defaultValue={item?.route_summary || ''} rows="3" /></label>
          <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" defaultValue={item?.description || ''} rows="3" /></label>
          <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" defaultValue={item?.notes || ''} rows="2" /></label>
          <label><span>Estado</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
        </div>
        <SaveBar label={isNew ? 'Crear salida habitual' : 'Guardar salida'} canEdit={canEdit} />
      </form>

      {!isNew ? (
        <div className={styles.subEditor}>
          <div className={styles.subEditorHeading}><div><span className={styles.eyebrow}>Ida, regreso y traslados</span><h4>Movimientos habituales</h4></div><span>{item.movements.length}</span></div>
          {item.movements.map((movement) => (
            <form action={saveMovementAction} className={styles.movementForm} key={movement.id}>
              <input type="hidden" name="brotherhood_id" value={data.entity.id} />
              <input type="hidden" name="series_id" value={item.id} />
              <input type="hidden" name="series_title" value={item.title} />
              <input type="hidden" name="movement_id" value={movement.id} />
              <label><span>Orden</span><input name="sequence_no" type="number" defaultValue={movement.sequence_no} /></label>
              <label><span>Dirección</span><input name="direction" defaultValue={movement.direction} required /></label>
              <label><span>Fecha</span><input name="date_rule" defaultValue={movement.date_rule || ''} /></label>
              <label><span>Hora</span><input name="time_text" defaultValue={movement.time_text || ''} /></label>
              <label><span>Origen</span><PlaceSelect places={data.places} name="origin_place_id" defaultValue={movement.origin_place_id} /></label>
              <label><span>Destino</span><PlaceSelect places={data.places} name="destination_place_id" defaultValue={movement.destination_place_id} /></label>
              <label className={styles.fieldWide}><span>Recorrido</span><input name="route_summary" defaultValue={movement.route_summary || ''} /></label>
              <label className={styles.fieldWide}><span>Descripción</span><input name="description" defaultValue={movement.description || ''} /></label>
              {canEdit ? <button className={styles.smallButton} type="submit">Guardar movimiento</button> : null}
            </form>
          ))}
          {canEdit ? (
            <details className={styles.addDetails}>
              <summary>Añadir movimiento <span>＋</span></summary>
              <form action={saveMovementAction} className={styles.movementForm}>
                <input type="hidden" name="brotherhood_id" value={data.entity.id} />
                <input type="hidden" name="series_id" value={item.id} />
                <input type="hidden" name="series_title" value={item.title} />
                <label><span>Orden</span><input name="sequence_no" type="number" defaultValue={item.movements.length + 1} /></label>
                <label><span>Dirección</span><input name="direction" placeholder="ida / regreso" required /></label>
                <label><span>Fecha</span><input name="date_rule" /></label>
                <label><span>Hora</span><input name="time_text" /></label>
                <label><span>Origen</span><PlaceSelect places={data.places} name="origin_place_id" /></label>
                <label><span>Destino</span><PlaceSelect places={data.places} name="destination_place_id" /></label>
                <label className={styles.fieldWide}><span>Recorrido</span><input name="route_summary" /></label>
                <label className={styles.fieldWide}><span>Descripción</span><input name="description" /></label>
                <button className={styles.smallButton} type="submit">Añadir movimiento</button>
              </form>
            </details>
          ) : null}
        </div>
      ) : null}

      {!isNew && canEdit && item.status !== 'archived' ? (
        <form action={archiveOutingSeriesAction} className={styles.archiveForm}>
          <input type="hidden" name="brotherhood_id" value={data.entity.id} />
          <input type="hidden" name="series_id" value={item.id} />
          <button type="submit">Archivar esta salida habitual</button>
        </form>
      ) : null}
    </article>
  )
}

export default async function BrotherhoodRecurringOutingsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <datalist id="habitual-outing-types">
        <option value="Estación de penitencia" />
        <option value="Procesión de Gloria" />
        <option value="Vía Crucis" />
        <option value="Rosario público" />
        <option value="Traslado" />
        <option value="Romería" />
        <option value="Subida" />
        <option value="Bajada" />
        <option value="Procesión sacramental" />
        <option value="Procesión extraordinaria" />
        <option value="Otra salida pública" />
      </datalist>

      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/hermandades">Hermandades</Link><span>→</span><Link href={`/panel/hermandades/${id}`}>{data.brotherhood?.popular_name || data.entity.name}</Link><span>→</span><Link href={`/panel/hermandades/${id}/salidas`}>Salidas</Link><span>→</span><strong>Salidas habituales</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Calendario de la Hermandad</span><h1>Salidas habituales</h1><p>Estación de penitencia, procesiones de Gloria, Vía Crucis, rosarios, traslados, romerías y demás salidas que forman parte del calendario habitual.</p></div>
          <Link className={styles.secondaryButton} href={`/panel/hermandades/${id}/salidas`}>Volver a Salidas</Link>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Salidas habituales actualizadas correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Calendario habitual</span><h2>Salidas habituales registradas</h2></div><p>{data.series.length} salida{data.series.length === 1 ? '' : 's'} habitual{data.series.length === 1 ? '' : 'es'}.</p></div>
        <div className={styles.editorStack}>{data.series.map((item) => <HabitualOutingForm key={item.id} item={item} data={data} canEdit={canEdit} />)}{canEdit ? <HabitualOutingForm data={data} canEdit /> : null}</div>
      </section>
    </div>
  )
}
