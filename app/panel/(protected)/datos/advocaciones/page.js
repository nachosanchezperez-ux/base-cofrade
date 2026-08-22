import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelMasterData } from '@/lib/panel/master-data'
import { saveAdvocationAction, saveImageAdvocationAction } from '../actions'
import { SaveBar, STATUS_LABELS } from '@/components/panel/data/DataEditorPrimitives'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Advocaciones · Datos · Panel' }

export default async function AdvocationsPage({ searchParams }) {
  const [query, user, data] = await Promise.all([searchParams, requirePanelUser(), getPanelMasterData()])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const focus = String(query?.focus || '')

  return <div className={styles.pageWrap}>
    <header className={styles.pageHeader}><div><span className={styles.eyebrow}>Identidad devocional</span><h1>Advocaciones</h1><p>Una Advocación puede agrupar Imágenes físicas sin duplicar su identidad devocional.</p></div></header>
    {query?.saved ? <div className={styles.savedNotice} role="status">Advocación guardada correctamente.</div> : null}
    {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil puede consultar estos datos, pero no modificarlos.</div> : null}

    <section className={styles.metricGrid} aria-label="Resumen de advocaciones">
      <article className={styles.metricCard}><span>Total</span><strong>{data.advocations.length}</strong><small>advocaciones registradas</small></article>
      <article className={styles.metricCard}><span>Publicadas</span><strong>{data.advocations.filter((item) => item.status === 'published').length}</strong><small>disponibles en el grafo</small></article>
      <article className={styles.metricCard}><span>Con Imágenes</span><strong>{data.advocations.filter((item) => item.imageCount > 0).length}</strong><small>vínculo físico documentado</small></article>
      <article className={styles.metricCard}><span>Sin Fuentes</span><strong>{data.advocations.filter((item) => item.status === 'published' && item.sourceCount === 0).length}</strong><small>publicadas por documentar</small></article>
    </section>

    <section className={styles.editorSection}>
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Devociones</span><h2>Fichas de Advocación</h2></div><p>Los recursos y Fuentes se gestionan de forma transversal.</p></div>
      <div className={styles.editorStack}>
        {data.advocations.map((item) => <article className={styles.editorItem} key={item.id} style={focus === item.id ? { outline: '2px solid #123a67', outlineOffset: 3 } : undefined}>
          <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{item.advocation_type || 'Advocación'}</span><h3>{item.name}</h3><small>{item.imageCount} imágenes · {item.mediaCount} multimedia · {item.sourceCount} fuentes</small></div><span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span></div>
          <form action={saveAdvocationAction} className={styles.editorForm}><input type="hidden" name="advocation_id" value={item.id} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Nombre</span><input name="name" defaultValue={item.name} required /></label><label><span>Tipo de advocación</span><input name="advocation_type" defaultValue={item.advocation_type || ''} placeholder="Mariana, cristológica…" /></label><label><span>Slug</span><input name="slug" defaultValue={item.slug || ''} required /></label><label><span>Estado editorial</span><select name="status" defaultValue={item.status}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label><label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" defaultValue={item.summary || ''} rows="2" /></label><label className={styles.fieldWide}><span>Descripción</span><textarea name="description" defaultValue={item.description || ''} rows="3" /></label></div><SaveBar canEdit={canEdit} label="Guardar Advocación" /></form>
          {item.images.length ? <div className={styles.panelSubsection}><div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Imágenes vinculadas</span><h3>{item.images.length}</h3></div></div><div className={styles.editorStack}>{item.images.map((image) => <div className={styles.editorItem} key={image.id} style={{ padding: 12 }}><div className={styles.itemHeading}><div><strong>{image.name}</strong><small>{image.status === 'published' ? 'Publicada' : 'No publicada'}</small></div>{canEdit ? <form action={saveImageAdvocationAction}><input type="hidden" name="image_id" value={image.id} /><input type="hidden" name="advocation_id" value="" /><button className={styles.signOut} type="submit">Desvincular</button></form> : null}</div></div>)}</div></div> : null}
          {canEdit ? <form action={saveImageAdvocationAction} className={styles.editorForm} style={{ marginTop: 12 }}><input type="hidden" name="advocation_id" value={item.id} /><div className={styles.formGrid}><label className={styles.fieldWide}><span>Asignar Imagen</span><select name="image_id" defaultValue="" required><option value="">Selecciona una Imagen</option>{data.imageOptions.map((image) => <option key={image.id} value={image.id}>{image.name}{image.advocation_entity_id && image.advocation_entity_id !== item.id ? ' · actualmente en otra Advocación' : ''}</option>)}</select></label></div><div className={styles.formActions}><small>Si la Imagen estaba vinculada a otra Advocación, se moverá a esta.</small><button className={styles.secondaryButton} type="submit">Asignar Imagen</button></div></form> : null}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}><Link className={styles.secondaryButton} href={`/panel/multimedia?entity=${item.id}`}>Multimedia</Link><Link className={styles.secondaryButton} href={`/panel/fuentes?entity=${item.id}`}>Fuentes</Link></div>
        </article>)}
        {canEdit ? <article className={styles.editorItem}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva entidad</span><h3>Crear Advocación</h3></div></div><form action={saveAdvocationAction} className={styles.editorForm}><div className={styles.formGrid}><label className={styles.fieldWide}><span>Nombre</span><input name="name" required /></label><label><span>Tipo</span><input name="advocation_type" /></label><label><span>Slug</span><input name="slug" required /></label><label><span>Estado</span><select name="status" defaultValue="draft"><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option></select></label><label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" rows="2" /></label><label className={styles.fieldWide}><span>Descripción</span><textarea name="description" rows="3" /></label></div><SaveBar canEdit label="Crear Advocación" /></form></article> : null}
      </div>
    </section>
  </div>
}
