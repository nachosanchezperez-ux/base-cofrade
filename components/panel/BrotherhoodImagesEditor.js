'use client'

import { useMemo, useState } from 'react'
import BrotherhoodInlineMedia from '@/components/panel/BrotherhoodInlineMedia'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import {
  addBrotherhoodImageRelationAction,
  archiveBrotherhoodImageRelationAction,
  updateBrotherhoodImageRelationAction,
} from '@/app/panel/(protected)/hermandades/[id]/titulares/actions'
import styles from '@/app/panel/panel.module.css'
import {
  BROTHERHOOD_IMAGE_RELATION_OPTIONS,
  isFormerTitularRelation,
  normalizeRelationType,
  relationTypeLabel,
} from '@/lib/brotherhood-image-relations'
import { plural } from '@/lib/plural'

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
  return relationTypeLabel(value)
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

// Tipo, fechas (exactas o textuales), nota y, para las antiguas imágenes titulares, la imagen que la sustituyó.
function RelationFields({ relation = null, successorOptions = [] }) {
  const initialType = normalizeRelationType(relation?.relation_type || 'titular') || 'titular'
  const [relationType, setRelationType] = useState(initialType)
  const isFormer = isFormerTitularRelation(relationType)
  const knownType = BROTHERHOOD_IMAGE_RELATION_OPTIONS.some((option) => option.value === initialType)
  const successors = successorOptions.filter((option) => option.id !== relation?.image_entity_id)

  return (
    <>
      <label>
        <span>Tipo de relación</span>
        <select name="relation_type" value={relationType} onChange={(event) => setRelationType(event.target.value)} required>
          {BROTHERHOOD_IMAGE_RELATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
          {!knownType ? <option value={initialType}>{relationTypeLabel(initialType)} (valor existente)</option> : null}
        </select>
        {isFormer ? <small>No aparecerá entre los Sagrados Titulares ni en el cortejo: se muestra en Historia como antigua imagen titular.</small> : null}
      </label>
      <label>
        <span>{isFormer ? 'Titular desde (fecha exacta)' : 'Fecha inicial'}</span>
        <input name="date_from" type="date" defaultValue={relation?.date_from || ''} />
      </label>
      <label>
        <span>{isFormer ? 'Titular hasta (fecha exacta)' : 'Fecha final'}</span>
        <input name="date_to" type="date" defaultValue={relation?.date_to || ''} />
      </label>
      <label>
        <span>Desde (año o referencia)</span>
        <input name="date_from_text" defaultValue={relation?.date_from_text || ''} placeholder="1905, h. 1926, siglo XVI…" maxLength={120} />
      </label>
      <label>
        <span>Hasta (año o referencia)</span>
        <input name="date_to_text" defaultValue={relation?.date_to_text || ''} placeholder="1945, 1936…" maxLength={120} />
      </label>
      {isFormer ? (
        <label>
          <span>La sustituyó</span>
          <select name="successor_image_id" defaultValue={relation?.successorImageId || ''}>
            <option value="">Sin documentar</option>
            {successors.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
          <small>Solo imágenes ya vinculadas a esta Hermandad.</small>
        </label>
      ) : null}
      <label className={styles.fieldWide}>
        <span>{isFormer ? 'Nota (destino, estado actual, fuente…)' : 'Nota'}</span>
        <textarea name="notes" rows={3} defaultValue={relation?.notes || ''} maxLength={1500} placeholder={isFormer ? 'Solo datos contrastados. Deja vacío lo que no conste.' : ''} />
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
  const successorOptions = useMemo(() => {
    const seen = new Set()
    return data.relations
      .filter((relation) => relation.status !== 'archived' && relation.image && !isFormerTitularRelation(relation.relation_type))
      .map((relation) => relation.image)
      .filter((image) => (seen.has(image.id) ? false : seen.add(image.id)))
  }, [data.relations])

  return (
    <>
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
              <RelationFields successorOptions={successorOptions} />
            </div>
            <div className={styles.formActions}>
              <small>Las fechas son opcionales: usa la exacta si consta o el año/referencia textual si solo se conoce aproximadamente. Al añadirla podrás cargar su fotografía aquí mismo.</small>
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
          <p>{plural(data.relations.length, 'relación conservada', 'relaciones conservadas')}, incluidas las cerradas o retiradas.</p>
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

                  {relation.image && canEdit && !isArchived ? (
                    <BrotherhoodInlineMedia
                      brotherhoodId={data.entity.id}
                      targetId={relation.image.id}
                      targetKind="entity"
                      title={imageName}
                      defaultAlt={imageName}
                      returnSection="titulares"
                    />
                  ) : null}

                  {!isArchived && canEdit ? (
                    <>
                      <form action={updateBrotherhoodImageRelationAction} className={styles.editorForm}>
                        <input type="hidden" name="brotherhood_id" value={data.entity.id} />
                        <input type="hidden" name="relation_id" value={relation.id} />
                        <div className={styles.formGrid}>
                          <RelationFields relation={relation} successorOptions={successorOptions} />
                        </div>
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

                  <RelationSourcesEditor
                    relationKind="brotherhood_image"
                    relationId={relation.id}
                    contextEntityId={data.entity.id}
                    sourceOptions={data.sourceOptions}
                    links={relation.sourceLinks || []}
                    returnPath={`/panel/hermandades/${data.entity.id}/titulares`}
                    canEdit={canEdit}
                  />
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
