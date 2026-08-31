import detailStyles from './band-detail-polish.module.css'
import periodStyles from './band-period-emphasis.module.css'
import headerStyles from './band-accompaniment-header-fix.module.css'

export const dynamic = 'force-dynamic'

export default function BandDetailLayout({ children }) {
  return (
    <div className={`${detailStyles.detailScope} ${periodStyles.periodScope} ${headerStyles.headerScope}`}>
      {children}
    </div>
  )
}
