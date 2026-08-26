import styles from '@/app/panel/panel.module.css'

export const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Archivado',
}

export const SOCIAL_PLATFORMS = [
  ['website', 'Web oficial'],
  ['facebook', 'Facebook'],
  ['instagram', 'Instagram'],
  ['x', 'X / Twitter'],
  ['youtube', 'YouTube'],
  ['spotify', 'Spotify'],
  ['tiktok', 'TikTok'],
  ['whatsapp', 'Canal de WhatsApp'],
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

export function MunicipalitySelect({ municipalities, defaultValue = '' }) {
  return (
    <select name="municipality_id" defaultValue={defaultValue || ''}>
      <option value="">Sin localidad</option>
      {municipalities.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.province}</option>)}
    </select>
  )
}

export function BrotherhoodSelect({ brotherhoods, defaultValue = '', name = 'brotherhood_entity_id', required = true }) {
  return (
    <select name={name} defaultValue={defaultValue || ''} required={required}>
      <option value="">{required ? 'Selecciona una hermandad' : 'Sin ficha vinculada'}</option>
      {brotherhoods.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
    </select>
  )
}

export function SaveBar({ label, canEdit, note = 'Los datos publicados se reflejan en la ficha pública.' }) {
  return (
    <div className={styles.formActions}>
      <small>{canEdit ? note : 'Tu perfil tiene acceso de consulta.'}</small>
      {canEdit ? <button className={styles.primaryButton} type="submit">{label}</button> : null}
    </div>
  )
}

export function SourceFields({ source }) {
  return (
    <>
      <input type="hidden" name="source_id" value={source?.id || ''} />
      <label className={styles.fieldWide}><span>Fuente</span><input name="source_name" defaultValue={source?.name || ''} placeholder="Nombre de la página o publicación" required /></label>
      <label className={styles.fieldWide}><span>Enlace de la fuente</span><input name="source_url" type="url" defaultValue={source?.url || ''} placeholder="https://…" required /></label>
      <label><span>Editor o responsable</span><input name="source_publisher" defaultValue={source?.author_or_publisher || ''} /></label>
      <label><span>Fecha de publicación</span><input name="source_publication_date" type="date" defaultValue={source?.publication_date || ''} /></label>
    </>
  )
}
