import detailStyles from './band-detail-polish.module.css'
import periodStyles from './band-period-emphasis.module.css'
import headerStyles from './band-accompaniment-header-fix.module.css'
import paletteStyles from './band-palette-cleanup.module.css'

export const dynamic = 'force-dynamic'

export default function BandDetailLayout({ children }) {
  return (
    <div className={`${detailStyles.detailScope} ${periodStyles.periodScope} ${headerStyles.headerScope} ${paletteStyles.paletteScope}`}>
      {children}
    </div>
  )
}
