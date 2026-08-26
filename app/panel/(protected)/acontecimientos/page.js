import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelEvents } from '@/lib/panel/events'
import { createEventAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const SAVED_MESSAGES = { archived: 'El Acontecimiento se ha archivado sin borrar su histórico.' }

export const metadata = { title: 'Acontecimientos · Panel' }

export default async function PanelEventsPage({ searchParams }) {
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const status = ['published', 'review', 'draft', 'archived'].includes(query?.status) ? query.status : ''
  const contextEntityId = String(query?.entity || '').trim()
  const [user, events] = await Promise.all([
    requirePanelUser(),
    getPanelEvents({ query: q, status, contextEntityId }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div><span className={styles.eyebrow}>Memoria y efemérides</span><h1>Acontecimientos</h1><p>Hechos históricos relacionados con Hermandades, Imágenes, Pasos, Bandas y el resto del grafo.</p></div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}

      <form className={styles.filters}>
        <label><span className={styles.srOnly}>Buscar acontecimiento</span><input type="search" name="q" defaultValue={q} placeholder="Buscar acontecimiento…" /></label>
        <label><span className={styles.srOnly}>Filtrar por estado</span><select name="status" defaultValue={status}><option value="">Todos los estados</option><option value="published">Publicados</option><option value="review">En revisión</option><option value="draft">Borradores</option><option value="archived">Archivados</option></select></label>
        {contextEntityId ? <input type="hidden" name="entity" value={contextEntityId} /> : null}
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      {contextEntityId ? <div className={styles.readOnlyNotice}>Mostrando Acontecimientos relacionados con la entidad desde la que has llegado. <Link href="/panel/acontecimientos">Ver todos</Link></div> : null}

      <section className={styles.panelCard}>
        <div className={styles.listHeading}><strong>{events.length} acontecimientos</strong><small>Las efemérides publicadas pueden alimentar la Home automáticamente.</small></div>
        {events.length ? <div className={styles.brotherhoodList}>{events.map((item) => (
          <article key={item.id}>
            <span className={styles.listMonogram}>A</span>
            <div className={styles.listIdentity}><strong>{item.name}</strong><span>{item.event.event_type || 'Tipo por documentar'}</span><small>{item.event.event_date_text || item.event.event_date || item.slug || 'Fecha por documentar'}</small></div>
            <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
            <Link className={styles.rowLink} href={`/panel/acontecimientos/${item.id}`}>Editar <span>→</span></Link>
          </article>
        ))}</div> : <p className={styles.emptyText}>No hay Acontecimientos que coincidan con este filtro.</p>}
      </section>

      {canEdit ? <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nuevo hecho</span><h2>Crear Acontecimiento</h2></div><p>Se crea como entidad independiente; después podrás añadir relaciones, Fuentes y multimedia.</p></div>
        <form action={createEventAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          {contextEntityId ? <input type="hidden" name="context_entity_id" value={contextEntityId} /> : null}
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Título</span><input name="name" required placeholder="Vía Crucis de las Hermandades de Sevilla de 1985" /></label>
            <label><span>Tipo</span><input name="event_type" required placeholder="Vía Crucis, Coronación, traslado…" /></label>
            <label><span>Slug</span><input name="slug" placeholder="Se genera desde el título" /></label>
            <label><span>Fecha exacta</span><input name="event_date" type="date" /></label>
            <label><span>Datación textual</span><input name="event_date_text" placeholder="1985, siglo XX…" /></label>
            <label><span>Estado editorial</span><select name="status" defaultValue="draft"><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option></select></label>
            <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" rows="3" /></label>
          </div>
          <div className={styles.formActions}><small>{contextEntityId ? 'Se vinculará automáticamente con la entidad de contexto.' : 'Podrás relacionarlo después con una o varias entidades.'}</small><button className={styles.primaryButton} type="submit">Crear Acontecimiento</button></div>
        </form>
      </section> : null}
    </div>
  )
}
