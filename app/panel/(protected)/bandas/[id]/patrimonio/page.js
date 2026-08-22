import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBandEditorData } from '@/lib/panel/data'
import { SaveBar, StatusSelect, STATUS_LABELS } from '@/components/panel/band/BandEditorPrimitives'
import {
  archiveBandAssetContributionAction,
  archiveBandHeritageAssetAction,
  saveBandAssetContributionAction,
  saveBandHeritageAssetAction,
} from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Patrimonio · Banda · Panel' }

function BandAssetContributionForm({ item, asset, data, canEdit }) {
  const isNew = !item?.id
  return (
    <article className={styles.contributionItem}>
      <div className={styles.contributionHeading}>
        <div><span className={styles.eyebrow}>{isNew ? 'Nueva intervención' : item.intervention_type}</span><h4>{isNew ? 'Vincular autor o taller' : `${item.agentName} · ${item.discipline}`}</h4></div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}
      </div>
      <form action={saveBandAssetContributionAction} className={styles.editorForm}>
        <input type="hidden" name="band_id" value={data.entity.id} />
        <input type="hidden" name="asset_entity_id" value={asset.entity.id} />
        <input type="hidden" name="contribution_id" value={item?.id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Autor, taller o institución</span><select name="agent_entity_id" defaultValue={item?.agent_entity_id || ''} required><option value="">Selecciona un agente</option>{data.agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}</select></label>
          <label><span>Disciplina</span><input name="discipline" defaultValue={item?.discipline || ''} placeholder="Bordados, orfebrería…" required /></label>
          <label><span>Tipo de intervención</span><input name="intervention_type" defaultValue={item?.intervention_type || 'Realización'} /></label>
          <label><span>Papel o fase</span><input name="phase" defaultValue={item?.phase || ''} /></label>
          <label><span>Elemento</span><input name="element_name" defaultValue={item?.element_name || asset.entity.name} /></label>
          <label><span>Fecha</span><input name="contribution_date_from" type="date" defaultValue={item?.date_from || ''} /></label>
          <label><span>Datación textual</span><input name="contribution_date_from_text" defaultValue={item?.date_from_text || ''} placeholder="1999, 2017…" /></label>
          <label><span>Estado</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
          <label className={styles.fieldWide}><span>Descripción</span><textarea name="contribution_description" defaultValue={item?.description || ''} rows="2" /></label>
        </div>
        <SaveBar label={isNew ? 'Vincular agente' : 'Guardar intervención'} canEdit={canEdit} />
      </form>
      {!isNew && canEdit && item.status !== 'archived' ? (
        <form action={archiveBandAssetContributionAction} className={styles.archiveForm}>
          <input type="hidden" name="band_id" value={data.entity.id} />
          <input type="hidden" name="asset_entity_id" value={asset.entity.id} />
          <input type="hidden" name="contribution_id" value={item.id} />
          <button type="submit">Archivar esta intervención</button>
        </form>
      ) : null}
    </article>
  )
}

function BandHeritageAssetForm({ item, data, canEdit }) {
  const isNew = !item?.entity?.id
  const entity = item?.entity || {}
  return (
    <article className={`${styles.editorItem} ${styles.assetEditorItem}`}>
      <div className={styles.itemHeading}>
        <div><span className={styles.eyebrow}>Banderín</span><h3>{isNew ? 'Añadir banderín' : entity.name}</h3></div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[entity.status]}`}>{STATUS_LABELS[entity.status]}</span> : null}
      </div>
      <form action={saveBandHeritageAssetAction} className={styles.editorForm}>
        <input type="hidden" name="band_id" value={data.entity.id} />
        <input type="hidden" name="asset_entity_id" value={entity.id || ''} />
        <input type="hidden" name="asset_type" value="Banderín" />
        <input type="hidden" name="is_featured" value="on" />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Nombre del banderín</span><input name="asset_name" defaultValue={entity.name || ''} placeholder="Banderín de la formación" required /></label>
          <label><span>Slug público</span><input name="asset_slug" defaultValue={entity.slug || ''} required /></label>
          <label className={styles.fieldWide}><span>Resumen breve</span><textarea name="asset_summary" defaultValue={entity.summary || ''} rows="2" /></label>
          <label><span>Fecha</span><input name="date_from" type="date" defaultValue={item?.date_from || ''} /></label>
          <label><span>Datación textual</span><input name="date_from_text" defaultValue={item?.date_from_text || ''} /></label>
          <label><span>Técnica</span><input name="technique" defaultValue={item?.technique || ''} /></label>
          <label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? 0} /></label>
          <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="asset_description" defaultValue={item?.description || ''} rows="4" /></label>
          <label className={styles.fieldWide}><span>Origen y restauraciones</span><textarea name="origin_notes" defaultValue={item?.origin_notes || ''} rows="3" /></label>
          <label className={styles.fieldWide}><span>Ruta pública de la imagen</span><input name="public_image_path" defaultValue={item?.public_image_path || ''} /></label>
          <label className={styles.fieldWide}><span>Descripción accesible de la imagen</span><input name="public_image_alt" defaultValue={item?.public_image_alt || ''} /></label>
          <label className={styles.fieldWide}><span>Crédito de la imagen</span><input name="public_image_credit" defaultValue={item?.public_image_credit || ''} /></label>
          <label><span>Estado editorial</span><StatusSelect defaultValue={entity.status || 'draft'} /></label>
          <label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked={item?.is_current ?? true} /><span>Banderín actual</span></label>
          <label className={styles.fieldWide}><span>Notas internas</span><textarea name="asset_notes" defaultValue={item?.notes || ''} rows="2" /></label>
        </div>
        <SaveBar label={isNew ? 'Crear banderín' : 'Guardar banderín'} canEdit={canEdit} />
      </form>

      {!isNew ? (
        <div className={styles.contributionBlock}>
          <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Relaciones</span><h4>Realización y restauraciones</h4></div><p>Una misma pieza puede reunir distintos responsables, años y disciplinas.</p></div>
          <div className={styles.contributionStack}>{item.contributions.map((contribution) => <BandAssetContributionForm key={contribution.id} item={contribution} asset={item} data={data} canEdit={canEdit} />)}{canEdit ? <BandAssetContributionForm asset={item} data={data} canEdit /> : null}</div>
        </div>
      ) : null}

      {!isNew && canEdit && entity.status !== 'archived' ? (
        <form action={archiveBandHeritageAssetAction} className={styles.archiveForm}>
          <input type="hidden" name="band_id" value={data.entity.id} />
          <input type="hidden" name="asset_entity_id" value={entity.id} />
          <button type="submit">Archivar este banderín</button>
        </form>
      ) : null}
    </article>
  )
}

export default async function BandHeritagePage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBandEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const displayName = data.popularName?.name || data.entity.name

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/bandas">Bandas</Link><span>→</span><Link href={`/panel/bandas/${id}`}>{displayName}</Link><span>→</span><strong>Patrimonio</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Patrimonio material</span><h1>Banderín y piezas identitarias</h1><p>Realización, restauraciones, autorías, imagen y documentación de la pieza.</p></div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Patrimonio actualizado correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Campo opcional</span><h2>Banderín</h2></div><p>Solo se completa cuando la formación dispone de una pieza notable documentada.</p></div>
        <div className={styles.editorStack}>{data.assets.map((item) => <BandHeritageAssetForm key={item.entity.id} item={item} data={data} canEdit={canEdit} />)}{canEdit && data.assets.length === 0 ? <BandHeritageAssetForm data={data} canEdit /> : null}</div>
      </section>
    </div>
  )
}
