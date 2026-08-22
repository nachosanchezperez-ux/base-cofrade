import styles from '@/app/panel/panel.module.css'

export const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Archivado',
}

export const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export function StatusSelect({ defaultValue = 'draft', disabled = false }) {
  return (
    <select name="status" defaultValue={defaultValue} disabled={disabled}>
      <option value="draft">Borrador</option>
      <option value="review">En revisión</option>
      <option value="published">Publicado</option>
      <option value="archived">Archivado</option>
    </select>
  )
}

export function MonthSelect({ defaultValue = '', name = 'month' }) {
  return (
    <select name={name} defaultValue={defaultValue || ''}>
      <option value="">Sin mes fijo</option>
      {MONTHS.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
    </select>
  )
}

export function PlaceSelect({ places, name, defaultValue = '', empty = 'Sin lugar vinculado' }) {
  return (
    <select name={name} defaultValue={defaultValue || ''}>
      <option value="">{empty}</option>
      {places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
    </select>
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
