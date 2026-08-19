import Link from 'next/link'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createAgentAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Nueva ficha · Personas · Panel' }

export default async function NewAgentPage() {
  await requirePanelEditor()

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/agentes">Personas</Link>
          <span>→</span>
          <strong>Nueva ficha</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Alta mínima</span>
            <h1>Nueva ficha</h1>
            <p>Personas, talleres, empresas e instituciones reutilizables en todo el grafo.</p>
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
          <p>No se crean todavía obras, disciplinas, fuentes ni relaciones.</p>
        </div>

        <form action={createAgentAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}>
              <span>Nombre</span>
              <input name="name" required autoFocus placeholder="Ej. Juan Pérez / Taller Pérez" />
            </label>
            <label>
              <span>Tipo de registro</span>
              <select name="agent_kind" defaultValue="person" required>
                <option value="person">Persona</option>
                <option value="workshop">Taller</option>
                <option value="company">Empresa</option>
                <option value="institution">Institución</option>
              </select>
            </label>
            <label>
              <span>Slug</span>
              <input name="slug" placeholder="Se genera desde el nombre" />
            </label>
          </div>
          <div className={styles.formActions}>
            <small>Se crearán la entidad y su ficha con estado borrador.</small>
            <button className={styles.primaryButton} type="submit">Crear ficha</button>
          </div>
        </form>
      </section>
    </div>
  )
}
