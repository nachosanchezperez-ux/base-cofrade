import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import {
  addImageAuthorshipAction,
  archiveImageAuthorshipAction,
  updateImageAuthorshipAction,
} from '@/app/panel/(protected)/imagenes/[id]/autorias/actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Retirada',
}

const AUTHORSHIP_LABELS = {
  author: 'Autoría documentada',
  attributed_to: 'Atribuida a',
  workshop_of: 'Taller de',
  circle_of: 'Círculo de',
  school_of: 'Escuela de',
}

const CERTAINTY_LABELS = {
  documented: 'Documentada',
  attributed: 'Atribuida',
  traditional: 'Tradicional',
  unknown: 'Pendiente',
}

function periodLabel(item) {
  const from = item.date_from_text || item.date_from || 'Fecha no documentada'
  const to = item.date_to_text || item.date_to
  return to ? `${from} → ${to}` : from
}

function AuthorshipFields({ relation }) {
  return (
    <div className={styles.formGrid}>
      <label>
        <span>Tipo</span>
        <select name="authorship_type" defaultValue={relation?.authorship_type || 'author'} required>
          <option value="author">Autoría documentada</option>
          <option value="attributed_to">Atribuida a</option>
          <option value="workshop_of">Taller de</option>
          <option value="circle_of">Círculo de</option>
          <option value="school_of">Escuela de</option>
        </select>
      </label>
      <label>
        <span>Grado de certeza</span>
        <select name="certainty" defaultValue={relation?.certainty || 'documented'} required>
          <option value="documented">Documentada</option>
          <option value="attributed">Atribuida</option>
          <option value="traditional">Tradicional</option>
          <option value="unknown">Pendiente</option>
        </select>
      </label>
      <label className={styles.fieldWide}>
        <span>Rol</span>
        <input name="role_name" defaultValue={relation?.role_name || 'autor'} required />
      </label>
      <label>
        <span>Fecha inicial</span>
        <input name="date_from" type="date" defaultValue={relation?.date_from || ''} />
      </label>
      <label>
        <span>Fecha final</span>
        <input name="date_to" type="date" defaultValue={relation?.date_to || ''} />
      </label>
    </div>
  )
}

export default function ImageAuthorshipEditor({ data, canEdit }) {
  return (
    <>
      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Relaciones existentes</span>
            <h2>Autoría y atribuciones</h2>
          </div>
          <p>La atribución se conserva como tal y nunca se convierte automáticamente en autoría documentada.</p>
        </div>

        {data.relations.length ? (
          <div className={styles.editorStack}>
            {data.relations.map((relation) => {
              const archived = relation.status === 'archived'
              const agentName = relation.agent?.name || 'Agente no disponible'
              return (
                <article className={styles.editorItem} key={relation.id}>
                  <div className={styles.itemHeading}>
                    <div>
                      <span className={styles.eyebrow}>
                        {AUTHORSHIP_LABELS[relation.authorship_type] || relation.authorship_type}
                      </span>
                      <h3>{agentName}</h3>
                      <p style={{ margin: '6px 0 0', color: '#68788a', fontSize: 12 }}>
                        {relation.role_name} · {CERTAINTY_LABELS[relation.certainty] || relation.certainty} · {periodLabel(relation)}
                      </p>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[relation.status] || styles.archived}`}>
                      {STATUS_LABELS[relation.status] || relation.status}
                    </span>
                  </div>

                  {relation.agent ? (
                    <Link className={styles.rowLink} href={`/panel/agentes/${relation.agent.id}`}>
                      Abrir Agente <span>→</span>
                    </Link>
                  ) : null}

                  {!archived ? (
                    <form action={updateImageAuthorshipAction} className={styles.editorForm}>
                      <input type="hidden" name="image_id" value={data.entity.id} />
                      <input type="hidden" name="relation_id" value={relation.id} />
                      <AuthorshipFields relation={relation} />
                      <div className={styles.formActions}>
                        <small>Para información incierta usa «Atribuida a», «Taller», «Círculo» o «Escuela».</small>
                        {canEdit ? <button className={styles.primaryButton} type="submit">Guardar autoría</button> : null}
                      </div>
                    </form>
                  ) : null}

                  {!archived && canEdit ? (
                    <form action={archiveImageAuthorshipAction} className={styles.archiveForm}>
                      <input type="hidden" name="image_id" value={data.entity.id} />
                      <input type="hidden" name="relation_id" value={relation.id} />
                      <button type="submit">Retirar autoría sin borrar entidades</button>
                    </form>
                  ) : null}

                  <RelationSourcesEditor
                    relationKind="image_authorship"
                    relationId={relation.id}
                    contextEntityId={data.entity.id}
                    sourceOptions={data.sourceOptions}
                    links={relation.sourceLinks || []}
                    returnPath={`/panel/imagenes/${data.entity.id}/autorias`}
                    canEdit={canEdit}
                  />
                </article>
              )
            })}
          </div>
        ) : (
          <div className={styles.emptyPanel}>Esta Imagen todavía no tiene autorías ni atribuciones relacionadas.</div>
        )}
      </section>

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>Buscar antes de crear</span>
              <h2>Vincular Agente existente</h2>
            </div>
            <p>El Agente debe existir previamente en el Panel.</p>
          </div>

          <form action={addImageAuthorshipAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <input type="hidden" name="image_id" value={data.entity.id} />
            <div className={styles.formGrid}>
              <EntityPicker
                className={styles.fieldWide}
                name="agent_entity_id"
                items={data.candidates}
                label="Buscar Agente"
                placeholder="Persona, taller, empresa o institución…"
                emptyLabel="Selecciona un Agente existente"
              />
            </div>
            <AuthorshipFields />
            <div className={styles.formActions}>
              <small>«Autoría documentada» exige certeza documentada; las atribuciones conservan su categoría propia.</small>
              <button className={styles.primaryButton} type="submit">Añadir autoría</button>
            </div>
          </form>
        </section>
      ) : null}
    </>
  )
}
