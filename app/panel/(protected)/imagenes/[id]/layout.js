import Link from 'next/link'
import styles from '@/app/panel/panel.module.css'

export default async function ImageEditorLayout({ children, params }) {
  const { id } = await params

  return (
    <>
      <div className={styles.pageWrap} style={{ paddingBottom: 0 }}>
        <section
          className={styles.panelCard}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}
        >
          <div>
            <span className={styles.eyebrow}>Ficha conectada</span>
            <strong style={{ display: 'block', marginTop: 5 }}>Autoría, patrimonio, multimedia, Fuentes y presencia procesional</strong>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Link className={styles.secondaryButton} href={`/panel/imagenes/${id}/autorias`}>Autoría</Link>
            <Link className={styles.secondaryButton} href={`/panel/imagenes/${id}/intervenciones`}>Intervenciones</Link>
            <Link className={styles.secondaryButton} href={`/panel/multimedia?entity=${id}`}>Multimedia</Link>
            <Link className={styles.secondaryButton} href={`/panel/fuentes?entity=${id}`}>Fuentes</Link>
            <Link className={styles.primaryButton} href="/panel/relaciones/imagen-paso">Imagen ↔ Paso</Link>
          </div>
        </section>
      </div>
      {children}
    </>
  )
}
