import styles from '@/app/panel/panel.module.css'

export const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }

export function SaveBar({ canEdit, label }) {
  return <div className={styles.formActions}><small>{canEdit ? 'Los cambios se reutilizan en todas las fichas relacionadas.' : 'Tu perfil tiene acceso de consulta.'}</small>{canEdit ? <button className={styles.secondaryButton} type="submit">{label}</button> : null}</div>
}

export function MunicipalityFields({ item = null }) {
  return <div className={styles.formGrid}>
    <label><span>Municipio</span><input name="name" defaultValue={item?.name || ''} required /></label>
    <label><span>Slug</span><input name="slug" defaultValue={item?.slug || ''} required /></label>
    <label><span>Provincia</span><input name="province" defaultValue={item?.province || 'Sevilla'} required /></label>
    <label><span>Comunidad autónoma</span><input name="autonomous_community" defaultValue={item?.autonomous_community || 'Andalucía'} required /></label>
    <label><span>País</span><input name="country" defaultValue={item?.country || 'España'} required /></label>
  </div>
}

export function PlaceFields({ item = null, municipalities }) {
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
