import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { getHomeEditorialPanelData } from '@/lib/panel/home-editorial'
import {
  archiveEditorialContentAction,
  removeEditorialContentLinkAction,
  saveEditorialContentAction,
  saveEditorialContentLinkAction,
} from '../actions'
import { STATUS_LABELS, StatusSelect } from '@/components/panel/home/HomeEditorialPrimitives'
import styles from '@/app/panel/panel.module.css'

const SAVED_MESSAGES = {
  'content-created': 'El contenido editorial se ha creado.',
  'content-updated': 'El contenido editorial se ha actualizado.',
  'content-archived': 'El contenido editorial se ha archivado.',
  'content-link': 'La relación editorial se ha guardado.',
  'content-link-removed': 'La relación editorial se ha retirado.',
}

export const metadata = { title: 'Banco editorial · Hoy · Panel' }

export default async function HomeEditorialBankPage({ searchParams }) {
  const query = await searchParams
  const [user, data] = await Promise.all([
    requirePanelUser(),
    getHomeEditorialPanelData({ date: String(query?.fecha || '') }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]
  const focusedContent = String(query?.content || '')
  const facts = data.editorial.filter((item) => item.content_type === 'fact').length
  const curiosities = data.editorial.filter((item) => item.content_type === 'curiosity').length

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div><span className={styles.eyebrow}>Biblioteca editorial</span><h1>Banco editorial</h1><p>Datos Cofrades y Curiosidades reutilizables para la rotación automática o la programación manual de una fecha.</p></div>
        <Link className={styles.secondaryButton} href={`/panel/hoy/programacion?fecha=${data.selectedDate}`}>Programación diaria</Link>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura del Banco editorial">
        <article className={styles.metricCard}><span>Total</span><strong>{data.editorial.length}</strong><small>contenidos activos</small></article>
        <article className={styles.metricCard}><span>Datos</span><strong>{facts}</strong><small>Datos Cofrades</small></article>
        <article className={styles.metricCard}><span>Curiosidades</span><strong>{curiosities}</strong><small>contenidos breves</small></article>
        <article className={styles.metricCard}><span>Elegibles</span><strong>{data.metrics.editorialEligible}</strong><small>participan en rotación</small></article>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Contenido reutilizable</span><h2>Datos y curiosidades</h2></div><p>Un contenido publicado y elegible puede salir automáticamente o seleccionarse desde Programación diaria sin duplicarlo.</p></div>
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
                  <div className={styles.formActions}><small>{item.eligible_for_daily ? 'Participa en la rotación automática y puede programarse manualmente.' : 'No participa en la rotación automática.'}</small><button className={styles.secondaryButton} type="submit">Guardar contenido</button></div>
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

              {canEdit ? <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}><Link className={styles.secondaryButton} href={`/panel/hoy/programacion?fecha=${data.selectedDate}`}>Programar este contenido</Link><form action={archiveEditorialContentAction} className={styles.archiveForm}><input type="hidden" name="content_id" value={item.id} /><input type="hidden" name="return_date" value={data.selectedDate} /><button type="submit">Archivar contenido</button></form></div> : null}
            </article>
          ))}
          {!data.editorial.length ? <div className={styles.emptyPanel}>Todavía no hay contenidos en el Banco editorial.</div> : null}
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
