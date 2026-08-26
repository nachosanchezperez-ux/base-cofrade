import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import {
  addImageAuthorshipAction,
  archiveImageAuthorshipAction,
  updateImageAuthorshipAction,
} from '@/app/panel/(protected)/imagenes/[id]/autorias/actions'
import { addAnonymousImageAuthorshipAction } from '@/app/panel/(protected)/imagenes/[id]/autorias/anonymous-action'
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
  anonymous: 'Autor desconocido',
}

const CERTAINTY_LABELS = {
  documented: 'Documentada',
  attributed: 'Atribuida',
  traditional: 'Tradicional',
  unknown: 'Desconocida',
}

function periodLabel(item) {
  const from = item.date_from_text || item.date_from || 'Fecha no documentada'
  const to = item.date_to_text || item.date_to
  return to ? `${from} → ${to}` : from
}

function AuthorshipFields({ relation }) {
  const isAnonymous = relation?.authorship_type === 'anonymous'
  return (
    <div className={styles.formGrid}>
      <label>
        <span>Tipo</span>
        <select name="authorship_type" defaultValue={relation?.authorship_type || 'author'} required disabled={isAnonymous}>
          <option value="author">Autoría documentada</option>
          <option value="attributed_to">Atribuida a</option>
          <option value="workshop_of">Taller de</option>
          <option value="circle_of">Círculo de</option>
          <option value="school_of">Escuela de</option>
          {isAnonymous ? <option value="anonymous">Autor desconocido</option> : null}
        </select>
        {isAnonymous ? <input type="hidden" name="authorship_type" value="anonymous" /> : null}
      </label>
      <label>
        <span>Grado de certeza</span>
        <select name="certainty" defaultValue={relation?.certainty || 'documented'} required disabled={isAnonymous}>
          <option value="documented">Documentada</option>
          <option value="attributed">Atribuida</option>
          <option value="traditional">Tradicional</option>
          <option value="unknown">Desconocida</option>
        </select>
        {isAnonymous ? <input type="hidden" name="certainty" value="unknown" /> : null}
      </label>
      <label className={styles.fieldWide}>
        <span>Rol</span>
        <input name="role_name" defaultValue={relation?.role_name || 'autor'} required readOnly={isAnonymous} />
      </label>
      <label>
        <span>Fecha inicial exacta</span>
        <input name="date_from" type="date" defaultValue={relation?.date_from || ''} />
      </label>
      <label>
        <span>Fecha final exacta</span>
        <input name="date_to" type="date" defaultValue={relation?.date_to || ''} />
      </label>
      <label>
        <span>Cronología inicial (texto)</span>
        <input
          name="date_from_text"
          defaultValue={relation?.date_from_text || ''}
          placeholder="1928, hacia 1928, siglo XVIII…"
        />
      </label>
      <label>
        <span>Cronología final (texto)</span>
        <input
          name="date_to_text"
          defaultValue={relation?.date_to_text || ''}
          placeholder="Opcional: 1930, antes de 1940…"
        />
      </label>
    </div>
  )
}

export default function ImageAuthorshipEditor({ data, canEdit }) {
  const hasActiveAnonymous = data.relations.some((relation) => relation.authorship_type === 'anonymous' && relation.status !== 'archived')

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
              const anonymous = relation.authorship_type === 'anonymous'
              const agentName = anonymous ? 'Autor desconocido' : relation.agent?.name || 'Agente no disponible'
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
                  ) : anonymous ? <p className={styles.emptyText}>No se crea un Agente ficticio: la ausencia de autor conocido queda documentada en la relación.</p> : null}

                  {!archived ? (
                    <form action={updateImageAuthorshipAction} className={styles.editorForm}>
                      <input type="hidden" name="image_id" value={data.entity.id} />
                      <input type="hidden" name="relation_id" value={relation.id} />
                      <AuthorshipFields relation={relation} />
                      <div className={styles.formActions}>
                        <small>Usa fecha exacta solo cuando esté documentada; para años, periodos o dataciones imprecisas usa la cronología en texto.</small>
                        {canEdit && !anonymous ? <button className={styles.primaryButton} type="submit">Guardar autoría</button> : null}
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
        <>
          <section className={styles.editorSection}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>Autor no identificado</span>
                <h2>Documentar autor desconocido</h2>
              </div>
              <p>Úsalo solo cuando una Fuente permita afirmar que la obra es anónima o que su autor no está identificado.</p>
            </div>
            <form action={addAnonymousImageAuthorshipAction} className={`${styles.panelCard} ${styles.editorForm}`}>
              <input type="hidden" name="image_id" value={data.entity.id} />
              <div className={styles.formActions}>
                <small>No crea una Persona llamada «Anónimo». Registra la ausencia de autor conocido como un dato estructurado y luego permite vincular su Fuente.</small>
                <button className={styles.secondaryButton} type="submit" disabled={hasActiveAnonymous}>
                  {hasActiveAnonymous ? 'Autor desconocido ya documentado' : 'Registrar autor desconocido'}
                </button>
              </div>
            </form>
          </section>

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
                <small>«Autoría documentada» exige certeza documentada. Usa cronología textual para años o periodos sin fabricar una fecha exacta.</small>
                <button className={styles.primaryButton} type="submit">Añadir autoría</button>
              </div>
            </form>
          </section>
        </>
      ) : null}
    </>
  )
}
