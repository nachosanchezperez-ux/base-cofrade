import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelBrotherhoods } from '@/lib/panel/data'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }

export const metadata = { title: 'Hermandades · Panel' }

export default async function PanelBrotherhoodsPage({ searchParams }) {
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const status = ['published', 'review', 'draft', 'archived'].includes(query?.status) ? query.status : ''
  const [user, brotherhoods] = await Promise.all([
    requirePanelUser(),
    getPanelBrotherhoods({ query: q, status }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div><span className={styles.eyebrow}>Enciclopedia</span><h1>Hermandades</h1><p>Identidad, titulares, salidas, cultos, patrimonio y archivo visual en una sola ficha.</p></div>
        {canEdit ? <Link className={styles.primaryButton} href="/panel/hermandades/nueva">Nueva hermandad</Link> : null}
      </header>

      <form className={styles.filters}>
        <label><span className={styles.srOnly}>Buscar hermandad</span><input type="search" name="q" defaultValue={q} placeholder="Buscar hermandad…" /></label>
        <label><span className={styles.srOnly}>Filtrar por estado</span><select name="status" defaultValue={status}><option value="">Todos los estados</option><option value="published">Publicados</option><option value="review">En revisión</option><option value="draft">Borradores</option><option value="archived">Archivados</option></select></label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}><strong>{brotherhoods.length} hermandades</strong><small>Datos conectados con la web pública</small></div>
        {brotherhoods.length ? (
          <div className={styles.brotherhoodList}>
            {brotherhoods.map((item) => (
              <article key={item.id}>
                <span className={styles.listMonogram}>{item.popularName.slice(0, 2).toUpperCase()}</span>
                <div className={styles.listIdentity}><strong>{item.popularName}</strong><span>{item.officialName}</span><small>{item.municipality} · {item.processionDay}</small></div>
                <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
                <Link className={styles.rowLink} href={`/panel/hermandades/${item.id}`}>Editar <span>→</span></Link>
              </article>
            ))}
          </div>
        ) : <p className={styles.emptyText}>No hay hermandades que coincidan con este filtro.</p>}
      </section>
    </div>
  )
}
