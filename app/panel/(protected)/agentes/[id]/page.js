import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { AGENT_KIND_LABELS, getAgentEditorData } from '@/lib/panel/agents'
import { getAgentRelationsData } from '@/lib/panel/agent-relations'
import { STATUS_LABELS, StatusSelect } from '@/components/panel/agent/AgentEditorPrimitives'
import { saveAgentGeneralAction } from './general-action'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Editar ficha · Personas · Panel' }

function ModuleRow({ href, label, count, note }) {
  return (
    <div>
      <span><strong>{label}</strong>{note ? <small style={{ display: 'block', marginTop: 3 }}>{note}</small> : null}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><b>{count}</b><Link className={styles.rowLink} href={href}>Abrir <span>→</span></Link></span>
    </div>
  )
}

export default async function AgentEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const [data, relationData] = await Promise.all([getAgentEditorData(id), getAgentRelationsData(id)])
  if (!data || !relationData) notFound()

  const savedRoute = { nombres: 'nombres', disciplinas: 'disciplinas', roles: 'roles' }[query?.saved]
  if (savedRoute) redirect(`/panel/agentes/${id}/${savedRoute}?saved=${query.saved}`)

  const canEdit = ['admin', 'editor'].includes(user.role)
  const { entity, agent, coverage } = data

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/agentes">Personas</Link><span>→</span><strong>{entity.name}</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Resumen de ficha</span><h1>{entity.name}</h1><p>{AGENT_KIND_LABELS[agent.agent_kind] || 'Registro'}</p></div>
          <div className={styles.editorHeaderActions}>
            <span className={`${styles.statusBadge} ${styles[entity.status]}`}>{STATUS_LABELS[entity.status]}</span>
            {entity.status === 'published' && entity.slug ? <Link className={styles.secondaryButton} href={`/agentes/${entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
          </div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {data.isReference ? <div className={styles.savedNotice}>Este registro nació como nodo de referencia. Al guardar Información general se consolidará como ficha completa de Persona/Autor.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando esta ficha como colaborador.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura de la ficha">
        <article className={styles.metricCard}><span>Nombres</span><strong>{coverage.names}</strong><small>alias y denominaciones</small></article>
        <article className={styles.metricCard}><span>Disciplinas</span><strong>{coverage.disciplines}</strong><small>especialidades</small></article>
        <article className={styles.metricCard}><span>Relaciones</span><strong>{relationData.total}</strong><small>obra y responsabilidades</small></article>
        <article className={styles.metricCard}><span>Documentación</span><strong>{coverage.sources + coverage.media}</strong><small>{coverage.sources} fuentes · {coverage.media} recursos</small></article>
      </section>

      <section className={styles.editorSection} id="general">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Fuente de verdad</span><h2>Información general</h2></div><p>Identidad, biografía o trayectoria y datos públicos del registro.</p></div>
        <form action={saveAgentGeneralAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="agent_id" value={entity.id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Nombre principal</span><input name="name" defaultValue={entity.name} required /></label>
            <label><span>Tipo de registro</span><select name="agent_kind" defaultValue={agent.agent_kind} required><option value="person">Persona</option><option value="workshop">Taller</option><option value="company">Empresa</option><option value="institution">Institución</option></select></label>
            <label><span>Slug</span><input name="slug" defaultValue={entity.slug || ''} required /></label>
            <label><span>Estado editorial</span><StatusSelect defaultValue={entity.status} /></label>
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
          <div className={styles.formActions}><small>Los cambios publicados quedan disponibles para las relaciones del grafo.</small>{canEdit ? <button className={styles.primaryButton} type="submit">Guardar información general</button> : null}</div>
        </form>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Cobertura editorial</span><h2>Completar el nodo</h2></div><p>La identidad base vive aquí; los contenidos relacionales se administran en módulos propios.</p></div>
        <div className={styles.panelCard}><div className={styles.moduleList}>
          <ModuleRow href={`/panel/agentes/${id}/nombres`} label="Nombres y denominaciones" count={coverage.names} note="Alias, nombres artísticos, comerciales y anteriores" />
          <ModuleRow href={`/panel/agentes/${id}/disciplinas`} label="Disciplinas" count={coverage.disciplines} note="Especialidades y disciplina principal" />
          <ModuleRow href={`/panel/agentes/${id}/roles`} label="Roles y responsabilidades" count={coverage.roles} note="Trayectoria estructurada por periodos" />
          <ModuleRow href={`/panel/agentes/${id}/obra`} label="Obra y relaciones" count={relationData.total} note="Imágenes, Pasos, patrimonio, Bandas y Marchas" />
          <ModuleRow href={`/panel/multimedia?entity=${id}`} label="Multimedia" count={coverage.media} note="Archivo visual y portada" />
          <ModuleRow href={`/panel/fuentes?entity=${id}`} label="Fuentes" count={coverage.sources} note="Documentación directa de esta ficha" />
        </div></div>
      </section>
    </div>
  )
}
