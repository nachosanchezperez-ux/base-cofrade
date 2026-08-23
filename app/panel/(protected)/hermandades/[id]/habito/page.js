import Link from 'next/link'
import { notFound } from 'next/navigation'
import PanelFormGroup from '@/components/panel/PanelFormGroup'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodHabitsEditorData } from '@/lib/panel/brotherhood-habits'
import {
  archiveBrotherhoodHabitAction,
  saveBrotherhoodHabitAction,
  uploadBrotherhoodHabitImageAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'
import habitStyles from './habit.module.css'

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
    <>
      <PanelFormGroup
        eyebrow="Identidad"
        title="Nombre y publicación"
        description="Controla cómo se identifica y ordena este hábito dentro de la ficha."
      >
        <label className={styles.fieldWide}><span>Nombre del hábito</span><input name="name" defaultValue={item?.name || ''} placeholder="Hábito nazareno" required /></label>
        <label><span>Orden</span><input name="sort_order" type="number" min="0" defaultValue={item?.sort_order ?? 0} /></label>
        <label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
      </PanelFormGroup>

      <PanelFormGroup
        eyebrow="Indumentaria"
        title="Descripción del hábito"
        description="Separa cada pieza para que la información sea precisa, comparable y fácil de mantener."
      >
        <label><span>Túnica</span><textarea name="tunic_description" defaultValue={item?.tunic_description || ''} rows="3" placeholder="Color, tejido, cola, recogido…" /></label>
        <label><span>Antifaz / capirote</span><textarea name="hood_description" defaultValue={item?.hood_description || ''} rows="3" /></label>
        <label><span>Cíngulo, cinturón o esparto</span><textarea name="cord_description" defaultValue={item?.cord_description || ''} rows="3" /></label>
        <label><span>Botonadura</span><textarea name="buttons_description" defaultValue={item?.buttons_description || ''} rows="3" /></label>
        <label><span>Escudo</span><textarea name="shield_description" defaultValue={item?.shield_description || ''} rows="3" /></label>
        <label><span>Calzado y complementos</span><textarea name="footwear_description" defaultValue={item?.footwear_description || ''} rows="3" /></label>
      </PanelFormGroup>

      <PanelFormGroup
        eyebrow="Archivo visual"
        title="Ilustración y notas"
        description="La subida visual se gestiona en la columna izquierda; estos campos conservan la referencia y su descripción."
      >
        <label className={styles.fieldWide}><span>Ruta o URL de la ilustración</span><input name="image_path" defaultValue={item?.image_path || ''} placeholder="También puedes subirla desde el bloque visual" /></label>
        <label className={styles.fieldWide}><span>Texto alternativo</span><input name="image_alt" defaultValue={item?.image_alt || ''} /></label>
        <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" defaultValue={item?.notes || ''} rows="3" /></label>
      </PanelFormGroup>
    </>
  )
}

export default async function BrotherhoodHabitPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodHabitsEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]
  const returnPath = `/panel/hermandades/${id}/habito`
  const brotherhoodName = data.brotherhood.popular_name || data.entity.name

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/hermandades">Hermandades</Link><span>→</span>
          <Link href={`/panel/hermandades/${id}`}>{brotherhoodName}</Link><span>→</span>
          <strong>Hábito</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Indumentaria</span><h1>Hábito y túnica</h1><p>{data.brotherhood.official_name}</p></div>
          <Link className={styles.secondaryButton} href={`/hermandades/${data.entity.slug}#tunica`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection} id="habitos">
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Indumentaria documentada</span><h2>Hábitos de la Hermandad</h2></div>
          <p>{data.habits.length} registro{data.habits.length === 1 ? '' : 's'} activo{data.habits.length === 1 ? '' : 's'}.</p>
        </div>

        {data.habits.length ? (
          <div className={styles.editorStack}>
            {data.habits.map((item) => (
              <article className={`${styles.editorItem} ${habitStyles.habitCard}`} id={`habit-${item.id}`} key={item.id}>
                <div className={styles.itemHeading}>
                  <div><span className={styles.eyebrow}>Hábito</span><h3>{item.name}</h3></div>
                  <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
                </div>

                <div className={habitStyles.workspace}>
                  <aside className={habitStyles.visualColumn}>
                    <div className={habitStyles.previewPanel}>
                      <div className={habitStyles.previewFrame}>
                        {item.image_path ? (
                          <img src={item.image_path} alt={item.image_alt || item.name} />
                        ) : (
                          <div className={habitStyles.emptyVisual}>
                            <strong>Sin ilustración</strong>
                            <span>Sube el hábito para comprobar aquí mismo cómo quedará documentado.</span>
                          </div>
                        )}
                      </div>
                      <div className={habitStyles.previewMeta}>
                        <strong>{item.image_path ? 'Ilustración actual' : 'Archivo visual pendiente'}</strong>
                        <span>{item.image_alt || 'Añade un texto alternativo descriptivo.'}</span>
                      </div>
                    </div>

                    {canEdit ? (
                      <div className={habitStyles.uploadPanel}>
                        <div>
                          <h4>{item.image_path ? 'Reemplazar ilustración' : 'Subir ilustración'}</h4>
                          <p>Actualiza la imagen de la ficha pública sin salir de este editor.</p>
                        </div>
                        <form action={uploadBrotherhoodHabitImageAction}>
                          <input type="hidden" name="brotherhood_id" value={id} />
                          <input type="hidden" name="habit_id" value={item.id} />
                          <label><span>Archivo</span><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" required /></label>
                          <label><span>Texto alternativo</span><input name="image_alt" defaultValue={item.image_alt || `Hábito de ${brotherhoodName}`} required /></label>
                          <div className={habitStyles.uploadActions}>
                            <small>JPG, PNG, WEBP, GIF o AVIF · máximo 10 MB.</small>
                            <button className={styles.secondaryButton} type="submit">{item.image_path ? 'Reemplazar imagen' : 'Subir ilustración'}</button>
                          </div>
                        </form>
                      </div>
                    ) : null}
                  </aside>

                  <div className={habitStyles.dataColumn}>
                    <div className={habitStyles.formIntro}>
                      <strong>Descripción del hábito</strong>
                      <span>Los campos se muestran agrupados para editar más rápido.</span>
                    </div>
                    {canEdit ? (
                      <form action={saveBrotherhoodHabitAction} className={styles.editorForm}>
                        <input type="hidden" name="brotherhood_id" value={id} />
                        <input type="hidden" name="habit_id" value={item.id} />
                        <HabitFields item={item} />
                        <div className={styles.formActions}><small>Al publicar, estos datos aparecen en la sección Túnica de la ficha pública.</small><button className={styles.primaryButton} type="submit">Guardar hábito</button></div>
                      </form>
                    ) : (
                      <div className={habitStyles.emptyState}><strong>Modo consulta</strong><span>Un editor puede modificar la descripción y el archivo visual.</span></div>
                    )}
                  </div>
                </div>

                <div className={habitStyles.sources}>
                  <RelationSourcesEditor relationKind="brotherhood_habit" relationId={item.id} contextEntityId={id} sourceOptions={data.sourceOptions} links={item.sourceLinks || []} returnPath={`${returnPath}#habit-${item.id}`} canEdit={canEdit} />
                </div>

                {canEdit ? (
                  <form action={archiveBrotherhoodHabitAction} className={styles.archiveForm}>
                    <input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="habit_id" value={item.id} />
                    <button type="submit">Archivar hábito</button>
                  </form>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className={habitStyles.emptyState}><strong>Todavía no hay un hábito documentado</strong><span>Crea el primer registro desde el bloque inferior y después añade su ilustración.</span></div>
        )}
      </section>

      {canEdit ? (
        <section className={styles.editorSection} id="nuevo-habito">
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
