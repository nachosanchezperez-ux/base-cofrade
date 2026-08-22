import { requirePanelUser } from '@/lib/panel/auth'
import { getBulkImports } from '@/lib/panel/bulk-import'
import ImportWorkspace from './ImportWorkspace'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Importación masiva · Panel' }

export default async function BulkImportPage() {
  const user = await requirePanelUser()
  const imports = await getBulkImports(20)
  const canEdit = ['admin', 'editor'].includes(user.role)

  return <div className={styles.pageWrap}>
    <header className={styles.pageHeader}>
      <div>
        <span className={styles.eyebrow}>Carga y normalización</span>
        <h1>Importación masiva</h1>
        <p>Prepara CSV, JSON o JSONL en lotes, valida cada registro y aplica únicamente los datos correctos al grafo.</p>
      </div>
    </header>

    {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil puede consultar el historial de importaciones, pero no preparar ni aplicar nuevos lotes.</div> : null}
    <ImportWorkspace initialImports={imports} canEdit={canEdit} />
  </div>
}
