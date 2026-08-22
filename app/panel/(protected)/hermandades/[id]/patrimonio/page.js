import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodEditorData } from '@/lib/panel/data'
import { SaveBar, StatusSelect, STATUS_LABELS } from '@/components/panel/brotherhood/BrotherhoodEditorPrimitives'
import {
  archiveAssetContributionAction,
  archiveHeritageAction,
  archiveHeritageAssetAction,
  saveAssetContributionAction,
  saveHeritageAction,
  saveHeritageAssetAction,
} from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Patrimonio · Hermandad · Panel' }

function HeritageUpdateForm({ item, data, canEdit }) {
  const isNew = !item?.id
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div><span className={styles.eyebrow}>{isNew ? 'Nueva incorporación' : item.update_type}</span><h3>{isNew ? 'Añadir estreno o restauración' : item.title}</h3></div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}
      </div>
      <form action={saveHeritageAction} className={styles.editorForm}>
        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
        <input type="hidden" name="update_id" value={item?.id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Título</span><input name="title" defaultValue={item?.title || ''} required /></label>
          <label><span>Tipo</span><select name="update_type" defaultValue={item?.update_type || 'estreno'}><option value="estreno">Estreno</option><option value="restauracion">Restauración</option></select></label>
          <label><span>Fecha</span><input name="update_date" type="date" defaultValue={item?.update_date || ''} /></label>
          <label><span>Año</span><input name="year" type="number" defaultValue={item?.year ?? ''} /></label>
          <label><span>Elemento</span><input name="element_name" defaultValue={item?.element_name || ''} /></label>
          <label><span>Disciplina</span><input name="discipline" defaultValue={item?.discipline || ''} placeholder="orfebrería, bordado…" /></label>
          <input type="hidden" name="target_entity_id" value={item?.target_entity_id || ''} />
          <label className={styles.fieldWide}><span>Descripción</span><textarea name="description" defaultValue={item?.description || ''} rows="4" /></label>
          <label><span>Estado</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
        </div>
        <SaveBar label={isNew ? 'Crear novedad' : 'Guardar novedad'} canEdit={canEdit} />
      </form>
      {!isNew && canEdit && item.status !== 'archived' ? <form action={archiveHeritageAction} className={styles.archiveForm}><input type="hidden" name="brotherhood_id" value={data.entity.id} /><input type="hidden" name="update_id" value={item.id} /><button type="submit">Archivar esta novedad</button></form> : null}
    </article>
  )
}

function AssetContributionForm({ item, asset, data, canEdit }) {
  const isNew = !item?.id
  return (
    <article className={styles.contributionItem}>
      <div className={styles.contributionHeading}>
        <div><span className={styles.eyebrow}>{isNew ? 'Nueva relación' : item.intervention_type || 'Intervención'}</span><h4>{isNew ? 'Vincular autor o taller' : `${item.agentName} · ${item.discipline}`}</h4></div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}
      </div>
      <form action={saveAssetContributionAction} className={styles.editorForm}>
        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
        <input type="hidden" name="asset_entity_id" value={asset.entity.id} />
        <input type="hidden" name="contribution_id" value={item?.id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Autor, taller o institución</span><select name="agent_entity_id" defaultValue={item?.agent_entity_id || ''} required><option value="">Selecciona un agente</option>{data.agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}</select></label>
          <label><span>Disciplina</span><input name="discipline" defaultValue={item?.discipline || ''} placeholder="Diseño, bordado, orfebrería…" required /></label>
          <label><span>Papel o fase</span><input name="phase" defaultValue={item?.phase || ''} placeholder="Dirección artística, dibujo…" /></label>
          <label><span>Tipo de intervención</span><input name="intervention_type" defaultValue={item?.intervention_type || 'Creación'} /></label>
          <label><span>Elemento concreto</span><input name="element_name" defaultValue={item?.element_name || asset.entity.name} /></label>
          <label><span>Fecha inicial</span><input name="contribution_date_from" type="date" defaultValue={item?.date_from || ''} /></label>
          <label><span>Datación textual</span><input name="contribution_date_from_text" defaultValue={item?.date_from_text || ''} placeholder="2021, hacia 1950…" /></label>
          <label><span>Fecha final</span><input name="contribution_date_to" type="date" defaultValue={item?.date_to || ''} /></label>
          <label><span>Datación final textual</span><input name="contribution_date_to_text" defaultValue={item?.date_to_text || ''} /></label>
          <label className={styles.fieldWide}><span>Descripción de la aportación</span><textarea name="contribution_description" defaultValue={item?.description || ''} rows="3" /></label>
          <label><span>Estado</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
        </div>
        <SaveBar label={isNew ? 'Vincular agente' : 'Guardar relación'} canEdit={canEdit} />
      </form>
      {!isNew && canEdit && item.status !== 'archived' ? <form action={archiveAssetContributionAction} className={styles.archiveForm}><input type="hidden" name="brotherhood_id" value={data.entity.id} /><input type="hidden" name="asset_entity_id" value={asset.entity.id} /><input type="hidden" name="contribution_id" value={item.id} /><button type="submit">Archivar esta relación</button></form> : null}
    </article>
  )
}

function HeritageAssetForm({ item, data, canEdit }) {
  const isNew = !item?.entity?.id
  const entity = item?.entity || {}
  return (
    <article className={`${styles.editorItem} ${styles.assetEditorItem}`}>
      <div className={styles.itemHeading}>
        <div><span className={styles.eyebrow}>{isNew ? 'Nueva pieza' : item.asset_type || 'Patrimonio'}</span><h3>{isNew ? 'Añadir obra o enser' : entity.name}</h3></div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[entity.status]}`}>{STATUS_LABELS[entity.status]}</span> : null}
      </div>
      <form action={saveHeritageAssetAction} className={styles.editorForm}>
        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
        <input type="hidden" name="asset_entity_id" value={entity.id || ''} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Nombre de la pieza</span><input name="asset_name" defaultValue={entity.name || ''} required /></label>
          <label><span>Tipo</span><input name="asset_type" defaultValue={item?.asset_type || ''} placeholder="Simpecado, carreta, retablo…" required /></label>
          <label><span>Slug público</span><input name="asset_slug" defaultValue={entity.slug || ''} placeholder="simpecado-de-los-devotos" required /></label>
          <label className={styles.fieldWide}><span>Resumen breve</span><textarea name="asset_summary" defaultValue={entity.summary || ''} rows="2" /></label>
          <label><span>Fecha</span><input name="date_from" type="date" defaultValue={item?.date_from || ''} /></label>
          <label><span>Datación textual</span><input name="date_from_text" defaultValue={item?.date_from_text || ''} placeholder="2021, siglo XVIII…" /></label>
          <label><span>Fecha de bendición</span><input name="blessing_date" type="date" defaultValue={item?.blessing_date || ''} /></label>
          <label><span>Bendición en texto</span><input name="blessing_date_text" defaultValue={item?.blessing_date_text || ''} /></label>
          <label><span>Técnica</span><input name="technique" defaultValue={item?.technique || ''} /></label>
          <label><span>Materiales</span><input name="materials" defaultValue={item?.materials || ''} /></label>
          <label><span>Dimensiones</span><input name="dimensions_text" defaultValue={item?.dimensions_text || ''} /></label>
          <label><span>Estado de conservación</span><input name="current_condition" defaultValue={item?.current_condition || ''} /></label>
          <label className={styles.fieldWide}><span>Descripción</span><textarea name="asset_description" defaultValue={item?.description || ''} rows="4" /></label>
          <label className={styles.fieldWide}><span>Iconografía y diseño</span><textarea name="iconography" defaultValue={item?.iconography || ''} rows="4" /></label>
          <label className={styles.fieldWide}><span>Contexto histórico</span><textarea name="historical_context" defaultValue={item?.historical_context || ''} rows="3" /></label>
          <label className={styles.fieldWide}><span>Procedencia o donación</span><textarea name="provenance_text" defaultValue={item?.provenance_text || ''} rows="3" /></label>
          <label className={styles.fieldWide}><span>Origen y evolución</span><textarea name="origin_notes" defaultValue={item?.origin_notes || ''} rows="3" /></label>
          <label><span>Orden</span><input name="display_order" type="number" defaultValue={item?.display_order ?? 0} /></label>
          <label><span>Estado editorial</span><StatusSelect defaultValue={entity.status || 'draft'} /></label>
          <label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked={item?.is_current ?? true} /><span>Pieza actual</span></label>
          <label className={styles.checkField}><input name="is_featured" type="checkbox" defaultChecked={item?.is_featured ?? false} /><span>Destacar en la ficha pública</span></label>
          <label className={styles.fieldWide}><span>Notas internas</span><textarea name="asset_notes" defaultValue={item?.notes || ''} rows="2" /></label>
        </div>
        <SaveBar label={isNew ? 'Crear pieza patrimonial' : 'Guardar pieza'} canEdit={canEdit} />
      </form>

      {!isNew ? (
        <div className={styles.contributionBlock}>
          <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Relaciones</span><h4>Autores, talleres e intervenciones</h4></div><p>Una pieza puede reunir diferentes responsables y disciplinas.</p></div>
          <div className={styles.contributionStack}>{item.contributions.map((contribution) => <AssetContributionForm key={contribution.id} item={contribution} asset={item} data={data} canEdit={canEdit} />)}{canEdit ? <AssetContributionForm asset={item} data={data} canEdit /> : null}</div>
        </div>
      ) : null}

      {!isNew && canEdit && entity.status !== 'archived' ? <form action={archiveHeritageAssetAction} className={styles.archiveForm}><input type="hidden" name="brotherhood_id" value={data.entity.id} /><input type="hidden" name="asset_entity_id" value={entity.id} /><button type="submit">Archivar esta pieza</button></form> : null}
    </article>
  )
}

export default async function BrotherhoodHeritagePage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/hermandades">Hermandades</Link><span>→</span><Link href={`/panel/hermandades/${id}`}>{data.brotherhood?.popular_name || data.entity.name}</Link><span>→</span><strong>Patrimonio</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Memoria material</span><h1>Patrimonio</h1><p>Obras, autores, talleres, estrenos, restauraciones e intervenciones conectadas.</p></div>
          {data.entity.slug ? <Link className={styles.secondaryButton} href={`/hermandades/${data.entity.slug}#patrimonio`} target="_blank" rel="noreferrer">Ver en el Front ↗</Link> : null}
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Patrimonio actualizado correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Catálogo</span><h2>Obras y enseres</h2></div><p>{data.assets.length} pieza{data.assets.length === 1 ? '' : 's'} con ficha propia.</p></div>
        <div className={styles.editorStack}>{data.assets.map((item) => <HeritageAssetForm key={item.entity.id} item={item} data={data} canEdit={canEdit} />)}{canEdit ? <HeritageAssetForm data={data} canEdit /> : null}</div>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Cronología</span><h2>Estrenos y restauraciones</h2></div><p>{data.heritage.length} novedad{data.heritage.length === 1 ? '' : 'es'} documentada{data.heritage.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>{data.heritage.map((item) => <HeritageUpdateForm key={item.id} item={item} data={data} canEdit={canEdit} />)}{canEdit ? <HeritageUpdateForm data={data} canEdit /> : null}</div>
      </section>
    </div>
  )
}
