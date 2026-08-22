import styles from '@/app/panel/panel.module.css'

export const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Archivado',
}

export const MARCH_SAVED_MESSAGES = {
  created: 'La Marcha se ha creado correctamente.',
  updated: 'La Marcha se ha actualizado.',
  author: 'La autoría se ha guardado.',
  'author-archived': 'La autoría se ha archivado.',
  dedication: 'La dedicatoria se ha guardado.',
  'dedication-archived': 'La dedicatoria se ha archivado.',
  recording: 'La grabación se ha guardado.',
  'recording-archived': 'La grabación se ha archivado.',
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

export function SaveBar({ label, canEdit, note = 'Los cambios publicados alimentan el patrimonio musical y las relaciones del grafo.' }) {
  return (
    <div className={styles.formActions}>
      <small>{canEdit ? note : 'Tu perfil tiene acceso de consulta.'}</small>
      {canEdit ? <button className={styles.primaryButton} type="submit">{label}</button> : null}
    </div>
  )
}
