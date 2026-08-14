import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { ENTITY_TYPE_LABELS, STATUS_LABELS, getPanelSourcesData } from '@/lib/panel/sources'
import {
  createSourceAction,
  linkExistingSourceAction,
  unlinkSourceAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Fuentes · Panel' }

const SAVED_MESSAGES = {
  created: 'La Fuente se ha creado correctamente.',
  'created-linked': 'La Fuente se ha creado y vinculado correctamente.',
  linked: 'La Fuente existente se ha vinculado correctamente.',
  'reused-linked': 'Ya existía una Fuente con esa URL; se ha reutilizado y vinculado sin crear un duplicado.',
  'duplicate-url': 'Ya existe una Fuente con esa URL. Puedes reutilizarla desde el selector.',
  'already-linked': 'Esa Fuente ya estaba vinculada a la entidad seleccionada; no se ha creado un duplicado.',
  unlinked: 'El vínculo se ha retirado. La Fuente continúa existiendo de forma independiente.',
}

export default async function PanelSourcesPage({ searchParams }) {
  const [query, user, data] = await Promise.all([
    searchParams,
    requirePanelUser(),
    getPanelSourcesData(),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Documentación</span>
          <h1>Fuentes</h1>
          <p>Crea y reutiliza Fuentes, y vincúlalas directamente a Hermandades, Imágenes, Pasos o Agentes.</p>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil puede consultar las Fuentes y sus vínculos, pero no modificarlos.</div> : null}

      <datalist id="source-types">
        <option value="website" />
        <option value="official_website" />
        <option value="article" />
        <option value="book" />
        <option value="archive" />
        <option value="newspaper" />
      </datalist>

      <section className={`${styles.panelCard} ${styles.editorForm}`}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Nueva Fuente</span>
            <h2>Crear Fuente</h2>
          </div>
          <p>La URL se normaliza antes de guardar. Si ya existe, se reutiliza la Fuente existente.</p>
        </div>

        {canEdit ? (
          <form action={createSourceAction}>
            <div className={styles.formGrid}>
              <label className={styles.fieldWide}>
                <span>Nombre</span>
                <input name="name" required placeholder="Ej. Web oficial de la Hermandad" />
              </label>
              <label className={styles.fieldWide}>
                <span>URL</span>
                <input name="url" type="text" inputMode="url" placeholder="https://…" />
              </label>
              <label>
                <span>Tipo de Fuente</span>
                <input name="source_type" list="source-types" defaultValue="website" required />
              </label>
              <label>
                <span>Autor / editor</span>
                <input name="author_or_publisher" placeholder="Entidad o autor" />
              </label>
              <label>
                <span>Fecha de publicación</span>
                <input name="publication_date" type="date" />
              </label>
              <label>
                <span>Fecha de consulta</span>
                <input name="accessed_at" type="date" />
              </label>
              <label className={styles.fieldWide}>
                <span>Licencia</span>
                <input name="license" placeholder="Opcional" />
              </label>
              <label className={styles.fieldWide}>
                <span>Notas</span>
                <textarea name="notes" rows={3} placeholder="Contexto documental interno, si procede." />
              </label>
              <EntityPicker
                className={styles.fieldWide}
                name="entity_id"
                items={data.entityOptions}
                label="Vincular ahora a una entidad (opcional)"
                placeholder="Buscar Hermandad, Imagen, Paso o Agente…"
                emptyLabel="Crear la Fuente sin vínculo inicial"
                required={false}
              />
            </div>
            <div className={styles.formActions}>
              <small>Una Fuente es reutilizable: no se duplica para cada entidad.</small>
              <button className={styles.primaryButton} type="submit">Crear Fuente</button>
            </div>
          </form>
        ) : null}
      </section>

      <section className={`${styles.panelCard} ${styles.editorForm}`}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Reutilizar conocimiento</span>
            <h2>Vincular Fuente existente</h2>
          </div>
          <p>Busca primero una Fuente ya registrada y relaciónala con una entidad existente, también si está en borrador.</p>
        </div>

        {canEdit ? (
          data.sources.length ? (
            <form action={linkExistingSourceAction}>
              <div className={styles.formGrid}>
                <EntityPicker
                  className={styles.fieldWide}
                  name="source_id"
                  items={data.sourceOptions}
                  label="Fuente existente"
                  placeholder="Buscar por nombre, tipo o URL…"
                  emptyLabel="Selecciona una Fuente"
                />
                <EntityPicker
                  className={styles.fieldWide}
                  name="entity_id"
                  items={data.entityOptions}
                  label="Entidad"
                  placeholder="Buscar Hermandad, Imagen, Paso o Agente…"
                  emptyLabel="Selecciona una entidad"
                />
              </div>
              <div className={styles.formActions}>
                <small>El vínculo es directo con la entidad; no se extiende a autorías, relaciones o intervenciones.</small>
                <button className={styles.primaryButton} type="submit">Vincular Fuente</button>
              </div>
            </form>
          ) : <p className={styles.emptyText}>Todavía no hay Fuentes registradas. Crea la primera arriba.</p>
        ) : null}
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Relaciones documentales</span>
            <h2>Fuentes vinculadas</h2>
          </div>
          <p>{data.links.length} vínculo{data.links.length === 1 ? '' : 's'} directo{data.links.length === 1 ? '' : 's'} con entidades del núcleo.</p>
        </div>

        {data.links.length ? (
          <div className={styles.editorStack}>
            {data.links.map((link) => (
              <article className={styles.editorItem} key={link.id}>
                <div className={styles.itemHeading}>
                  <div>
                    <span className={styles.eyebrow}>{link.source.source_type}</span>
                    <h3>{link.source.name}</h3>
                    <p>
                      {ENTITY_TYPE_LABELS[link.entity.entity_type]}: <strong>{link.entity.name}</strong>
                      {' · '}{STATUS_LABELS[link.entity.status] || link.entity.status}
                    </p>
                    {link.source.url ? (
                      <p><a href={link.source.url} target="_blank" rel="noreferrer">{link.source.url}</a></p>
                    ) : null}
                  </div>
                  <span className={`${styles.statusBadge} ${styles[link.entity.status]}`}>
                    {STATUS_LABELS[link.entity.status] || link.entity.status}
                  </span>
                </div>

                {canEdit ? (
                  <form action={unlinkSourceAction} className={styles.archiveForm}>
                    <input type="hidden" name="link_id" value={link.id} />
                    <button type="submit">Retirar vínculo sin borrar la Fuente</button>
                  </form>
                ) : null}
              </article>
            ))}
          </div>
        ) : <div className={styles.emptyPanel}>Todavía no hay Fuentes vinculadas a Hermandades, Imágenes, Pasos o Agentes.</div>}
      </section>
    </div>
  )
}
