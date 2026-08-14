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

export const metadata = { title: 'Agentes · Panel' }

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
          <h1>Agentes</h1>
          <p>Personas, talleres, empresas e instituciones reutilizables en autorías y trabajos.</p>
        </div>
        {canEdit ? <Link className={styles.primaryButton} href="/panel/agentes/nuevo">Nuevo Agente</Link> : null}
      </header>

      <form className={styles.filters}>
        <label>
          <span className={styles.srOnly}>Buscar Agente</span>
          <input type="search" name="q" defaultValue={q} placeholder="Buscar Agente…" />
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
          <strong>{agents.length} Agentes</strong>
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
                <Link className={styles.rowLink} href={`/panel/agentes/${item.id}`}>Editar <span>→</span></Link>
              </article>
            ))}
          </div>
        ) : <p className={styles.emptyText}>No hay Agentes que coincidan con este filtro.</p>}
      </section>
    </div>
  )
}
