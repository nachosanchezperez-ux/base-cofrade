import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelMasterData } from '@/lib/panel/master-data'
import { getPanelDataHealth } from '@/lib/panel/data-health'
import styles from '@/app/panel/panel.module.css'

function ModuleRow({ href, label, count, note }) {
  return <div><span><strong>{label}</strong>{note ? <small style={{ display: 'block', marginTop: 3 }}>{note}</small> : null}</span><span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><b>{count}</b><Link className={styles.rowLink} href={href}>Abrir <span>→</span></Link></span></div>
}

export const metadata = { title: 'Datos · Panel' }

export default async function PanelMasterDataPage() {
  await requirePanelUser()
  const [data, health] = await Promise.all([getPanelMasterData(), getPanelDataHealth()])
  const openIssues = health.issues.length

  return <div className={styles.pageWrap}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Calidad y estructura</span><h1>Datos</h1><p>Centro de control de datos maestros, referencias pendientes y salud del grafo de Hilo Cofrade.</p></div></header>

    <section className={styles.metricGrid} aria-label="Resumen de Datos">
      <article className={styles.metricCard}><span>Salud</span><strong>{openIssues}</strong><small>incidencias accionables</small></article>
      <article className={styles.metricCard}><span>Referencias</span><strong>{data.referenceNodes.length}</strong><small>nodos por completar</small></article>
      <article className={styles.metricCard}><span>Advocaciones</span><strong>{data.advocations.length}</strong><small>identidades devocionales</small></article>
      <article className={styles.metricCard}><span>Geografía</span><strong>{data.municipalities.length + data.places.length}</strong><small>{data.municipalities.length} municipios · {data.places.length} lugares</small></article>
    </section>

    {health.bySeverity.critical ? <div className={styles.readOnlyNotice}>Hay {health.bySeverity.critical} incidencia{health.bySeverity.critical === 1 ? '' : 's'} prioritaria{health.bySeverity.critical === 1 ? '' : 's'} en la salud del grafo. Revisa el módulo Salud antes de seguir ampliando contenido publicado.</div> : <div className={styles.savedNotice}>No hay incidencias prioritarias en las comprobaciones activas.</div>}

    <section className={styles.editorSection}>
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Control de calidad</span><h2>Estado del grafo</h2></div><p>Las alertas se calculan en tiempo real: desaparecen cuando resuelves el dato subyacente.</p></div>
      <div className={styles.panelCard}><div className={styles.moduleList}>
        <ModuleRow href="/panel/datos/salud" label="Salud del grafo" count={openIssues} note={`${health.bySeverity.critical} prioritarias · ${health.bySeverity.warning} para revisar · ${health.bySeverity.info} mejoras`} />
        <ModuleRow href="/panel/datos/referencias" label="Nodos de referencia" count={data.referenceNodes.length} note="Personas, Pasos y Hermandades que existen en relaciones pero aún no tienen ficha especializada" />
      </div></div>
    </section>

    <section className={styles.editorSection}>
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Datos maestros</span><h2>Fuentes únicas reutilizables</h2></div><p>Editar aquí evita repetir conceptos y geografía en múltiples fichas.</p></div>
      <div className={styles.panelCard}><div className={styles.moduleList}>
        <ModuleRow href="/panel/datos/advocaciones" label="Advocaciones" count={data.advocations.length} note="Identidades devocionales y relación con Imágenes físicas" />
        <ModuleRow href="/panel/datos/municipios" label="Municipios" count={data.municipalities.length} note="Geografía base de Hermandades, Bandas, cultos y salidas" />
        <ModuleRow href="/panel/datos/lugares" label="Lugares" count={data.places.length} note="Templos, plazas, sedes y enclaves reutilizables" />
      </div></div>
    </section>
  </div>
}
