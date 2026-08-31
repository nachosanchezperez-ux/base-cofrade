import styles from '@/app/panel/panel.module.css'
import {
  setBrotherhoodMediaCoverAction,
  unlinkBrotherhoodMediaAssetAction,
  updateBrotherhoodMediaAssetAction,
} from './manage-actions'
import mediaStyles from './MediaAssetManager.module.css'

const RIGHTS_OPTIONS = [
  ['owned', 'Propia'],
  ['authorized', 'Autorizada'],
  ['licensed', 'Con licencia'],
  ['public_domain', 'Dominio público'],
  ['pending', 'Pendiente'],
  ['restricted', 'Restringida'],
]

function HiddenFields({ brotherhoodId, targetId, targetKind, item }) {
  return (
    <>
      <input type="hidden" name="brotherhood_id" value={brotherhoodId} />
      <input type="hidden" name="target_id" value={targetId} />
      <input type="hidden" name="target_kind" value={targetKind} />
      <input type="hidden" name="media_link_id" value={item.id} />
      <input type="hidden" name="media_asset_id" value={item.asset.id} />
    </>
  )
}

export default function MediaAssetManager({ media = [], brotherhoodId, targetId, targetKind }) {
  if (!media.length) return null

  return (
    <div className={mediaStyles.manager}>
      <div className={mediaStyles.heading}>
        <strong>Archivos vinculados</strong>
        <span>{media.length} {media.length === 1 ? 'archivo' : 'archivos'}</span>
      </div>

      <div className={mediaStyles.list}>
        {media.map((item) => (
          <article className={mediaStyles.asset} key={item.id}>
            <div className={mediaStyles.preview}>
              {item.publicUrl ? <img src={item.publicUrl} alt={item.asset.alt_text || ''} /> : null}
            </div>

            <div className={mediaStyles.body}>
              <div className={mediaStyles.identity}>
                <div className={mediaStyles.identityTop}>
                  <strong>{item.asset.title || 'Imagen sin título'}</strong>
                  {item.is_cover ? <span className={mediaStyles.badge}>Principal</span> : null}
                </div>
                <small>{item.asset.author_name ? `Fotografía · ${item.asset.author_name}` : 'Sin autor documentado'}</small>
              </div>

              <div className={mediaStyles.actions}>
                {!item.is_cover ? (
                  <form action={setBrotherhoodMediaCoverAction}>
                    <HiddenFields brotherhoodId={brotherhoodId} targetId={targetId} targetKind={targetKind} item={item} />
                    <button className={styles.smallButton} type="submit">Usar como principal</button>
                  </form>
                ) : null}
              </div>

              <details className={mediaStyles.editDetails}>
                <summary>Editar información</summary>
                <form action={updateBrotherhoodMediaAssetAction} className={mediaStyles.editForm}>
                  <HiddenFields brotherhoodId={brotherhoodId} targetId={targetId} targetKind={targetKind} item={item} />
                  <div className={mediaStyles.grid}>
                    <label><span>Título</span><input name="title" defaultValue={item.asset.title || ''} /></label>
                    <label><span>Autor / fotógrafo</span><input name="author_name" defaultValue={item.asset.author_name || ''} /></label>
                    <label className={mediaStyles.wide}><span>Descripción accesible</span><input name="alt_text" defaultValue={item.asset.alt_text || ''} required /></label>
                    <label className={mediaStyles.wide}><span>Pie de foto</span><textarea name="caption" rows="2" defaultValue={item.asset.caption || ''} /></label>
                    <label>
                      <span>Derechos</span>
                      <select name="rights_status" defaultValue={item.asset.rights_status || 'authorized'}>
                        {RIGHTS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className={mediaStyles.actions}>
                    <button className={styles.secondaryButton} type="submit">Guardar cambios</button>
                  </div>
                </form>
              </details>

              <details className={mediaStyles.deleteDetails}>
                <summary>Desvincular</summary>
                <p>Se retirará únicamente de este contenido. El archivo multimedia y el objeto de almacenamiento se conservarán para evitar borrar recursos que puedan seguir utilizándose en otros contextos.</p>
                <form action={unlinkBrotherhoodMediaAssetAction}>
                  <HiddenFields brotherhoodId={brotherhoodId} targetId={targetId} targetKind={targetKind} item={item} />
                  <button className={styles.smallButton} type="submit">Confirmar desvinculación</button>
                </form>
              </details>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
