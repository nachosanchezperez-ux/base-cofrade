import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelMasterData } from '@/lib/panel/master-data'
import { savePlaceAction } from '../actions'
import { PlaceFields, SaveBar } from '@/components/panel/data/DataEditorPrimitives'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Lugares · Datos · Panel' }

export default async function PlacesPage({ searchParams }) {
  const [query, user, data] = await Promise.all([searchParams, requirePanelUser(), getPanelMasterData()])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return <div className={styles.pageWrap}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Sedes y enclaves</span><h1>Lugares</h1><p>Templos, plazas, sedes y otros puntos reutilizables en fichas, cultos, acontecimientos y salidas.</p></div></header>
    {query?.saved ? <div className={styles.savedNotice} role="status">Lugar guardado correctamente.</div> : null}
    {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil puede consultar estos datos, pero no modificarlos.</div> : null}

    <section className={styles.metricGrid} aria-label="Resumen de lugares">
      <article className={styles.metricCard}><span>Total</span><strong>{data.places.length}</strong><small>lugares reutilizables</small></article>
      <article className={styles.metricCard}><span>Con municipio</span><strong>{data.places.filter((item) => item.municipality_id).length}</strong><small>geografía estructurada</small></article>
      <article className={styles.metricCard}><span>Con coordenadas</span><strong>{data.places.filter((item) => item.latitude !== null && item.longitude !== null).length}</strong><small>localización precisa</small></article>
      <article className={styles.metricCard}><span>Horario verificado</span><strong>{data.places.filter((item) => item.opening_hours_verified_at).length}</strong><small>dato revisado</small></article>
    </section>

    <section className={styles.editorSection}>
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Geografía</span><h2>Lugares registrados</h2></div><p>La misma ficha de Lugar se reutiliza en todo el grafo para evitar direcciones y nombres duplicados.</p></div>
      <div className={styles.editorStack}>{data.places.map((item) => <article className={styles.editorItem} key={item.id}><form action={savePlaceAction} className={styles.editorForm}><input type="hidden" name="place_id" value={item.id} /><PlaceFields item={item} municipalities={data.municipalities} /><SaveBar canEdit={canEdit} label="Guardar lugar" /></form></article>)}{canEdit ? <article className={styles.editorItem}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nuevo</span><h3>Añadir lugar</h3></div></div><form action={savePlaceAction} className={styles.editorForm}><PlaceFields municipalities={data.municipalities} /><SaveBar canEdit label="Crear lugar" /></form></article> : null}</div>
    </section>
  </div>
}
