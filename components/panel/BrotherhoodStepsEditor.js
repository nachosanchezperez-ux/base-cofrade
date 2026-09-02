import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import BrotherhoodInlineMedia from '@/components/panel/BrotherhoodInlineMedia'
import {
  addBrotherhoodStepRelationAction,
  archiveBrotherhoodStepRelationAction,
  updateBrotherhoodStepRelationAction,
} from '@/app/panel/(protected)/hermandades/[id]/pasos/actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Retirada',
}

const RELATION_LABELS = {
  processional_step: 'Paso procesional',
  former_processional_step: 'Antiguo paso procesional',
  occasional_step: 'Paso ocasional',
}

function relationLabel(value) {
  return RELATION_LABELS[value] || value.replaceAll('_', ' ')
}

function periodLabel(item) {
  const from = item.date_from_text || item.date_from || 'Inicio no documentado'
  const to = item.date_to_text || item.date_to || 'Actualidad'
  return `${from} → ${to}`
}

export default function BrotherhoodStepsEditor({ data, canEdit }) {
  return (
    <>
      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Relaciones existentes</span>
            <h2>Pasos de la Hermandad</h2>
          </div>
          <p>La temporalidad pertenece a la relación y no modifica la identidad del Paso.</p>
        </div>

        {data.relations.length ? (
          <div className={styles.editorStack}>
            {data.relations.map((relation) => {
              const stepName = relation.step?.name || 'Paso no disponible'
              const archived = relation.status === 'archived'
              return (
                <article className={styles.editorItem} key={relation.id}>
                  <div className={styles.itemHeading}>
                    <div>
                      <span className={styles.eyebrow}>{relationLabel(relation.relation_type)}</span>
                      <h3>{stepName}</h3>
                      <p style={{ margin: '6px 0 0', color: '#68788a', fontSize: 12 }}>
                        {periodLabel(relation)}
                      </p>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[relation.status] || styles.archived}`}>
                      {STATUS_LABELS[relation.status] || relation.status}
                    </span>
                  </div>

                  {relation.step ? (
                    <Link className={styles.rowLink} href={`/panel/pasos/${relation.step.id}`}>
                      Abrir Paso <span>→</span>
                    </Link>
                  ) : null}

                  {relation.step && canEdit && !archived ? (
                    <BrotherhoodInlineMedia
                      brotherhoodId={data.entity.id}
                      targetId={relation.step.id}
                      targetKind="entity"
                      title={stepName}
                      defaultAlt={stepName}
                      returnSection="pasos"
                      media={relation.step.media || []}
                    />
                  ) : null}

                  {!archived ? (
                    <form action={updateBrotherhoodStepRelationAction} className={styles.editorForm}>
                      <input type="hidden" name="brotherhood_id" value={data.entity.id} />
                      <input type="hidden" name="relation_id" value={relation.id} />
                      <div className={styles.formGrid}>
                        <label className={styles.fieldWide}>
                          <span>Tipo de relación</span>
                          <input
                            name="relation_type"
                            defaultValue={relation.relation_type}
                            list="brotherhood-step-relation-types"
                            required
                          />
                        </label>
                        <label>
                          <span>Fecha inicial</span>
                          <input name="date_from" type="date" defaultValue={relation.date_from || ''} />
                        </label>
                        <label>
                          <span>Fecha final</span>
                          <input name="date_to" type="date" defaultValue={relation.date_to || ''} />
                        </label>
                      </div>
                      <div className={styles.formActions}>
                        <small>Una fecha final cierra el periodo sin borrar ninguna entidad.</small>
                        {canEdit ? <button className={styles.primaryButton} type="submit">Guardar relación</button> : null}
                      </div>
                    </form>
                  ) : null}

                  {!archived && canEdit ? (
                    <form action={archiveBrotherhoodStepRelationAction} className={styles.archiveForm}>
                      <input type="hidden" name="brotherhood_id" value={data.entity.id} />
                      <input type="hidden" name="relation_id" value={relation.id} />
                      <button type="submit">Retirar relación sin borrar el Paso</button>
                    </form>
                  ) : null}

                  <RelationSourcesEditor
                    relationKind="brotherhood_step"
                    relationId={relation.id}
                    contextEntityId={data.entity.id}
                    sourceOptions={data.sourceOptions}
                    links={relation.sourceLinks || []}
                    returnPath={`/panel/hermandades/${data.entity.id}/pasos`}
                    canEdit={canEdit}
                  />
                </article>
              )
            })}
          </div>
        ) : (
          <div className={styles.emptyPanel}>Esta Hermandad todavía no tiene Pasos relacionados.</div>
        )}
      </section>

      {canEdit ? (
        <section className={styles.editorSection} id="anadir-paso">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>Buscar antes de crear</span>
              <h2>Añadir Paso existente</h2>
            </div>
            <p>Solo se crea la relación Hermandad ↔ Paso.</p>
          </div>

          <form action={addBrotherhoodStepRelationAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <input type="hidden" name="brotherhood_id" value={data.entity.id} />
            <div className={styles.formGrid}>
              <EntityPicker
                className={styles.fieldWide}
                name="step_entity_id"
                items={data.candidates}
                label="Buscar Paso"
                placeholder="Nombre o tipo de Paso…"
                emptyLabel="Selecciona un Paso existente"
              />
              <label className={styles.fieldWide}>
                <span>Tipo de relación</span>
                <input
                  name="relation_type"
                  defaultValue="processional_step"
                  list="brotherhood-step-relation-types"
                  required
                />
              </label>
              <label>
                <span>Fecha inicial</span>
                <input name="date_from" type="date" />
              </label>
              <label>
                <span>Fecha final</span>
                <input name="date_to" type="date" />
              </label>
            </div>
            <div className={styles.formActions}>
              <small>Las fechas son opcionales. Al añadirlo podrás cargar su fotografía aquí mismo.</small>
              <button className={styles.primaryButton} type="submit">Añadir Paso</button>
            </div>
          </form>
        </section>
      ) : null}

      <datalist id="brotherhood-step-relation-types">
        <option value="processional_step">Paso procesional</option>
        <option value="former_processional_step">Antiguo paso procesional</option>
        <option value="occasional_step">Paso ocasional</option>
      </datalist>
    </>
  )
}
