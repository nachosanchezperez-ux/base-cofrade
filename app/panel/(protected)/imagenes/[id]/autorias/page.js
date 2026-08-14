import Link from 'next/link'
import { notFound } from 'next/navigation'
import ImageAuthorshipEditor from '@/components/panel/ImageAuthorshipEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getImageAuthorshipRelations } from '@/lib/panel/image-authorships'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Autoría de Imagen · Panel' }

const SAVED_MESSAGES = {
  linked: 'El Agente se ha relacionado correctamente con la Imagen.',
  restored: 'La autoría o atribución se ha restaurado correctamente.',
  updated: 'La autoría se ha actualizado correctamente.',
  closed: 'El periodo se ha cerrado sin borrar la Imagen ni el Agente.',
  archived: 'La autoría se ha retirado. Ambas entidades continúan existiendo.',
}

export default async function ImageAuthorshipPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([
    params,
    searchParams,
    requirePanelUser(),
  ])
  const data = await getImageAuthorshipRelations(id)
  if (!data) notFound()

  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/imagenes">Imágenes</Link>
          <span>→</span>
          <Link href={`/panel/imagenes/${id}`}>{data.entity.name}</Link>
          <span>→</span>
          <strong>Autoría</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Imagen ↔ Agente</span>
            <h1>Autoría y atribuciones</h1>
            <p>{data.entity.name} · {data.image.image_type || 'Tipo pendiente de documentar'}</p>
          </div>
          <Link className={styles.secondaryButton} href={`/panel/imagenes/${id}`}>Volver al editor</Link>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando las autorías como colaborador.</div> : null}

      <ImageAuthorshipEditor data={data} canEdit={canEdit} />
    </div>
  )
}
