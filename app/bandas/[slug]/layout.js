import { Suspense } from 'react'
import HiloMovementsSection from '@/components/HiloMovementsSection'
import detailStyles from './band-detail-polish.module.css'
import periodStyles from './band-period-emphasis.module.css'
import headerStyles from './band-accompaniment-header-fix.module.css'
import paletteStyles from './band-palette-cleanup.module.css'

export const dynamic = 'force-static'

// El Hilo se mueve va siempre al final de la ficha, tras Fuentes, igual que en
// Hermandad, Imagen y Paso (24/10/2026).
export default async function BandDetailLayout({ children, params }) {
  const { slug } = await params
  return (
    <div className={`${detailStyles.detailScope} ${periodStyles.periodScope} ${headerStyles.headerScope} ${paletteStyles.paletteScope}`}>
      {children}
      <Suspense fallback={null}><HiloMovementsSection entityHref={`/bandas/${slug}`} /></Suspense>
    </div>
  )
}
