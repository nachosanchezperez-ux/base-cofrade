import Link from 'next/link'
import { notFound } from 'next/navigation'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodHabitsEditorData } from '@/lib/panel/brotherhood-habits'
import {
  archiveBrotherhoodHabitAction,
  saveBrotherhoodHabitAction,
  uploadBrotherhoodHabitImageAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const SAVED_MESSAGES = {
  created: 'El hábito se ha creado correctamente.',
  updated: 'Los datos del hábito se han actualizado.',
  archived: 'El hábito se ha archivado sin borrar su histórico.',
  image: 'La imagen del hábito se ha actualizado correctamente.',
}

function StatusSelect({ defaultValue = 'draft' }) {
  return (
    <select name="status" defaultValue={defaultValue}>
      <option value="draft">Borrador</option>
      <option value="review">En revisión</option>
      <option value="published">Publicado</option>
      <option value="archived">Archivado</option>
    </select>
  )
}

function HabitFields({ item = null }) {
  return (
    <div className={styles.formGrid}>
      <label className={styles.fieldWide}><span>Nombre del hábito</span><input name="name" defaultValue={item?.name || ''} placeholder="Hábito nazareno" required /></label>
      <label className={styles.fieldWide}><span>Túnica</span><textarea name="tunic_description" defaultValue={item?.tunic_description || ''} rows="3" placeholder="Color, tejido, cola, recogido…" /></label>
      <label className={styles.fieldWide}><span>Antifaz / capirote</span><textarea name="hood_description" defaultValue={item?.hood_description || ''} rows="3" /></label>
      <label className={styles.fieldWide}><span>Cíngulo, cinturón o esparto</span><textarea name="cord_description" defaultValue={item?.cord_description || ''} rows="3" /></label>
      <label className={styles.fieldWide}><span>Botonadura</span><textarea name="buttons_description" defaultValue={item?.buttons_description || ''} rows="2" /></label>
      <label className={styles.fieldWide}><span>Escudo</span><textarea name="shield_description" defaultValue={item?.shield_description || ''} rows="3" /></label>
      <label className={styles.fieldWide}><span>Calzado y complementos</span><textarea name="footwear_description" defaultValue={item?.footwear_description || ''} rows="3" /></label>
      <label className={styles.fieldWide}><span>Ruta o URL de la ilustración</span><input name="image_path" defaultValue={item?.image_path || ''} placeholder="También puedes subirla desde este editor" /></label>
      <label className={styles.fieldWide}><span>Texto alternativo</span><input name="image_alt" defaultValue={item?.image_alt || ''} /></label>
      <label><span>Orden</span><input name="sort_order" type="number" min="0" defaultValue={item?.sort_order ?? 0} /></label>
      <label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
      <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" defaultValue={item?.notes || ''} rows="3" /></label>
    </div>
  )
}

export default async function BrotherhoodHabitPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodHabitsEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]
  const returnPath = `/panel/hermandades/${id}/habito`

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/hermandades">Hermandades</Link><span>→</span>
          <Link href={`/panel/hermandades/${id}`}>{data.brotherhood.popular_name || data.entity.name}</Link><span>→</span>
          <strong>Hábito</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Indumentaria</span><h1>Hábito y túnica</h1><p>{data.brotherhood.official_name}</p></div>
          <Link className={styles.secondaryButton} href={`/hermandades/${data.entity.slug}#tunica`} target="_blank" rel="noreferrer">Ver en el Front ↗</Link>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Registros publicados</span><h2>Hábitos de la Hermandad</h2></div>
          <p>{data.habits.length} registro{data.habits.length === 1 ? '' : 's'} activo{data.habits.length === 1 ? '' : 's'}.</p>
        </div>

        <div className={styles.editorStack}>
          {data.habits.map((item) => (
            <article className={styles.editorItem} key={item.id}>
              <div className={styles.itemHeading}>
                <div><span className={styles.eyebrow}>Indumentaria</span><h3>{item.name}</h3></div>
                <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
              </div>

              {item.image_path ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 180px) 1fr', gap: 18, alignItems: 'start', marginBottom: 18 }}>
                  <img src={item.image_path} alt={item.image_alt || item.name} style={{ width: '100%', maxHeight: 260, objectFit: 'contain', border: '1px solid #dfe7ef', borderRadius: 12, background: '#fff' }} />
                  <div><strong>Ilustración actual</strong><p className={styles.emptyText}>{item.image_alt || 'Texto alternativo pendiente'}</p></div>
                </div>
              ) : null}

              {canEdit ? (
                <form action={saveBrotherhoodHabitAction} className={styles.editorForm}>
                  <input type="hidden" name="brotherhood_id" value={id} />
                  <input type="hidden" name="habit_id" value={item.id} />
                  <HabitFields item={item} />
                  <div className={styles.formActions}><small>Los registros publicados aparecen en la sección Túnica de la ficha pública.</small><button className={styles.secondaryButton} type="submit">Guardar hábito</button></div>
                </form>
              ) : null}

              {canEdit ? (
                <div className={styles.panelSubsection}>
                  <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Archivo visual</span><h4>Subir ilustración</h4></div><p>La subida actualiza directamente la imagen que consume el Front.</p></div>
                  <form action={uploadBrotherhoodHabitImageAction} className={styles.editorForm}>
                    <input type="hidden" name="brotherhood_id" value={id} />
                    <input type="hidden" name="habit_id" value={item.id} />
                    <div className={styles.formGrid}>
                      <label className={styles.fieldWide}><span>Archivo</span><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" required /></label>
                      <label className={styles.fieldWide}><span>Texto alternativo</span><input name="image_alt" defaultValue={item.image_alt || `Hábito de ${data.brotherhood.popular_name || data.entity.name}`} required /></label>
                    </div>
                    <div className={styles.formActions}><small>JPG, PNG, WEBP, GIF o AVIF · máximo 10 MB.</small><button className={styles.secondaryButton} type="submit">Subir ilustración</button></div>
                  </form>
                </div>
              ) : null}

              <RelationSourcesEditor relationKind="brotherhood_habit" relationId={item.id} contextEntityId={id} sourceOptions={data.sourceOptions} links={item.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />

              {canEdit ? (
                <form action={archiveBrotherhoodHabitAction} className={styles.archiveForm}>
                  <input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="habit_id" value={item.id} />
                  <button type="submit">Archivar hábito</button>
                </form>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nuevo registro</span><h2>Añadir hábito</h2></div><p>Crea primero el registro; después podrás subir su ilustración y vincular Fuentes.</p></div>
          <form action={saveBrotherhoodHabitAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <input type="hidden" name="brotherhood_id" value={id} />
            <HabitFields />
            <div className={styles.formActions}><small>Puede quedar como borrador hasta completar la documentación.</small><button className={styles.primaryButton} type="submit">Crear hábito</button></div>
          </form>
        </section>
      ) : null}
    </div>
  )
}
