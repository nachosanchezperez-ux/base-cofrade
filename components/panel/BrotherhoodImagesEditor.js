'use client'

import { useMemo, useState } from 'react'
import {
  addBrotherhoodImageRelationAction,
  archiveBrotherhoodImageRelationAction,
  updateBrotherhoodImageRelationAction,
} from '@/app/panel/(protected)/hermandades/[id]/titulares/actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = {
  published: 'Publicada',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Retirada',
}

function normalized(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function relationLabel(value = '') {
  return value.replaceAll('_', ' ')
}

function dateLabel(value, textValue) {
  if (value) {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${value}T00:00:00Z`))
  }
  return textValue || ''
}

function RelationTypeField({ defaultValue = 'titular' }) {
  return (
    <label>
      <span>Tipo de relación</span>
      <input
        name="relation_type"
        list="brotherhood-image-relation-types"
        defaultValue={defaultValue}
        placeholder="titular"
        required
      />
    </label>
  )
}

function RelationDates({ relation = null }) {
  return (
    <>
      <label>
        <span>Fecha inicial</span>
        <input name="date_from" type="date" defaultValue={relation?.date_from || ''} />
      </label>
      <label>
        <span>Fecha final</span>
        <input name="date_to" type="date" defaultValue={relation?.date_to || ''} />
      </label>
    </>
  )
}

export default function BrotherhoodImagesEditor({ data, canEdit }) {
  const [query, setQuery] = useState('')
  const filteredCandidates = useMemo(() => {
    const term = normalized(query).trim()
    if (!term) return data.candidates
    return data.candidates.filter((image) => normalized([
      image.name,
      image.imageType,
      image.slug,
      STATUS_LABELS[image.status],
    ].join(' ')).includes(term))
  }, [data.candidates, query])

  return (
    <>
      <datalist id="brotherhood-image-relation-types">
        <option value="titular" />
        <option value="cotitular" />
        <option value="imagen_venerada" />
        <option value="vinculada" />
      </datalist>

      <section className={`${styles.panelCard} ${styles.editorForm}`}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Buscar antes de crear</span>
            <h2>Añadir imagen/titular</h2>
          </div>
          <p>La Imagen conserva su ficha independiente; aquí solo se crea la relación con la Hermandad.</p>
        </div>

        {canEdit ? (
          <form action={addBrotherhoodImageRelationAction}>
            <input type="hidden" name="brotherhood_id" value={data.entity.id} />
            <div className={styles.formGrid}>
              <label className={styles.fieldWide}>
                <span>Buscar Imagen existente</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Nombre, tipo o slug…"
                  autoComplete="off"
                />
              </label>
              <label className={styles.fieldWide}>
                <span>Imagen</span>
                <select name="image_entity_id" required defaultValue="">
                  <option value="">Selecciona una Imagen existente</option>
                  {filteredCandidates.map((image) => (
                    <option key={image.id} value={image.id}>
                      {image.name} · {image.imageType} · {STATUS_LABELS[image.status] || image.status}
                    </option>
                  ))}
                </select>
                {!filteredCandidates.length ? <small>No hay Imágenes que coincidan con la búsqueda.</small> : null}
              </label>
              <RelationTypeField />
              <RelationDates />
            </div>
            <div className={styles.formActions}>
              <small>Las fechas son opcionales. «Titular» es la relación principal.</small>
              <button className={styles.primaryButton} type="submit">Añadir imagen/titular</button>
            </div>
          </form>
        ) : (
          <p className={styles.emptyText}>Tu perfil puede consultar estas relaciones, pero no modificarlas.</p>
        )}
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Relaciones estructuradas</span>
            <h2>Imágenes vinculadas</h2>
          </div>
          <p>{data.relations.length} relaciones conservadas, incluidas las cerradas o retiradas.</p>
        </div>

        {data.relations.length ? (
          <div className={styles.editorStack}>
            {data.relations.map((relation) => {
              const imageName = relation.image?.name || 'Imagen no disponible'
              const startLabel = dateLabel(relation.date_from, relation.date_from_text)
              const endLabel = dateLabel(relation.date_to, relation.date_to_text)
              const isArchived = relation.status === 'archived'

              return (
                <article className={styles.editorItem} key={relation.id}>
                  <div className={styles.itemHeading}>
                    <div>
                      <span className={styles.eyebrow}>{relationLabel(relation.relation_type)}</span>
                      <h3>{imageName}</h3>
                      <p>
                        {startLabel || endLabel
                          ? [startLabel ? `Desde ${startLabel}` : 'Inicio no documentado', endLabel ? `hasta ${endLabel}` : 'vigente'].join(' · ')
                          : 'Periodo no documentado'}
                      </p>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[relation.status]}`}>
                      {STATUS_LABELS[relation.status] || relation.status}
                    </span>
                  </div>

                  {!isArchived && canEdit ? (
                    <>
                      <form action={updateBrotherhoodImageRelationAction} className={styles.editorForm}>
                        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
                        <input type="hidden" name="relation_id" value={relation.id} />
                        <div className={styles.formGrid}>
                          <RelationTypeField defaultValue={relation.relation_type} />
                          <RelationDates relation={relation} />
                        </div>
                        {(relation.date_from_text || relation.date_to_text) ? (
                          <p className={styles.emptyText}>
                            Referencia textual conservada: {[relation.date_from_text, relation.date_to_text].filter(Boolean).join(' — ')}
                          </p>
                        ) : null}
                        <div className={styles.formActions}>
                          <small>Indicar una fecha final cierra el periodo sin borrar la relación.</small>
                          <button className={styles.primaryButton} type="submit">Guardar / cerrar relación</button>
                        </div>
                      </form>

                      <form
                        action={archiveBrotherhoodImageRelationAction}
                        className={styles.archiveForm}
                        onSubmit={(event) => {
                          if (!window.confirm(`¿Retirar la relación con ${imageName}? La Imagen no se borrará.`)) {
                            event.preventDefault()
                          }
                        }}
                      >
                        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
                        <input type="hidden" name="relation_id" value={relation.id} />
                        <button type="submit">Retirar relación sin borrar la Imagen</button>
                      </form>
                    </>
                  ) : null}
                </article>
              )
            })}
          </div>
        ) : (
          <div className={styles.emptyPanel}>Todavía no hay Imágenes relacionadas con esta Hermandad.</div>
        )}
      </section>
    </>
  )
}
