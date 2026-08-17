import {
  archiveBandReleaseAction,
  deleteBandReleaseTrackAction,
  linkBandReleaseSourceAction,
  saveBandReleaseAction,
  saveBandReleaseTrackAction,
  unlinkBandReleaseSourceAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const TYPES = [['album', 'Álbum'], ['ep', 'EP'], ['single', 'Single'], ['live', 'En directo'], ['compilation', 'Recopilatorio'], ['other', 'Otro']]

function StatusSelect({ value = 'draft' }) {
  return <select name="status" defaultValue={value}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option><option value="archived">Archivado</option></select>
}

function SaveBar({ label, canEdit }) {
  return <div className={styles.formActions}><small>{canEdit ? 'Los datos publicados se reflejan en la ficha pública.' : 'Acceso de consulta.'}</small>{canEdit ? <button className={styles.primaryButton} type="submit">{label}</button> : null}</div>
}

function TrackForm({ item, bandId, releaseId, marches, canEdit, next }) {
  const isNew = !item?.id
  return <article className={styles.editorItem}>
    <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{isNew ? 'Nueva pista' : `Pista ${item.sequence_no}`}</span><h3>{isNew ? 'Añadir pista' : item.title}</h3></div></div>
    <form action={saveBandReleaseTrackAction} className={styles.editorForm}>
      <input type="hidden" name="band_id" value={bandId} /><input type="hidden" name="release_id" value={releaseId} /><input type="hidden" name="track_id" value={item?.id || ''} />
      <div className={styles.formGrid}>
        <label><span>Orden</span><input name="sequence_no" type="number" min="1" defaultValue={item?.sequence_no || next || 1} required /></label>
        <label className={styles.fieldWide}><span>Título</span><input name="title" defaultValue={item?.title || ''} required /></label>
        <label className={styles.fieldWide}><span>Marcha relacionada</span><select name="march_entity_id" defaultValue={item?.march_entity_id || ''}><option value="">Todavía sin entidad Marcha</option>{marches.map((march) => <option key={march.id} value={march.id}>{march.name} · {STATUS_LABELS[march.status]}</option>)}</select></label>
        <label><span>Duración</span><input name="duration_text" defaultValue={item?.duration_text || ''} placeholder="4:12" /></label>
        <label className={styles.fieldWide}><span>Spotify de esta pista</span><input name="spotify_url" type="url" defaultValue={item?.spotify_url || ''} placeholder="https://open.spotify.com/track/…" /></label>
        <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" defaultValue={item?.notes || ''} rows="2" /></label>
      </div>
      <SaveBar label={isNew ? 'Añadir pista' : 'Guardar pista'} canEdit={canEdit} />
    </form>
    {!isNew && canEdit ? <form action={deleteBandReleaseTrackAction} className={styles.archiveForm}><input type="hidden" name="band_id" value={bandId} /><input type="hidden" name="release_id" value={releaseId} /><input type="hidden" name="track_id" value={item.id} /><button type="submit">Retirar esta pista del lanzamiento</button></form> : null}
  </article>
}

function SourceBlock({ release, bandId, sources, canEdit }) {
  return <div className={styles.contributionBlock}>
    <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Documentación</span><h4>Fuentes del lanzamiento</h4></div><p>Spotify es escucha; la documentación vive en Fuentes.</p></div>
    <div className={styles.editorStack}>
      {release.sources.map((link) => <article className={styles.editorItem} key={link.source_id}>
        <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{link.source.author_or_publisher || 'Fuente'}</span><h3>{link.source.name}</h3></div>{link.source.url ? <a className={styles.smallButton} href={link.source.url} target="_blank" rel="noreferrer">Abrir ↗</a> : null}</div>
        {link.scope ? <p>{link.scope}</p> : null}
        {canEdit ? <form action={unlinkBandReleaseSourceAction} className={styles.archiveForm}><input type="hidden" name="band_id" value={bandId} /><input type="hidden" name="release_id" value={release.id} /><input type="hidden" name="source_id" value={link.source_id} /><button type="submit">Desvincular fuente</button></form> : null}
      </article>)}
      {canEdit ? <form action={linkBandReleaseSourceAction} className={`${styles.editorItem} ${styles.editorForm}`}>
        <input type="hidden" name="band_id" value={bandId} /><input type="hidden" name="release_id" value={release.id} />
        <div className={styles.formGrid}><label className={styles.fieldWide}><span>Vincular Fuente existente</span><select name="source_id" defaultValue="" required><option value="">Selecciona una Fuente</option>{sources.map((source) => <option key={source.id} value={source.id}>{source.name}{source.author_or_publisher ? ` · ${source.author_or_publisher}` : ''}</option>)}</select></label><label className={styles.fieldWide}><span>Qué documenta</span><input name="scope" placeholder="Fecha, repertorio, streaming…" /></label></div>
        <SaveBar label="Vincular fuente" canEdit />
      </form> : null}
    </div>
  </div>
}

export default function DiscographyReleaseEditor({ item, data, canEdit }) {
  const isNew = !item?.id
  const id = item?.id || ''
  return <article className={styles.editorItem} id={isNew ? 'nuevo-lanzamiento' : `release-${id}`}>
    <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{isNew ? 'Nuevo lanzamiento' : item.release_year || 'Sin año'}</span><h3>{isNew ? 'Añadir lanzamiento discográfico' : item.title}</h3></div>{!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}</div>
    <form action={saveBandReleaseAction} className={styles.editorForm}>
      <input type="hidden" name="band_id" value={data.entity.id} /><input type="hidden" name="release_id" value={id} />
      <div className={styles.formGrid}>
        <label className={styles.fieldWide}><span>Título</span><input name="title" defaultValue={item?.title || ''} required /></label>
        <label><span>Tipo</span><select name="release_type" defaultValue={item?.release_type || 'album'}>{TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label><span>Año</span><input name="release_year" type="number" min="1800" max="2200" defaultValue={item?.release_year || ''} /></label>
        <label><span>Fecha exacta</span><input name="release_date" type="date" defaultValue={item?.release_date || ''} /></label>
        <label><span>N.º en la discografía</span><input name="ordinal_number" type="number" min="1" defaultValue={item?.ordinal_number || ''} /></label>
        <label className={styles.fieldWide}><span>Datación / matiz editorial</span><input name="release_date_text" defaultValue={item?.release_date_text || ''} /></label>
        <label className={styles.fieldWide}><span>Descripción</span><textarea name="description" defaultValue={item?.description || ''} rows="4" /></label>
        <label className={styles.fieldWide}><span>Spotify del lanzamiento</span><input name="spotify_url" type="url" defaultValue={item?.spotify_url || ''} placeholder="https://open.spotify.com/album/…" /></label>
        <label className={styles.fieldWide}><span>Más información</span><input name="external_url" type="url" defaultValue={item?.external_url || ''} /></label>
        <label className={styles.fieldWide}><span>Ruta de portada</span><input name="cover_image_path" defaultValue={item?.cover_image_path || ''} /></label>
        <label className={styles.fieldWide}><span>Descripción accesible de portada</span><input name="cover_image_alt" defaultValue={item?.cover_image_alt || ''} /></label>
        <label className={styles.fieldWide}><span>Crédito de portada</span><input name="cover_image_credit" defaultValue={item?.cover_image_credit || ''} /></label>
        <label><span>Estado editorial</span><StatusSelect value={item?.status || 'draft'} /></label>
      </div>
      <SaveBar label={isNew ? 'Crear lanzamiento' : 'Guardar lanzamiento'} canEdit={canEdit} />
    </form>
    {!isNew ? <>
      <div className={styles.contributionBlock}><div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Relaciones</span><h4>Pistas y Marchas</h4></div><p>Cada pista puede abrir su grabación concreta en Spotify; al enlazar una Marcha, compositor y dedicatoria se resuelven desde esa entidad.</p></div><div className={styles.editorStack}>{item.tracks.map((track) => <TrackForm key={track.id} item={track} bandId={data.entity.id} releaseId={id} marches={data.marches} canEdit={canEdit} />)}{canEdit ? <TrackForm bandId={data.entity.id} releaseId={id} marches={data.marches} canEdit next={item.tracks.length + 1} /> : null}</div></div>
      <SourceBlock release={item} bandId={data.entity.id} sources={data.sources} canEdit={canEdit} />
      {canEdit && item.status !== 'archived' ? <form action={archiveBandReleaseAction} className={styles.archiveForm}><input type="hidden" name="band_id" value={data.entity.id} /><input type="hidden" name="release_id" value={id} /><button type="submit">Archivar este lanzamiento</button></form> : null}
    </> : null}
  </article>
}
