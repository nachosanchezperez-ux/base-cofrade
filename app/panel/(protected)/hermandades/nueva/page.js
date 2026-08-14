import Link from 'next/link'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createBrotherhoodAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Nueva hermandad · Panel' }

export default async function NewBrotherhoodPage() {
  await requirePanelEditor()

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/hermandades">Hermandades</Link>
          <span>→</span>
          <strong>Nueva hermandad</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Alta mínima</span>
            <h1>Nueva hermandad</h1>
            <p>Crea la identidad básica como borrador y continúa después en el editor completo.</p>
          </div>
          <span className={`${styles.statusBadge} ${styles.draft}`}>Borrador</span>
        </div>
      </header>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Identidad</span><h2>Datos mínimos</h2></div>
          <p>La hermandad no será visible en la web pública hasta que se publique desde su ficha.</p>
        </div>

        <form action={createBrotherhoodAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <div className={styles.formGrid}>
            <label>
              <span>Nombre popular</span>
              <input name="popular_name" autoComplete="off" required />
            </label>
            <label>
              <span>Slug</span>
              <input name="slug" autoComplete="off" placeholder="Se genera desde el nombre popular" />
            </label>
            <label className={styles.fieldWide}>
              <span>Nombre oficial</span>
              <input name="official_name" autoComplete="off" required />
            </label>
          </div>

          <div className={styles.formActions}>
            <small>Se comprobarán nombres y slug antes de crear `entity` + `brotherhood`.</small>
            <button className={styles.primaryButton} type="submit">Crear borrador</button>
          </div>
        </form>
      </section>
    </div>
  )
}
