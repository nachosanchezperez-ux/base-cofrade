import styles from '@/app/panel/panel.module.css'

export const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Archivado',
}

export const NAME_TYPES = [
  ['official', 'Oficial'],
  ['commercial', 'Comercial'],
  ['artistic', 'Artístico'],
  ['alias', 'Alias'],
  ['acronym', 'Siglas'],
  ['former', 'Anterior'],
]

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
      <label><span>Fecha inicial</span><input name="date_from" type="date" defaultValue={item?.date_from || ''} /></label>
      <label><span>Datación inicial</span><input name="date_from_text" defaultValue={item?.date_from_text || ''} placeholder="Ej. desde 1985" /></label>
      <label><span>Fecha final</span><input name="date_to" type="date" defaultValue={item?.date_to || ''} /></label>
      <label><span>Datación final</span><input name="date_to_text" defaultValue={item?.date_to_text || ''} /></label>
    </>
  )
}

export function SaveBar({ label = 'Guardar cambios', canEdit = true, note = 'Los cambios publicados quedan disponibles para las relaciones del grafo.' }) {
  return (
    <div className={styles.formActions}>
      <small>{canEdit ? note : 'Tu perfil tiene acceso de consulta.'}</small>
      {canEdit ? <button className={styles.primaryButton} type="submit">{label}</button> : null}
    </div>
  )
}
