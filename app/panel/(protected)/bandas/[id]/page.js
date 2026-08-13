import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBandEditorData } from '@/lib/panel/data'
import {
  archiveBandAssetContributionAction,
  archiveBandAccompanimentAction,
  archiveBandDirectionAction,
  archiveBandHeritageAssetAction,
  archiveBandOutingAction,
  archiveBandPremiereAction,
  saveBandAssetContributionAction,
  saveBandAccompanimentAction,
  saveBandDirectionAction,
  saveBandHeritageAssetAction,
  saveBandOutingAction,
  saveBandPremiereAction,
  saveBandSocialLinkAction,
  updateBandAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const SOCIAL_PLATFORMS = [['website', 'Web oficial'], ['facebook', 'Facebook'], ['instagram', 'Instagram'], ['x', 'X / Twitter'], ['youtube', 'YouTube'], ['spotify', 'Spotify'], ['tiktok', 'TikTok'], ['whatsapp', 'Canal de WhatsApp']]
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

function SocialLinkForm({ item, bandId, canEdit }) {
  const isNew = !item?.id
  return <form action={saveBandSocialLinkAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="band_id" value={bandId} /><input type="hidden" name="link_id" value={item?.id || ''} /><div className={styles.formGrid}><label><span>Plataforma</span><select name="platform" defaultValue={item?.platform || 'website'} disabled={!isNew}>{SOCIAL_PLATFORMS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{!isNew ? <input type="hidden" name="platform" value={item.platform} /> : null}</label><label><span>Nombre visible</span><input name="label" defaultValue={item?.label || ''} placeholder="Spotify oficial" /></label><label className={styles.fieldWide}><span>URL oficial</span><input name="url" type="url" defaultValue={item?.url || ''} placeholder="https://…" required /></label><label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? 0} /></label><label className={styles.checkField}><input name="is_public" type="checkbox" defaultChecked={item?.is_public ?? true} /><span>Mostrar públicamente</span></label></div><SaveBar label={isNew ? 'Añadir enlace' : 'Guardar enlace'} canEdit={canEdit} /></form>
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
  return <article className={styles.editorItem}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>{isNew ? 'Nuevo estreno' : item.premiere_year}</span><h3>{isNew ? 'Añadir estreno' : item.title}</h3></div>{!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}</div><form action={saveBandPremiereAction} className={styles.editorForm}><input type="hidden" name="band_id" value={bandId} /><input type="hidden" name="premiere_id" value={item?.id || ''} /><input type="hidden" name="march_entity_id" value={item?.march_entity_id || ''} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Título de la marcha</span><input name="title" defaultValue={item?.title || ''} required /></label><label><span>Compositor</span><input name="composer_name" defaultValue={item?.composerName || item?.composer_name || ''} required /></label><label><span>Adaptador</span><input name="adapter_name" defaultValue={item?.adapterName || ''} placeholder="Solo cuando corresponda" /></label><label><span>Año del estreno</span><input name="premiere_year" type="number" min="1800" max="2200" defaultValue={item?.premiere_year || new Date().getFullYear()} required /></label><label><span>Fecha exacta</span><input name="premiere_date" type="date" defaultValue={item?.premiere_date || ''} /></label><label><span>Lugar</span><input name="venue_text" defaultValue={item?.venue_text || ''} placeholder="Parroquia o auditorio" /></label><label><span>Municipio</span><input name="municipality_text" defaultValue={item?.municipality_text || ''} /></label><label className={styles.fieldWide}><span>Enlace de YouTube</span><input name="video_url" type="url" defaultValue={item?.video_url || ''} /></label><label className={styles.fieldWide}><span>Descripción</span><textarea name="description" defaultValue={item?.description || ''} rows="3" /></label><label><span>Orden</span><input name="display_order" type="number" min="0" defaultValue={item?.display_order || 0} /></label><label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label><SourceFields source={item?.source} /></div><SaveBar label={isNew ? 'Crear estreno' : 'Guardar estreno'} canEdit={canEdit} /></form>{!isNew && item.status !== 'archived' && canEdit ? <form action={archiveBandPremiereAction} className={styles.archiveForm}><input type="hidden" name="band_id" value={bandId} /><input type="hidden" name="premiere_id" value={item.id} /><button type="submit">Archivar este estreno</button></form> : null}</article>
}

function BandAssetContributionForm({ item, asset, data, canEdit }) {
  const isNew = !item?.id
  return <article className={styles.contributionItem}>
    <div className={styles.contributionHeading}><div><span className={styles.eyebrow}>{isNew ? 'Nueva intervención' : item.intervention_type}</span><h4>{isNew ? 'Vincular autor o taller' : `${item.agentName} · ${item.discipline}`}</h4></div>{!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}</div>
    <form action={saveBandAssetContributionAction} className={styles.editorForm}>
      <input type="hidden" name="band_id" value={data.entity.id} /><input type="hidden" name="asset_entity_id" value={asset.entity.id} /><input type="hidden" name="contribution_id" value={item?.id || ''} />
      <div className={styles.formGrid}>
        <label className={styles.fieldWide}><span>Autor, taller o institución</span><select name="agent_entity_id" defaultValue={item?.agent_entity_id || ''} required><option value="">Selecciona un agente</option>{data.agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}</select></label>
        <label><span>Disciplina</span><input name="discipline" defaultValue={item?.discipline || ''} placeholder="Bordados, orfebrería…" required /></label>
        <label><span>Tipo de intervención</span><input name="intervention_type" defaultValue={item?.intervention_type || 'Realización'} /></label>
        <label><span>Papel o fase</span><input name="phase" defaultValue={item?.phase || ''} /></label>
        <label><span>Elemento</span><input name="element_name" defaultValue={item?.element_name || asset.entity.name} /></label>
        <label><span>Fecha</span><input name="contribution_date_from" type="date" defaultValue={item?.date_from || ''} /></label>
        <label><span>Datación textual</span><input name="contribution_date_from_text" defaultValue={item?.date_from_text || ''} placeholder="1999, 2017…" /></label>
        <label><span>Estado</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
        <label className={styles.fieldWide}><span>Descripción</span><textarea name="contribution_description" defaultValue={item?.description || ''} rows="2" /></label>
      </div>
      <SaveBar label={isNew ? 'Vincular agente' : 'Guardar intervención'} canEdit={canEdit} />
    </form>
    {!isNew && canEdit && item.status !== 'archived' ? <form action={archiveBandAssetContributionAction} className={styles.archiveForm}><input type="hidden" name="band_id" value={data.entity.id} /><input type="hidden" name="asset_entity_id" value={asset.entity.id} /><input type="hidden" name="contribution_id" value={item.id} /><button type="submit">Archivar esta intervención</button></form> : null}
  </article>
}

function BandHeritageAssetForm({ item, data, canEdit }) {
  const isNew = !item?.entity?.id
  const entity = item?.entity || {}
  return <article className={`${styles.editorItem} ${styles.assetEditorItem}`}>
    <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Banderín</span><h3>{isNew ? 'Añadir banderín' : entity.name}</h3></div>{!isNew ? <span className={`${styles.statusBadge} ${styles[entity.status]}`}>{STATUS_LABELS[entity.status]}</span> : null}</div>
    <form action={saveBandHeritageAssetAction} className={styles.editorForm}>
      <input type="hidden" name="band_id" value={data.entity.id} /><input type="hidden" name="asset_entity_id" value={entity.id || ''} /><input type="hidden" name="asset_type" value="Banderín" /><input type="hidden" name="is_featured" value="on" />
      <div className={styles.formGrid}>
        <label className={styles.fieldWide}><span>Nombre del banderín</span><input name="asset_name" defaultValue={entity.name || ''} placeholder="Banderín de la formación" required /></label>
        <label><span>Slug público</span><input name="asset_slug" defaultValue={entity.slug || ''} required /></label>
        <label className={styles.fieldWide}><span>Resumen breve</span><textarea name="asset_summary" defaultValue={entity.summary || ''} rows="2" /></label>
        <label><span>Fecha</span><input name="date_from" type="date" defaultValue={item?.date_from || ''} /></label>
        <label><span>Datación textual</span><input name="date_from_text" defaultValue={item?.date_from_text || ''} /></label>
        <label><span>Técnica</span><input name="technique" defaultValue={item?.technique || ''} /></label>
        <label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? 0} /></label>
        <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="asset_description" defaultValue={item?.description || ''} rows="4" /></label>
        <label className={styles.fieldWide}><span>Origen y restauraciones</span><textarea name="origin_notes" defaultValue={item?.origin_notes || ''} rows="3" /></label>
        <label className={styles.fieldWide}><span>Ruta pública de la imagen</span><input name="public_image_path" defaultValue={item?.public_image_path || ''} /></label>
        <label className={styles.fieldWide}><span>Descripción accesible de la imagen</span><input name="public_image_alt" defaultValue={item?.public_image_alt || ''} /></label>
        <label className={styles.fieldWide}><span>Crédito de la imagen</span><input name="public_image_credit" defaultValue={item?.public_image_credit || ''} /></label>
        <label><span>Estado editorial</span><StatusSelect defaultValue={entity.status || 'draft'} /></label>
        <label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked={item?.is_current ?? true} /><span>Banderín actual</span></label>
        <label className={styles.fieldWide}><span>Notas internas</span><textarea name="asset_notes" defaultValue={item?.notes || ''} rows="2" /></label>
      </div>
      <SaveBar label={isNew ? 'Crear banderín' : 'Guardar banderín'} canEdit={canEdit} />
    </form>
    {!isNew ? <div className={styles.contributionBlock}><div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Relaciones</span><h4>Realización y restauraciones</h4></div><p>Una misma pieza puede reunir distintos responsables, años y disciplinas.</p></div><div className={styles.contributionStack}>{item.contributions.map((contribution) => <BandAssetContributionForm key={contribution.id} item={contribution} asset={item} data={data} canEdit={canEdit} />)}{canEdit ? <BandAssetContributionForm asset={item} data={data} canEdit /> : null}</div></div> : null}
    {!isNew && canEdit && entity.status !== 'archived' ? <form action={archiveBandHeritageAssetAction} className={styles.archiveForm}><input type="hidden" name="band_id" value={data.entity.id} /><input type="hidden" name="asset_entity_id" value={entity.id} /><button type="submit">Archivar este banderín</button></form> : null}
  </article>
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
    <nav className={styles.sectionTabs} aria-label="Secciones de la ficha"><a href="#general">General</a><a href="#banderin">Banderín</a><a href="#enlaces">Enlaces</a><a href="#acompanamientos">Acompañamientos</a><a href="#extraordinarias">Extraordinarias</a><a href="#estrenos">Estrenos</a><a href="#direccion">Dirección</a></nav>

    <section className={styles.editorSection} id="general"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Identidad</span><h2>Información general</h2></div><p>Nombre, clasificación, relaciones, colores, imagen y trayectoria.</p></div><form action={updateBandAction} className={`${styles.panelCard} ${styles.editorForm}`}><input type="hidden" name="band_id" value={data.entity.id} /><input type="hidden" name="official_name_id" value={data.officialName?.id || ''} /><input type="hidden" name="popular_name_id" value={data.popularName?.id || ''} /><div className={styles.formGrid}><label><span>Nombre popular</span><input name="popular_name" defaultValue={displayName} required /></label><label><span>Nombre corto oficial</span><input name="official_short_name" defaultValue={data.officialName?.short_name || ''} /></label><label className={styles.fieldWide}><span>Nombre oficial</span><input name="official_name" defaultValue={data.officialName?.name || ''} required /></label><label><span>Slug público</span><input name="slug" defaultValue={data.entity.slug || ''} required /></label><label><span>Estado editorial</span><StatusSelect defaultValue={data.entity.status} /></label><label><span>Tipo de formación</span><select name="band_type" defaultValue={data.band?.band_type || 'Cornetas y Tambores'}><option value="Cornetas y Tambores">Cornetas y Tambores</option><option value="Agrupación Musical">Agrupación Musical</option><option value="Banda de Música">Banda de Música</option><option value="Capilla Musical">Capilla Musical</option><option value="Otra">Otra</option></select></label><label><span>Fundación</span><input name="foundation_text" defaultValue={data.band?.foundation_text || ''} /></label><label><span>Localidad</span><MunicipalitySelect municipalities={data.municipalities} defaultValue={data.band?.municipality_id} /></label><label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" defaultValue={data.entity.summary || ''} rows="3" /></label><label className={styles.fieldWide}><span>Hermandad vinculada</span><BrotherhoodSelect name="linked_brotherhood_entity_id" brotherhoods={data.brotherhoods} defaultValue={data.linkedBrotherhoodRelation?.target_entity_id} required={false} /></label><label className={styles.fieldWide}><span>Sede o local de ensayo</span><input name="headquarters_text" defaultValue={data.band?.headquarters_text || ''} /></label><label><span>Color principal</span><input name="primary_color" defaultValue={data.band?.primary_color || ''} placeholder="#63358B" /></label><label><span>Color secundario</span><input name="secondary_color" defaultValue={data.band?.secondary_color || ''} placeholder="#29272C" /></label><label className={styles.fieldWide}><span>Ruta pública del logotipo</span><input name="logo_path" defaultValue={data.band?.logo_path || ''} /></label><label className={styles.fieldWide}><span>Ruta pública de la fotografía principal</span><input name="hero_image_path" defaultValue={data.band?.hero_image_path || ''} /></label><label className={styles.fieldWide}><span>Descripción accesible de la fotografía</span><input name="hero_image_alt" defaultValue={data.band?.hero_image_alt || ''} /></label><label className={styles.fieldWide}><span>Crédito de la fotografía</span><input name="hero_image_credit" defaultValue={data.band?.hero_image_credit || ''} /></label><label className={styles.fieldWide}><span>Historia breve</span><textarea name="description" defaultValue={data.band?.description || ''} rows="6" /></label></div><SaveBar label="Guardar información general" canEdit={canEdit} /></form></section>

    <section className={styles.editorSection} id="banderin"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Campo opcional</span><h2>Banderín</h2></div><p>Solo se completa cuando la formación dispone de un banderín notable documentado, con su imagen, realización y restauraciones.</p></div><div className={styles.editorStack}>{data.assets.map((item) => <BandHeritageAssetForm key={item.entity.id} item={item} data={data} canEdit={canEdit} />)}{canEdit && data.assets.length === 0 ? <BandHeritageAssetForm data={data} canEdit /> : null}</div></section>

    <section className={styles.editorSection} id="acompanamientos"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Semana Santa</span><h2>Acompañamientos actuales</h2></div><p>Relaciona la banda con hermandades y periodos documentados.</p></div><div className={styles.editorStack}>{data.periods.map((item) => <AccompanimentForm key={item.id} item={item} data={data} canEdit={canEdit} />)}{canEdit ? <AccompanimentForm data={data} canEdit /> : null}</div></section>
    <section className={styles.editorSection} id="extraordinarias"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Agenda</span><h2>Próximas salidas extraordinarias</h2></div><p>Las citas pasadas dejan de aparecer automáticamente en la ficha pública.</p></div><div className={styles.editorStack}>{data.outings.map((item) => <OutingForm key={item.id} item={item} data={data} canEdit={canEdit} />)}{canEdit ? <OutingForm data={data} canEdit /> : null}</div></section>
    <section className={styles.editorSection} id="estrenos"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Patrimonio musical</span><h2>Estrenos</h2></div><p>Composición, autoría, año, vídeo y fuente documental.</p></div><div className={styles.editorStack}>{data.premieres.map((item) => <PremiereForm key={item.id} item={item} bandId={data.entity.id} canEdit={canEdit} />)}{canEdit ? <PremiereForm bandId={data.entity.id} canEdit /> : null}</div></section>
    <section className={styles.editorSection} id="direccion"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Organización</span><h2>Dirección actual</h2></div><p>Responsabilidades ejecutivas, musicales, de personal y comunicación.</p></div><div className={styles.editorStack}>{data.direction.map((item) => <DirectionForm key={item.id} item={item} bandId={data.entity.id} canEdit={canEdit} />)}{canEdit ? <DirectionForm bandId={data.entity.id} canEdit /> : null}</div></section>
    <section className={styles.editorSection} id="enlaces"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Canales oficiales</span><h2>Enlaces de interés</h2></div><p>Web, redes sociales y Spotify. Solo se muestran públicamente los canales verificados.</p></div><div className={styles.editorStack}>{data.socialLinks.map((item) => <SocialLinkForm key={item.id} item={item} bandId={data.entity.id} canEdit={canEdit} />)}{canEdit ? <SocialLinkForm bandId={data.entity.id} canEdit /> : null}</div></section>
  </div>
}
