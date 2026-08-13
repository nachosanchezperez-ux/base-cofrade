import Link from 'next/link'
import { notFound } from 'next/navigation'
import BrotherhoodTypeSelector from '@/components/panel/BrotherhoodTypeSelector'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodEditorData } from '@/lib/panel/data'
import {
  archiveAssetContributionAction,
  archiveCultAction,
  archiveHeritageAction,
  archiveHeritageAssetAction,
  archiveOutingSeriesAction,
  saveAssetContributionAction,
  saveCultAction,
  saveHeritageAction,
  saveHeritageAssetAction,
  saveMovementAction,
  saveOutingSeriesAction,
  saveSocialLinkAction,
  updateBrotherhoodAction,
  uploadMediaAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const SOCIAL_PLATFORMS = [
  ['website', 'Web oficial'],
  ['facebook', 'Facebook'],
  ['instagram', 'Instagram'],
  ['x', 'X / Twitter'],
  ['youtube', 'YouTube'],
  ['tiktok', 'TikTok'],
  ['whatsapp', 'Canal de WhatsApp'],
]

export const metadata = { title: 'Editar hermandad · Panel' }

function StatusSelect({ defaultValue = 'draft', disabled = false }) {
  return (
    <select name="status" defaultValue={defaultValue} disabled={disabled}>
      <option value="draft">Borrador</option>
      <option value="review">En revisión</option>
      <option value="published">Publicado</option>
      <option value="archived">Archivado</option>
    </select>
  )
}

function MonthSelect({ defaultValue = '', name = 'month' }) {
  return (
    <select name={name} defaultValue={defaultValue || ''}>
      <option value="">Sin mes fijo</option>
      {MONTHS.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
    </select>
  )
}

function PlaceSelect({ places, name, defaultValue = '', empty = 'Sin lugar vinculado' }) {
  return (
    <select name={name} defaultValue={defaultValue || ''}>
      <option value="">{empty}</option>
      {places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
    </select>
  )
}

function SaveBar({ label = 'Guardar cambios', canEdit = true }) {
  return (
    <div className={styles.formActions}>
      <small>{canEdit ? 'Los cambios publicados se reflejan en la ficha pública.' : 'Tu perfil tiene acceso de consulta.'}</small>
      {canEdit ? <button className={styles.primaryButton} type="submit">{label}</button> : null}
    </div>
  )
}

function SocialLinkForm({ item, entityId, canEdit }) {
  const isNew = !item?.id
  return (
    <form action={saveSocialLinkAction} className={`${styles.editorItem} ${styles.editorForm}`}>
      <input type="hidden" name="brotherhood_id" value={entityId} />
      <input type="hidden" name="link_id" value={item?.id || ''} />
      <div className={styles.formGrid}>
        <label><span>Plataforma</span><select name="platform" defaultValue={item?.platform || 'website'} disabled={!isNew}><option value="">Selecciona una plataforma</option>{SOCIAL_PLATFORMS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>{!isNew ? <input type="hidden" name="platform" value={item.platform} /> : null}</label>
        <label><span>Nombre visible</span><input name="label" defaultValue={item?.label || ''} placeholder="Web oficial" /></label>
        <label className={styles.fieldWide}><span>URL oficial</span><input name="url" type="url" defaultValue={item?.url || ''} placeholder="https://…" required /></label>
        <label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? 0} /></label>
        <label className={styles.checkField}><input name="is_public" type="checkbox" defaultChecked={item?.is_public ?? true} /><span>Mostrar públicamente</span></label>
      </div>
      <SaveBar label={isNew ? 'Añadir enlace' : 'Guardar enlace'} canEdit={canEdit} />
    </form>
  )
}

function SeriesForm({ item, data, canEdit }) {
  const isNew = !item?.id
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div><span className={styles.eyebrow}>{isNew ? 'Nueva serie anual' : item.outing_type}</span><h3>{isNew ? 'Añadir salida recurrente' : item.title}</h3></div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}
      </div>
      <form action={saveOutingSeriesAction} className={styles.editorForm}>
        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
        <input type="hidden" name="series_id" value={item?.id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Título</span><input name="title" defaultValue={item?.title || ''} required /></label>
          <label><span>Tipo de salida</span><input name="outing_type" defaultValue={item?.outing_type || 'rosario'} required /></label>
          <label><span>Carácter</span><select name="character" defaultValue={item?.character || 'ordinary'}><option value="ordinary">Ordinaria</option><option value="extraordinary">Extraordinaria</option></select></label>
          <label><span>Mes</span><MonthSelect defaultValue={item?.month} /></label>
          <label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? ''} /></label>
          <label className={styles.fieldWide}><span>Regla de fecha</span><input name="date_rule" defaultValue={item?.date_rule || ''} placeholder="Ej. Segundo sábado de septiembre" /></label>
          <label><span>Horario</span><input name="time_text" defaultValue={item?.time_text || ''} placeholder="Ej. 20:30" /></label>
          <label><span>Localidad</span><select name="municipality_id" defaultValue={item?.municipality_id || data.brotherhood?.municipality_id || ''}><option value="">Sin localidad</option>{data.municipalities.map((municipality) => <option key={municipality.id} value={municipality.id}>{municipality.name}</option>)}</select></label>
          <label><span>Origen</span><PlaceSelect places={data.places} name="origin_place_id" defaultValue={item?.origin_place_id} /></label>
          <label><span>Destino</span><PlaceSelect places={data.places} name="destination_place_id" defaultValue={item?.destination_place_id} /></label>
          <label className={styles.fieldWide}><span>Recorrido resumido</span><textarea name="route_summary" defaultValue={item?.route_summary || ''} rows="3" /></label>
          <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" defaultValue={item?.description || ''} rows="3" /></label>
          <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" defaultValue={item?.notes || ''} rows="2" /></label>
          <label><span>Estado</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
        </div>
        <SaveBar label={isNew ? 'Crear salida recurrente' : 'Guardar salida'} canEdit={canEdit} />
      </form>

      {!isNew ? (
        <div className={styles.subEditor}>
          <div className={styles.subEditorHeading}><div><span className={styles.eyebrow}>Ida, regreso y traslados</span><h4>Movimientos</h4></div><span>{item.movements.length}</span></div>
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
          <button type="submit">Archivar esta salida</button>
        </form>
      ) : null}
    </article>
  )
}

function CultForm({ item, data, canEdit }) {
  const isNew = !item?.id
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{isNew ? 'Nuevo culto' : item.cult_type}</span><h3>{isNew ? 'Añadir culto' : item.title}</h3></div>{!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}</div>
      <form action={saveCultAction} className={styles.editorForm}>
        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
        <input type="hidden" name="cult_id" value={item?.id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Título</span><input name="title" defaultValue={item?.title || ''} required /></label>
          <label><span>Tipo</span><input name="cult_type" defaultValue={item?.cult_type || ''} placeholder="triduo, novena, función…" required /></label>
          <label><span>Fecha concreta</span><input name="cult_date" type="date" defaultValue={item?.cult_date || ''} /></label>
          <label><span>Mes</span><MonthSelect defaultValue={item?.month} /></label>
          <label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? ''} /></label>
          <label className={styles.fieldWide}><span>Regla de fecha</span><input name="date_rule" defaultValue={item?.date_rule || ''} /></label>
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
      {!isNew && canEdit && item.status !== 'archived' ? <form action={archiveCultAction} className={styles.archiveForm}><input type="hidden" name="brotherhood_id" value={data.entity.id} /><input type="hidden" name="cult_id" value={item.id} /><button type="submit">Archivar este culto</button></form> : null}
    </article>
  )
}

function HeritageUpdateForm({ item, data, canEdit }) {
  const isNew = !item?.id
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{isNew ? 'Nueva incorporación' : item.update_type}</span><h3>{isNew ? 'Añadir estreno o restauración' : item.title}</h3></div>{!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}</div>
      <form action={saveHeritageAction} className={styles.editorForm}>
        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
        <input type="hidden" name="update_id" value={item?.id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Título</span><input name="title" defaultValue={item?.title || ''} required /></label>
          <label><span>Tipo</span><select name="update_type" defaultValue={item?.update_type || 'estreno'}><option value="estreno">Estreno</option><option value="restauracion">Restauración</option></select></label>
          <label><span>Fecha</span><input name="update_date" type="date" defaultValue={item?.update_date || ''} /></label>
          <label><span>Año</span><input name="year" type="number" defaultValue={item?.year ?? ''} /></label>
          <label><span>Elemento</span><input name="element_name" defaultValue={item?.element_name || ''} /></label>
          <label><span>Disciplina</span><input name="discipline" defaultValue={item?.discipline || ''} placeholder="orfebrería, bordado…" /></label>
          <input type="hidden" name="target_entity_id" value={item?.target_entity_id || ''} />
          <label className={styles.fieldWide}><span>Descripción</span><textarea name="description" defaultValue={item?.description || ''} rows="4" /></label>
          <label><span>Estado</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
        </div>
        <SaveBar label={isNew ? 'Crear novedad' : 'Guardar novedad'} canEdit={canEdit} />
      </form>
      {!isNew && canEdit && item.status !== 'archived' ? <form action={archiveHeritageAction} className={styles.archiveForm}><input type="hidden" name="brotherhood_id" value={data.entity.id} /><input type="hidden" name="update_id" value={item.id} /><button type="submit">Archivar esta novedad</button></form> : null}
    </article>
  )
}

function AssetContributionForm({ item, asset, data, canEdit }) {
  const isNew = !item?.id
  return (
    <article className={styles.contributionItem}>
      <div className={styles.contributionHeading}>
        <div>
          <span className={styles.eyebrow}>{isNew ? 'Nueva relación' : item.intervention_type || 'Intervención'}</span>
          <h4>{isNew ? 'Vincular autor o taller' : `${item.agentName} · ${item.discipline}`}</h4>
        </div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}
      </div>
      <form action={saveAssetContributionAction} className={styles.editorForm}>
        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
        <input type="hidden" name="asset_entity_id" value={asset.entity.id} />
        <input type="hidden" name="contribution_id" value={item?.id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Autor, taller o institución</span><select name="agent_entity_id" defaultValue={item?.agent_entity_id || ''} required><option value="">Selecciona un agente</option>{data.agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}</select></label>
          <label><span>Disciplina</span><input name="discipline" defaultValue={item?.discipline || ''} placeholder="Diseño, bordado, orfebrería…" required /></label>
          <label><span>Papel o fase</span><input name="phase" defaultValue={item?.phase || ''} placeholder="Dirección artística, dibujo…" /></label>
          <label><span>Tipo de intervención</span><input name="intervention_type" defaultValue={item?.intervention_type || 'Creación'} /></label>
          <label><span>Elemento concreto</span><input name="element_name" defaultValue={item?.element_name || asset.entity.name} /></label>
          <label><span>Fecha inicial</span><input name="contribution_date_from" type="date" defaultValue={item?.date_from || ''} /></label>
          <label><span>Datación textual</span><input name="contribution_date_from_text" defaultValue={item?.date_from_text || ''} placeholder="2021, hacia 1950…" /></label>
          <label><span>Fecha final</span><input name="contribution_date_to" type="date" defaultValue={item?.date_to || ''} /></label>
          <label><span>Datación final textual</span><input name="contribution_date_to_text" defaultValue={item?.date_to_text || ''} /></label>
          <label className={styles.fieldWide}><span>Descripción de la aportación</span><textarea name="contribution_description" defaultValue={item?.description || ''} rows="3" /></label>
          <label><span>Estado</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
        </div>
        <SaveBar label={isNew ? 'Vincular agente' : 'Guardar relación'} canEdit={canEdit} />
      </form>
      {!isNew && canEdit && item.status !== 'archived' ? <form action={archiveAssetContributionAction} className={styles.archiveForm}><input type="hidden" name="brotherhood_id" value={data.entity.id} /><input type="hidden" name="asset_entity_id" value={asset.entity.id} /><input type="hidden" name="contribution_id" value={item.id} /><button type="submit">Archivar esta relación</button></form> : null}
    </article>
  )
}

function HeritageAssetForm({ item, data, canEdit }) {
  const isNew = !item?.entity?.id
  const entity = item?.entity || {}
  return (
    <article className={`${styles.editorItem} ${styles.assetEditorItem}`}>
      <div className={styles.itemHeading}>
        <div><span className={styles.eyebrow}>{isNew ? 'Nueva pieza' : item.asset_type || 'Patrimonio'}</span><h3>{isNew ? 'Añadir obra o enser' : entity.name}</h3></div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[entity.status]}`}>{STATUS_LABELS[entity.status]}</span> : null}
      </div>
      <form action={saveHeritageAssetAction} className={styles.editorForm}>
        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
        <input type="hidden" name="asset_entity_id" value={entity.id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Nombre de la pieza</span><input name="asset_name" defaultValue={entity.name || ''} required /></label>
          <label><span>Tipo</span><input name="asset_type" defaultValue={item?.asset_type || ''} placeholder="Simpecado, carreta, retablo…" required /></label>
          <label><span>Slug público</span><input name="asset_slug" defaultValue={entity.slug || ''} placeholder="simpecado-de-los-devotos" required /></label>
          <label className={styles.fieldWide}><span>Resumen breve</span><textarea name="asset_summary" defaultValue={entity.summary || ''} rows="2" /></label>
          <label><span>Fecha</span><input name="date_from" type="date" defaultValue={item?.date_from || ''} /></label>
          <label><span>Datación textual</span><input name="date_from_text" defaultValue={item?.date_from_text || ''} placeholder="2021, siglo XVIII…" /></label>
          <label><span>Fecha de bendición</span><input name="blessing_date" type="date" defaultValue={item?.blessing_date || ''} /></label>
          <label><span>Bendición en texto</span><input name="blessing_date_text" defaultValue={item?.blessing_date_text || ''} /></label>
          <label><span>Técnica</span><input name="technique" defaultValue={item?.technique || ''} /></label>
          <label><span>Materiales</span><input name="materials" defaultValue={item?.materials || ''} /></label>
          <label><span>Dimensiones</span><input name="dimensions_text" defaultValue={item?.dimensions_text || ''} /></label>
          <label><span>Estado de conservación</span><input name="current_condition" defaultValue={item?.current_condition || ''} /></label>
          <label className={styles.fieldWide}><span>Descripción</span><textarea name="asset_description" defaultValue={item?.description || ''} rows="4" /></label>
          <label className={styles.fieldWide}><span>Iconografía y diseño</span><textarea name="iconography" defaultValue={item?.iconography || ''} rows="4" /></label>
          <label className={styles.fieldWide}><span>Contexto histórico</span><textarea name="historical_context" defaultValue={item?.historical_context || ''} rows="3" /></label>
          <label className={styles.fieldWide}><span>Procedencia o donación</span><textarea name="provenance_text" defaultValue={item?.provenance_text || ''} rows="3" /></label>
          <label className={styles.fieldWide}><span>Origen y evolución</span><textarea name="origin_notes" defaultValue={item?.origin_notes || ''} rows="3" /></label>
          <label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? 0} /></label>
          <label><span>Estado editorial</span><StatusSelect defaultValue={entity.status || 'draft'} /></label>
          <label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked={item?.is_current ?? true} /><span>Pieza actual</span></label>
          <label className={styles.checkField}><input name="is_featured" type="checkbox" defaultChecked={item?.is_featured ?? false} /><span>Destacar en la ficha pública</span></label>
          <label className={styles.fieldWide}><span>Notas internas</span><textarea name="asset_notes" defaultValue={item?.notes || ''} rows="2" /></label>
        </div>
        <SaveBar label={isNew ? 'Crear pieza patrimonial' : 'Guardar pieza'} canEdit={canEdit} />
      </form>

      {!isNew ? (
        <div className={styles.contributionBlock}>
          <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Relaciones</span><h4>Autores, talleres e intervenciones</h4></div><p>Una pieza puede reunir diferentes responsables y disciplinas.</p></div>
          <div className={styles.contributionStack}>{item.contributions.map((contribution) => <AssetContributionForm key={contribution.id} item={contribution} asset={item} data={data} canEdit={canEdit} />)}{canEdit ? <AssetContributionForm asset={item} data={data} canEdit /> : null}</div>
        </div>
      ) : null}

      {!isNew && canEdit && entity.status !== 'archived' ? <form action={archiveHeritageAssetAction} className={styles.archiveForm}><input type="hidden" name="brotherhood_id" value={data.entity.id} /><input type="hidden" name="asset_entity_id" value={entity.id} /><button type="submit">Archivar esta pieza</button></form> : null}
    </article>
  )
}

export default async function BrotherhoodEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const colorRows = [...data.colors]
  while (colorRows.length < 3) colorRows.push({ id: '', color_name: '', hex_value: '', color_role: 'identity' })

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/hermandades">Hermandades</Link><span>→</span><strong>{data.brotherhood?.popular_name || data.entity.name}</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Editar ficha</span><h1>{data.brotherhood?.popular_name || data.entity.name}</h1><p>{data.brotherhood?.official_name}</p></div>
          <div className={styles.editorHeaderActions}><span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>{data.entity.slug ? <Link className={styles.secondaryButton} href={`/hermandades/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}</div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando la ficha como colaborador. Un editor debe realizar los cambios.</div> : null}

      <nav className={styles.sectionTabs} aria-label="Secciones de la ficha">
        <a href="#general">General</a><a href="#redes">Web y redes</a><a href="#imagenes">Imágenes</a><a href="#salidas">Salidas</a><a href="#cultos">Cultos</a><a href="#patrimonio">Patrimonio</a>
      </nav>

      <section className={styles.editorSection} id="general">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Identidad</span><h2>Información general</h2></div><p>Los datos esenciales que encabezan la ficha pública.</p></div>
        <form action={updateBrotherhoodAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="brotherhood_id" value={data.entity.id} />
          <div className={styles.formGrid}>
            <label><span>Nombre popular</span><input name="popular_name" defaultValue={data.brotherhood?.popular_name || ''} required /></label>
            <label><span>Nombre corto de entidad</span><input name="name" defaultValue={data.entity.name} required /></label>
            <label className={styles.fieldWide}><span>Nombre oficial</span><input name="official_name" defaultValue={data.brotherhood?.official_name || ''} required /></label>
            <label><span>Slug público</span><input name="slug" defaultValue={data.entity.slug || ''} required /></label>
            <label><span>Estado editorial</span><StatusSelect defaultValue={data.entity.status} /></label>
            <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" defaultValue={data.entity.summary || ''} rows="4" /></label>
            <label><span>Fundación</span><input name="foundation_text" defaultValue={data.brotherhood?.foundation_text || ''} /></label>
            <label><span>Día de salida</span><input name="current_procession_day" defaultValue={data.brotherhood?.current_procession_day || ''} /></label>
            <label><span>Localidad</span><select name="municipality_id" defaultValue={data.brotherhood?.municipality_id || ''}><option value="">Sin localidad</option>{data.municipalities.map((municipality) => <option key={municipality.id} value={municipality.id}>{municipality.name} · {municipality.province}</option>)}</select></label>
            <label><span>Sede canónica</span><PlaceSelect places={data.places} name="canonical_see_place_id" defaultValue={data.brotherhood?.canonical_see_place_id} /></label>
            <label><span>Barrio</span><input name="neighborhood" defaultValue={data.brotherhood?.neighborhood || ''} /></label>
            <BrotherhoodTypeSelector selected={data.brotherhood?.brotherhood_types || []} />
            <label className={styles.fieldWide}><span>Ruta o URL del escudo</span><input name="crest_path" defaultValue={data.brotherhood?.crest_path || ''} /></label>
            <label className={styles.fieldWide}><span>Notas documentales</span><textarea name="notes" defaultValue={data.brotherhood?.notes || ''} rows="4" /></label>
          </div>
          <fieldset className={styles.colorFieldset}>
            <legend>Colores identitarios</legend>
            {colorRows.map((color, index) => (
              <div className={styles.colorRow} key={color.id || `new-${index}`}>
                <input type="hidden" name="color_id" value={color.id || ''} />
                <label><span>Nombre</span><input name="color_name" defaultValue={color.color_name || ''} placeholder="Azul" /></label>
                <label><span>Hexadecimal</span><div className={styles.colorInput}><i style={{ backgroundColor: color.hex_value || '#edf1f5' }} aria-hidden="true" /><input name="color_hex" defaultValue={color.hex_value || ''} placeholder="#123A67" /></div></label>
                <label><span>Uso</span><select name="color_role" defaultValue={color.color_role || 'identity'}><option value="primary">Principal</option><option value="secondary">Secundario</option><option value="accent">Acento</option><option value="identity">Identidad</option></select></label>
              </div>
            ))}
          </fieldset>
          <SaveBar canEdit={canEdit} />
        </form>
      </section>

      <section className={styles.editorSection} id="redes">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Canales oficiales</span><h2>Web y redes sociales</h2></div><p>Solo se publican los enlaces verificados y marcados como visibles.</p></div>
        <div className={styles.editorStack}>
          {data.socialLinks.map((item) => <SocialLinkForm key={item.id} item={item} entityId={data.entity.id} canEdit={canEdit} />)}
          {canEdit ? <SocialLinkForm entityId={data.entity.id} canEdit /> : null}
        </div>
      </section>

      <section className={styles.editorSection} id="imagenes">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Archivo visual</span><h2>Imágenes</h2></div><p>Ficheros, autoría, derechos y relación con la ficha.</p></div>
        {data.media.length ? <div className={styles.mediaGrid}>{data.media.map((item) => <article key={item.id}><div className={styles.mediaPreview}>{item.publicUrl ? <img src={item.publicUrl} alt={item.asset?.alt_text || ''} /> : <span>Sin vista previa</span>}</div><div><strong>{item.asset?.title || 'Imagen sin título'}</strong><span>{item.targetName} · {item.relation_type}{item.is_cover ? ' · Portada' : ''}</span><small>{item.asset?.author_name || 'Autoría por documentar'} · {item.asset?.rights_status}</small></div></article>)}</div> : <div className={styles.emptyPanel}>Todavía no hay imágenes vinculadas a esta ficha.</div>}
        {canEdit ? (
          <form action={uploadMediaAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <input type="hidden" name="brotherhood_id" value={data.entity.id} />
            <div className={styles.formGrid}>
              <label className={styles.fieldWide}><span>Archivo de imagen</span><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required /></label>
              <label><span>Título</span><input name="title" /></label>
              <label><span>Texto alternativo</span><input name="alt_text" required /></label>
              <label className={styles.fieldWide}><span>Pie de foto</span><textarea name="caption" rows="2" /></label>
              <label><span>Autor</span><input name="author_name" /></label>
              <label><span>Titular de derechos</span><input name="rights_holder" /></label>
              <label><span>Estado de derechos</span><select name="rights_status" defaultValue="authorized" required><option value="owned">Propia</option><option value="authorized">Autorizada</option><option value="licensed">Con licencia</option><option value="public_domain">Dominio público</option></select></label>
              <label><span>Licencia</span><input name="license" /></label>
              <label><span>Fuente</span><input name="source_name" /></label>
              <label><span>URL de fuente</span><input name="source_url" type="url" /></label>
              <label><span>Vincular a</span><select name="media_entity_id" defaultValue={data.entity.id}><option value={data.entity.id}>Ficha de la hermandad</option>{data.assets.map((asset) => <option key={asset.entity.id} value={asset.entity.id}>{asset.entity.name}</option>)}</select></label>
              <label><span>Relación</span><select name="relation_type" defaultValue="gallery"><option value="gallery">Galería</option><option value="cover">Portada</option><option value="crest">Escudo</option><option value="document">Documento</option></select></label>
              <label><span>Orden</span><input name="sort_order" type="number" defaultValue="0" /></label>
              <label className={styles.checkField}><input name="is_cover" type="checkbox" /><span>Marcar como imagen de portada</span></label>
              <label className={styles.fieldWide}><span>Notas de permiso</span><textarea name="permission_notes" rows="2" /></label>
            </div>
            <SaveBar label="Subir y vincular imagen" canEdit />
          </form>
        ) : null}
      </section>

      <section className={styles.editorSection} id="salidas">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Calendario estable</span><h2>Salidas recurrentes y rosarios</h2></div><p>Cada serie anual puede incluir ida, regreso y otros movimientos.</p></div>
        <div className={styles.editorStack}>{data.series.map((item) => <SeriesForm key={item.id} item={item} data={data} canEdit={canEdit} />)}{canEdit ? <SeriesForm data={data} canEdit /> : null}</div>
      </section>

      <section className={styles.editorSection} id="cultos">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Vida de hermandad</span><h2>Cultos</h2></div><p>Definiciones recurrentes y fechas concretas listas para la ficha pública.</p></div>
        <div className={styles.editorStack}>{data.cults.map((item) => <CultForm key={item.id} item={item} data={data} canEdit={canEdit} />)}{canEdit ? <CultForm data={data} canEdit /> : null}</div>
      </section>

      <section className={styles.editorSection} id="patrimonio">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Memoria material</span><h2>Patrimonio</h2></div><p>Obras, autores, talleres, imágenes e intervenciones conectados en un mismo catálogo.</p></div>

        <div className={styles.panelSubsection}>
          <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Catálogo</span><h3>Obras y enseres</h3></div><p>Simpecados, carretas, retablos, insignias y otras piezas con ficha propia.</p></div>
          <div className={styles.editorStack}>{data.assets.map((item) => <HeritageAssetForm key={item.entity.id} item={item} data={data} canEdit={canEdit} />)}{canEdit ? <HeritageAssetForm data={data} canEdit /> : null}</div>
        </div>

        <div className={styles.panelSubsection}>
          <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Cronología</span><h3>Estrenos y restauraciones</h3></div><p>Novedades documentadas por fecha, disciplina y elemento afectado.</p></div>
          <div className={styles.editorStack}>{data.heritage.map((item) => <HeritageUpdateForm key={item.id} item={item} data={data} canEdit={canEdit} />)}{canEdit ? <HeritageUpdateForm data={data} canEdit /> : null}</div>
        </div>
      </section>
    </div>
  )
}
