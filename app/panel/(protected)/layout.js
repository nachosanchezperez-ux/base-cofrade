import { Suspense } from 'react'
import PanelNav from '@/components/panel/PanelNav'
import PanelSaveToast from '@/components/panel/PanelSaveToast'
import { requirePanelUser } from '@/lib/panel/auth'
import styles from '@/app/panel/panel.module.css'

export const dynamic = 'force-dynamic'

export default async function ProtectedPanelLayout({ children }) {
  const user = await requirePanelUser()

  return (
    <div className={styles.panelShell}>
      <PanelNav user={user} />
      <div className={styles.panelMain}>{children}</div>
      <Suspense fallback={null}>
        <PanelSaveToast />
      </Suspense>
    </div>
  )
}
