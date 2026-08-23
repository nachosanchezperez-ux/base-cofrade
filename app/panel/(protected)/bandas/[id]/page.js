import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import PanelFormGroup from '@/components/panel/PanelFormGroup'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBandEditorData } from '@/lib/panel/data'
import {
  BrotherhoodSelect,
  MunicipalitySelect,
  SaveBar,
  StatusSelect,
  STATUS_LABELS,
} from '@/components/panel/band/BandEditorPrimitives'
import { updateBandAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Editar banda · Panel' }

function ModuleRow({ href, label, count, note }) {
  return (
    <div>
      <span><strong>{label}</strong>{note ? <small style={{ display: 'block', marginTop: 3 }}>{note}</small> : null}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{count !== undefined ? <b>{count}</b> : null}<Link className={styles.rowLink} href={href}>Abrir <span>→</span></Link></span>
    </div>
  )
}

export default async function BandEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])

  const savedRoutes = {
    enlaces: `/panel/bandas/${id}/canales`,
    direccion: `/panel/bandas/${id}/direccion`,
    acompanamientos: `/panel/bandas/${id}/acompanamientos`,
    'acompanamientos-historicos': `/panel/bandas/${id}/acompanamientos`,
    extraordinarias: `/panel/bandas/${id}/extraordinarias`,
    estrenos: `/panel/bandas/${id}/estrenos`,
    banderin: `/panel/bandas/${id}/patrimonio`,
  }
  if (query?.saved && savedRoutes[query.saved]) {
    redirect(`${savedRoutes[query.saved]}?saved=${encodeURIComponent(query.saved)}`)
  }

  const data = await getBandEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const displayName = data.popularName?.name || data.entity.name
  const currentPeriods = data.periods.filter((item) => item.is_current)
  const historicalPeriods = data.periods.filter((item) => !item.is_current)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/bandas">Bandas</Link><span>→</span><strong>{displayName}</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Resumen de ficha</span><h1>{displayName}</h1><p>{data.officialName?.name}</p></div>
          <div className={styles.editorHeaderActions}>
            <span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>
            {data.entity.slug ? <Link className={styles.secondaryButton} href={`/bandas/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
          </div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando la ficha como colaborador. Un editor debe realizar los cambios.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura de la ficha">
        <article className={styles.metricCard}><span>Dirección</span><strong>{data.direction.filter((item) => item.is_current).length}</strong><small>responsabilidades actuales</small></article>
        <article className={styles.metricCard}><span>Acompañamientos</span><strong>{currentPeriods.length}</strong><small>{historicalPeriods.length} históricos</small></article>
        <article className={styles.metricCard}><span>Estrenos</span><strong>{data.premieres.length}</strong><small>marchas documentadas</small></article>
        <article className={styles.metricCard}><span>Extraordinarias</span><strong>{data.outings.length}</strong><small>salidas vinculadas</small></article>
      </section>

      <section className={styles.editorSection} id="general">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Identidad</span><h2>Información general</h2></div><p>Datos estructurales, identidad visual, sede y trayectoria básica de la formación.</p></div>
        <form action={updateBandAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="band_id" value={data.entity.id} />
          <input type="hidden" name="official_name_id" value={data.officialName?.id || ''} />
          <input type="hidden" name="popular_name_id" value={data.popularName?.id || ''} />

          <PanelFormGroup
            eyebrow="Identidad pública"
            title="Nombre y publicación"
            description="Cómo se identifica y clasifica la formación en directorios, búsquedas y ficha pública."
          >
            <label><span>Nombre popular</span><input name="popular_name" defaultValue={displayName} required /></label>
            <label><span>Nombre corto oficial</span><input name="official_short_name" defaultValue={data.officialName?.short_name || ''} /></label>
            <label className={styles.fieldWide}><span>Nombre oficial</span><input name="official_name" defaultValue={data.officialName?.name || ''} required /></label>
            <label><span>Slug público</span><input name="slug" defaultValue={data.entity.slug || ''} required /></label>
            <label><span>Estado editorial</span><StatusSelect defaultValue={data.entity.status} /></label>
            <label><span>Tipo de formación</span><select name="band_type" defaultValue={data.band?.band_type || 'Cornetas y Tambores'}><option value="Cornetas y Tambores">Cornetas y Tambores</option><option value="Agrupación Musical">Agrupación Musical</option><option value="Banda de Música">Banda de Música</option><option value="Capilla Musical">Capilla Musical</option><option value="Otra">Otra</option></select></label>
            <label><span>Fundación</span><input name="foundation_text" defaultValue={data.band?.foundation_text || ''} /></label>
            <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" defaultValue={data.entity.summary || ''} rows="3" /></label>
          </PanelFormGroup>

          <PanelFormGroup
            eyebrow="Territorio y vínculos"
            title="Localidad, sede y Hermandad"
            description="Ubicación operativa de la Banda y relación institucional cuando existe una Hermandad propia."
          >
            <label><span>Localidad</span><MunicipalitySelect municipalities={data.municipalities} defaultValue={data.band?.municipality_id} /></label>
            <label className={styles.fieldWide}><span>Hermandad vinculada</span><BrotherhoodSelect name="linked_brotherhood_entity_id" brotherhoods={data.brotherhoods} defaultValue={data.linkedBrotherhoodRelation?.target_entity_id} required={false} /></label>
            <label className={styles.fieldWide}><span>Sede o local de ensayo</span><input name="headquarters_text" defaultValue={data.band?.headquarters_text || ''} /></label>
          </PanelFormGroup>

          <PanelFormGroup
            eyebrow="Identidad visual"
            title="Colores, logotipo y fotografía"
            description="Recursos maestros que alimentan la cabecera, tarjetas y archivo visual de la Banda."
          >
            <label><span>Color principal</span><input name="primary_color" defaultValue={data.band?.primary_color || ''} placeholder="#63358B" /></label>
            <label><span>Color secundario</span><input name="secondary_color" defaultValue={data.band?.secondary_color || ''} placeholder="#29272C" /></label>
            <label className={styles.fieldWide}><span>Ruta pública del logotipo</span><input name="logo_path" defaultValue={data.band?.logo_path || ''} /></label>
            <label className={styles.fieldWide}><span>Ruta pública de la fotografía principal</span><input name="hero_image_path" defaultValue={data.band?.hero_image_path || ''} /></label>
            <label className={styles.fieldWide}><span>Descripción accesible de la fotografía</span><input name="hero_image_alt" defaultValue={data.band?.hero_image_alt || ''} /></label>
            <label className={styles.fieldWide}><span>Crédito de la fotografía</span><input name="hero_image_credit" defaultValue={data.band?.hero_image_credit || ''} /></label>
          </PanelFormGroup>

          <PanelFormGroup
            eyebrow="Trayectoria"
            title="Historia breve"
            description="Síntesis pública de la formación; la cronología detallada puede crecer después en módulos propios."
          >
            <label className={styles.fieldWide}><span>Historia breve</span><textarea name="description" defaultValue={data.band?.description || ''} rows="6" /></label>
          </PanelFormGroup>

          <SaveBar label="Guardar información general" canEdit={canEdit} />
        </form>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Cobertura editorial</span><h2>Completar la ficha</h2></div><p>Los contenidos especializados viven ya en módulos propios del workspace.</p></div>
        <div className={styles.panelCard}>
          <div className={styles.moduleList}>
            <ModuleRow href={`/panel/bandas/${id}/direccion`} label="Dirección" count={data.direction.length} note="Responsables actuales e históricos" />
            <ModuleRow href={`/panel/bandas/${id}/acompanamientos`} label="Acompañamientos" count={data.periods.length} note="Contratos, Pasos, jornadas y vigencias" />
            <ModuleRow href={`/panel/bandas/${id}/extraordinarias`} label="Extraordinarias" count={data.outings.length} note="Agenda y participaciones especiales" />
            <ModuleRow href={`/panel/bandas/${id}/estrenos`} label="Estrenos" count={data.premieres.length} note="Marchas, autoría, vídeos y fuentes" />
            <ModuleRow href={`/panel/bandas/${id}/patrimonio`} label="Patrimonio" count={data.assets.length} note="Banderín, realización y restauraciones" />
            <ModuleRow href={`/panel/bandas/${id}/discografia`} label="Discografía" note="Discos, pistas y plataformas" />
            <ModuleRow href={`/panel/bandas/${id}/canales`} label="Canales" count={data.socialLinks.length} note="Web, redes y Spotify" />
            <ModuleRow href={`/panel/bandas/${id}/multimedia`} label="Multimedia" note="Logos, portadas y archivo visual" />
          </div>
        </div>
      </section>
    </div>
  )
}
