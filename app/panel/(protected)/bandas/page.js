import Image from 'next/image'
import Link from 'next/link'
import { getPanelBands } from '@/lib/panel/data'
import styles from '@/app/panel/panel.module.css'
import bandUx from '@/app/panel/(protected)/bandas/BandPanelUx.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }

export const metadata = { title: 'Bandas · Panel' }

export default async function PanelBandsPage({ searchParams }) {
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const status = ['published', 'review', 'draft', 'archived'].includes(query?.status) ? query.status : ''
  const bands = await getPanelBands({ query: q, status })

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div><span className={styles.eyebrow}>Enciclopedia musical</span><h1>Bandas</h1><p>Abre una Banda para editar su identidad y todos los contenidos conectados desde una única ficha.</p></div>
      </header>

      <form className={styles.filters}>
        <label><span className={styles.srOnly}>Buscar banda</span><input type="search" name="q" defaultValue={q} placeholder="Buscar banda…" /></label>
        <label><span className={styles.srOnly}>Filtrar por estado</span><select name="status" defaultValue={status}><option value="">Todos los estados</option><option value="published">Publicados</option><option value="review">En revisión</option><option value="draft">Borradores</option><option value="archived">Archivados</option></select></label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}><strong>{bands.length} {bands.length === 1 ? 'banda' : 'bandas'}</strong><small>Toca una Banda para abrir su ficha editorial completa</small></div>
        {bands.length ? (
          <div className={styles.brotherhoodList}>
            {bands.map((item) => (
              <article key={item.id} className={bandUx.bandListItem}>
                <Link className={bandUx.bandListLink} href={`/panel/bandas/${item.id}`} aria-label={`Editar ficha de ${item.popularName}`}>
                  <span className={styles.listMonogram}>{item.logoPath ? <Image src={item.logoPath} alt="" width={34} height={40} /> : item.popularName.slice(0, 2).toUpperCase()}</span>
                  <div className={styles.listIdentity}><strong>{item.popularName}</strong><span>{item.officialName}</span><small>{item.municipality} · {item.type}</small></div>
                  <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
                  <span className={`${styles.rowLink} ${bandUx.bandPrimaryAction}`}>Editar banda <span>→</span></span>
                </Link>
              </article>
            ))}
          </div>
        ) : <p className={styles.emptyText}>No hay bandas que coincidan con este filtro.</p>}
      </section>
    </div>
  )
}
