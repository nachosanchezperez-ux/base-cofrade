import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelMasterData } from '@/lib/panel/master-data'
import { saveMunicipalityAction } from '../actions'
import { MunicipalityFields, SaveBar } from '@/components/panel/data/DataEditorPrimitives'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Municipios · Datos · Panel' }

export default async function MunicipalitiesPage({ searchParams }) {
  const [query, user, data] = await Promise.all([searchParams, requirePanelUser(), getPanelMasterData()])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return <div className={styles.pageWrap}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Geografía maestra</span><h1>Municipios</h1><p>Fuente única para Hermandades, Bandas, Lugares, cultos y salidas.</p></div></header>
    {query?.saved ? <div className={styles.savedNotice} role="status">Municipio guardado correctamente.</div> : null}
    {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil puede consultar estos datos, pero no modificarlos.</div> : null}

    <section className={styles.metricGrid} aria-label="Resumen de municipios">
      <article className={styles.metricCard}><span>Total</span><strong>{data.municipalities.length}</strong><small>municipios reutilizables</small></article>
      <article className={styles.metricCard}><span>Sevilla</span><strong>{data.municipalities.filter((item) => item.province === 'Sevilla').length}</strong><small>provincia principal</small></article>
      <article className={styles.metricCard}><span>Con Lugares</span><strong>{data.municipalities.filter((item) => data.places.some((place) => place.municipality_id === item.id)).length}</strong><small>enclaves asociados</small></article>
      <article className={styles.metricCard}><span>Sin Lugares</span><strong>{data.municipalities.filter((item) => !data.places.some((place) => place.municipality_id === item.id)).length}</strong><small>todavía sin enclaves</small></article>
    </section>

    <section className={styles.editorSection}>
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Localidades</span><h2>Municipios registrados</h2></div><p>Editar aquí actualiza todas las referencias que reutilizan el municipio.</p></div>
      <div className={styles.editorStack}>{data.municipalities.map((item) => <article className={styles.editorItem} key={item.id}><form action={saveMunicipalityAction} className={styles.editorForm}><input type="hidden" name="municipality_id" value={item.id} /><MunicipalityFields item={item} /><SaveBar canEdit={canEdit} label="Guardar municipio" /></form></article>)}{canEdit ? <article className={styles.editorItem}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nuevo</span><h3>Añadir municipio</h3></div></div><form action={saveMunicipalityAction} className={styles.editorForm}><MunicipalityFields /><SaveBar canEdit label="Crear municipio" /></form></article> : null}</div>
    </section>
  </div>
}
