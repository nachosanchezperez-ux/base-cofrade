import Link from 'next/link'
import styles from '@/app/panel/panel.module.css'

export default async function ImageEditorLayout({ children, params }) {
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
            <strong style={{ display: 'block', marginTop: 5 }}>Autoría y atribuciones de la Imagen</strong>
          </div>
          <Link className={styles.primaryButton} href={`/panel/imagenes/${id}/autorias`}>
            Gestionar autoría
          </Link>
        </section>
      </div>
      {children}
    </>
  )
}
