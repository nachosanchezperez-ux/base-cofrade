import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelMasterData } from '@/lib/panel/master-data'
import { completeReferenceNodeAction } from '../actions'
import { STATUS_LABELS } from '@/components/panel/data/DataEditorPrimitives'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Referencias · Datos · Panel' }

export default async function ReferenceNodesPage() {
  const [user, data] = await Promise.all([requirePanelUser(), getPanelMasterData()])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return <div className={styles.pageWrap}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Integridad estructural</span><h1>Nodos de referencia</h1><p>Entidades creadas por relaciones o importaciones que todavía no tienen su ficha especializada.</p></div></header>
    {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil puede consultar estas referencias, pero no completarlas.</div> : null}

    <section className={styles.metricGrid} aria-label="Referencias pendientes">
      <article className={styles.metricCard}><span>Pendientes</span><strong>{data.referenceNodes.length}</strong><small>nodos por consolidar</small></article>
      <article className={styles.metricCard}><span>Personas</span><strong>{data.referenceNodes.filter((item) => item.entity_type === 'agent').length}</strong><small>autores y profesionales</small></article>
      <article className={styles.metricCard}><span>Pasos</span><strong>{data.referenceNodes.filter((item) => item.entity_type === 'step').length}</strong><small>sin ficha técnica</small></article>
      <article className={styles.metricCard}><span>Hermandades</span><strong>{data.referenceNodes.filter((item) => item.entity_type === 'brotherhood').length}</strong><small>sin ficha institucional</small></article>
    </section>

    <section className={styles.editorSection}>
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Cola de trabajo</span><h2>Completar referencias</h2></div><p>Completar crea únicamente el registro especializado y abre su editor. No duplica la entidad ni sus relaciones.</p></div>
      {data.referenceNodes.length ? <div className={styles.editorStack}>{data.referenceNodes.map((item) => <article className={styles.editorItem} key={item.id}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>{item.typeLabel}</span><h3>{item.name}</h3><small>{item.slug || 'Sin slug'} · {STATUS_LABELS[item.status] || item.status}</small></div>{canEdit ? <form action={completeReferenceNodeAction}><input type="hidden" name="entity_id" value={item.id} /><button className={styles.primaryButton} type="submit">Completar ficha</button></form> : null}</div></article>)}</div> : <div className={styles.savedNotice}>No hay nodos incompletos de los tipos gestionados.</div>}
    </section>
  </div>
}
