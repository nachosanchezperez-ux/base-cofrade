import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelImages } from '@/lib/panel/images'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }

export const metadata = { title: 'Imágenes · Panel' }

export default async function PanelImagesPage({ searchParams }) {
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const status = ['published', 'review', 'draft', 'archived'].includes(query?.status) ? query.status : ''
  const [user, images] = await Promise.all([
    requirePanelUser(),
    getPanelImages({ query: q, status }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Enciclopedia</span>
          <h1>Imágenes</h1>
          <p>Identidad básica de las imágenes físicas registradas en Hilo Cofrade.</p>
        </div>
        {canEdit ? <Link className={styles.primaryButton} href="/panel/imagenes/nueva">Nueva imagen</Link> : null}
      </header>

      <form className={styles.filters}>
        <label>
          <span className={styles.srOnly}>Buscar imagen</span>
          <input type="search" name="q" defaultValue={q} placeholder="Buscar imagen…" />
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
          <strong>{images.length} imágenes</strong>
          <small>Los borradores solo son visibles en el Panel</small>
        </div>
        {images.length ? (
          <div className={styles.brotherhoodList}>
            {images.map((item) => (
              <article key={item.id}>
                <span className={styles.listMonogram}>{item.name.slice(0, 2).toUpperCase()}</span>
                <div className={styles.listIdentity}>
                  <strong>{item.name}</strong>
                  <span>{item.type}</span>
                  <small>{item.slug || 'Slug por documentar'}</small>
                </div>
                <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
                <Link className={styles.rowLink} href={`/panel/imagenes/${item.id}`}>Editar <span>→</span></Link>
              </article>
            ))}
          </div>
        ) : <p className={styles.emptyText}>No hay imágenes que coincidan con este filtro.</p>}
      </section>
    </div>
  )
}
