import Link from 'next/link'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getDocumentableRelationsData } from '@/lib/panel/documentable-relations'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Documentación de relaciones · Panel' }

export default async function DocumentableRelationsPage() {
  const [user, data] = await Promise.all([requirePanelUser(), getDocumentableRelationsData()])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const returnPath = '/panel/relaciones/documentacion'

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Procedencia documental</span>
          <h1>Fuentes de relaciones avanzadas</h1>
          <p>Documenta relaciones existentes sin crear tablas de Fuentes paralelas.</p>
        </div>
        <Link className={styles.secondaryButton} href="/panel/relaciones">Volver a Relaciones</Link>
      </header>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Música</span><h2>Periodos de acompañamiento</h2></div>
          <p>Este módulo solo documenta periodos ya existentes; no amplía todavía la carga de música histórica.</p>
        </div>
        <div style={{ display: 'grid', gap: 16 }}>
          {data.musicPeriods.length ? data.musicPeriods.map((period) => (
            <article className={styles.panelCard} key={period.id}>
              <span className={styles.eyebrow}>{period.position}</span>
              <h3>{period.brotherhood.name} → {period.band.name}</h3>
              <p className={styles.emptyText}>
                {[period.step?.name, period.outing_type, period.date_from_text || period.year_from, period.date_to_text || period.year_to].filter(Boolean).join(' · ') || 'Periodo sin detalle adicional'}
              </p>
              <RelationSourcesEditor
                relationKind="music_accompaniment_period"
                relationId={period.id}
                contextEntityId={period.brotherhood_entity_id}
                sourceOptions={data.sourceOptions}
                links={period.sourceLinks}
                returnPath={returnPath}
                canEdit={canEdit}
              />
            </article>
          )) : <p className={styles.emptyText}>No hay periodos de acompañamiento activos que documentar.</p>}
        </div>
      </section>
    </div>
  )
}
