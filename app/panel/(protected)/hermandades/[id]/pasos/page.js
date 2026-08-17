import Link from 'next/link'
import { notFound } from 'next/navigation'
import BrotherhoodStepsEditor from '@/components/panel/BrotherhoodStepsEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBrotherhoodStepRelations } from '@/lib/panel/brotherhood-steps'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Pasos de la Hermandad · Panel' }

const SAVED_MESSAGES = {
  linked: 'El Paso se ha relacionado correctamente con la Hermandad.',
  'already-linked': 'El Paso ya estaba relacionado con la Hermandad. No se ha creado un duplicado.',
  restored: 'La relación histórica se ha restaurado correctamente.',
  updated: 'La relación se ha actualizado correctamente.',
  closed: 'El periodo se ha cerrado sin borrar el Paso.',
  archived: 'La relación se ha retirado. El Paso continúa existiendo de forma independiente.',
}

export default async function BrotherhoodStepsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([
    params,
    searchParams,
    requirePanelUser(),
  ])
  const data = await getBrotherhoodStepRelations(id)
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
          <strong>Pasos</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Relación Hermandad ↔ Paso</span>
            <h1>Pasos de la Hermandad</h1>
            <p>{data.brotherhood.official_name}</p>
          </div>
          <Link className={styles.secondaryButton} href={`/panel/hermandades/${id}`}>Volver al editor</Link>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando las relaciones como colaborador.</div> : null}

      <BrotherhoodStepsEditor data={data} canEdit={canEdit} />
    </div>
  )
}
