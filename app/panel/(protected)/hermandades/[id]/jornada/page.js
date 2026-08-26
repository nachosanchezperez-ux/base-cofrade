import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodProcessionStatsEditorData } from '@/lib/panel/brotherhood-procession-stats'
import {
  archiveBrotherhoodProcessionStatsAction,
  saveBrotherhoodProcessionStatsAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const SAVED_MESSAGES = {
  created: 'Los Datos de jornada se han creado correctamente.',
  updated: 'Los Datos de jornada se han actualizado.',
  archived: 'El registro se ha archivado sin borrar su histórico.',
}

function StatusSelect({ defaultValue = 'draft' }) {
  return (
    <select name="status" defaultValue={defaultValue}>
      <option value="draft">Borrador</option>
      <option value="review">En revisión</option>
      <option value="published">Publicado</option>
      <option value="archived">Archivado</option>
    </select>
  )
}

function StatsFields({ item = null, sourceOptions, defaultDay = '' }) {
  return (
    <div className={styles.formGrid}>
      <label><span>Año</span><input name="year" type="number" min="1900" max="2100" defaultValue={item?.year || new Date().getFullYear()} required /></label>
      <label><span>Fecha de la procesión</span><input name="procession_date" type="date" defaultValue={item?.procession_date || ''} /></label>
      <label><span>Jornada</span><input name="procession_day" defaultValue={item?.procession_day || defaultDay || ''} placeholder="Miércoles Santo, 15 de agosto…" /></label>
      <label><span>Hora de salida</span><input name="departure_time" type="time" defaultValue={item?.departure_time?.slice(0, 5) || ''} /></label>
      <label><span>Hora de entrada</span><input name="entrance_time" type="time" defaultValue={item?.entrance_time?.slice(0, 5) || ''} /></label>
      <label><span>Nazarenos</span><input name="nazarenos_count" type="number" min="0" defaultValue={item?.nazarenos_count ?? ''} /></label>
      <label><span>Penitentes</span><input name="penitents_count" type="number" min="0" defaultValue={item?.penitents_count ?? ''} /></label>
      <label><span>Total nazarenos</span><input name="total_nazarenos_count" type="number" min="0" defaultValue={item?.total_nazarenos_count ?? ''} /></label>
      <label><span>Acólitos</span><input name="acolytes_count" type="number" min="0" defaultValue={item?.acolytes_count ?? ''} /></label>
      <label><span>Monaguillos</span><input name="monaguillos_count" type="number" min="0" defaultValue={item?.monaguillos_count ?? ''} /></label>
      <label><span>Integrantes de acompañamientos musicales</span><input name="musical_accompaniment_count" type="number" min="0" defaultValue={item?.musical_accompaniment_count ?? ''} /></label>
      <label><span>Total cortejo</span><input name="total_procession_count" type="number" min="0" defaultValue={item?.total_procession_count ?? ''} /></label>
      <label><span>Orden por nazarenos</span><input name="position_by_nazarenos" type="number" min="1" defaultValue={item?.position_by_nazarenos ?? ''} /></label>
      <label><span>Orden por cortejo</span><input name="position_by_procession" type="number" min="1" defaultValue={item?.position_by_procession ?? ''} /></label>
      <label><span>Hermandades en la jornada</span><input name="brotherhoods_in_day" type="number" min="1" defaultValue={item?.brotherhoods_in_day ?? ''} /></label>
      <label><span>Tiempo recorrido oficial (min)</span><input name="official_route_duration_minutes" type="number" min="0" defaultValue={item?.official_route_duration_minutes ?? ''} /></label>
      <label><span>Tiempo en Carrera Oficial (min)</span><input name="official_career_duration_minutes" type="number" min="0" defaultValue={item?.official_career_duration_minutes ?? ''} /></label>
      <label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
      <EntityPicker
        className={styles.fieldWide}
        name="source_id"
        items={sourceOptions}
        label="Fuente principal (opcional)"
        placeholder="Buscar Fuente…"
        emptyLabel="Sin Fuente principal"
        required={false}
        defaultValue={item?.source_id || ''}
      />
      <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" rows="3" defaultValue={item?.notes || ''} /></label>
    </div>
  )
}

export default async function BrotherhoodProcessionStatsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getBrotherhoodProcessionStatsEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/hermandades">Hermandades</Link><span>→</span>
          <Link href={`/panel/hermandades/${id}`}>{data.brotherhood.popular_name || data.entity.name}</Link><span>→</span>
          <strong>Datos de jornada</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Cortejo y Carrera Oficial</span><h1>Datos de jornada</h1><p>Serie histórica anual de {data.brotherhood.popular_name || data.entity.name}.</p></div>
          <Link className={styles.secondaryButton} href={`/hermandades/${data.entity.slug}#resumen`} target="_blank" rel="noreferrer">Ver en el Front ↗</Link>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Histórico</span><h2>Registros por año</h2></div>
          <p>El Front usa el registro publicado más reciente para el bloque de Datos clave.</p>
        </div>

        <div className={styles.editorStack}>
          {data.stats.length ? data.stats.map((item) => (
            <article className={styles.editorItem} key={item.id}>
              <div className={styles.itemHeading}>
                <div><span className={styles.eyebrow}>Jornada</span><h3>{item.year}</h3><p>{item.procession_day || data.brotherhood.current_procession_day || 'Jornada por documentar'}</p></div>
                <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
              </div>

              <div className={styles.moduleList} style={{ marginBottom: 18 }}>
                <div><span>Total nazarenos</span><strong>{item.total_nazarenos_count ?? '—'}</strong></div>
                <div><span>Total cortejo</span><strong>{item.total_procession_count ?? '—'}</strong></div>
                <div><span>Orden en la jornada</span><strong>{item.position_by_nazarenos ? `${item.position_by_nazarenos}.ª${item.brotherhoods_in_day ? ` de ${item.brotherhoods_in_day}` : ''}` : '—'}</strong></div>
                <div><span>Carrera Oficial</span><strong>{item.official_career_duration_minutes != null ? `${item.official_career_duration_minutes} min` : '—'}</strong></div>
              </div>

              {canEdit ? (
                <form action={saveBrotherhoodProcessionStatsAction} className={styles.editorForm}>
                  <input type="hidden" name="brotherhood_id" value={id} />
                  <input type="hidden" name="stats_id" value={item.id} />
                  <StatsFields item={item} sourceOptions={data.sourceOptions} defaultDay={data.brotherhood.current_procession_day} />
                  <div className={styles.formActions}><small>{item.source ? `Fuente: ${item.source.name}` : 'Añade una Fuente principal cuando el dato esté documentado.'}</small><button className={styles.secondaryButton} type="submit">Guardar {item.year}</button></div>
                </form>
              ) : null}

              {canEdit ? (
                <form action={archiveBrotherhoodProcessionStatsAction} className={styles.archiveForm}>
                  <input type="hidden" name="brotherhood_id" value={id} /><input type="hidden" name="stats_id" value={item.id} />
                  <button type="submit">Archivar este año</button>
                </form>
              ) : null}
            </article>
          )) : <div className={styles.emptyPanel}>Todavía no hay Datos de jornada registrados.</div>}
        </div>
      </section>

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nuevo año</span><h2>Añadir Datos de jornada</h2></div><p>Solo puede existir un registro por Hermandad y año.</p></div>
          <form action={saveBrotherhoodProcessionStatsAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <input type="hidden" name="brotherhood_id" value={id} />
            <StatsFields sourceOptions={data.sourceOptions} defaultDay={data.brotherhood.current_procession_day} />
            <div className={styles.formActions}><small>Puede quedar en borrador hasta que la documentación esté completa.</small><button className={styles.primaryButton} type="submit">Crear registro anual</button></div>
          </form>
        </section>
      ) : null}
    </div>
  )
}
