import Link from 'next/link'
import HiloMovementCards from '@/components/HiloMovementCards'
import { HILO_MOVEMENTS } from '@/lib/hilo-movements-data'
import { HILO_MOVEMENTS_PATH, selectHiloMovements } from '@/lib/hilo-movements'
import { getPublicHiloMovements } from '@/lib/supabase/hilo-movements'
import styles from './HiloMovements.module.css'

export default async function HiloMovementsSection({ brotherhoodId = '', brotherhoodName = '' }) {
  if (brotherhoodId && !HILO_MOVEMENTS.some((item) => item.status === 'published' && item.brotherhood.id === brotherhoodId)) return null
  let items
  try {
    items = selectHiloMovements(await getPublicHiloMovements(), { brotherhoodId, limit: brotherhoodId ? 2 : 3, diverse: !brotherhoodId })
  } catch (error) {
    console.error('[Hilo Cofrade] El Hilo se mueve no está disponible temporalmente', error instanceof Error ? error.message : '')
    return null
  }
  if (!items.length) return null
  return <section className={styles.section} aria-label="El Hilo se mueve" data-analytics-related-section="el_hilo_se_mueve">
    <div className="shell">
      {brotherhoodId ? <details className={styles.brotherhoodBrief}>
        <summary><span><strong>El Hilo se mueve</strong><span>En {brotherhoodName || items[0].brotherhood.label}: {items[0].title}</span></span><b aria-hidden="true">+</b></summary>
        <HiloMovementCards items={items} compact />
      </details> : <>
        <header className={styles.sectionHeader}><div><span className={styles.eyebrow}>La vida de nuestras hermandades</span><h2>El Hilo se mueve</h2><p>Nuevos capítulos, con su historia y sus protagonistas.</p></div><Link className={styles.more} href={HILO_MOVEMENTS_PATH} prefetch={false}>Ver todas las novedades <span aria-hidden="true">→</span></Link></header>
        <HiloMovementCards items={items} compact />
      </>}
    </div>
  </section>
}
