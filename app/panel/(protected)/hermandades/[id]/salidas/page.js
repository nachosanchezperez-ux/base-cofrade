import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodOutingsEditorData } from '@/lib/panel/brotherhood-outings'
import {
  archiveOutingAction,
  archiveOutingMusicAssignmentAction,
  archiveOutingMusicPositionAction,
  deleteOutingScheduleItemAction,
  removeOutingParticipantAction,
  saveOutingAction,
  saveOutingMusicAssignmentAction,
  saveOutingMusicPositionAction,
  saveOutingParticipantAction,
  saveOutingScheduleItemAction,
  uploadOutingHeroImageAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const EVENT_STATUS_LABELS = { announced: 'Anunciada', held: 'Celebrada', cancelled: 'Cancelada' }
const SAVED_MESSAGES = {
  created: 'La salida se ha creado correctamente.', updated: 'La salida se ha actualizado.', archived: 'La salida se ha archivado.',
  participant: 'El participante se ha guardado.', 'participant-removed': 'El participante se ha retirado.',
  schedule: 'El hito horario se ha guardado.', 'schedule-removed': 'El hito horario se ha eliminado.',
  'music-position': 'La posición musical se ha guardado.', 'music-position-archived': 'La posición musical se ha archivado.',
  'music-assignment': 'La Banda se ha asignado correctamente.', 'music-assignment-archived': 'La asignación musical se ha archivado.',
  'hero-image': 'La imagen principal de la salida se ha actualizado.',
}

function StatusSelect({ defaultValue = 'draft' }) {
  return <select name="status" defaultValue={defaultValue}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option><option value="archived">Archivado</option></select>
}

function OutingFields({ item = null, data }) {
  const routeJson = item?.route ? JSON.stringify(item.route, null, 2) : ''
  return (
    <div className={styles.formGrid}>
      <label className={styles.fieldWide}><span>Título público</span><input name="title" defaultValue={item?.title || ''} placeholder="Salida extraordinaria de…" /></label>
      <label><span>Tipo de salida</span><input name="outing_type" defaultValue={item?.outing_type || 'Procesión extraordinaria'} required /></label>
      <label><span>Carácter</span><select name="character" defaultValue={item?.character || 'extraordinary'}><option value="ordinary">Ordinaria</option><option value="extraordinary">Extraordinaria</option></select></label>
      <label><span>Estado del evento</span><select name="event_status" defaultValue={item?.event_status || 'announced'}><option value="announced">Anunciada</option><option value="held">Celebrada</option><option value="cancelled">Cancelada</option></select></label>
      <label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
      <label><span>Fecha de salida</span><input name="outing_date" type="date" defaultValue={item?.outing_date || ''} /></label>
      <label><span>Fecha de regreso</span><input name="return_date" type="date" defaultValue={item?.return_date || ''} /></label>
      <label><span>Año</span><input name="year" type="number" min="1800" max="2200" defaultValue={item?.year ?? ''} /></label>
      <label><span>Hora de salida</span><input name="departure_time" type="time" defaultValue={item?.departure_time?.slice(0, 5) || ''} /></label>
      <label><span>Hora de regreso</span><input name="return_time" type="time" defaultValue={item?.return_time?.slice(0, 5) || ''} /></label>
      <label><span>Localidad</span><select name="municipality_id" defaultValue={item?.municipality_id || data.brotherhood.municipality_id || ''}><option value="">Sin localidad</option>{data.municipalities.map((municipality) => <option key={municipality.id} value={municipality.id}>{municipality.name} · {municipality.province}</option>)}</select></label>
      <label><span>Origen</span><select name="origin_place_id" defaultValue={item?.origin_place_id || ''}><option value="">Sin origen</option>{data.places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label>
      <label><span>Destino</span><select name="destination_place_id" defaultValue={item?.destination_place_id || ''}><option value="">Sin destino</option>{data.places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label>
      <label><span>Serie anual vinculada</span><select name="outing_series_id" defaultValue={item?.outing_series_id || ''}><option value="">Sin serie vinculada</option>{data.series.map((series) => <option key={series.id} value={series.id}>{series.title}</option>)}</select></label>
      <label className={styles.fieldWide}><span>Motivo</span><input name="reason" defaultValue={item?.reason || ''} /></label>
      <label className={styles.fieldWide}><span>Recorrido resumido</span><textarea name="route_summary" defaultValue={item?.route_summary || ''} rows="3" /></label>
      <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" defaultValue={item?.description || ''} rows="4" /></label>
      <label className={styles.fieldWide}><span>Notas públicas</span><textarea name="public_notes" defaultValue={item?.public_notes || ''} rows="3" /></label>
      <label><span>Organiza</span><input name="organizer_name" defaultValue={item?.organizer_name || data.brotherhood.popular_name || data.entity.name} /></label>
      <label className={styles.fieldWide}><span>Notas de organización</span><textarea name="organizer_notes" defaultValue={item?.organizer_notes || ''} rows="2" /></label>
      <label className={styles.fieldWide}><span>Recorrido estructurado · JSON avanzado</span><textarea name="route_json" defaultValue={routeJson} rows="5" placeholder='Opcional. Ej. [{"place":"Catedral"}]' /></label>
      <label className={styles.fieldWide}><span>Ruta/URL imagen principal</span><input name="hero_image_path" defaultValue={item?.hero_image_path || ''} placeholder="También puedes subirla después" /></label>
      <label><span>Alt imagen principal</span><input name="hero_image_alt" defaultValue={item?.hero_image_alt || ''} /></label>
      <label><span>Crédito imagen principal</span><input name="hero_image_credit" defaultValue={item?.hero_image_credit || ''} /></label>
    </div>
  )
}

export default async function BrotherhoodOutingsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodOutingsEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]
  const returnPath = `/panel/hermandades/${id}/salidas`

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/hermandades">Hermandades</Link><span>→</span><Link href={`/panel/hermandades/${id}`}>{data.brotherhood.popular_name || data.entity.name}</Link><span>→</span><strong>Salidas concretas</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Agenda y extraordinarias</span><h1>Salidas concretas</h1><p>Fecha, itinerario, titulares, horarios y música de cada salida documentada.</p></div>
          <Link className={styles.secondaryButton} href={`/hermandades/${data.entity.slug}#salidas`} target="_blank" rel="noreferrer">Ver en el Front ↗</Link>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Histórico</span><h2>Salidas registradas</h2></div><p>{data.outings.length} salida{data.outings.length === 1 ? '' : 's'} activa{data.outings.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>
          {data.outings.map((outing) => (
            <article className={styles.editorItem} id={`outing-${outing.id}`} key={outing.id}>
              <div className={styles.itemHeading}>
                <div><span className={styles.eyebrow}>{outing.character === 'extraordinary' ? 'Extraordinaria' : 'Ordinaria'} · {EVENT_STATUS_LABELS[outing.event_status] || outing.event_status}</span><h3>{outing.title || outing.outing_type}</h3><p>{[outing.outing_date, outing.departure_time?.slice(0, 5), outing.originPlace?.name].filter(Boolean).join(' · ')}</p></div>
                <span className={`${styles.statusBadge} ${styles[outing.status]}`}>{STATUS_LABELS[outing.status]}</span>
              </div>

              {outing.hero_image_path ? <img src={outing.hero_image_path} alt={outing.hero_image_alt || outing.title || outing.outing_type} style={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 12, marginBottom: 18 }} /> : null}

              {canEdit ? <form action={saveOutingAction} className={styles.editorForm}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><OutingFields item={outing} data={data} /><div className={styles.formActions}><small>Los datos publicados alimentan la ficha de la Hermandad y, si es extraordinaria futura, la Home.</small><button className={styles.secondaryButton} type="submit">Guardar salida</button></div></form> : null}

              {canEdit ? (
                <div className={styles.panelSubsection}>
                  <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Portada</span><h4>Imagen principal</h4></div></div>
                  <form action={uploadOutingHeroImageAction} className={styles.editorForm}>
                    <input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} />
                    <div className={styles.formGrid}><label className={styles.fieldWide}><span>Archivo</span><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" required /></label><label><span>Texto alternativo</span><input name="hero_image_alt" defaultValue={outing.hero_image_alt || outing.title || outing.outing_type} required /></label><label><span>Crédito</span><input name="hero_image_credit" defaultValue={outing.hero_image_credit || ''} /></label></div>
                    <div className={styles.formActions}><small>Actualiza la imagen usada también por el bloque de extraordinarias de la Home.</small><button className={styles.secondaryButton} type="submit">Subir imagen</button></div>
                  </form>
                </div>
              ) : null}

              <div className={styles.panelSubsection}>
                <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Protagonistas</span><h4>Titulares y música litúrgica</h4></div><p>{outing.participants.length} relación{outing.participants.length === 1 ? '' : 'es'}.</p></div>
                <div className={styles.editorStack}>
                  {outing.participants.map((participant) => (
                    <div className={styles.editorItem} key={participant.id}>
                      <strong>{participant.entity?.name || 'Entidad no disponible'}</strong><small>{participant.role === 'processional_image' ? 'Imagen procesional' : 'Música litúrgica'}{participant.notes ? ` · ${participant.notes}` : ''}</small>
                      {canEdit ? <form action={removeOutingParticipantAction} className={styles.archiveForm}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><input type="hidden" name="participant_id" value={participant.id} /><button type="submit">Retirar relación</button></form> : null}
                    </div>
                  ))}
                </div>
                {canEdit ? (
                  <div className={styles.dashboardGrid} style={{ marginTop: 16 }}>
                    <form action={saveOutingParticipantAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><input type="hidden" name="role" value="processional_image" /><EntityPicker name="entity_id" items={data.imageOptions} label="Añadir imagen procesional" emptyLabel="Selecciona una Imagen" placeholder="Buscar titular…" /><label><span>Notas</span><input name="notes" /></label><div className={styles.formActions}><span /><button className={styles.smallButton} type="submit">Vincular titular</button></div></form>
                    <form action={saveOutingParticipantAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><input type="hidden" name="role" value="liturgical_music" /><EntityPicker name="entity_id" items={data.participantOptions} label="Añadir música litúrgica" emptyLabel="Selecciona una entidad" placeholder="Escolanía, coro, formación…" /><label><span>Notas</span><input name="notes" /></label><div className={styles.formActions}><span /><button className={styles.smallButton} type="submit">Vincular música</button></div></form>
                  </div>
                ) : null}
              </div>

              <div className={styles.panelSubsection}>
                <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Guía del día</span><h4>Horarios e hitos</h4></div><p>{outing.schedule.length} hito{outing.schedule.length === 1 ? '' : 's'}.</p></div>
                <div className={styles.editorStack}>
                  {outing.schedule.map((scheduleItem) => (
                    <div className={styles.editorItem} key={scheduleItem.id}>
                      {canEdit ? <form action={saveOutingScheduleItemAction} className={styles.editorForm}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><input type="hidden" name="schedule_item_id" value={scheduleItem.id} /><div className={styles.formGrid}><label><span>Orden</span><input name="sequence_no" type="number" min="1" defaultValue={scheduleItem.sequence_no} /></label><label className={styles.fieldWide}><span>Hito</span><input name="label" defaultValue={scheduleItem.label} required /></label><label><span>Fecha</span><input name="item_date" type="date" defaultValue={scheduleItem.item_date || ''} /></label><label><span>Hora</span><input name="item_time" type="time" defaultValue={scheduleItem.item_time?.slice(0, 5) || ''} /></label><label><span>Hora textual</span><input name="time_text" defaultValue={scheduleItem.time_text || ''} /></label><label><span>Lugar</span><select name="place_id" defaultValue={scheduleItem.place_id || ''}><option value="">Sin lugar</option>{data.places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label><label className={styles.fieldWide}><span>Notas</span><input name="notes" defaultValue={scheduleItem.notes || ''} /></label></div><div className={styles.formActions}><small>{scheduleItem.place?.name || ''}</small><button className={styles.smallButton} type="submit">Guardar hito</button></div></form> : <strong>{scheduleItem.label}</strong>}
                      {canEdit ? <form action={deleteOutingScheduleItemAction} className={styles.archiveForm}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><input type="hidden" name="schedule_item_id" value={scheduleItem.id} /><button type="submit">Eliminar hito</button></form> : null}
                    </div>
                  ))}
                  {canEdit ? <form action={saveOutingScheduleItemAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><div className={styles.formGrid}><label><span>Orden</span><input name="sequence_no" type="number" min="1" defaultValue={outing.schedule.length + 1} /></label><label className={styles.fieldWide}><span>Nuevo hito</span><input name="label" required placeholder="Salida, llegada a Catedral…" /></label><label><span>Fecha</span><input name="item_date" type="date" defaultValue={outing.outing_date || ''} /></label><label><span>Hora</span><input name="item_time" type="time" /></label><label><span>Hora textual</span><input name="time_text" /></label><label><span>Lugar</span><select name="place_id"><option value="">Sin lugar</option>{data.places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label><label className={styles.fieldWide}><span>Notas</span><input name="notes" /></label></div><div className={styles.formActions}><span /><button className={styles.primaryButton} type="submit">Añadir hito</button></div></form> : null}
                </div>
              </div>

              <div className={styles.panelSubsection}>
                <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Música procesional</span><h4>Posiciones y Bandas</h4></div><p>{outing.musicPositions.length} posición{outing.musicPositions.length === 1 ? '' : 'es'}.</p></div>
                <div className={styles.editorStack}>
                  {outing.musicPositions.map((position) => (
                    <div className={styles.editorItem} key={position.id}>
                      <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{position.position_code}</span><h3>{position.position_label || 'Posición musical'}</h3><p>{position.step?.name || 'Sin Paso específico'}</p></div><span className={`${styles.statusBadge} ${styles[position.status]}`}>{STATUS_LABELS[position.status]}</span></div>
                      {canEdit ? <form action={saveOutingMusicPositionAction} className={styles.editorForm}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><input type="hidden" name="position_id" value={position.id} /><div className={styles.formGrid}><label><span>Orden</span><input name="sequence_no" type="number" min="1" defaultValue={position.sequence_no} /></label><label><span>Código</span><input name="position_code" defaultValue={position.position_code} required /></label><label><span>Etiqueta pública</span><input name="position_label" defaultValue={position.position_label || ''} /></label><EntityPicker className={styles.fieldWide} name="step_entity_id" items={data.stepOptions} label="Paso (opcional)" emptyLabel="Sin Paso específico" required={false} defaultValue={position.step_entity_id || ''} /><label><span>Estado</span><StatusSelect defaultValue={position.status} /></label><label className={styles.fieldWide}><span>Notas</span><input name="notes" defaultValue={position.notes || ''} /></label></div><div className={styles.formActions}><span /><button className={styles.smallButton} type="submit">Guardar posición</button></div></form> : null}

                      <div className={styles.editorStack} style={{ marginTop: 14 }}>
                        {position.assignments.map((assignment) => (
                          <div className={styles.editorItem} key={assignment.id}>
                            {canEdit ? <form action={saveOutingMusicAssignmentAction} className={styles.editorForm}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><input type="hidden" name="position_id" value={position.id} /><input type="hidden" name="assignment_id" value={assignment.id} /><div className={styles.formGrid}><EntityPicker className={styles.fieldWide} name="band_entity_id" items={data.bandOptions} label="Banda" defaultValue={assignment.band_entity_id} /><label><span>Orden</span><input name="sequence_no" type="number" min="1" defaultValue={assignment.sequence_no} /></label><label><span>Participación</span><select name="participation_mode" defaultValue={assignment.participation_mode}><option value="full_route">Recorrido completo</option><option value="segment">Por tramo</option><option value="alternating">Alternancia</option><option value="unspecified">Sin precisar</option></select></label><label><span>Desde</span><input name="segment_start_label" defaultValue={assignment.segment_start_label || ''} /></label><label><span>Hasta</span><input name="segment_end_label" defaultValue={assignment.segment_end_label || ''} /></label><label><span>Estado</span><StatusSelect defaultValue={assignment.status} /></label><label className={styles.fieldWide}><span>Notas</span><input name="notes" defaultValue={assignment.notes || ''} /></label></div><div className={styles.formActions}><small>{assignment.band?.name || ''}</small><button className={styles.smallButton} type="submit">Guardar Banda</button></div></form> : <strong>{assignment.band?.name}</strong>}
                            {canEdit ? <form action={archiveOutingMusicAssignmentAction} className={styles.archiveForm}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><input type="hidden" name="position_id" value={position.id} /><input type="hidden" name="assignment_id" value={assignment.id} /><button type="submit">Archivar Banda</button></form> : null}
                          </div>
                        ))}
                        {canEdit ? <form action={saveOutingMusicAssignmentAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><input type="hidden" name="position_id" value={position.id} /><div className={styles.formGrid}><EntityPicker className={styles.fieldWide} name="band_entity_id" items={data.bandOptions} label="Añadir Banda" emptyLabel="Selecciona una Banda" /><label><span>Orden</span><input name="sequence_no" type="number" min="1" defaultValue={position.assignments.length + 1} /></label><label><span>Participación</span><select name="participation_mode" defaultValue="full_route"><option value="full_route">Recorrido completo</option><option value="segment">Por tramo</option><option value="alternating">Alternancia</option><option value="unspecified">Sin precisar</option></select></label><label><span>Desde</span><input name="segment_start_label" /></label><label><span>Hasta</span><input name="segment_end_label" /></label><label><span>Estado</span><StatusSelect defaultValue="draft" /></label><label className={styles.fieldWide}><span>Notas</span><input name="notes" /></label></div><div className={styles.formActions}><span /><button className={styles.primaryButton} type="submit">Añadir Banda</button></div></form> : null}
                      </div>

                      {canEdit ? <form action={archiveOutingMusicPositionAction} className={styles.archiveForm}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><input type="hidden" name="position_id" value={position.id} /><button type="submit">Archivar posición musical</button></form> : null}
                    </div>
                  ))}
                  {canEdit ? <form action={saveOutingMusicPositionAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><div className={styles.formGrid}><label><span>Orden</span><input name="sequence_no" type="number" min="1" defaultValue={outing.musicPositions.length + 1} /></label><label><span>Código</span><input name="position_code" placeholder="palio, misterio, cruz-guia…" required /></label><label><span>Etiqueta pública</span><input name="position_label" placeholder="Tras el paso de palio" /></label><EntityPicker className={styles.fieldWide} name="step_entity_id" items={data.stepOptions} label="Paso (opcional)" emptyLabel="Sin Paso específico" required={false} /><label><span>Estado</span><StatusSelect defaultValue="draft" /></label><label className={styles.fieldWide}><span>Notas</span><input name="notes" /></label></div><div className={styles.formActions}><small>Después podrás añadir una o varias Bandas a esta posición.</small><button className={styles.primaryButton} type="submit">Crear posición</button></div></form> : null}
                </div>
              </div>

              <RelationSourcesEditor relationKind="outing" relationId={outing.id} contextEntityId={id} sourceOptions={data.sourceOptions} links={outing.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />
              {canEdit ? <form action={archiveOutingAction} className={styles.archiveForm}><input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="outing_id" value={outing.id} /><button type="submit">Archivar salida</button></form> : null}
            </article>
          ))}
        </div>
      </section>

      {canEdit ? <section className={styles.editorSection}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nueva salida</span><h2>Registrar salida concreta</h2></div><p>Después podrás añadir titulares, horarios, Bandas, imagen y Fuentes.</p></div><form action={saveOutingAction} className={`${styles.panelCard} ${styles.editorForm}`}><input type="hidden" name="brotherhood_id" value={id} /><OutingFields data={data} /><div className={styles.formActions}><small>Puede quedar en borrador hasta completar la guía.</small><button className={styles.primaryButton} type="submit">Crear salida</button></div></form></section> : null}
    </div>
  )
}
