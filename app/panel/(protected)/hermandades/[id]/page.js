import Link from 'next/link'
import { notFound } from 'next/navigation'
import BrotherhoodTypeSelector from '@/components/panel/BrotherhoodTypeSelector'
import { BrotherhoodGeographyFields, BrotherhoodGeographyInlineTools } from '@/components/panel/BrotherhoodGeographyEditor'
import { SaveBar, StatusSelect, STATUS_LABELS } from '@/components/panel/brotherhood/BrotherhoodEditorPrimitives'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodEditorData } from '@/lib/panel/data'
import { getBrotherhoodPresenceData } from '@/lib/panel/brotherhood-presence'
import { updateBrotherhoodAction } from './actions'
import { createMunicipalityAction, createPlaceAction, updatePlaceAction } from './geography-actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Editar hermandad · Panel' }

function ModuleRow({ href, label, count, note }) {
  return (
    <div>
      <span><strong>{label}</strong>{note ? <small style={{ display: 'block', marginTop: 3 }}>{note}</small> : null}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><b>{count}</b><Link className={styles.rowLink} href={href}>Abrir <span>→</span></Link></span>
    </div>
  )
}

export default async function BrotherhoodEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const [data, geography] = await Promise.all([getBrotherhoodEditorData(id), getBrotherhoodPresenceData(id)])
  if (!data || !geography) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const colorRows = [...data.colors]
  while (colorRows.length < 3) colorRows.push({ id: '', color_name: '', hex_value: '', color_role: 'identity' })

  const requestedMunicipality = geography.municipalities.some((item) => item.id === query?.municipality) ? query.municipality : null
  const requestedPlace = geography.places.some((item) => item.id === query?.place) ? query.place : null
  const selectedPlaceId = requestedPlace || data.brotherhood?.canonical_see_place_id || ''
  const selectedPlace = geography.places.find((item) => item.id === selectedPlaceId) || null
  const selectedMunicipalityId = requestedMunicipality || selectedPlace?.municipality_id || data.brotherhood?.municipality_id || ''

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/hermandades">Hermandades</Link><span>→</span><strong>{data.brotherhood?.popular_name || data.entity.name}</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Resumen de ficha</span><h1>{data.brotherhood?.popular_name || data.entity.name}</h1><p>{data.brotherhood?.official_name}</p></div>
          <div className={styles.editorHeaderActions}><span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>{data.entity.slug ? <Link className={styles.secondaryButton} href={`/hermandades/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}</div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {query?.reused === 'municipality' ? <div className={styles.savedNotice} role="status">La Localidad ya existía y queda seleccionada.</div> : null}
      {query?.reused === 'place' ? <div className={styles.savedNotice} role="status">El Lugar ya existía y queda seleccionado como Sede.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando la ficha como colaborador. Un editor debe realizar los cambios.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura de la ficha">
        <article className={styles.metricCard}><span>Canales</span><strong>{data.socialLinks.length}</strong><small>web y redes oficiales</small></article>
        <article className={styles.metricCard}><span>Cultos</span><strong>{data.cults.length}</strong><small>definiciones registradas</small></article>
        <article className={styles.metricCard}><span>Patrimonio</span><strong>{data.assets.length}</strong><small>piezas con ficha propia</small></article>
        <article className={styles.metricCard}><span>Multimedia</span><strong>{data.media.length}</strong><small>recursos vinculados</small></article>
      </section>

      <section className={styles.editorSection} id="general">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Identidad</span><h2>Información general</h2></div><p>Solo los datos estructurales que definen y encabezan la ficha pública.</p></div>
        <form action={updateBrotherhoodAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="brotherhood_id" value={data.entity.id} />
          <div className={styles.formGrid}>
            <label><span>Nombre popular</span><input name="popular_name" defaultValue={data.brotherhood?.popular_name || ''} required /></label>
            <label><span>Nombre corto de entidad</span><input name="name" defaultValue={data.entity.name} required /></label>
            <label className={styles.fieldWide}><span>Nombre oficial</span><input name="official_name" defaultValue={data.brotherhood?.official_name || ''} required /></label>
            <label><span>Slug público</span><input name="slug" defaultValue={data.entity.slug || ''} required /></label>
            <label><span>Estado editorial</span><StatusSelect defaultValue={data.entity.status} /></label>
            <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" defaultValue={data.entity.summary || ''} rows="4" /></label>
            <label><span>Fundación</span><input name="foundation_text" defaultValue={data.brotherhood?.foundation_text || ''} /></label>
            <label><span>Día de salida</span><input name="current_procession_day" defaultValue={data.brotherhood?.current_procession_day || ''} /></label>
            <BrotherhoodGeographyFields municipalities={geography.municipalities} places={geography.places} selectedMunicipalityId={selectedMunicipalityId} selectedPlaceId={selectedPlaceId} />
            <label><span>Barrio</span><input name="neighborhood" defaultValue={data.brotherhood?.neighborhood || ''} /></label>
            <BrotherhoodTypeSelector selected={data.brotherhood?.brotherhood_types || []} />
            <label className={styles.fieldWide}><span>Ruta o URL del escudo</span><input name="crest_path" defaultValue={data.brotherhood?.crest_path || ''} /></label>
            <label className={styles.fieldWide}><span>Notas documentales</span><textarea name="notes" defaultValue={data.brotherhood?.notes || ''} rows="4" /></label>
          </div>
          <fieldset className={styles.colorFieldset}>
            <legend>Colores identitarios</legend>
            {colorRows.map((color, index) => (
              <div className={styles.colorRow} key={color.id || `new-${index}`}>
                <input type="hidden" name="color_id" value={color.id || ''} />
                <label><span>Nombre</span><input name="color_name" defaultValue={color.color_name || ''} placeholder="Azul" /></label>
                <label><span>Hexadecimal</span><div className={styles.colorInput}><i style={{ backgroundColor: color.hex_value || '#edf1f5' }} aria-hidden="true" /><input name="color_hex" defaultValue={color.hex_value || ''} placeholder="#123A67" /></div></label>
                <label><span>Uso</span><select name="color_role" defaultValue={color.color_role || 'identity'}><option value="primary">Principal</option><option value="secondary">Secundario</option><option value="accent">Acento</option><option value="identity">Identidad</option></select></label>
              </div>
            ))}
          </fieldset>
          <SaveBar canEdit={canEdit} />
        </form>

        <BrotherhoodGeographyInlineTools brotherhoodId={data.entity.id} canEdit={canEdit} municipalities={geography.municipalities} places={geography.places} selectedMunicipalityId={selectedMunicipalityId} selectedPlaceId={selectedPlaceId} createMunicipalityAction={createMunicipalityAction} createPlaceAction={createPlaceAction} updatePlaceAction={updatePlaceAction} />
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Cobertura editorial</span><h2>Completar la ficha</h2></div><p>Los contenidos extensos viven ya en módulos propios del workspace.</p></div>
        <div className={styles.panelCard}><div className={styles.moduleList}>
          <ModuleRow href={`/panel/hermandades/${id}/canales`} label="Canales oficiales" count={data.socialLinks.length} note="Web y redes sociales" />
          <ModuleRow href={`/panel/hermandades/${id}/cultos`} label="Cultos" count={data.cults.length} note="Calendario litúrgico y recurrencias" />
          <ModuleRow href={`/panel/hermandades/${id}/salidas/recurrentes`} label="Series anuales" count={data.series.length} note="Rosarios, traslados y salidas recurrentes" />
          <ModuleRow href={`/panel/hermandades/${id}/patrimonio`} label="Patrimonio" count={data.assets.length + data.heritage.length} note="Piezas, estrenos y restauraciones" />
          <ModuleRow href={`/panel/multimedia?entity=${id}`} label="Multimedia" count={data.media.length} note="Archivo visual transversal" />
        </div></div>
      </section>
    </div>
  )
}
