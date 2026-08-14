import Link from 'next/link'
import ImageStepRelationsEditor from '@/components/panel/ImageStepRelationsEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getImageStepRelations } from '@/lib/panel/image-steps'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Imagen y Paso · Panel' }

const SAVED_MESSAGES = {
  linked: 'La Imagen y el Paso se han relacionado correctamente.',
  restored: 'La relación histórica se ha restaurado correctamente.',
  updated: 'La relación se ha actualizado correctamente.',
  closed: 'El periodo se ha cerrado sin borrar ninguna entidad.',
  archived: 'La relación se ha retirado. La Imagen y el Paso continúan existiendo.',
}

export default async function ImageStepRelationsPage({ searchParams }) {
  const [query, user, data] = await Promise.all([
    searchParams,
    requirePanelUser(),
    getImageStepRelations(),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/relaciones">Relaciones</Link>
          <span>→</span>
          <strong>Imagen ↔ Paso</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Núcleo procesional</span>
            <h1>Imagen ↔ Paso</h1>
            <p>Busca ambos nodos antes de crear una relación nueva.</p>
          </div>
          <Link className={styles.secondaryButton} href="/panel/relaciones">Volver a relaciones</Link>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando las relaciones como colaborador.</div> : null}

      <ImageStepRelationsEditor data={data} canEdit={canEdit} />
    </div>
  )
}
