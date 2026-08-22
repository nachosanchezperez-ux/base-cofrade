import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBandEditorData } from '@/lib/panel/data'
import { getBandStepOptions } from '@/lib/panel/band-step-options'
import { BrotherhoodSelect, SaveBar, StatusSelect, STATUS_LABELS } from '@/components/panel/band/BandEditorPrimitives'
import { archiveBandAccompanimentAction, saveBandAccompanimentAction } from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Acompañamientos · Banda · Panel' }

function StepSelect({ steps, defaultValue = '' }) {
  return (
    <select name="step_entity_id" defaultValue={defaultValue || ''}>
      <option value="">Sin Paso vinculado</option>
      {steps.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
    </select>
  )
}

function AccompanimentForm({ item, data, steps, canEdit, defaultCurrent = true, sectionId = 'acompanamientos' }) {
  const isNew = !item?.id
  const isCurrent = item?.is_current ?? defaultCurrent
  return (
    <article className={styles.editorItem}>
      <div className={styles.itemHeading}>
        <div>
          <span className={styles.eyebrow}>{isNew ? 'Nuevo acompañamiento' : isCurrent ? 'Actual' : 'Histórico'}</span>
          <h3>{isNew ? `Añadir acompañamiento ${isCurrent ? 'actual' : 'histórico'}` : item.brotherhood?.name || 'Hermandad no disponible'}</h3>
          {!isNew ? <p>{[item.step?.name, item.outing_type, item.position].filter(Boolean).join(' · ')}</p> : null}
        </div>
        {!isNew ? <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span> : null}
      </div>
      <form action={saveBandAccompanimentAction} className={styles.editorForm}>
        <input type="hidden" name="band_id" value={data.entity.id} />
        <input type="hidden" name="period_id" value={item?.id || ''} />
        <input type="hidden" name="return_section" value={sectionId} />
        <div className={styles.formGrid}>
          <label><span>Hermandad</span><BrotherhoodSelect brotherhoods={data.brotherhoods} defaultValue={item?.brotherhood_entity_id} /></label>
          <label><span>Paso</span><StepSelect steps={steps} defaultValue={item?.step_entity_id} /></label>
          <label><span>Jornada o salida</span><input name="outing_type" defaultValue={item?.outing_type || ''} placeholder="Domingo de Ramos / Procesión de Gloria" required /></label>
          <label><span>Ubicación en el cortejo</span><input name="position" defaultValue={item?.position || 'Tras el paso'} required /></label>
          <label><span>Año de inicio</span><input name="year_from" type="number" min="1800" max="2200" defaultValue={item?.year_from ?? ''} placeholder="Solo si está documentado" /></label>
          <label><span>Datación textual</span><input name="date_from_text" defaultValue={item?.date_from_text || ''} placeholder="Vigente en 2026" /></label>
          <label><span>Año de finalización</span><input name="year_to" type="number" min="1800" max="2200" defaultValue={item?.year_to ?? ''} placeholder="Vacío si continúa" /></label>
          <label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked={isCurrent} /><span>Acompañamiento actual</span></label>
          <label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
          <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item?.notes || ''} rows="3" /></label>
        </div>
        <SaveBar label={isNew ? 'Crear acompañamiento' : 'Guardar acompañamiento'} canEdit={canEdit} note="La relación publicada alimenta la ficha de Banda, la Hermandad y, cuando se selecciona, el Paso." />
      </form>
      {!isNew && item.status !== 'archived' && canEdit ? (
        <form action={archiveBandAccompanimentAction} className={styles.archiveForm}>
          <input type="hidden" name="band_id" value={data.entity.id} />
          <input type="hidden" name="period_id" value={item.id} />
          <input type="hidden" name="return_section" value={sectionId} />
          <button type="submit">Archivar este acompañamiento</button>
        </form>
      ) : null}
    </article>
  )
}

export default async function BandAccompanimentsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const [data, steps] = await Promise.all([getBandEditorData(id), getBandStepOptions()])
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const displayName = data.popularName?.name || data.entity.name
  const current = data.periods.filter((item) => item.is_current)
  const historical = data.periods.filter((item) => !item.is_current)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/bandas">Bandas</Link><span>→</span><Link href={`/panel/bandas/${id}`}>{displayName}</Link><span>→</span><strong>Acompañamientos</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Contratos y trayectoria</span><h1>Acompañamientos</h1><p>Hermandad, Paso, jornada, posición y vigencia de cada relación musical.</p></div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Acompañamientos actualizados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Vigentes</span><h2>Acompañamientos actuales</h2></div><p>{current.length} relación{current.length === 1 ? '' : 'es'} vigente{current.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>{current.map((item) => <AccompanimentForm key={item.id} item={item} data={data} steps={steps} canEdit={canEdit} />)}{canEdit ? <AccompanimentForm data={data} steps={steps} canEdit /> : null}</div>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Memoria musical</span><h2>Acompañamientos históricos</h2></div><p>{historical.length} periodo{historical.length === 1 ? '' : 's'} finalizado{historical.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>{historical.map((item) => <AccompanimentForm key={item.id} item={item} data={data} steps={steps} canEdit={canEdit} defaultCurrent={false} sectionId="acompanamientos-historicos" />)}{canEdit ? <AccompanimentForm data={data} steps={steps} canEdit defaultCurrent={false} sectionId="acompanamientos-historicos" /> : null}</div>
      </section>
    </div>
  )
}
