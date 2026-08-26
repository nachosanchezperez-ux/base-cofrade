import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { MEDIA_ENTITY_TYPE_LABELS, getPanelMediaData } from '@/lib/panel/media'
import {
  linkExistingMediaAction,
  unlinkEntityMediaAction,
  updateEntityMediaAction,
  uploadEntityMediaAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Multimedia · Panel' }

const SAVED_MESSAGES = {
  uploaded: 'El archivo se ha subido y vinculado correctamente.',
  linked: 'El archivo existente se ha vinculado correctamente.',
  updated: 'El recurso multimedia se ha actualizado correctamente.',
  unlinked: 'El vínculo se ha retirado sin borrar el archivo original.',
}

const RIGHTS_OPTIONS = [
  ['owned', 'Propia'],
  ['authorized', 'Autorizada'],
  ['licensed', 'Con licencia'],
  ['public_domain', 'Dominio público'],
  ['pending', 'Pendiente'],
  ['restricted', 'Restringida'],
]

function LinkFields({ item = null }) {
  return (
    <>
      <label>
        <span>Relación con la entidad</span>
        <input name="relation_type" defaultValue={item?.relation_type || 'gallery'} list="media-relations" required />
      </label>
      <label>
        <span>Orden</span>
        <input name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} />
      </label>
      <label>
        <span>Ajuste</span>
        <select name="fit_mode" defaultValue={item?.fit_mode || 'auto'}>
          <option value="auto">Automático</option>
          <option value="cover">Cubrir</option>
          <option value="contain">Contener</option>
        </select>
      </label>
      <label><span>Foco X</span><input name="focus_x" type="number" min="0" max="100" step="0.01" defaultValue={item?.focus_x ?? 50} /></label>
      <label><span>Foco Y</span><input name="focus_y" type="number" min="0" max="100" step="0.01" defaultValue={item?.focus_y ?? 50} /></label>
      <label><span>Foco móvil X</span><input name="mobile_focus_x" type="number" min="0" max="100" step="0.01" defaultValue={item?.mobile_focus_x ?? ''} /></label>
      <label><span>Foco móvil Y</span><input name="mobile_focus_y" type="number" min="0" max="100" step="0.01" defaultValue={item?.mobile_focus_y ?? ''} /></label>
      <label className={styles.checkField}>
        <input name="is_cover" type="checkbox" defaultChecked={item?.is_cover || false} />
        <span>Usar como portada principal</span>
      </label>
      <label className={styles.fieldWide}><span>Notas del vínculo</span><textarea name="link_notes" rows="2" defaultValue={item?.notes || ''} /></label>
    </>
  )
}

function AssetFields({ asset = null, requireAlt = false }) {
  return (
    <>
      <label><span>Título</span><input name="title" defaultValue={asset?.title || ''} /></label>
      <label><span>Texto alternativo</span><input name="alt_text" defaultValue={asset?.alt_text || ''} required={requireAlt} /></label>
      <label className={styles.fieldWide}><span>Pie de foto</span><textarea name="caption" rows="2" defaultValue={asset?.caption || ''} /></label>
      <label><span>Autor / fotógrafo</span><input name="author_name" defaultValue={asset?.author_name || ''} /></label>
      <label><span>Titular de derechos</span><input name="rights_holder" defaultValue={asset?.rights_holder || ''} /></label>
      <label>
        <span>Derechos</span>
        <select name="rights_status" defaultValue={asset?.rights_status || 'authorized'}>
          {RIGHTS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label><span>Licencia</span><input name="license" defaultValue={asset?.license || ''} /></label>
      <label><span>Fuente</span><input name="source_name" defaultValue={asset?.source_name || ''} /></label>
      <label className={styles.fieldWide}><span>URL de la fuente</span><input name="source_url" type="url" defaultValue={asset?.source_url || ''} /></label>
      <label><span>Fecha de la imagen</span><input name="taken_or_created_date" type="date" defaultValue={asset?.taken_or_created_date || ''} /></label>
      <label className={styles.fieldWide}><span>Permiso / notas de derechos</span><textarea name="permission_notes" rows="2" defaultValue={asset?.permission_notes || ''} /></label>
    </>
  )
}

export default async function PanelMultimediaPage({ searchParams }) {
  const [query, user] = await Promise.all([searchParams, requirePanelUser()])
  const entityId = String(query?.entity || '').trim()
  const q = String(query?.q || '').trim()
  const data = await getPanelMediaData({ entityId, query: q })
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Archivo transversal</span>
          <h1>Multimedia</h1>
          <p>Un único archivo para Hermandades, Imágenes, Pasos, Bandas, patrimonio, marchas y acontecimientos.</p>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil puede consultar el archivo multimedia, pero no modificarlo.</div> : null}

      <datalist id="media-relations">
        <option value="cover" />
        <option value="portrait" />
        <option value="gallery" />
        <option value="crest" />
        <option value="logo" />
        <option value="poster" />
        <option value="document" />
      </datalist>

      <form className={styles.filters}>
        <label><span className={styles.srOnly}>Buscar recurso</span><input type="search" name="q" defaultValue={q} placeholder="Buscar recurso, entidad o autor…" /></label>
        <label>
          <span className={styles.srOnly}>Filtrar por entidad</span>
          <select name="entity" defaultValue={entityId}>
            <option value="">Todas las entidades</option>
            {data.entities.map((entity) => (
              <option key={entity.id} value={entity.id}>{MEDIA_ENTITY_TYPE_LABELS[entity.entity_type] || entity.entity_type} · {entity.name}</option>
            ))}
          </select>
        </label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>Nuevo recurso</span><h2>Subir y vincular</h2></div>
            <p>El destino puede ser cualquier entidad activa del grafo.</p>
          </div>
          <form action={uploadEntityMediaAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <div className={styles.formGrid}>
              <EntityPicker
                className={styles.fieldWide}
                name="entity_id"
                items={data.entityOptions}
                label="Entidad de destino"
                placeholder="Buscar Hermandad, Imagen, Paso, Banda…"
                emptyLabel="Selecciona una entidad"
                defaultValue={entityId}
              />
              <label className={styles.fieldWide}><span>Archivo</span><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required /></label>
              <AssetFields requireAlt />
              <LinkFields />
            </div>
            <div className={styles.formActions}>
              <small>Una portada nueva sustituye como portada al recurso anterior, sin borrar ningún archivo.</small>
              <button className={styles.primaryButton} type="submit">Subir y vincular</button>
            </div>
          </form>
        </section>
      ) : null}

      {canEdit && data.assets.length ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>Reutilizar</span><h2>Vincular archivo existente</h2></div>
            <p>Un mismo recurso puede documentar varias entidades sin duplicar el archivo.</p>
          </div>
          <form action={linkExistingMediaAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <div className={styles.formGrid}>
              <EntityPicker className={styles.fieldWide} name="entity_id" items={data.entityOptions} label="Entidad" emptyLabel="Selecciona una entidad" defaultValue={entityId} />
              <EntityPicker className={styles.fieldWide} name="media_asset_id" items={data.assetOptions} label="Archivo existente" emptyLabel="Selecciona un archivo" />
              <LinkFields />
            </div>
            <div className={styles.formActions}>
              <small>Se crea únicamente una nueva relación con el archivo ya existente.</small>
              <button className={styles.primaryButton} type="submit">Vincular archivo</button>
            </div>
          </form>
        </section>
      ) : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Archivo vinculado</span><h2>Recursos en uso</h2></div>
          <p>{data.links.length} vínculo{data.links.length === 1 ? '' : 's'}.</p>
        </div>

        <div className={styles.editorStack}>
          {data.links.length ? data.links.map((item) => (
            <article className={styles.editorItem} key={item.id}>
              <div className={styles.itemHeading}>
                <div>
                  <span className={styles.eyebrow}>{MEDIA_ENTITY_TYPE_LABELS[item.entity.entity_type] || item.entity.entity_type} · {item.relation_type}</span>
                  <h3>{item.asset.title || item.entity.name}</h3>
                  <p style={{ margin: '5px 0 0', color: '#68788a', fontSize: 12 }}>{item.entity.name}{item.is_cover ? ' · Portada' : ''}</p>
                </div>
                {item.publicUrl ? <img src={item.publicUrl} alt={item.asset.alt_text || ''} style={{ width: 92, height: 72, objectFit: 'cover', borderRadius: 10, border: '1px solid #dfe7ef' }} /> : null}
              </div>

              {canEdit ? (
                <form action={updateEntityMediaAction} className={styles.editorForm}>
                  <input type="hidden" name="media_link_id" value={item.id} />
                  <input type="hidden" name="entity_id" value={item.entity_id} />
                  <input type="hidden" name="media_asset_id" value={item.media_asset_id} />
                  <div className={styles.formGrid}>
                    <AssetFields asset={item.asset} />
                    <LinkFields item={item} />
                  </div>
                  <div className={styles.formActions}>
                    <small>{item.asset.storage_path}</small>
                    <button className={styles.secondaryButton} type="submit">Guardar recurso</button>
                  </div>
                </form>
              ) : null}

              {canEdit ? (
                <form action={unlinkEntityMediaAction} className={styles.archiveForm}>
                  <input type="hidden" name="media_link_id" value={item.id} />
                  <input type="hidden" name="entity_id" value={item.entity_id} />
                  <button type="submit">Desvincular sin borrar el archivo</button>
                </form>
              ) : null}
            </article>
          )) : <div className={styles.emptyPanel}>No hay recursos que coincidan con este filtro.</div>}
        </div>
      </section>
    </div>
  )
}
