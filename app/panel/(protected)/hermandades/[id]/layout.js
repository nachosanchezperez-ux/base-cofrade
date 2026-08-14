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
            <strong style={{ display: 'block', marginTop: 5 }}>Imágenes vinculadas a la Hermandad</strong>
          </div>
          <Link className={styles.primaryButton} href={`/panel/hermandades/${id}/titulares`}>
            Añadir imagen/titular
          </Link>
        </section>
      </div>
      {children}
    </>
  )
}
