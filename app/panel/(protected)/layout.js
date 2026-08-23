import { Suspense } from 'react'
import PanelEditState from '@/components/panel/PanelEditState'
import PanelMetricNavigation from '@/components/panel/PanelMetricNavigation'
import PanelNav from '@/components/panel/PanelNav'
import PanelSaveToast from '@/components/panel/PanelSaveToast'
import { requirePanelUser } from '@/lib/panel/auth'
import styles from '@/app/panel/panel.module.css'
import '@/app/panel/panel-ux.css'

export const dynamic = 'force-dynamic'

export default async function ProtectedPanelLayout({ children }) {
  const user = await requirePanelUser()

  return (
    <div className={styles.panelShell}>
      <PanelNav user={user} />
      <div className={styles.panelMain} data-panel-main>{children}</div>
      <Suspense fallback={null}>
        <PanelSaveToast />
        <PanelEditState />
        <PanelMetricNavigation />
      </Suspense>
    </div>
  )
}
