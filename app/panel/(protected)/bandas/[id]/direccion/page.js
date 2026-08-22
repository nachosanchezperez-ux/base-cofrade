import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBandEditorData } from '@/lib/panel/data'
import { loadRelationSourceSupport } from '@/lib/panel/relation-sources'
import { createClient } from '@/lib/supabase/server'
import { SaveBar } from '@/components/panel/band/BandEditorPrimitives'
import { archiveBandDirectionAction, saveBandDirectionAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Dirección · Banda · Panel' }

function PeriodFields({ item }) {
  return (
    <div className={styles.formGrid}>
      <label><span>Inicio exacto</span><input name="date_from" type="date" defaultValue={item?.date_from || ''} /></label>
      <label><span>Inicio en texto</span><input name="date_from_text" defaultValue={item?.date_from_text || ''} placeholder="2023/2024, agosto de 2026…" /></label>
      <label><span>Final exacto</span><input name="date_to" type="date" defaultValue={item?.date_to || ''} /></label>
      <label><span>Final en texto</span><input name="date_to_text" defaultValue={item?.date_to_text || ''} placeholder="Hasta 2025, curso 2024/25…" /></label>
    </div>
  )
}

function ExistingDirectionForm({ item, bandId, canEdit, sourceOptions }) {
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div>
          <span className={styles.eyebrow}>{item.is_current ? 'Dirección actual' : 'Histórico'}</span>
          <h3>{item.agent?.name || 'Persona no disponible'}</h3>
          <p>{item.role_name}</p>
        </div>
      </div>

      {item.agent ? (
        <Link className={styles.rowLink} href={`/panel/agentes/${item.agent.id}`}>
          Abrir Persona <span>→</span>
        </Link>
      ) : null}

      <form action={saveBandDirectionAction} className={styles.editorForm}>
        <input type="hidden" name="band_id" value={bandId} />
        <input type="hidden" name="band_agent_id" value={item.id} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Responsabilidad</span><input name="role_name" defaultValue={item.role_name || ''} placeholder="Dirección musical" required /></label>
        </div>
        <PeriodFields item={item} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item.notes || ''} rows="2" /></label>
          <label><span>Vigencia</span><span><input name="is_current" type="checkbox" defaultChecked={item.is_current} /> Responsabilidad vigente</span></label>
          <label><span>Visibilidad</span><span><input name="is_public" type="checkbox" defaultChecked={item.is_public !== false} /> Visible públicamente</span></label>
        </div>
        <SaveBar label="Guardar responsabilidad" canEdit={canEdit} />
      </form>

      {item.is_current && canEdit ? (
        <form action={archiveBandDirectionAction} className={styles.archiveForm}>
          <input type="hidden" name="band_id" value={bandId} />
          <input type="hidden" name="band_agent_id" value={item.id} />
          <button type="submit">Cerrar periodo actual</button>
        </form>
      ) : null}

      <RelationSourcesEditor
        relationKind="band_agent"
        relationId={item.id}
        contextEntityId={bandId}
        sourceOptions={sourceOptions}
        links={item.sourceLinks || []}
        returnPath={`/panel/bandas/${bandId}/direccion`}
        canEdit={canEdit}
      />
    </article>
  )
}

function NewDirectionForm({ bandId, canEdit, agentOptions }) {
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div>
          <span className={styles.eyebrow}>Nueva responsabilidad</span>
          <h3>Añadir a la dirección</h3>
          <p>Reutiliza una Persona existente siempre que sea posible.</p>
        </div>
      </div>
      <form action={saveBandDirectionAction} className={styles.editorForm}>
        <input type="hidden" name="band_id" value={bandId} />
        <EntityPicker
          className={styles.fieldWide}
          name="agent_entity_id"
          items={agentOptions}
          label="Buscar Persona existente"
          placeholder="Nombre de la Persona…"
          emptyLabel="No vincular Persona existente"
          required={false}
        />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}>
            <span>O crear Persona nueva</span>
            <input name="person_name" placeholder="Solo si no existe ya en Personas" />
          </label>
          <label className={styles.fieldWide}><span>Responsabilidad</span><input name="role_name" placeholder="Dirección musical" required /></label>
        </div>
        <PeriodFields />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label>
          <label><span>Vigencia</span><span><input name="is_current" type="checkbox" defaultChecked /> Responsabilidad vigente</span></label>
          <label><span>Visibilidad</span><span><input name="is_public" type="checkbox" defaultChecked /> Visible públicamente</span></label>
        </div>
        <SaveBar label="Añadir responsabilidad" canEdit={canEdit} />
      </form>
    </article>
  )
}

export default async function BandDirectionPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBandEditorData(id)
  if (!data) notFound()

  const supabase = await createClient()
  const agentIds = data.agents.map((agent) => agent.id).filter(Boolean)
  const [sourceSupport, personRowsResult] = await Promise.all([
    loadRelationSourceSupport(supabase, data.direction, 'band_agent'),
    agentIds.length
      ? supabase.from('agents').select('entity_id').in('entity_id', agentIds).eq('agent_kind', 'person')
      : Promise.resolve({ data: [], error: null }),
  ])
  if (personRowsResult.error) throw new Error(`No se pudieron filtrar las Personas: ${personRowsResult.error.message}`)

  const personIds = new Set((personRowsResult.data || []).map((item) => item.entity_id))
  const canEdit = ['admin', 'editor'].includes(user.role)
  const displayName = data.popularName?.name || data.entity.name
  const current = sourceSupport.relations.filter((item) => item.is_current)
  const historical = sourceSupport.relations.filter((item) => !item.is_current)
  const agentOptions = data.agents
    .filter((agent) => personIds.has(agent.id))
    .map((agent) => ({ id: agent.id, name: agent.name, slug: agent.slug, meta: agent.status === 'published' ? 'Persona' : agent.status }))

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/bandas">Bandas</Link><span>→</span><Link href={`/panel/bandas/${id}`}>{displayName}</Link><span>→</span><strong>Dirección</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Organización</span><h1>Dirección y responsables</h1><p>Personas, responsabilidades, periodos y Fuentes sin duplicar la identidad del nodo Persona.</p></div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Dirección actualizada correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Equipo actual</span><h2>Responsabilidades vigentes</h2></div><p>{current.length} responsabilidad{current.length === 1 ? '' : 'es'} activa{current.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>
          {current.map((item) => <ExistingDirectionForm key={item.id} item={item} bandId={data.entity.id} canEdit={canEdit} sourceOptions={sourceSupport.sourceOptions} />)}
          {canEdit ? <NewDirectionForm bandId={data.entity.id} canEdit={canEdit} agentOptions={agentOptions} /> : null}
        </div>
      </section>

      {historical.length ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Histórico</span><h2>Responsabilidades anteriores</h2></div><p>Se conserva la trayectoria de la organización sin perder Personas ni Fuentes.</p></div>
          <div className={styles.editorStack}>{historical.map((item) => <ExistingDirectionForm key={item.id} item={item} bandId={data.entity.id} canEdit={canEdit} sourceOptions={sourceSupport.sourceOptions} />)}</div>
        </section>
      ) : null}
    </div>
  )
}
