import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getSemanticRelationsData } from '@/lib/panel/semantic-relations'
import {
  archiveSemanticRelationAction,
  createAdvocationAction,
  createSemanticRelationAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Relaciones semánticas · Panel' }

function RelationForm({ title, description, relationType, sourceLabel, sourceOptions, targetLabel, targetOptions, canPublish }) {
  return (
    <section className={styles.panelCard}>
      <div className={styles.cardHeading}>
        <div><span className={styles.eyebrow}>Relación estructurada</span><h2>{title}</h2></div>
      </div>
      <p className={styles.emptyText}>{description}</p>
      <form action={createSemanticRelationAction} className={styles.editorForm} style={{ marginTop: 18 }}>
        <input type="hidden" name="relation_type" value={relationType} />
        <div className={styles.formGrid}>
          <EntityPicker name="source_entity_id" items={sourceOptions} label={sourceLabel} emptyLabel={`Selecciona ${sourceLabel.toLowerCase()}`} />
          <EntityPicker name="target_entity_id" items={targetOptions} label={targetLabel} emptyLabel={`Selecciona ${targetLabel.toLowerCase()}`} />
          <label><span>Desde</span><input name="date_from_text" placeholder="Opcional" /></label>
          <label><span>Hasta</span><input name="date_to_text" placeholder="Opcional" /></label>
          <label className={styles.fieldWide}><span>Notas</span><input name="notes" placeholder="Contexto documental opcional" /></label>
          <label><span>Estado</span><select name="status" defaultValue="draft"><option value="draft">Borrador</option>{canPublish ? <option value="published">Publicado</option> : null}</select></label>
        </div>
        <div className={styles.formActions}><small>No se duplica ninguna entidad: se crea únicamente la relación.</small><button className={styles.primaryButton} type="submit">Crear relación</button></div>
      </form>
    </section>
  )
}

export default async function SemanticRelationsPage({ searchParams }) {
  const [user, query, data] = await Promise.all([requirePanelUser(), searchParams, getSemanticRelationsData()])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const canPublish = user.role === 'admin'

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Conocimiento relacional</span>
          <h1>Titularidad, propiedad y vínculos institucionales</h1>
          <p>Separa la identidad devocional de las piezas físicas y de sus relaciones institucionales.</p>
        </div>
        <Link className={styles.secondaryButton} href="/panel/relaciones">Volver a Relaciones</Link>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Identidad devocional</span><h2>Advocaciones y titulares conceptuales</h2></div><p>Una identidad devocional puede existir sin una talla física asociada.</p></div>
        {canEdit ? (
          <form action={createAdvocationAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <div className={styles.formGrid}>
              <label className={styles.fieldWide}><span>Nombre</span><input name="name" required placeholder="Ej. Santísimo Sacramento" /></label>
              <label><span>Tipo</span><input name="advocation_type" placeholder="Sacramento, Cristo, Virgen, Santo…" /></label>
              <label><span>Slug</span><input name="slug" placeholder="Opcional" /></label>
              <label className={styles.fieldWide}><span>Descripción</span><input name="description" placeholder="Descripción breve opcional" /></label>
            </div>
            <div className={styles.formActions}><small>Se crea como borrador y puede reutilizarse en distintas relaciones.</small><button className={styles.primaryButton} type="submit">Crear identidad devocional</button></div>
          </form>
        ) : null}
        <div style={{ display: 'grid', gap: 8, marginTop: 16 }}>
          {data.advocations.map((item) => <div className={styles.panelCard} key={item.entity_id}><strong>{item.entity.name}</strong><small style={{ display: 'block' }}>{[item.advocation_type, item.entity.status].filter(Boolean).join(' · ')}</small></div>)}
        </div>
      </section>

      {canEdit ? (
        <div className={styles.dashboardGrid}>
          <RelationForm title="Hermandad → titular" description="Titularidad institucional independiente de que exista o no una Imagen física." relationType="has_titular" sourceLabel="Hermandad" sourceOptions={data.brotherhoodOptions} targetLabel="Identidad devocional" targetOptions={data.advocationOptions} canPublish={canPublish} />
          <RelationForm title="Imagen → propietario" description="Propiedad de la pieza física por una institución, sin confundirla con titularidad ni ubicación." relationType="owned_by" sourceLabel="Imagen" sourceOptions={data.imageOptions} targetLabel="Institución propietaria" targetOptions={data.institutionOptions} canPublish={canPublish} />
          <RelationForm title="Hermandad → banda institucional" description="Vínculo institucional estable, distinto de un acompañamiento procesional contratado." relationType="institutional_band" sourceLabel="Hermandad" sourceOptions={data.brotherhoodOptions} targetLabel="Banda" targetOptions={data.bandOptions} canPublish={canPublish} />
        </div>
      ) : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Relaciones registradas</span><h2>Conocimiento estructurado</h2></div><p>{data.relations.length} relaciones activas.</p></div>
        <div style={{ display: 'grid', gap: 16 }}>
          {data.relations.length ? data.relations.map((relation) => (
            <article className={styles.panelCard} key={relation.id}>
              <span className={styles.eyebrow}>{relation.relationLabel}</span>
              <h3>{relation.sourceEntity.name} → {relation.targetEntity.name}</h3>
              <p className={styles.emptyText}>{[relation.date_from_text, relation.date_to_text].filter(Boolean).join(' → ') || 'Sin temporalidad documentada'}{relation.notes ? ` · ${relation.notes}` : ''}</p>
              <small>Estado: {relation.status}</small>
              <RelationSourcesEditor relationKind="entity_relation" relationId={relation.id} contextEntityId={relation.source_entity_id} sourceOptions={data.sourceOptions} links={relation.sourceLinks} returnPath="/panel/relaciones/semanticas" canEdit={canEdit} />
              {canEdit ? <form action={archiveSemanticRelationAction} style={{ marginTop: 14 }}><input type="hidden" name="relation_id" value={relation.id} /><button type="submit">Archivar relación</button></form> : null}
            </article>
          )) : <p className={styles.emptyText}>Todavía no hay relaciones semánticas de estos tipos.</p>}
        </div>
      </section>
    </div>
  )
}
