import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import {
  addImageStepRelationAction,
  archiveImageStepRelationAction,
  updateImageStepRelationAction,
} from '@/app/panel/(protected)/relaciones/imagen-paso/actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Retirada',
}

const RELATION_LABELS = {
  processes_on: 'Procesiona en',
  formerly_processed_on: 'Procesionó en',
  displayed_on: 'Se dispone en',
}

function relationLabel(value) {
  return RELATION_LABELS[value] || value.replaceAll('_', ' ')
}

function periodLabel(item) {
  const from = item.date_from_text || item.date_from || 'Inicio no documentado'
  const to = item.date_to_text || item.date_to || 'Actualidad'
  return `${from} → ${to}`
}

export default function ImageStepRelationsEditor({ data, canEdit }) {
  return (
    <>
      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Relaciones existentes</span>
            <h2>Imagen ↔ Paso</h2>
          </div>
          <p>Una relación puede cerrarse históricamente sin borrar la Imagen ni el Paso.</p>
        </div>

        {data.relations.length ? (
          <div className={styles.editorStack}>
            {data.relations.map((relation) => {
              const archived = relation.status === 'archived'
              const imageName = relation.image?.name || 'Imagen no disponible'
              const stepName = relation.step?.name || 'Paso no disponible'
              return (
                <article className={styles.editorItem} key={relation.id}>
                  <div className={styles.itemHeading}>
                    <div>
                      <span className={styles.eyebrow}>{relationLabel(relation.relation_type)}</span>
                      <h3>{imageName} → {stepName}</h3>
                      <p style={{ margin: '6px 0 0', color: '#68788a', fontSize: 12 }}>
                        {periodLabel(relation)}
                      </p>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[relation.status] || styles.archived}`}>
                      {STATUS_LABELS[relation.status] || relation.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {relation.image ? (
                      <Link className={styles.rowLink} href={`/panel/imagenes/${relation.image.id}`}>
                        Abrir Imagen <span>→</span>
                      </Link>
                    ) : null}
                    {relation.step ? (
                      <Link className={styles.rowLink} href={`/panel/pasos/${relation.step.id}`}>
                        Abrir Paso <span>→</span>
                      </Link>
                    ) : null}
                  </div>

                  {!archived ? (
                    <form action={updateImageStepRelationAction} className={styles.editorForm}>
                      <input type="hidden" name="relation_id" value={relation.id} />
                      <div className={styles.formGrid}>
                        <label className={styles.fieldWide}>
                          <span>Tipo de relación</span>
                          <input
                            name="relation_type"
                            defaultValue={relation.relation_type}
                            list="image-step-relation-types"
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
                        <small>Una fecha final conserva la relación como histórico.</small>
                        {canEdit ? <button className={styles.primaryButton} type="submit">Guardar relación</button> : null}
                      </div>
                    </form>
                  ) : null}

                  {!archived && canEdit ? (
                    <form action={archiveImageStepRelationAction} className={styles.archiveForm}>
                      <input type="hidden" name="relation_id" value={relation.id} />
                      <button type="submit">Retirar relación sin borrar entidades</button>
                    </form>
                  ) : null}

                  <RelationSourcesEditor
                    relationKind="image_step"
                    relationId={relation.id}
                    contextEntityId={relation.image_entity_id}
                    sourceOptions={data.sourceOptions}
                    links={relation.sourceLinks || []}
                    returnPath="/panel/relaciones/imagen-paso"
                    canEdit={canEdit}
                  />
                </article>
              )
            })}
          </div>
        ) : (
          <div className={styles.emptyPanel}>Todavía no hay relaciones Imagen ↔ Paso.</div>
        )}
      </section>

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>Entidades existentes</span>
              <h2>Crear relación</h2>
            </div>
            <p>No se crea ninguna Imagen ni Paso desde este formulario.</p>
          </div>

          <form action={addImageStepRelationAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <div className={styles.formGrid}>
              <EntityPicker
                className={styles.fieldWide}
                name="image_entity_id"
                items={data.images}
                label="Buscar Imagen"
                placeholder="Nombre o tipo de Imagen…"
                emptyLabel="Selecciona una Imagen existente"
              />
              <EntityPicker
                className={styles.fieldWide}
                name="step_entity_id"
                items={data.steps}
                label="Buscar Paso"
                placeholder="Nombre o tipo de Paso…"
                emptyLabel="Selecciona un Paso existente"
              />
              <label className={styles.fieldWide}>
                <span>Tipo de relación</span>
                <input
                  name="relation_type"
                  defaultValue="processes_on"
                  list="image-step-relation-types"
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
              <small>La relación quedará en borrador si alguno de sus extremos todavía no está publicado.</small>
              <button className={styles.primaryButton} type="submit">Relacionar Imagen y Paso</button>
            </div>
          </form>
        </section>
      ) : null}

      <datalist id="image-step-relation-types">
        <option value="processes_on">Procesiona en</option>
        <option value="formerly_processed_on">Procesionó en</option>
        <option value="displayed_on">Se dispone en</option>
      </datalist>
    </>
  )
}
