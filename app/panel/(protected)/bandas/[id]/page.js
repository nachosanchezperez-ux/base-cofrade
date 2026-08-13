import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBandEditorData } from '@/lib/panel/data'
import {
  archiveBandAccompanimentAction,
  archiveBandDirectionAction,
  archiveBandOutingAction,
  archiveBandPremiereAction,
  saveBandAccompanimentAction,
  saveBandDirectionAction,
  saveBandOutingAction,
  saveBandPremiereAction,
  updateBandAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
export const metadata = { title: 'Editar banda · Panel' }

function StatusSelect({ defaultValue = 'draft' }) {
  return <select name="status" defaultValue={defaultValue}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option><option value="archived">Archivado</option></select>
}

function MunicipalitySelect({ municipalities, defaultValue = '' }) {
  return <select name="municipality_id" defaultValue={defaultValue || ''}><option value="">Sin localidad</option>{municipalities.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.province}</option>)}</select>
}

function BrotherhoodSelect({ brotherhoods, defaultValue = '', name = 'brotherhood_entity_id', required = true }) {
  return <select name={name} defaultValue={defaultValue || ''} required={required}><option value="">{required ? 'Selecciona una hermandad' : 'Sin ficha vinculada'}</option>{brotherhoods.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
}

function SaveBar({ label, canEdit }) {
  return <div className={styles.formActions}><small>{canEdit ? 'Los datos publicados se reflejan en la ficha pública.' : 'Tu perfil tiene acceso de consulta.'}</small>{canEdit ? <button className={styles.primaryButton} type="submit">{label}</button> : null}</div>
}

function SourceFields({ source }) {
  return <><input type="hidden" name="source_id" value={source?.id || ''} /><label className={styles.fieldWide}><span>Fuente</span><input name="source_name" defaultValue={source?.name || ''} placeholder="Nombre de la página o publicación" required /></label><label className={styles.fieldWide}><span>Enlace de la fuente</span><input name="source_url" type="url" defaultValue={source?.url || ''} placeholder="https://…" required /></label><label><span>Editor o responsable</span><input name="source_publisher" defaultValue={source?.author_or_publisher || ''} /></label><label><span>Fecha de publicación</span><input name="source_publication_date" type="date" defaultValue={source?.publication_date || ''} /></label></>
}

function DirectionForm({ item, bandId, canEdit }) {
  const isNew = !item?.id
  return <article className={styles.editorItem}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>{isNew ? 'Nueva responsabilidad' : item.role_name}</span><h3>{isNew ? 'Añadir a la dirección' : item.agent?.name}</h3></div></div><form action={saveBandDirectionAction} className={styles.editorForm}><input type="hidden" name="band_id" value={bandId} /><input type="hidden" name="band_agent_id" value={item?.id || ''} /><input type="hidden" name="agent_entity_id" value={item?.agent_entity_id || ''} /><div className={styles.formGrid}><label><span>Nombre</span><input name="person_name" defaultValue={item?.agent?.name || ''} required /></label><label><span>Responsabilidad</span><input name="role_name" defaultValue={item?.role_name || ''} placeholder="Dirección musical" required /></label><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item?.notes || ''} rows="2" /></label></div><SaveBar label={isNew ? 'Añadir responsabilidad' : 'Guardar responsabilidad'} canEdit={canEdit} /></form>{!isNew && item.is_current && canEdit ? <form action={archiveBandDirectionAction} className={styles.archiveForm}><input type="hidden" name="band_id" value={bandId} /><input type="hidden" name="band_agent_id" value={item.id} /><button type="submit">Retirar de la dirección actual</button></form> : null}</article>
}

function AccompanimentForm({ item, data, canEdit }) {
  const isNew = !item?.id
  return <article className={styles.editorItem}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>{isNew ? 'Nuevo acompañamiento' : item.outing_type}</span><h3>{isNew ? 'Añadir acompañamiento habitual' : item.brotherhood?.name}</h3></div>{!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}</div><form action={saveBandAccompanimentAction} className={styles.editorForm}><input type="hidden" name="band_id" value={data.entity.id} /><input type="hidden" name="period_id" value={item?.id || ''} /><input type="hidden" name="step_entity_id" value={item?.step_entity_id || ''} /><div className={styles.formGrid}><label><span>Hermandad</span><BrotherhoodSelect brotherhoods={data.brotherhoods} defaultValue={item?.brotherhood_entity_id} /></label><label><span>Jornada o salida</span><input name="outing_type" defaultValue={item?.outing_type || ''} placeholder="Domingo de Ramos" required /></label><label><span>Ubicación en el cortejo</span><input name="position" defaultValue={item?.position || 'Tras el paso'} required /></label><label><span>Año de inicio</span><input name="year_from" type="number" min="1800" max="2200" defaultValue={item?.year_from ?? ''} required /></label><label><span>Año de finalización</span><input name="year_to" type="number" min="1800" max="2200" defaultValue={item?.year_to ?? ''} placeholder="Vacío si continúa" /></label><label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked={item?.is_current ?? true} /><span>Acompañamiento actual</span></label><label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item?.notes || ''} rows="3" /></label></div><SaveBar label={isNew ? 'Crear acompañamiento' : 'Guardar acompañamiento'} canEdit={canEdit} /></form>{!isNew && item.status !== 'archived' && canEdit ? <form action={archiveBandAccompanimentAction} className={styles.archiveForm}><input type="hidden" name="band_id" value={data.entity.id} /><input type="hidden" name="period_id" value={item.id} /><button type="submit">Archivar este acompañamiento</button></form> : null}</article>
}

function OutingForm({ item, data, canEdit }) {
  const isNew = !item?.id
  return <article className={styles.editorItem}>
    <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{isNew ? 'Nueva extraordinaria' : item.outing_date}</span><h3>{isNew ? 'Añadir próxima salida' : item.title}</h3></div>{!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}</div>
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
        <label><span>Ubicación de la banda</span><input name="position_label" defaultValue={item?.position?.position_label || ''} placeholder="Solo si está documentada" /></label>
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
    {!isNew && item.status !== 'archived' && canEdit ? <form action={archiveBandOutingAction} className={styles.archiveForm}><input type="hidden" name="band_id" value={data.entity.id} /><input type="hidden" name="outing_id" value={item.id} /><button type="submit">Archivar esta salida</button></form> : null}
  </article>
}

function PremiereForm({ item, bandId, canEdit }) {
  const isNew = !item?.id
  return <article className={styles.editorItem}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>{isNew ? 'Nuevo estreno' : item.premiere_year}</span><h3>{isNew ? 'Añadir estreno' : item.title}</h3></div>{!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}</div><form action={saveBandPremiereAction} className={styles.editorForm}><input type="hidden" name="band_id" value={bandId} /><input type="hidden" name="premiere_id" value={item?.id || ''} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Título de la marcha</span><input name="title" defaultValue={item?.title || ''} required /></label><label className={styles.fieldWide}><span>Compositor</span><input name="composer_name" defaultValue={item?.composer_name || ''} required /></label><label><span>Año del estreno</span><input name="premiere_year" type="number" min="1800" max="2200" defaultValue={item?.premiere_year || new Date().getFullYear()} required /></label><label><span>Fecha exacta</span><input name="premiere_date" type="date" defaultValue={item?.premiere_date || ''} /></label><label><span>Lugar</span><input name="venue_text" defaultValue={item?.venue_text || ''} placeholder="Parroquia o auditorio" /></label><label><span>Municipio</span><input name="municipality_text" defaultValue={item?.municipality_text || ''} /></label><label className={styles.fieldWide}><span>Enlace de YouTube</span><input name="video_url" type="url" defaultValue={item?.video_url || ''} /></label><label className={styles.fieldWide}><span>Descripción</span><textarea name="description" defaultValue={item?.description || ''} rows="3" /></label><label><span>Orden</span><input name="display_order" type="number" min="0" defaultValue={item?.display_order || 0} /></label><label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label><SourceFields source={item?.source} /></div><SaveBar label={isNew ? 'Crear estreno' : 'Guardar estreno'} canEdit={canEdit} /></form>{!isNew && item.status !== 'archived' && canEdit ? <form action={archiveBandPremiereAction} className={styles.archiveForm}><input type="hidden" name="band_id" value={bandId} /><input type="hidden" name="premiere_id" value={item.id} /><button type="submit">Archivar este estreno</button></form> : null}</article>
}

export default async function BandEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBandEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const displayName = data.popularName?.name || data.entity.name

  return <div className={styles.pageWrap}>
    <header className={styles.editorHeader}><div className={styles.breadcrumb}><Link href="/panel/bandas">Bandas</Link><span>→</span><strong>{displayName}</strong></div><div className={styles.editorTitleRow}><div><span className={styles.eyebrow}>Editar ficha</span><h1>{displayName}</h1><p>{data.officialName?.name}</p></div><div className={styles.editorHeaderActions}><span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>{data.entity.slug ? <Link className={styles.secondaryButton} href={`/bandas/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}</div></div></header>
    {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
    {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando la ficha como colaborador. Un editor debe realizar los cambios.</div> : null}
    <nav className={styles.sectionTabs} aria-label="Secciones de la ficha"><a href="#general">General</a><a href="#acompanamientos">Acompañamientos</a><a href="#extraordinarias">Extraordinarias</a><a href="#estrenos">Estrenos</a><a href="#direccion">Dirección</a></nav>

    <section className={styles.editorSection} id="general"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Identidad</span><h2>Información general</h2></div><p>Nombre, clasificación, relaciones, colores, imagen, trayectoria y enlaces oficiales.</p></div><form action={updateBandAction} className={`${styles.panelCard} ${styles.editorForm}`}><input type="hidden" name="band_id" value={data.entity.id} /><input type="hidden" name="official_name_id" value={data.officialName?.id || ''} /><input type="hidden" name="popular_name_id" value={data.popularName?.id || ''} /><div className={styles.formGrid}><label><span>Nombre popular</span><input name="popular_name" defaultValue={displayName} required /></label><label><span>Nombre corto oficial</span><input name="official_short_name" defaultValue={data.officialName?.short_name || ''} /></label><label className={styles.fieldWide}><span>Nombre oficial</span><input name="official_name" defaultValue={data.officialName?.name || ''} required /></label><label><span>Slug público</span><input name="slug" defaultValue={data.entity.slug || ''} required /></label><label><span>Estado editorial</span><StatusSelect defaultValue={data.entity.status} /></label><label><span>Tipo de formación</span><select name="band_type" defaultValue={data.band?.band_type || 'Cornetas y Tambores'}><option value="Cornetas y Tambores">Cornetas y Tambores</option><option value="Agrupación Musical">Agrupación Musical</option><option value="Banda de Música">Banda de Música</option><option value="Capilla Musical">Capilla Musical</option><option value="Otra">Otra</option></select></label><label><span>Fundación</span><input name="foundation_text" defaultValue={data.band?.foundation_text || ''} /></label><label><span>Localidad</span><MunicipalitySelect municipalities={data.municipalities} defaultValue={data.band?.municipality_id} /></label><label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" defaultValue={data.entity.summary || ''} rows="3" /></label><label className={styles.fieldWide}><span>Hermandad vinculada</span><BrotherhoodSelect name="linked_brotherhood_entity_id" brotherhoods={data.brotherhoods} defaultValue={data.linkedBrotherhoodRelation?.target_entity_id} required={false} /></label><label className={styles.fieldWide}><span>Sede o local de ensayo</span><input name="headquarters_text" defaultValue={data.band?.headquarters_text || ''} /></label><label><span>Color principal</span><input name="primary_color" defaultValue={data.band?.primary_color || ''} placeholder="#63358B" /></label><label><span>Color secundario</span><input name="secondary_color" defaultValue={data.band?.secondary_color || ''} placeholder="#29272C" /></label><label className={styles.fieldWide}><span>Ruta pública del logotipo</span><input name="logo_path" defaultValue={data.band?.logo_path || ''} /></label><label className={styles.fieldWide}><span>Ruta pública de la fotografía principal</span><input name="hero_image_path" defaultValue={data.band?.hero_image_path || ''} /></label><label className={styles.fieldWide}><span>Descripción accesible de la fotografía</span><input name="hero_image_alt" defaultValue={data.band?.hero_image_alt || ''} /></label><label className={styles.fieldWide}><span>Crédito de la fotografía</span><input name="hero_image_credit" defaultValue={data.band?.hero_image_credit || ''} /></label><label><span>Web oficial</span><input name="website_url" type="url" defaultValue={data.band?.website_url || ''} /></label><label><span>Canal de YouTube</span><input name="youtube_url" type="url" defaultValue={data.band?.youtube_url || ''} /></label><label><span>Instagram</span><input name="instagram_url" type="url" defaultValue={data.band?.instagram_url || ''} /></label><label className={styles.fieldWide}><span>Historia breve</span><textarea name="description" defaultValue={data.band?.description || ''} rows="6" /></label></div><SaveBar label="Guardar información general" canEdit={canEdit} /></form></section>

    <section className={styles.editorSection} id="acompanamientos"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Semana Santa</span><h2>Acompañamientos actuales</h2></div><p>Relaciona la banda con hermandades y periodos documentados.</p></div><div className={styles.editorStack}>{data.periods.map((item) => <AccompanimentForm key={item.id} item={item} data={data} canEdit={canEdit} />)}{canEdit ? <AccompanimentForm data={data} canEdit /> : null}</div></section>
    <section className={styles.editorSection} id="extraordinarias"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Agenda</span><h2>Próximas salidas extraordinarias</h2></div><p>Las citas pasadas dejan de aparecer automáticamente en la ficha pública.</p></div><div className={styles.editorStack}>{data.outings.map((item) => <OutingForm key={item.id} item={item} data={data} canEdit={canEdit} />)}{canEdit ? <OutingForm data={data} canEdit /> : null}</div></section>
    <section className={styles.editorSection} id="estrenos"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Patrimonio musical</span><h2>Estrenos</h2></div><p>Composición, autoría, año, vídeo y fuente documental.</p></div><div className={styles.editorStack}>{data.premieres.map((item) => <PremiereForm key={item.id} item={item} bandId={data.entity.id} canEdit={canEdit} />)}{canEdit ? <PremiereForm bandId={data.entity.id} canEdit /> : null}</div></section>
    <section className={styles.editorSection} id="direccion"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Organización</span><h2>Dirección actual</h2></div><p>Responsabilidades ejecutivas, musicales, de personal y comunicación.</p></div><div className={styles.editorStack}>{data.direction.map((item) => <DirectionForm key={item.id} item={item} bandId={data.entity.id} canEdit={canEdit} />)}{canEdit ? <DirectionForm bandId={data.entity.id} canEdit /> : null}</div></section>
  </div>
}
