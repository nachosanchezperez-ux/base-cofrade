import Link from 'next/link'
import styles from '@/app/panel/panel.module.css'

export default async function BrotherhoodEditorLayout({ children, params }) {
  const { id } = await params

  return (
    <>
      <div className={styles.pageWrap} style={{ paddingBottom: 0 }}>
        <section
          className={styles.panelCard}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}
        >
          <div>
            <span className={styles.eyebrow}>Relaciones de conocimiento</span>
            <strong style={{ display: 'block', marginTop: 5 }}>Imágenes y Pasos vinculados a la Hermandad</strong>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Link className={styles.secondaryButton} href={`/panel/hermandades/${id}/titulares`}>
              Imágenes y titulares
            </Link>
            <Link className={styles.primaryButton} href={`/panel/hermandades/${id}/pasos`}>
              Añadir Paso
            </Link>
          </div>
        </section>
      </div>
      {children}
    </>
  )
}
