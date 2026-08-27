import Image from 'next/image'
import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import { getPanelBands } from '@/lib/panel/data'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }

export const metadata = { title: 'Bandas · Panel' }

export default async function PanelBandsPage({ searchParams }) {
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const status = ['published', 'review', 'draft', 'archived'].includes(query?.status) ? query.status : ''
  const [user, bands] = await Promise.all([
    requirePanelUser(),
    getPanelBands({ query: q, status }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div><span className={styles.eyebrow}>Enciclopedia musical</span><h1>Bandas</h1><p>Identidad, acompañamientos, salidas, dirección, estrenos y discografía conectada en una sola ficha editorial.</p></div>
        {canEdit ? <Link className={styles.primaryButton} href="/panel/bandas/nueva">Nueva banda</Link> : null}
      </header>

      <form className={styles.filters}>
        <label><span className={styles.srOnly}>Buscar banda</span><input type="search" name="q" defaultValue={q} placeholder="Buscar banda…" /></label>
        <label><span className={styles.srOnly}>Filtrar por estado</span><select name="status" defaultValue={status}><option value="">Todos los estados</option><option value="published">Publicados</option><option value="review">En revisión</option><option value="draft">Borradores</option><option value="archived">Archivados</option></select></label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}><strong>{bands.length} {bands.length === 1 ? 'banda' : 'bandas'}</strong><small>Datos conectados con la ficha pública</small></div>
        {bands.length ? (
          <div className={styles.brotherhoodList}>
            {bands.map((item) => (
              <article key={item.id}>
                <span className={styles.listMonogram}>{item.logoPath ? <Image src={item.logoPath} alt="" width={34} height={40} /> : item.popularName.slice(0, 2).toUpperCase()}</span>
                <div className={styles.listIdentity}><strong>{item.popularName}</strong><span>{item.officialName}</span><small>{item.municipality} · {item.type}</small></div>
                <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
                <div style={{ display: 'grid', gap: '4px', justifyItems: 'end' }}><Link className={styles.rowLink} href={`/panel/bandas/${item.id}`}>Editar <span>→</span></Link><Link className={styles.rowLink} href={`/panel/bandas/${item.id}/discografia`}>Discografía <span>→</span></Link></div>
              </article>
            ))}
          </div>
        ) : <p className={styles.emptyText}>No hay bandas que coincidan con este filtro.</p>}
      </section>
    </div>
  )
}
