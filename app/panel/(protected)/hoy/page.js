import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { getHomeEditorialPanelData } from '@/lib/panel/home-editorial'
import {
  archiveDailyOverrideAction,
  archiveEditorialContentAction,
  removeEditorialContentLinkAction,
  saveDailyOverrideAction,
  saveEditorialContentAction,
  saveEditorialContentLinkAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const BLOCKS = [
  { type: 'ephemeris', label: 'Efeméride', hint: 'Acontecimiento histórico. Sin programación manual, se elige automáticamente por día y mes.' },
  { type: 'fact', label: 'Dato Cofrade', hint: 'Contenido editorial o dato contextual. Sin override, rota entre candidatos elegibles.' },
  { type: 'curiosity', label: 'Curiosidad', hint: 'Contenido editorial breve. Sin override, rota entre candidatos elegibles.' },
  { type: 'march', label: 'Marcha del día', hint: 'Sin override, se elige entre Marchas publicadas, elegibles, con compositor y escucha disponible.' },
]
const SAVED_MESSAGES = {
  'content-created': 'El contenido editorial se ha creado.',
  'content-updated': 'El contenido editorial se ha actualizado.',
  'content-archived': 'El contenido editorial se ha archivado.',
  'content-link': 'La relación editorial se ha guardado.',
  'content-link-removed': 'La relación editorial se ha retirado.',
  override: 'La programación manual de la Home se ha guardado.',
  'override-archived': 'Ese bloque vuelve a selección automática para la fecha indicada.',
}

function StatusSelect({ defaultValue = 'draft' }) {
  return <select name="status" defaultValue={defaultValue}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option><option value="archived">Archivado</option></select>
}

function OverrideForm({ block, item, data, canEdit }) {
  const isActive = item && item.status !== 'archived'
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div><span className={styles.eyebrow}>{isActive ? 'Programación manual' : 'Modo automático'}</span><h3>{block.label}</h3><p>{block.hint}</p></div>
        {item ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}
      </div>

      {canEdit ? (
        <form action={saveDailyOverrideAction} className={styles.editorForm}>
          <input type="hidden" name="override_id" value={item?.id || ''} />
          <input type="hidden" name="publish_date" value={data.selectedDate} />
          <input type="hidden" name="content_type" value={block.type} />
          <div className={styles.formGrid}>
            {block.type === 'ephemeris' ? (
              <EntityPicker className={styles.fieldWide} name="event_entity_id" items={data.eventOptions} label="Acontecimiento" placeholder="Buscar efeméride…" emptyLabel="Selecciona un Acontecimiento" defaultValue={item?.event_entity_id || ''} />
            ) : null}
            {block.type === 'march' ? (
              <EntityPicker className={styles.fieldWide} name="march_entity_id" items={data.marchOptions} label="Marcha" placeholder="Buscar Marcha…" emptyLabel="Selecciona una Marcha" defaultValue={item?.march_entity_id || ''} />
            ) : null}
            {['fact', 'curiosity'].includes(block.type) ? (
              <EntityPicker className={styles.fieldWide} name="entity_id" items={data.entityOptions} label="Entidad relacionada (opcional)" placeholder="Buscar entidad…" emptyLabel="Sin entidad concreta" required={false} defaultValue={item?.entity_id || ''} />
            ) : null}
            {block.type !== 'march' ? <label className={styles.fieldWide}><span>Título visible</span><input name="title" defaultValue={item?.title || ''} required={block.type === 'ephemeris'} /></label> : null}
            {block.type !== 'march' ? <label className={styles.fieldWide}><span>Resumen visible</span><textarea name="summary" rows="3" defaultValue={item?.summary || ''} /></label> : null}
            <label><span>Orden</span><input name="sort_order" type="number" min="0" defaultValue={item?.sort_order ?? BLOCKS.findIndex((entry) => entry.type === block.type)} /></label>
            <label><span>Estado</span><StatusSelect defaultValue={item?.status === 'archived' ? 'published' : item?.status || 'published'} /></label>
            <label className={styles.fieldWide}><span>Motivo interno de la selección</span><textarea name="reason" rows="2" defaultValue={item?.reason || ''} placeholder="Por qué se fuerza este contenido para esta fecha" /></label>
          </div>
          <div className={styles.formActions}><small>Guardar crea o actualiza el único override de este tipo para {data.selectedDate}.</small><button className={styles.primaryButton} type="submit">{isActive ? 'Actualizar selección' : 'Forzar para esta fecha'}</button></div>
        </form>
      ) : null}

      {canEdit && isActive ? (
        <form action={archiveDailyOverrideAction} className={styles.archiveForm}>
          <input type="hidden" name="override_id" value={item.id} /><input type="hidden" name="publish_date" value={data.selectedDate} />
          <button type="submit">Volver a selección automática</button>
        </form>
      ) : null}
    </article>
  )
}

export const metadata = { title: 'Hoy · Panel' }

export default async function HomeEditorialPage({ searchParams }) {
  const query = await searchParams
  const [user, data] = await Promise.all([
    requirePanelUser(),
    getHomeEditorialPanelData({ date: String(query?.fecha || '') }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]
  const focusedContent = String(query?.content || '')

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div><span className={styles.eyebrow}>Portada editorial</span><h1>Hoy en Hilo Cofrade</h1><p>Automatización por defecto; intervención manual solo cuando una fecha necesita una selección concreta.</p></div>
        <Link className={styles.secondaryButton} href="/" target="_blank" rel="noreferrer">Abrir Home ↗</Link>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <form className={styles.filters} style={{ gridTemplateColumns: '220px auto 1fr' }}>
        <label><span className={styles.srOnly}>Fecha editorial</span><input type="date" name="fecha" defaultValue={data.selectedDate} /></label>
        <button className={styles.secondaryButton} type="submit">Abrir fecha</button>
        <small style={{ alignSelf: 'center', color: '#68788a' }}>Los overrides son específicos de cada fecha y bloque.</small>
      </form>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Programación diaria</span><h2>{data.selectedDate}</h2></div><p>{data.overrides.filter((item) => item.status === 'published').length} bloque{data.overrides.filter((item) => item.status === 'published').length === 1 ? '' : 's'} forzado{data.overrides.filter((item) => item.status === 'published').length === 1 ? '' : 's'}; el resto sigue automático.</p></div>
        <div className={styles.dashboardGrid}>
          {BLOCKS.map((block) => <OverrideForm key={block.type} block={block} item={data.overrideByType.get(block.type) || null} data={data} canEdit={canEdit} />)}
        </div>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Banco editorial</span><h2>Datos y curiosidades</h2></div><p>Estos contenidos participan en la selección automática cuando están publicados y marcados como elegibles.</p></div>
        <div className={styles.editorStack}>
          {data.editorial.map((item) => (
            <article className={styles.editorItem} key={item.id} style={focusedContent === item.id ? { outline: '2px solid #123a67', outlineOffset: 3 } : undefined}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{item.content_type === 'fact' ? 'Dato Cofrade' : 'Curiosidad'}</span><h3>{item.title}</h3><p>{item.summary}</p></div><span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span></div>

              {canEdit ? (
                <form action={saveEditorialContentAction} className={styles.editorForm}>
                  <input type="hidden" name="content_id" value={item.id} /><input type="hidden" name="return_date" value={data.selectedDate} />
                  <div className={styles.formGrid}>
                    <label><span>Tipo</span><select name="content_type" defaultValue={item.content_type}><option value="fact">Dato Cofrade</option><option value="curiosity">Curiosidad</option></select></label>
                    <label><span>Estado</span><StatusSelect defaultValue={item.status} /></label>
                    <label className={styles.fieldWide}><span>Título</span><input name="title" defaultValue={item.title} required /></label>
                    <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" rows="3" defaultValue={item.summary || ''} /></label>
                    <label className={styles.fieldWide}><span>Desarrollo</span><textarea name="body" rows="4" defaultValue={item.body || ''} /></label>
                    <label><span>Autor visible</span><input name="author_name" defaultValue={item.author_name || ''} /></label>
                    <label><span>Fecha editorial</span><input name="publish_date" type="date" defaultValue={item.publish_date || ''} /></label>
                    <label className={styles.fieldWide}><span>Ruta/URL de portada</span><input name="cover_image_path" defaultValue={item.cover_image_path || ''} /></label>
                    <label className={styles.checkField}><input name="eligible_for_daily" type="checkbox" defaultChecked={item.eligible_for_daily} /><span>Elegible para rotación diaria</span></label>
                    <label><span>Prioridad diaria</span><input name="daily_priority" type="number" min="0" defaultValue={item.daily_priority ?? 0} /></label>
                    <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" rows="2" defaultValue={item.notes || ''} /></label>
                  </div>
                  <div className={styles.formActions}><small>{item.eligible_for_daily ? 'Participa en la rotación automática.' : 'No participa en la rotación automática.'}</small><button className={styles.secondaryButton} type="submit">Guardar contenido</button></div>
                </form>
              ) : null}

              <div className={styles.panelSubsection}>
                <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Contexto</span><h4>Entidades relacionadas</h4></div><p>{item.links.length} vínculo{item.links.length === 1 ? '' : 's'}.</p></div>
                <div className={styles.editorStack}>
                  {item.links.map((link) => (
                    <div className={styles.editorItem} key={link.id}>
                      {canEdit ? <form action={saveEditorialContentLinkAction} className={styles.editorForm}><input type="hidden" name="content_id" value={item.id} /><input type="hidden" name="link_id" value={link.id} /><input type="hidden" name="return_date" value={data.selectedDate} /><div className={styles.formGrid}><EntityPicker className={styles.fieldWide} name="entity_id" items={data.entityOptions} label="Entidad" defaultValue={link.entity_id} /><label><span>Relación</span><input name="relation_type" defaultValue={link.relation_type || 'about'} /></label><label className={styles.checkField}><input name="is_primary" type="checkbox" defaultChecked={link.is_primary} /><span>Entidad principal</span></label><label className={styles.fieldWide}><span>Notas</span><input name="notes" defaultValue={link.notes || ''} /></label></div><div className={styles.formActions}><small>{link.entity?.name || ''}</small><button className={styles.smallButton} type="submit">Guardar vínculo</button></div></form> : <strong>{link.entity?.name}</strong>}
                      {canEdit ? <form action={removeEditorialContentLinkAction} className={styles.archiveForm}><input type="hidden" name="content_id" value={item.id} /><input type="hidden" name="link_id" value={link.id} /><input type="hidden" name="return_date" value={data.selectedDate} /><button type="submit">Retirar vínculo</button></form> : null}
                    </div>
                  ))}
                  {canEdit ? <form action={saveEditorialContentLinkAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="content_id" value={item.id} /><input type="hidden" name="return_date" value={data.selectedDate} /><EntityPicker name="entity_id" items={data.entityOptions} label="Añadir entidad" emptyLabel="Selecciona una entidad" /><div className={styles.formGrid}><label><span>Relación</span><input name="relation_type" defaultValue="about" /></label><label className={styles.checkField}><input name="is_primary" type="checkbox" /><span>Entidad principal</span></label><label className={styles.fieldWide}><span>Notas</span><input name="notes" /></label></div><div className={styles.formActions}><span /><button className={styles.smallButton} type="submit">Añadir vínculo</button></div></form> : null}
                </div>
              </div>

              {canEdit ? <form action={archiveEditorialContentAction} className={styles.archiveForm}><input type="hidden" name="content_id" value={item.id} /><input type="hidden" name="return_date" value={data.selectedDate} /><button type="submit">Archivar contenido</button></form> : null}
            </article>
          ))}
        </div>
      </section>

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nuevo contenido</span><h2>Añadir Dato o Curiosidad</h2></div><p>Puede quedar como borrador o entrar directamente en la rotación automática.</p></div>
          <form action={saveEditorialContentAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <input type="hidden" name="return_date" value={data.selectedDate} />
            <div className={styles.formGrid}>
              <label><span>Tipo</span><select name="content_type" defaultValue="curiosity"><option value="fact">Dato Cofrade</option><option value="curiosity">Curiosidad</option></select></label>
              <label><span>Estado</span><StatusSelect defaultValue="draft" /></label>
              <label className={styles.fieldWide}><span>Título</span><input name="title" required /></label>
              <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" rows="3" /></label>
              <label className={styles.fieldWide}><span>Desarrollo</span><textarea name="body" rows="4" /></label>
              <label><span>Autor visible</span><input name="author_name" /></label>
              <label><span>Fecha editorial</span><input name="publish_date" type="date" /></label>
              <label className={styles.fieldWide}><span>Ruta/URL de portada</span><input name="cover_image_path" /></label>
              <label className={styles.checkField}><input name="eligible_for_daily" type="checkbox" defaultChecked /><span>Elegible para rotación diaria</span></label>
              <label><span>Prioridad diaria</span><input name="daily_priority" type="number" min="0" defaultValue="0" /></label>
              <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" rows="2" /></label>
            </div>
            <div className={styles.formActions}><small>Después de crearla podrás relacionarla con una o varias entidades.</small><button className={styles.primaryButton} type="submit">Crear contenido</button></div>
          </form>
        </section>
      ) : null}
    </div>
  )
}
