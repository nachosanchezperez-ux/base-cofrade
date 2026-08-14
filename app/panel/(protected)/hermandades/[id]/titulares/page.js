import Link from 'next/link'
import { notFound } from 'next/navigation'
import BrotherhoodImagesEditor from '@/components/panel/BrotherhoodImagesEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodImageRelations } from '@/lib/panel/brotherhood-images'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Imágenes y titulares · Panel' }

const SAVED_MESSAGES = {
  linked: 'La Imagen se ha relacionado correctamente con la Hermandad.',
  existing: 'La Imagen ya estaba relacionada con la Hermandad. No se ha creado ningún duplicado.',
  updated: 'La relación se ha actualizado correctamente.',
  closed: 'El periodo de la relación se ha cerrado sin borrar la Imagen.',
  archived: 'La relación se ha retirado. La Imagen continúa existiendo de forma independiente.',
}

export default async function BrotherhoodImagesPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([
    params,
    searchParams,
    requirePanelUser(),
  ])
  const data = await getBrotherhoodImageRelations(id)
  if (!data) notFound()

  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/hermandades">Hermandades</Link>
          <span>→</span>
          <Link href={`/panel/hermandades/${id}`}>{data.brotherhood.popular_name || data.entity.name}</Link>
          <span>→</span>
          <strong>Imágenes y titulares</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Relación Hermandad ↔ Imagen</span>
            <h1>Imágenes y titulares</h1>
            <p>{data.brotherhood.official_name}</p>
          </div>
          <Link className={styles.secondaryButton} href={`/panel/hermandades/${id}`}>Volver al editor</Link>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando las relaciones como colaborador.</div> : null}

      <BrotherhoodImagesEditor data={data} canEdit={canEdit} />
    </div>
  )
}
