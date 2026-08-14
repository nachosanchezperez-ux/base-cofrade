import Link from 'next/link'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createImageAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Nueva imagen · Panel' }

export default async function NewImagePage() {
  await requirePanelEditor()

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/imagenes">Imágenes</Link>
          <span>→</span>
          <strong>Nueva imagen</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Alta mínima</span>
            <h1>Nueva imagen</h1>
            <p>Crea primero la identidad básica. Las relaciones y la documentación se incorporarán después.</p>
          </div>
          <span className={`${styles.statusBadge} ${styles.draft}`}>Borrador</span>
        </div>
      </header>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Identidad</span>
            <h2>Datos mínimos</h2>
          </div>
          <p>La imagen no será visible públicamente mientras permanezca en borrador.</p>
        </div>

        <form action={createImageAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}>
              <span>Nombre de la imagen</span>
              <input name="name" required autoFocus placeholder="Ej. Nuestra Señora de la Esperanza" />
            </label>
            <label>
              <span>Tipo de imagen</span>
              <input name="image_type" placeholder="Cristo, Virgen, Santo…" />
            </label>
            <label>
              <span>Slug</span>
              <input name="slug" placeholder="Se genera desde el nombre" />
            </label>
          </div>
          <div className={styles.formActions}>
            <small>Se crearán la entidad y su ficha de imagen con estado borrador.</small>
            <button className={styles.primaryButton} type="submit">Crear imagen</button>
          </div>
        </form>
      </section>
    </div>
  )
}
