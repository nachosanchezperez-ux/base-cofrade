import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelDataHealth } from '@/lib/panel/data-health'
import styles from '@/app/panel/panel.module.css'

const SEVERITY_LABELS = { critical: 'Prioritario', warning: 'Revisar', info: 'Mejora' }
const CATEGORIES = ['Estructura', 'Documentación', 'Relaciones', 'Visual']

export const metadata = { title: 'Salud del grafo · Datos · Panel' }

export default async function DataHealthPage({ searchParams }) {
  const [query, user, data] = await Promise.all([searchParams, requirePanelUser(), getPanelDataHealth()])
  void user
  const severity = ['critical', 'warning', 'info'].includes(String(query?.nivel || '')) ? String(query.nivel) : ''
  const category = CATEGORIES.includes(String(query?.categoria || '')) ? String(query.categoria) : ''
  const issues = data.issues.filter((item) => (!severity || item.severity === severity) && (!category || item.category === category))

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div><span className={styles.eyebrow}>Control de calidad</span><h1>Salud del grafo</h1><p>Incidencias accionables detectadas sobre entidades publicadas y nodos estructurales. No penaliza campos opcionales ni multimedia que no sea imprescindible.</p></div>
      </header>

      <section className={styles.metricGrid} aria-label="Resumen de salud">
        <article className={styles.metricCard}><span>Revisadas</span><strong>{data.checkedEntities}</strong><small>entidades públicas principales</small></article>
        <article className={styles.metricCard}><span>Prioritarias</span><strong>{data.bySeverity.critical}</strong><small>estructura o publicación</small></article>
        <article className={styles.metricCard}><span>Revisar</span><strong>{data.bySeverity.warning}</strong><small>documentación y relaciones</small></article>
        <article className={styles.metricCard}><span>Mejoras</span><strong>{data.bySeverity.info}</strong><small>completitud recomendada</small></article>
      </section>

      <form className={styles.filters} style={{ gridTemplateColumns: '220px 220px auto 1fr' }}>
        <label><span className={styles.srOnly}>Prioridad</span><select name="nivel" defaultValue={severity}><option value="">Todas las prioridades</option><option value="critical">Prioritarias</option><option value="warning">Revisar</option><option value="info">Mejoras</option></select></label>
        <label><span className={styles.srOnly}>Categoría</span><select name="categoria" defaultValue={category}><option value="">Todas las categorías</option>{CATEGORIES.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
        <small style={{ alignSelf: 'center', color: '#68788a' }}>{issues.length} de {data.issues.length} incidencias visibles.</small>
      </form>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Diagnóstico</span><h2>Incidencias abiertas</h2></div><p>{issues.length} incidencia{issues.length === 1 ? '' : 's'} en la vista actual.</p></div>
        {issues.length ? (
          <div className={styles.editorStack}>
            {issues.map((item) => (
              <article className={styles.editorItem} key={item.id}>
                <div className={styles.itemHeading}>
                  <div>
                    <span className={styles.eyebrow}>{item.category} · {item.entityLabel}</span>
                    <h3>{item.entityName}</h3>
                    <p><strong>{item.title}</strong></p>
                  </div>
                  <span className={`${styles.statusBadge} ${item.severity === 'critical' ? styles.archived : item.severity === 'warning' ? styles.review : styles.draft}`}>{SEVERITY_LABELS[item.severity]}</span>
                </div>
                <p className={styles.emptyText}>{item.detail}</p>
                <div className={styles.formActions}><small>La incidencia desaparece automáticamente cuando el dato subyacente queda resuelto.</small><Link className={styles.secondaryButton} href={item.href}>{item.action} →</Link></div>
              </article>
            ))}
          </div>
        ) : <div className={styles.savedNotice}>No hay incidencias que coincidan con estos filtros.</div>}
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Alcance</span><h2>Qué se está comprobando</h2></div><p>Las reglas se centran en datos necesarios para que el grafo sea navegable y documentado.</p></div>
        <div className={styles.panelCard}>
          <div className={styles.moduleList}>
            <div><span><strong>Estructura</strong><small style={{ display: 'block', marginTop: 3 }}>Nodos de referencia sin ficha especializada.</small></span><b>{data.byCategory.Estructura || 0}</b></div>
            <div><span><strong>Documentación</strong><small style={{ display: 'block', marginTop: 3 }}>Entidades públicas principales sin Fuente directa.</small></span><b>{data.byCategory.Documentación || 0}</b></div>
            <div><span><strong>Relaciones</strong><small style={{ display: 'block', marginTop: 3 }}>Autorías, responsables, dirección y acompañamientos esenciales.</small></span><b>{data.byCategory.Relaciones || 0}</b></div>
            <div><span><strong>Visual</strong><small style={{ display: 'block', marginTop: 3 }}>Solo se exige recurso visual donde forma parte inseparable de la entidad: Imágenes.</small></span><b>{data.byCategory.Visual || 0}</b></div>
          </div>
        </div>
      </section>
    </div>
  )
}
