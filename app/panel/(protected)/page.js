import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelDashboard } from '@/lib/panel/data'
import { getPanelDashboardGroups } from '@/lib/panel/navigation'
import styles from '@/app/panel/panel.module.css'
import accessStyles from '@/components/panel/PanelDashboardAccess.module.css'

const ACTION_LABELS = {
  create: 'Creación', update: 'Actualización', publish: 'Publicación',
  unpublish: 'Retirada', archive: 'Archivo', restore: 'Restauración',
  delete: 'Borrado', link: 'Vinculación', unlink: 'Desvinculación',
}

export const metadata = { title: 'Panel de control' }

export default async function PanelDashboardPage() {
  const [user, dashboard] = await Promise.all([requirePanelUser(), getPanelDashboard()])
  const total = Object.values(dashboard.entities).reduce((sum, value) => sum + value, 0)
  const accessGroups = getPanelDashboardGroups(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div><span className={styles.eyebrow}>Panel de control</span><h1>Hola, {user.name.split(' ')[0]}</h1><p>Una visión clara del archivo y del trabajo editorial pendiente.</p></div>
      </header>

      <section className={accessStyles.accessSection} aria-labelledby="panel-direct-access-title">
        <div className={accessStyles.accessHeading}>
          <div>
            <span className={styles.eyebrow}>Accesos directos</span>
            <h2 id="panel-direct-access-title">Gestiona todo Hilo</h2>
            <p>Los mismos módulos en móvil y escritorio, sin tener que pasar por el menú.</p>
          </div>
        </div>

        <div className={accessStyles.accessGroups}>
          {accessGroups.map((group) => (
            <section className={accessStyles.accessGroup} key={group.label} aria-label={group.label}>
              <span className={accessStyles.accessGroupLabel}>{group.label}</span>
              <div className={accessStyles.accessGrid}>
                {group.items.map((item) => (
                  <Link className={accessStyles.accessCard} href={item.href} key={item.href}>
                    <span className={accessStyles.accessMark} aria-hidden="true">{item.mark}</span>
                    <span className={accessStyles.accessCopy}>
                      <strong>{item.label}</strong>
                      <small>{item.description}</small>
                    </span>
                    <span className={accessStyles.accessArrow} aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className={styles.metricGrid} aria-label="Estado editorial">
        <article className={styles.metricCard}><span>Publicado</span><strong>{dashboard.entities.published}</strong><small>de {total} entidades</small></article>
        <article className={styles.metricCard}><span>En revisión</span><strong>{dashboard.entities.review}</strong><small>pendientes de validar</small></article>
        <article className={styles.metricCard}><span>Borradores</span><strong>{dashboard.entities.draft}</strong><small>en documentación</small></article>
        <article className={styles.metricCard}><span>Archivo visual</span><strong>{dashboard.modules.media}</strong><small>recursos registrados</small></article>
      </section>

      <div className={styles.dashboardGrid}>
        <section className={styles.panelCard}>
          <div className={styles.cardHeading}><div><span className={styles.eyebrow}>Contenido</span><h2>Módulos activos</h2></div></div>
          <div className={styles.moduleList}>
            <div><span>Salidas documentadas</span><strong>{dashboard.modules.outings}</strong></div>
            <div><span>Cultos registrados</span><strong>{dashboard.modules.cults}</strong></div>
            <div><span>Igualás y ensayos</span><strong>{dashboard.modules.crewEvents}</strong></div>
            <div><span>Patrimonio documentado</span><strong>{dashboard.modules.heritage}</strong></div>
            <div><span>Contenido archivado</span><strong>{dashboard.entities.archived}</strong></div>
          </div>
        </section>

        <section className={styles.panelCard}>
          <div className={styles.cardHeading}><div><span className={styles.eyebrow}>Trazabilidad</span><h2>Actividad reciente</h2></div></div>
          {dashboard.activity.length ? (
            <ol className={styles.activityList}>
              {dashboard.activity.map((item) => (
                <li key={item.id}><span className={styles.activityDot} /><div><strong>{item.summary}</strong><small>{item.actor_label || 'Equipo editorial'} · {ACTION_LABELS[item.action_type] || item.action_type}</small></div></li>
              ))}
            </ol>
          ) : <p className={styles.emptyText}>Los próximos cambios quedarán registrados aquí.</p>}
        </section>
      </div>
    </div>
  )
}
