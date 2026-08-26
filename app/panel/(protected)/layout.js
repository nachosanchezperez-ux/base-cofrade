import { Suspense } from 'react'
import MediaRightsGovernance from '@/components/panel/MediaRightsGovernance'
import PanelCommandPalette from '@/components/panel/PanelCommandPalette'
import PanelEditState from '@/components/panel/PanelEditState'
import PanelMetricNavigation from '@/components/panel/PanelMetricNavigation'
import PanelNav from '@/components/panel/PanelNav'
import PanelSaveToast from '@/components/panel/PanelSaveToast'
import { requirePanelUser } from '@/lib/panel/auth'
import styles from '@/app/panel/panel.module.css'
import '@/app/panel/panel-ux.css'
import '@/app/panel/panel-mobile.css'

export const dynamic = 'force-dynamic'

export default async function ProtectedPanelLayout({ children }) {
  const user = await requirePanelUser()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.panelShell} data-panel-shell>
      <PanelNav user={user} />
      <div className={styles.panelMain} data-panel-main>
        <MediaRightsGovernance canEdit={canEdit} />
        {children}
      </div>
      <Suspense fallback={null}>
        <PanelCommandPalette canEdit={canEdit} />
        <PanelSaveToast />
        <PanelEditState />
        <PanelMetricNavigation />
      </Suspense>
    </div>
  )
}
