import Link from 'next/link'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createStepAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Nuevo paso · Panel' }

export default async function NewStepPage({ searchParams }) {
  await requirePanelEditor()
  const query = await searchParams
  const brotherhoodId = String(query?.brotherhood || '').trim()
  const contextual = Boolean(brotherhoodId)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          {contextual ? <Link href={`/panel/hermandades/${brotherhoodId}/pasos`}>Pasos de la Hermandad</Link> : <Link href="/panel/pasos">Pasos</Link>}
          <span>→</span>
          <strong>Nuevo paso</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Alta mínima</span>
            <h1>Nuevo paso</h1>
            <p>{contextual ? 'Crea el Paso y quedará vinculado a la Hermandad en el mismo flujo.' : 'Crea primero la identidad básica. Las relaciones y la documentación se incorporarán después.'}</p>
          </div>
          <span className={`${styles.statusBadge} ${styles.draft}`}>Borrador</span>
        </div>
      </header>

      {contextual ? <div className={styles.savedNotice}>Al guardar volverás a la Hermandad con el nuevo Paso ya vinculado.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Identidad</span>
            <h2>Datos mínimos</h2>
          </div>
          <p>El paso no será visible públicamente mientras permanezca en borrador.</p>
        </div>

        <form action={createStepAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          {contextual ? <input type="hidden" name="brotherhood_id" value={brotherhoodId} /> : null}
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}>
              <span>Nombre del paso</span>
              <input name="name" required autoFocus placeholder="Ej. Paso de palio de Nuestra Señora de la Esperanza" />
            </label>
            <label>
              <span>Tipo de paso</span>
              <input name="step_type" placeholder="Misterio, palio, Cristo…" />
            </label>
            <label>
              <span>Slug</span>
              <input name="slug" placeholder="Se genera desde el nombre" />
            </label>
          </div>
          <div className={styles.formActions}>
            <small>{contextual ? 'Se crearán el Paso y la relación Hermandad ↔ Paso como borrador.' : 'Se crearán la entidad y su ficha de paso con estado borrador.'}</small>
            <button className={styles.primaryButton} type="submit">{contextual ? 'Crear y vincular' : 'Crear paso'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
