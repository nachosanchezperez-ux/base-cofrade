'use client'

import EntityPicker from '@/components/panel/EntityPicker'
import {
  linkRelationSourceAction,
  unlinkRelationSourceAction,
} from '@/app/panel/(protected)/fuentes/relation-actions'
import styles from '@/app/panel/panel.module.css'

export default function RelationSourcesEditor({
  relationKind,
  relationId,
  contextEntityId,
  sourceOptions,
  links,
  returnPath,
  canEdit,
}) {
  return (
    <section style={{ borderTop: '1px solid #e5e9ee', marginTop: 18, paddingTop: 18 }}>
      <div className={styles.sectionHeading} style={{ marginBottom: 12 }}>
        <div>
          <span className={styles.eyebrow}>Documentación</span>
          <strong style={{ display: 'block', marginTop: 4 }}>Fuentes que respaldan esta relación</strong>
        </div>
        <p>{links.length} Fuente{links.length === 1 ? '' : 's'} vinculada{links.length === 1 ? '' : 's'}.</p>
      </div>

      {links.length ? (
        <div style={{ display: 'grid', gap: 8, marginBottom: canEdit ? 16 : 0 }}>
          {links.map((link) => (
            <div
              key={link.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 12px',
                border: '1px solid #e5e9ee',
                borderRadius: 10,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <strong style={{ display: 'block' }}>{link.source.name}</strong>
                <small style={{ color: '#68788a' }}>
                  {[link.source.source_type, link.source.author_or_publisher].filter(Boolean).join(' · ') || 'Fuente'}
                </small>
                {link.scope && !String(link.scope).startsWith('relation:') ? (
                  <small style={{ display: 'block', marginTop: 4 }}><strong>Aspecto:</strong> {link.scope}</small>
                ) : null}
                {link.notes ? <small style={{ display: 'block', marginTop: 4 }}>{link.notes}</small> : null}
                {link.source.url ? (
                  <div>
                    <a href={link.source.url} target="_blank" rel="noreferrer" className={styles.rowLink}>
                      Abrir fuente <span>↗</span>
                    </a>
                  </div>
                ) : null}
              </div>

              {canEdit ? (
                <form
                  action={unlinkRelationSourceAction}
                  onSubmit={(event) => {
                    if (!window.confirm(`¿Desvincular «${link.source.name}» de esta relación? La Fuente no se borrará.`)) {
                      event.preventDefault()
                    }
                  }}
                >
                  <input type="hidden" name="relation_kind" value={relationKind} />
                  <input type="hidden" name="relation_id" value={relationId} />
                  <input type="hidden" name="context_entity_id" value={contextEntityId} />
                  <input type="hidden" name="link_id" value={link.id} />
                  <input type="hidden" name="return_path" value={returnPath} />
                  <button type="submit">Desvincular</button>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyText} style={{ marginBottom: canEdit ? 16 : 0 }}>
          Esta relación todavía no tiene Fuentes vinculadas.
        </p>
      )}

      {canEdit ? (
        sourceOptions.length ? (
          <form action={linkRelationSourceAction} className={styles.editorForm}>
            <input type="hidden" name="relation_kind" value={relationKind} />
            <input type="hidden" name="relation_id" value={relationId} />
            <input type="hidden" name="context_entity_id" value={contextEntityId} />
            <input type="hidden" name="return_path" value={returnPath} />
            <div className={styles.formGrid}>
              <EntityPicker
                className={styles.fieldWide}
                name="source_id"
                items={sourceOptions}
                label="Buscar Fuente existente"
                placeholder="Nombre, tipo, autor o URL…"
                emptyLabel="Selecciona una Fuente existente"
              />
              <label>
                <span>Aspecto que respalda</span>
                <input name="source_scope" placeholder="Ej. fecha de intervención" />
              </label>
              <label className={styles.fieldWide}>
                <span>Nota documental</span>
                <input name="source_notes" placeholder="Ej. esta fuente fecha la intervención en 1983" />
              </label>
            </div>
            <div className={styles.formActions}>
              <small>Dos Fuentes pueden respaldar aspectos o fechas discrepantes sin forzar una resolución editorial.</small>
              <button className={styles.primaryButton} type="submit">Vincular Fuente</button>
            </div>
          </form>
        ) : (
          <p className={styles.emptyText}>
            No hay Fuentes disponibles. Créala primero desde el módulo Fuentes.
          </p>
        )
      ) : null}
    </section>
  )
}
