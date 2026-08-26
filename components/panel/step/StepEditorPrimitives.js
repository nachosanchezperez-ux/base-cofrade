import styles from '@/app/panel/panel.module.css'

export const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Archivado',
}

export function StatusSelect({ defaultValue = 'draft' }) {
  return (
    <select name="status" defaultValue={defaultValue}>
      <option value="draft">Borrador</option>
      <option value="review">En revisión</option>
      <option value="published">Publicado</option>
      <option value="archived">Archivado</option>
    </select>
  )
}

export function PeriodFields({ item = null }) {
  return (
    <>
      <label><span>Fecha inicial exacta</span><input name="date_from" type="date" defaultValue={item?.date_from || ''} /></label>
      <label><span>Datación inicial</span><input name="date_from_text" defaultValue={item?.date_from_text || ''} placeholder="Ej. 2024, desde 2024…" /></label>
      <label><span>Año inicial</span><input name="year_from" type="number" min="1800" max="2200" defaultValue={item?.year_from ?? ''} /></label>
      <label><span>Fecha final exacta</span><input name="date_to" type="date" defaultValue={item?.date_to || ''} /></label>
      <label><span>Datación final</span><input name="date_to_text" defaultValue={item?.date_to_text || ''} /></label>
      <label><span>Año final</span><input name="year_to" type="number" min="1800" max="2200" defaultValue={item?.year_to ?? ''} /></label>
    </>
  )
}

export function SaveBar({ label = 'Guardar cambios', canEdit = true, note = 'Los cambios publicados se reflejan en la ficha pública.' }) {
  return (
    <div className={styles.formActions}>
      <small>{canEdit ? note : 'Tu perfil tiene acceso de consulta.'}</small>
      {canEdit ? <button className={styles.primaryButton} type="submit">{label}</button> : null}
    </div>
  )
}
