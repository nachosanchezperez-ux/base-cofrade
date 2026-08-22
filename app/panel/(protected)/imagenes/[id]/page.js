import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getImageEditorData } from '@/lib/panel/images'
import { updateImageAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }

export const metadata = { title: 'Editar imagen · Panel' }

export default async function ImageEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getImageEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const { image, entity, coverage } = data

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/imagenes">Imágenes</Link><span>→</span><strong>{entity.name}</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Editar imagen</span>
            <h1>{entity.name}</h1>
            <p>{image.image_type || 'Tipo de imagen pendiente de documentar'}</p>
          </div>
          <div className={styles.editorHeaderActions}>
            <span className={`${styles.statusBadge} ${styles[entity.status]}`}>{STATUS_LABELS[entity.status]}</span>
            {entity.status === 'published' && entity.slug ? <Link className={styles.secondaryButton} href={`/imagenes/${entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
          </div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando la imagen como colaborador. Un editor debe realizar los cambios.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura de la ficha">
        <article className={styles.metricCard}><span>Multimedia</span><strong>{coverage.media}</strong><small>{coverage.cover ? 'Portada definida' : 'Sin portada'}</small></article>
        <article className={styles.metricCard}><span>Hermandades</span><strong>{coverage.brotherhoods}</strong><small>vínculos activos</small></article>
        <article className={styles.metricCard}><span>Pasos</span><strong>{coverage.steps}</strong><small>presencia procesional</small></article>
        <article className={styles.metricCard}><span>Fuentes</span><strong>{coverage.sources}</strong><small>Fuentes directas</small></article>
      </section>

      <section className={styles.editorSection} id="general">
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Fuente de verdad</span><h2>Ficha completa</h2></div>
          <p>Estos campos alimentan directamente la ficha pública de la Imagen.</p>
        </div>

        <form action={updateImageAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="image_id" value={entity.id} />

          <div className={styles.panelSubsection}>
            <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Identidad</span><h3>Datos editoriales</h3></div></div>
            <div className={styles.formGrid}>
              <label className={styles.fieldWide}><span>Nombre de la imagen</span><input name="name" defaultValue={entity.name} required /></label>
              <label><span>Tipo de imagen</span><input name="image_type" defaultValue={image.image_type || ''} placeholder="Cristo, Virgen, Santo…" /></label>
              <label><span>Tipología</span><input name="anatomical_type" defaultValue={image.anatomical_type || ''} placeholder="Talla completa, busto…" /></label>
              <label className={styles.fieldWide}>
                <span>Advocación</span>
                <select name="advocation_entity_id" defaultValue={image.advocation_entity_id || ''}>
                  <option value="">Sin Advocación vinculada</option>
                  {data.advocationOptions.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.type}</option>)}
                </select>
              </label>
              <label><span>Slug público</span><input name="slug" defaultValue={entity.slug || ''} required /></label>
              <label>
                <span>Estado editorial</span>
                <select name="status" defaultValue={entity.status}>
                  <option value="draft">Borrador</option>
                  <option value="review">En revisión</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </select>
              </label>
              <label className={styles.checkField}><input name="is_dress_image" type="checkbox" defaultChecked={image.is_dress_image || false} /><span>Imagen de vestir</span></label>
              <label className={styles.fieldWide}><span>Resumen SEO / directorio</span><textarea name="summary" defaultValue={entity.summary || ''} rows="3" /></label>
              <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" defaultValue={image.description || ''} rows="5" /></label>
            </div>
          </div>

          <div className={styles.panelSubsection}>
            <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Datación y técnica</span><h3>Características materiales</h3></div></div>
            <div className={styles.formGrid}>
              <label><span>Fecha exacta de ejecución</span><input name="execution_date" type="date" defaultValue={image.execution_date || ''} /></label>
              <label><span>Datación textual</span><input name="execution_date_text" defaultValue={image.execution_date_text || ''} placeholder="1928, hacia 1650, siglo XVIII…" /></label>
              <label><span>Material</span><input name="material" defaultValue={image.material || ''} /></label>
              <label><span>Técnica</span><input name="technique" defaultValue={image.technique || ''} /></label>
              <label><span>Policromía</span><input name="polychromy" defaultValue={image.polychromy || ''} /></label>
              <label><span>Dimensiones en texto</span><input name="dimensions_text" defaultValue={image.dimensions_text || ''} placeholder="Ej. 175 × 70 × 55 cm" /></label>
              <label><span>Altura (cm)</span><input name="height_cm" type="number" min="0" step="0.01" defaultValue={image.height_cm ?? ''} /></label>
              <label><span>Anchura (cm)</span><input name="width_cm" type="number" min="0" step="0.01" defaultValue={image.width_cm ?? ''} /></label>
              <label><span>Profundidad (cm)</span><input name="depth_cm" type="number" min="0" step="0.01" defaultValue={image.depth_cm ?? ''} /></label>
              <label className={styles.fieldWide}><span>Iconografía</span><textarea name="iconography" defaultValue={image.iconography || ''} rows="4" /></label>
            </div>
          </div>

          <div className={styles.panelSubsection}>
            <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Conservación</span><h3>Estado actual</h3></div></div>
            <div className={styles.formGrid}>
              <label><span>Estado de conservación</span><input name="current_condition" defaultValue={image.current_condition || ''} placeholder="Bueno, estable…" /></label>
              <label className={styles.fieldWide}><span>Notas públicas del estado actual</span><textarea name="current_state_notes" defaultValue={image.current_state_notes || ''} rows="3" /></label>
              <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" defaultValue={image.notes || ''} rows="3" /></label>
            </div>
          </div>

          <div className={styles.formActions}>
            <small>{canEdit ? 'Autorías, restauraciones, fotografías, Fuentes y relaciones se gestionan desde las herramientas conectadas de esta misma ficha.' : 'Tu perfil tiene acceso de consulta.'}</small>
            {canEdit ? <button className={styles.primaryButton} type="submit">Guardar ficha completa</button> : null}
          </div>
        </form>
      </section>

      {data.sources.length ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Documentación</span><h2>Fuentes directas</h2></div><Link className={styles.secondaryButton} href={`/panel/fuentes?entity=${entity.id}`}>Gestionar Fuentes</Link></div>
          <div className={styles.editorStack}>
            {data.sources.map((source) => <article className={styles.editorItem} key={source.id}><strong>{source.name}</strong><small>{source.source_type}{source.url ? ` · ${source.url}` : ''}</small></article>)}
          </div>
        </section>
      ) : null}
    </div>
  )
}
