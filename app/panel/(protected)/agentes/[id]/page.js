import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { AGENT_KIND_LABELS, getAgentEditorData } from '@/lib/panel/agents'
import {
  deleteAgentDisciplineAction,
  deleteAgentNameAction,
  deleteAgentRoleAction,
  saveAgentDisciplineAction,
  saveAgentNameAction,
  saveAgentRoleAction,
  updateAgentAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const NAME_TYPES = [
  ['official', 'Oficial'], ['commercial', 'Comercial'], ['artistic', 'Artístico'],
  ['alias', 'Alias'], ['acronym', 'Siglas'], ['former', 'Anterior'],
]

export const metadata = { title: 'Editar ficha · Personas · Panel' }

function PeriodFields({ item = null }) {
  return <>
    <label><span>Fecha inicial</span><input name="date_from" type="date" defaultValue={item?.date_from || ''} /></label>
    <label><span>Datación inicial</span><input name="date_from_text" defaultValue={item?.date_from_text || ''} placeholder="Ej. desde 1985" /></label>
    <label><span>Fecha final</span><input name="date_to" type="date" defaultValue={item?.date_to || ''} /></label>
    <label><span>Datación final</span><input name="date_to_text" defaultValue={item?.date_to_text || ''} /></label>
  </>
}

export default async function AgentEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getAgentEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const { entity, agent, coverage } = data

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/agentes">Personas</Link><span>→</span><strong>{entity.name}</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Editar ficha</span><h1>{entity.name}</h1><p>{AGENT_KIND_LABELS[agent.agent_kind] || 'Registro'}</p></div>
          <span className={`${styles.statusBadge} ${styles[entity.status]}`}>{STATUS_LABELS[entity.status]}</span>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando esta ficha como colaborador.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura de la ficha">
        <article className={styles.metricCard}><span>Nombres</span><strong>{coverage.names}</strong><small>alias y denominaciones</small></article>
        <article className={styles.metricCard}><span>Disciplinas</span><strong>{coverage.disciplines}</strong><small>especialidades</small></article>
        <article className={styles.metricCard}><span>Roles</span><strong>{coverage.roles}</strong><small>trayectoria registrada</small></article>
        <article className={styles.metricCard}><span>Documentación</span><strong>{coverage.sources}</strong><small>{coverage.media} recursos multimedia</small></article>
      </section>

      <nav className={styles.sectionTabs} aria-label="Secciones de la ficha">
        <a href="#general">General</a><a href="#nombres">Nombres</a><a href="#disciplinas">Disciplinas</a><a href="#roles">Roles</a><a href="#documentacion">Documentación</a>
      </nav>

      <section className={styles.editorSection} id="general">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Fuente de verdad</span><h2>Información general</h2></div><p>Identidad, biografía o trayectoria y datos públicos del registro.</p></div>
        <form action={updateAgentAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="agent_id" value={entity.id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Nombre principal</span><input name="name" defaultValue={entity.name} required /></label>
            <label><span>Tipo de registro</span><select name="agent_kind" defaultValue={agent.agent_kind} required><option value="person">Persona</option><option value="workshop">Taller</option><option value="company">Empresa</option><option value="institution">Institución</option></select></label>
            <label><span>Slug</span><input name="slug" defaultValue={entity.slug || ''} required /></label>
            <label><span>Estado editorial</span><select name="status" defaultValue={entity.status}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label>
            <label><span>Localidad</span><select name="municipality_id" defaultValue={agent.municipality_id || ''}><option value="">Sin localidad</option>{data.municipalities.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.province}</option>)}</select></label>
            <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" defaultValue={entity.summary || ''} rows="3" /></label>
            <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" defaultValue={agent.description || ''} rows="5" /></label>
            <label><span>Nacimiento / fundación</span><input name="birth_or_foundation_date" type="date" defaultValue={agent.birth_or_foundation_date || ''} /></label>
            <label><span>Datación textual</span><input name="foundation_or_birth_text" defaultValue={agent.foundation_or_birth_text || ''} /></label>
            <label><span>Fallecimiento / fin</span><input name="death_or_end_date" type="date" defaultValue={agent.death_or_end_date || ''} /></label>
            <label><span>Datación final textual</span><input name="death_or_end_text" defaultValue={agent.death_or_end_text || ''} /></label>
            <label><span>Web</span><input name="website_url" type="url" defaultValue={agent.website_url || ''} /></label>
            <label><span>Instagram</span><input name="instagram_url" type="url" defaultValue={agent.instagram_url || ''} /></label>
            <label className={styles.fieldWide}><span>Dirección</span><input name="address" defaultValue={agent.address || ''} /></label>
            <label><span>Email</span><input name="email" type="email" defaultValue={agent.email || ''} /></label>
            <label><span>Teléfono</span><input name="phone" defaultValue={agent.phone || ''} /></label>
            <label className={styles.fieldWide}><span>Notas de actividad</span><textarea name="active_notes" defaultValue={agent.active_notes || ''} rows="3" /></label>
          </div>
          <div className={styles.formActions}><small>Los cambios publicados quedan disponibles para las relaciones del grafo.</small>{canEdit ? <button className={styles.primaryButton} type="submit">Guardar ficha completa</button> : null}</div>
        </form>
      </section>

      <section className={styles.editorSection} id="nombres">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Identidad histórica</span><h2>Nombres, alias y denominaciones</h2></div><p>Conserva cambios de nombre sin perder su contexto temporal.</p></div>
        <div className={styles.editorStack}>
          {data.names.map((item) => <article className={styles.editorItem} key={item.id}><form action={saveAgentNameAction} className={styles.editorForm}><input type="hidden" name="agent_id" value={entity.id} /><input type="hidden" name="name_id" value={item.id} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Nombre</span><input name="alternate_name" defaultValue={item.name} required /></label><label><span>Tipo</span><select name="name_type" defaultValue={item.name_type}>{NAME_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><PeriodFields item={item} /><label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked={item.is_current} /><span>Nombre vigente</span></label><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item.notes || ''} rows="2" /></label></div>{canEdit ? <div className={styles.formActions}><span /><button className={styles.secondaryButton} type="submit">Guardar nombre</button></div> : null}</form>{canEdit ? <form action={deleteAgentNameAction} className={styles.archiveForm}><input type="hidden" name="agent_id" value={entity.id} /><input type="hidden" name="name_id" value={item.id} /><button type="submit">Retirar registro de nombre</button></form> : null}</article>)}
          {canEdit ? <article className={styles.editorItem}><form action={saveAgentNameAction} className={styles.editorForm}><input type="hidden" name="agent_id" value={entity.id} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Nuevo nombre</span><input name="alternate_name" required /></label><label><span>Tipo</span><select name="name_type" defaultValue="alias">{NAME_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><PeriodFields /><label className={styles.checkField}><input name="is_current" type="checkbox" /><span>Nombre vigente</span></label><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label></div><div className={styles.formActions}><span /><button className={styles.primaryButton} type="submit">Añadir nombre</button></div></form></article> : null}
        </div>
      </section>

      <section className={styles.editorSection} id="disciplinas">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Especialización</span><h2>Disciplinas</h2></div><p>Imaginería, talla, bordado, orfebrería, composición, capataz…</p></div>
        <div className={styles.editorStack}>
          {data.disciplines.map((item) => <article className={styles.editorItem} key={item.id}><form action={saveAgentDisciplineAction} className={styles.editorForm}><input type="hidden" name="agent_id" value={entity.id} /><input type="hidden" name="discipline_id" value={item.id} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Disciplina</span><input name="discipline" defaultValue={item.discipline} required /></label><label className={styles.checkField}><input name="is_primary" type="checkbox" defaultChecked={item.is_primary} /><span>Disciplina principal</span></label><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item.notes || ''} rows="2" /></label></div>{canEdit ? <div className={styles.formActions}><span /><button className={styles.secondaryButton} type="submit">Guardar disciplina</button></div> : null}</form>{canEdit ? <form action={deleteAgentDisciplineAction} className={styles.archiveForm}><input type="hidden" name="agent_id" value={entity.id} /><input type="hidden" name="discipline_id" value={item.id} /><button type="submit">Retirar disciplina</button></form> : null}</article>)}
          {canEdit ? <article className={styles.editorItem}><form action={saveAgentDisciplineAction} className={styles.editorForm}><input type="hidden" name="agent_id" value={entity.id} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Nueva disciplina</span><input name="discipline" required /></label><label className={styles.checkField}><input name="is_primary" type="checkbox" /><span>Disciplina principal</span></label><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label></div><div className={styles.formActions}><span /><button className={styles.primaryButton} type="submit">Añadir disciplina</button></div></form></article> : null}
        </div>
      </section>

      <section className={styles.editorSection} id="roles">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Trayectoria</span><h2>Roles y responsabilidades</h2></div><p>Registra funciones con su periodo sin convertirlas en texto plano.</p></div>
        <div className={styles.editorStack}>
          {data.roles.map((item) => <article className={styles.editorItem} key={item.id}><form action={saveAgentRoleAction} className={styles.editorForm}><input type="hidden" name="agent_id" value={entity.id} /><input type="hidden" name="role_id" value={item.id} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Rol</span><input name="role_name" defaultValue={item.role_name} required /></label><PeriodFields item={item} /><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item.notes || ''} rows="2" /></label></div>{canEdit ? <div className={styles.formActions}><span /><button className={styles.secondaryButton} type="submit">Guardar rol</button></div> : null}</form>{canEdit ? <form action={deleteAgentRoleAction} className={styles.archiveForm}><input type="hidden" name="agent_id" value={entity.id} /><input type="hidden" name="role_id" value={item.id} /><button type="submit">Retirar rol</button></form> : null}</article>)}
          {canEdit ? <article className={styles.editorItem}><form action={saveAgentRoleAction} className={styles.editorForm}><input type="hidden" name="agent_id" value={entity.id} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Nuevo rol</span><input name="role_name" required /></label><PeriodFields /><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label></div><div className={styles.formActions}><span /><button className={styles.primaryButton} type="submit">Añadir rol</button></div></form></article> : null}
        </div>
      </section>

      <section className={styles.editorSection} id="documentacion">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Soporte documental</span><h2>Fuentes y multimedia</h2></div><p>Las herramientas transversales mantienen la documentación reutilizable.</p></div>
        <div className={styles.dashboardGrid}>
          <article className={styles.panelCard}><span className={styles.eyebrow}>Fuentes</span><h3>{coverage.sources} vinculada{coverage.sources === 1 ? '' : 's'}</h3><p className={styles.emptyText}>Documentación directa de esta ficha.</p><div style={{ marginTop: 18 }}><Link className={styles.secondaryButton} href={`/panel/fuentes?entity=${entity.id}`}>Gestionar Fuentes</Link></div></article>
          <article className={styles.panelCard}><span className={styles.eyebrow}>Multimedia</span><h3>{coverage.media} recurso{coverage.media === 1 ? '' : 's'}</h3><p className={styles.emptyText}>{coverage.cover ? 'La ficha tiene portada vinculada.' : 'Todavía no tiene portada vinculada.'}</p><div style={{ marginTop: 18 }}><Link className={styles.secondaryButton} href={`/panel/multimedia?entity=${entity.id}`}>Gestionar multimedia</Link></div></article>
        </div>
      </section>
    </div>
  )
}
