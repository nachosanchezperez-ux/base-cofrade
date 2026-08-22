import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { StatusSelect, STATUS_LABELS } from '@/components/panel/step/StepEditorPrimitives'
import { requirePanelUser } from '@/lib/panel/auth'
import { getStepEditorData } from '@/lib/panel/steps'
import { updateStepAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Editar paso · Panel' }

const MODULE_REDIRECTS = {
  personas: 'responsables',
  musica: 'musica',
  patrimonio: 'patrimonio',
}

function ModuleRow({ href, label, count, note }) {
  return (
    <div>
      <span><strong>{label}</strong>{note ? <small style={{ display: 'block', marginTop: 3 }}>{note}</small> : null}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><b>{count}</b><Link className={styles.rowLink} href={href}>Abrir <span>→</span></Link></span>
    </div>
  )
}

export default async function StepEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const targetModule = MODULE_REDIRECTS[query?.saved]
  if (targetModule) redirect(`/panel/pasos/${id}/${targetModule}?saved=${query.saved}`)

  const data = await getStepEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const { entity, step, coverage } = data

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/pasos">Pasos</Link><span>→</span><strong>{entity.name}</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Resumen del paso</span><h1>{entity.name}</h1><p>{step.step_type || 'Tipo de paso pendiente de documentar'}</p></div>
          <div className={styles.editorHeaderActions}>
            <span className={`${styles.statusBadge} ${styles[entity.status]}`}>{STATUS_LABELS[entity.status]}</span>
            {entity.status === 'published' && entity.slug ? <Link className={styles.secondaryButton} href={`/pasos/${entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
          </div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando el paso como colaborador. Un editor debe realizar los cambios.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura de la ficha">
        <article className={styles.metricCard}><span>Responsables</span><strong>{coverage.personnel}</strong><small>periodos documentados</small></article>
        <article className={styles.metricCard}><span>Música</span><strong>{coverage.music}</strong><small>acompañamientos registrados</small></article>
        <article className={styles.metricCard}><span>Patrimonio</span><strong>{coverage.phases}</strong><small>fases de evolución material</small></article>
        <article className={styles.metricCard}><span>Multimedia</span><strong>{coverage.media}</strong><small>{coverage.cover ? 'Portada definida' : 'Sin portada'}</small></article>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Fuente de verdad</span><h2>Datos técnicos</h2></div><p>Identidad, configuración actual y estado editorial que alimentan el Front.</p></div>
        <form action={updateStepAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="step_id" value={entity.id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Nombre del paso</span><input name="name" defaultValue={entity.name} required /></label>
            <label><span>Tipo de paso</span><input name="step_type" defaultValue={step.step_type || ''} placeholder="Misterio, palio, Cristo…" /></label>
            <label><span>Slug público</span><input name="slug" defaultValue={entity.slug || ''} required /></label>
            <label><span>Estado editorial</span><StatusSelect defaultValue={entity.status} /></label>
            <label className={styles.fieldWide}><span>Resumen SEO / directorio</span><textarea name="summary" defaultValue={entity.summary || ''} rows="3" /></label>
            <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" defaultValue={step.description || ''} rows="5" /></label>
            <label><span>Estilo</span><input name="style" defaultValue={step.style || ''} /></label>
            <label><span>Materiales</span><input name="materials" defaultValue={step.materials || ''} /></label>
            <label><span>Ejecución / datación</span><input name="execution_date_text" defaultValue={step.execution_date_text || ''} placeholder="1945, 1926–1927…" /></label>
            <label><span>Sistema de portadores</span><input name="carrier_system" defaultValue={step.carrier_system || ''} placeholder="Costaleros, ruedas…" /></label>
            <label><span>Dimensiones en texto</span><input name="dimensions_text" defaultValue={step.dimensions_text || ''} /></label>
            <label><span>Largo (cm)</span><input name="length_cm" type="number" min="0" step="0.01" defaultValue={step.length_cm ?? ''} /></label>
            <label><span>Ancho (cm)</span><input name="width_cm" type="number" min="0" step="0.01" defaultValue={step.width_cm ?? ''} /></label>
            <label><span>Alto (cm)</span><input name="height_cm" type="number" min="0" step="0.01" defaultValue={step.height_cm ?? ''} /></label>
            <label><span>Número de trabajaderas</span><input name="workbenches_count" type="number" min="0" defaultValue={step.workbenches_count ?? ''} /></label>
            <label><span>Estado de conservación</span><input name="current_condition" defaultValue={step.current_condition || ''} /></label>
            <label className={styles.fieldWide}><span>Estado actual / observaciones públicas</span><textarea name="current_state_notes" defaultValue={step.current_state_notes || ''} rows="3" /></label>
            <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" defaultValue={step.notes || ''} rows="3" /></label>
          </div>
          <div className={styles.formActions}><small>Las relaciones, música, responsables y evolución material se editan en módulos propios del workspace.</small>{canEdit ? <button className={styles.primaryButton} type="submit">Guardar ficha técnica</button> : null}</div>
        </form>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Cobertura editorial</span><h2>Completar el paso</h2></div><p>Cada bloque especializado conserva su histórico, relaciones y Fuentes.</p></div>
        <div className={styles.panelCard}><div className={styles.moduleList}>
          <ModuleRow href={`/panel/pasos/${id}/responsables`} label="Responsables y capataces" count={coverage.personnel} note="Periodos actuales e históricos" />
          <ModuleRow href={`/panel/pasos/${id}/musica`} label="Música" count={coverage.music} note="Bandas, Hermandad, posición y vigencia" />
          <ModuleRow href={`/panel/pasos/${id}/patrimonio`} label="Patrimonio y evolución" count={coverage.phases} note="Fases, autores, talleres y restauraciones" />
          <ModuleRow href={`/panel/multimedia?entity=${id}`} label="Multimedia" count={coverage.media} note="Archivo visual y portada" />
          <ModuleRow href="/panel/relaciones/imagen-paso" label="Imágenes vinculadas" count={coverage.images} note={`${coverage.brotherhoods} Hermandad${coverage.brotherhoods === 1 ? '' : 'es'} relacionada${coverage.brotherhoods === 1 ? '' : 's'}`} />
          <ModuleRow href={`/panel/fuentes?entity=${id}`} label="Fuentes directas" count={coverage.sources} note="Documentación general del Paso" />
        </div></div>
      </section>
    </div>
  )
}
