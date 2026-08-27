import Link from 'next/link'
import { requirePanelEditor } from '@/lib/panel/auth'
import { getPanelMasterData } from '@/lib/panel/master-data'
import { MunicipalitySelect } from '@/components/panel/band/BandEditorPrimitives'
import { createBandAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Nueva banda · Panel' }

export default async function NewBandPage() {
  await requirePanelEditor()
  const data = await getPanelMasterData()

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/bandas">Bandas</Link>
          <span>→</span>
          <strong>Nueva banda</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Alta mínima</span>
            <h1>Nueva banda</h1>
            <p>Crea la identidad básica como borrador y continúa después en el editor completo.</p>
          </div>
          <span className={`${styles.statusBadge} ${styles.draft}`}>Borrador</span>
        </div>
      </header>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Identidad musical</span><h2>Datos mínimos</h2></div>
          <p>La Banda no será visible públicamente hasta que se publique desde su ficha.</p>
        </div>

        <form action={createBandAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <div className={styles.formGrid}>
            <label>
              <span>Nombre popular</span>
              <input name="popular_name" autoComplete="off" required autoFocus placeholder="Ej. Las Cigarreras" />
            </label>
            <label>
              <span>Tipo de formación</span>
              <select name="band_type" defaultValue="Banda de Música" required>
                <option value="Banda de Música">Banda de Música</option>
                <option value="Cornetas y Tambores">Cornetas y Tambores</option>
                <option value="Agrupación Musical">Agrupación Musical</option>
                <option value="Capilla Musical">Capilla Musical</option>
                <option value="Otra">Otra</option>
              </select>
            </label>
            <label className={styles.fieldWide}>
              <span>Nombre oficial</span>
              <input name="official_name" autoComplete="off" required placeholder="Denominación completa de la formación" />
            </label>
            <label>
              <span>Localidad</span>
              <MunicipalitySelect municipalities={data.municipalities} />
            </label>
            <label>
              <span>Fundación</span>
              <input name="foundation_text" autoComplete="off" placeholder="Ej. 1979" />
            </label>
            <label className={styles.fieldWide}>
              <span>Slug</span>
              <input name="slug" autoComplete="off" placeholder="Se genera desde el nombre popular" />
            </label>
          </div>

          <div className={styles.formActions}>
            <small>Se crearán la entidad, la ficha de Banda y sus nombres actualizados como un único alta editorial.</small>
            <button className={styles.primaryButton} type="submit">Crear Banda</button>
          </div>
        </form>
      </section>
    </div>
  )
}
