import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelMasterData } from '@/lib/panel/master-data'
import { completeReferenceNodeAction, saveAdvocationAction, saveImageAdvocationAction, saveMunicipalityAction, savePlaceAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }

function SaveBar({ canEdit, label }) {
  return <div className={styles.formActions}><small>{canEdit ? 'Los cambios se reutilizan en todas las fichas relacionadas.' : 'Tu perfil tiene acceso de consulta.'}</small>{canEdit ? <button className={styles.secondaryButton} type="submit">{label}</button> : null}</div>
}

function MunicipalityFields({ item = null }) {
  return <div className={styles.formGrid}>
    <label><span>Municipio</span><input name="name" defaultValue={item?.name || ''} required /></label>
    <label><span>Slug</span><input name="slug" defaultValue={item?.slug || ''} required /></label>
    <label><span>Provincia</span><input name="province" defaultValue={item?.province || 'Sevilla'} required /></label>
    <label><span>Comunidad autónoma</span><input name="autonomous_community" defaultValue={item?.autonomous_community || 'Andalucía'} required /></label>
    <label><span>País</span><input name="country" defaultValue={item?.country || 'España'} required /></label>
  </div>
}

function PlaceFields({ item = null, municipalities }) {
  return <div className={styles.formGrid}>
    <label className={styles.fieldWide}><span>Nombre del lugar</span><input name="name" defaultValue={item?.name || ''} required /></label>
    <label><span>Slug</span><input name="slug" defaultValue={item?.slug || ''} required /></label>
    <label><span>Tipo</span><input name="place_type" defaultValue={item?.place_type || ''} placeholder="Parroquia, iglesia, plaza…" /></label>
    <label><span>Municipio</span><select name="municipality_id" defaultValue={item?.municipality_id || ''}><option value="">Sin municipio</option>{municipalities.map((municipality) => <option key={municipality.id} value={municipality.id}>{municipality.name}</option>)}</select></label>
    <label className={styles.fieldWide}><span>Dirección</span><input name="address" defaultValue={item?.address || ''} /></label>
    <label><span>Latitud</span><input name="latitude" type="number" step="any" defaultValue={item?.latitude ?? ''} /></label>
    <label><span>Longitud</span><input name="longitude" type="number" step="any" defaultValue={item?.longitude ?? ''} /></label>
    <label className={styles.fieldWide}><span>Horario público</span><input name="opening_hours_text" defaultValue={item?.opening_hours_text || ''} /></label>
    <label><span>Horario verificado</span><input name="opening_hours_verified_at" type="date" defaultValue={item?.opening_hours_verified_at || ''} /></label>
    <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item?.notes || ''} rows="2" /></label>
  </div>
}

export const metadata = { title: 'Datos · Panel' }

export default async function PanelMasterDataPage({ searchParams }) {
  const [query, user, data] = await Promise.all([searchParams, requirePanelUser(), getPanelMasterData()])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return <div className={styles.pageWrap}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Datos maestros</span><h1>Datos</h1><p>Advocaciones, municipios, lugares y nodos estructurales reutilizados por el grafo de Hilo Cofrade.</p></div></header>
    {query?.saved ? <div className={styles.savedNotice} role="status">Datos guardados correctamente.</div> : null}
    {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil puede consultar estos datos, pero no modificarlos.</div> : null}

    <section className={styles.metricGrid} aria-label="Resumen de datos maestros">
      <article className={styles.metricCard}><span>Advocaciones</span><strong>{data.advocations.length}</strong><small>entidades del grafo</small></article>
      <article className={styles.metricCard}><span>Municipios</span><strong>{data.municipalities.length}</strong><small>localidades reutilizables</small></article>
      <article className={styles.metricCard}><span>Lugares</span><strong>{data.places.length}</strong><small>sedes y enclaves</small></article>
      <article className={styles.metricCard}><span>Referencias</span><strong>{data.referenceNodes.length}</strong><small>pendientes de completar</small></article>
    </section>

    <nav className={styles.sectionTabs} aria-label="Secciones de datos"><a href="#referencias">Referencias</a><a href="#advocaciones">Advocaciones</a><a href="#municipios">Municipios</a><a href="#lugares">Lugares</a></nav>

    <section className={styles.editorSection} id="referencias">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Integridad del grafo</span><h2>Nodos de referencia</h2></div><p>Entidades creadas por relaciones o importaciones que todavía no tienen su ficha especializada.</p></div>
      {data.referenceNodes.length ? <div className={styles.editorStack}>{data.referenceNodes.map((item) => <article className={styles.editorItem} key={item.id}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>{item.typeLabel}</span><h3>{item.name}</h3><small>{item.slug || 'Sin slug'} · {STATUS_LABELS[item.status] || item.status}</small></div>{canEdit ? <form action={completeReferenceNodeAction}><input type="hidden" name="entity_id" value={item.id} /><button className={styles.primaryButton} type="submit">Completar ficha</button></form> : null}</div></article>)}</div> : <div className={styles.savedNotice}>No hay nodos incompletos: todas las entidades estructurales tienen ficha especializada.</div>}
    </section>

    <section className={styles.editorSection} id="advocaciones">
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Devociones</span><h2>Advocaciones</h2></div><p>La Imagen puede vincularse a una Advocación sin duplicar la identidad devocional.</p></div>
      <div className={styles.editorStack}>
        {data.advocations.map((item) => <article className={styles.editorItem} key={item.id}>
          <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{item.advocation_type || 'Advocación'}</span><h3>{item.name}</h3><small>{item.imageCount} imágenes · {item.mediaCount} multimedia · {item.sourceCount} fuentes</small></div><span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span></div>
          <form action={saveAdvocationAction} className={styles.editorForm}><input type="hidden" name="advocation_id" value={item.id} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Nombre</span><input name="name" defaultValue={item.name} required /></label><label><span>Tipo de advocación</span><input name="advocation_type" defaultValue={item.advocation_type || ''} placeholder="Mariana, cristológica…" /></label><label><span>Slug</span><input name="slug" defaultValue={item.slug || ''} required /></label><label><span>Estado editorial</span><select name="status" defaultValue={item.status}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label><label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" defaultValue={item.summary || ''} rows="2" /></label><label className={styles.fieldWide}><span>Descripción</span><textarea name="description" defaultValue={item.description || ''} rows="3" /></label></div><SaveBar canEdit={canEdit} label="Guardar Advocación" /></form>
          {item.images.length ? <div className={styles.panelSubsection}><div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Imágenes vinculadas</span><h3>{item.images.length}</h3></div></div><div className={styles.editorStack}>{item.images.map((image) => <div className={styles.editorItem} key={image.id} style={{ padding: 12 }}><div className={styles.itemHeading}><div><strong>{image.name}</strong><small>{image.status === 'published' ? 'Publicada' : 'No publicada'}</small></div>{canEdit ? <form action={saveImageAdvocationAction}><input type="hidden" name="image_id" value={image.id} /><input type="hidden" name="advocation_id" value="" /><button className={styles.signOut} type="submit">Desvincular</button></form> : null}</div></div>)}</div></div> : null}
          {canEdit ? <form action={saveImageAdvocationAction} className={styles.editorForm} style={{ marginTop: 12 }}><input type="hidden" name="advocation_id" value={item.id} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Asignar Imagen a esta Advocación</span><select name="image_id" defaultValue="" required><option value="">Selecciona una Imagen</option>{data.imageOptions.map((image) => <option key={image.id} value={image.id}>{image.name}{image.advocation_entity_id && image.advocation_entity_id !== item.id ? ' · actualmente en otra Advocación' : ''}</option>)}</select></label></div><div className={styles.formActions}><small>Si la Imagen estaba vinculada a otra Advocación, se moverá a esta.</small><button className={styles.secondaryButton} type="submit">Asignar Imagen</button></div></form> : null}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}><Link className={styles.secondaryButton} href={`/panel/multimedia?entity=${item.id}`}>Multimedia</Link><Link className={styles.secondaryButton} href={`/panel/fuentes?entity=${item.id}`}>Fuentes</Link></div>
        </article>)}
        {canEdit ? <article className={styles.editorItem}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva entidad</span><h3>Crear Advocación</h3></div></div><form action={saveAdvocationAction} className={styles.editorForm}><div className={styles.formGrid}><label className={styles.fieldWide}><span>Nombre</span><input name="name" required /></label><label><span>Tipo</span><input name="advocation_type" /></label><label><span>Slug</span><input name="slug" required /></label><label><span>Estado</span><select name="status" defaultValue="draft"><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option></select></label><label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" rows="2" /></label><label className={styles.fieldWide}><span>Descripción</span><textarea name="description" rows="3" /></label></div><SaveBar canEdit label="Crear Advocación" /></form></article> : null}
      </div>
    </section>

    <section className={styles.editorSection} id="municipios"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Geografía</span><h2>Municipios</h2></div><p>Fuente única para Hermandades, Bandas, Lugares y salidas.</p></div><div className={styles.editorStack}>{data.municipalities.map((item) => <article className={styles.editorItem} key={item.id}><form action={saveMunicipalityAction} className={styles.editorForm}><input type="hidden" name="municipality_id" value={item.id} /><MunicipalityFields item={item} /><SaveBar canEdit={canEdit} label="Guardar municipio" /></form></article>)}{canEdit ? <article className={styles.editorItem}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nuevo</span><h3>Añadir municipio</h3></div></div><form action={saveMunicipalityAction} className={styles.editorForm}><MunicipalityFields /><SaveBar canEdit label="Crear municipio" /></form></article> : null}</div></section>

    <section className={styles.editorSection} id="lugares"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Sedes y enclaves</span><h2>Lugares</h2></div><p>Parroquias, iglesias, plazas, templos y espacios con localización reutilizable.</p></div><div className={styles.editorStack}>{data.places.map((item) => <article className={styles.editorItem} key={item.id}><form action={savePlaceAction} className={styles.editorForm}><input type="hidden" name="place_id" value={item.id} /><PlaceFields item={item} municipalities={data.municipalities} /><SaveBar canEdit={canEdit} label="Guardar lugar" /></form></article>)}{canEdit ? <article className={styles.editorItem}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nuevo</span><h3>Añadir lugar</h3></div></div><form action={savePlaceAction} className={styles.editorForm}><PlaceFields municipalities={data.municipalities} /><SaveBar canEdit label="Crear lugar" /></form></article> : null}</div></section>
  </div>
}
