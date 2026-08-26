import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelAgents } from '@/lib/panel/agents'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Archivado',
}

export const metadata = { title: 'Personas · Panel' }

export default async function PanelAgentsPage({ searchParams }) {
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const status = ['published', 'review', 'draft', 'archived'].includes(query?.status)
    ? query.status
    : ''
  const [user, agents] = await Promise.all([
    requirePanelUser(),
    getPanelAgents({ query: q, status }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Enciclopedia</span>
          <h1>Personas</h1>
          <p>Autores, compositores, imagineros, artesanos, restauradores y otros profesionales, además de talleres, empresas e instituciones vinculadas.</p>
        </div>
        {canEdit ? <Link className={styles.primaryButton} href="/panel/agentes/nuevo">Nueva ficha</Link> : null}
      </header>

      <form className={styles.filters}>
        <label>
          <span className={styles.srOnly}>Buscar persona o entidad</span>
          <input type="search" name="q" defaultValue={q} placeholder="Buscar persona, taller o entidad…" />
        </label>
        <label>
          <span className={styles.srOnly}>Filtrar por estado</span>
          <select name="status" defaultValue={status}>
            <option value="">Todos los estados</option>
            <option value="published">Publicados</option>
            <option value="review">En revisión</option>
            <option value="draft">Borradores</option>
            <option value="archived">Archivados</option>
          </select>
        </label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}>
          <strong>{agents.length} fichas</strong>
          <small>Los borradores solo son visibles en el Panel</small>
        </div>
        {agents.length ? (
          <div className={styles.brotherhoodList}>
            {agents.map((item) => (
              <article key={item.id}>
                <span className={styles.listMonogram}>{item.name.slice(0, 2).toUpperCase()}</span>
                <div className={styles.listIdentity}>
                  <strong>{item.name}</strong>
                  <span>{item.kindLabel}</span>
                  <small>{item.slug || 'Slug por documentar'}</small>
                </div>
                <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
                {item.isEditable ? (
                  <Link className={styles.rowLink} href={`/panel/agentes/${item.id}`}>Editar <span>→</span></Link>
                ) : (
                  <span className={styles.rowNote} title={item.referenceReason}>Nodo de referencia</span>
                )}
              </article>
            ))}
          </div>
        ) : <p className={styles.emptyText}>No hay personas o entidades que coincidan con este filtro.</p>}
      </section>
    </div>
  )
}
