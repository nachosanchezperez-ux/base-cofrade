import Link from 'next/link'
import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { getTitularRelationsData } from '@/lib/panel/titular-relations'
import {
  addTitularRelationAction,
  archiveTitularRelationAction,
  createAdvocationAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Titularidad conceptual · Panel' }

export default async function TitularRelationsPage({ searchParams }) {
  const [user, query, data] = await Promise.all([
    requirePanelUser(),
    searchParams,
    getTitularRelationsData(),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Titularidad institucional</span>
          <h1>Identidades devocionales y titulares</h1>
          <p>La titularidad se expresa como Hermandad → has_titular → identidad devocional, sin exigir una Imagen física.</p>
        </div>
        <Link className={styles.secondaryButton} href="/panel/relaciones">Volver a Relaciones</Link>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Identidad devocional</span><h2>Crear identidad</h2></div>
          <p>Se reutiliza la entidad existente <code>advocation</code>. No se crea ninguna Imagen.</p>
        </div>
        {canEdit ? (
          <form action={createAdvocationAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <div className={styles.formGrid}>
              <label className={styles.fieldWide}><span>Nombre</span><input name="name" required placeholder="Ej. Santísimo Sacramento" /></label>
              <label><span>Tipo</span><input name="advocation_type" placeholder="Sacramento, Cristo, Virgen, Santo…" /></label>
              <label><span>Slug</span><input name="slug" placeholder="Opcional" /></label>
              <label className={styles.fieldWide}><span>Descripción</span><input name="description" placeholder="Opcional" /></label>
              <label><span>Estado</span><select name="status" defaultValue="draft"><option value="draft">Borrador</option><option value="published">Publicado</option></select></label>
            </div>
            <div className={styles.formActions}><small>La identidad puede existir aunque no represente una talla concreta.</small><button className={styles.primaryButton} type="submit">Crear identidad devocional</button></div>
          </form>
        ) : null}
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Relación semántica</span><h2>Asignar titular a Hermandad</h2></div>
          <p><code>entity_relations.relation_type = has_titular</code></p>
        </div>
        {canEdit ? (
          <form action={addTitularRelationAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <div className={styles.formGrid}>
              <EntityPicker name="brotherhood_entity_id" items={data.brotherhoodOptions} label="Hermandad" emptyLabel="Selecciona una Hermandad" />
              <EntityPicker name="advocation_entity_id" items={data.advocationOptions} label="Identidad devocional titular" emptyLabel="Selecciona una identidad" />
              <label className={styles.fieldWide}><span>Notas</span><input name="notes" placeholder="Contexto documental opcional" /></label>
            </div>
            <div className={styles.formActions}><small>La relación queda publicada solo cuando ambos extremos están publicados.</small><button className={styles.primaryButton} type="submit">Añadir titular</button></div>
          </form>
        ) : null}
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Titularidades registradas</span><h2>Relaciones actuales</h2></div>
          <p>{data.relations.length} relación{data.relations.length === 1 ? '' : 'es'} activa{data.relations.length === 1 ? '' : 's'}.</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {data.relations.length ? data.relations.map((relation) => (
            <article className={styles.panelCard} key={relation.id}>
              <strong>{relation.brotherhood.name} → {relation.advocation.name}</strong>
              <small style={{ display: 'block', marginTop: 5 }}>Estado: {relation.status}{relation.notes ? ` · ${relation.notes}` : ''}</small>
              {canEdit ? (
                <form action={archiveTitularRelationAction} style={{ marginTop: 12 }}>
                  <input type="hidden" name="relation_id" value={relation.id} />
                  <button type="submit">Archivar titularidad</button>
                </form>
              ) : null}
            </article>
          )) : <p className={styles.emptyText}>Todavía no hay titularidades conceptuales registradas.</p>}
        </div>
      </section>
    </div>
  )
}
