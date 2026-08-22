import Link from 'next/link'
import styles from '@/app/panel/panel.module.css'

export default async function BrotherhoodEditorLayout({ children, params }) {
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
            <strong style={{ display: 'block', marginTop: 5 }}>Titulares, Pasos, agenda, memoria histórica, multimedia y documentación</strong>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Link className={styles.secondaryButton} href={`/panel/hermandades/${id}/historia`}>Historia</Link>
            <Link className={styles.secondaryButton} href={`/panel/hermandades/${id}/titulares`}>Titulares</Link>
            <Link className={styles.secondaryButton} href={`/panel/hermandades/${id}/pasos`}>Pasos</Link>
            <Link className={styles.secondaryButton} href={`/panel/hermandades/${id}/salidas`}>Salidas</Link>
            <Link className={styles.secondaryButton} href={`/panel/acontecimientos?entity=${id}`}>Acontecimientos</Link>
            <Link className={styles.secondaryButton} href={`/panel/hermandades/${id}/habito`}>Hábito</Link>
            <Link className={styles.secondaryButton} href={`/panel/hermandades/${id}/jornada`}>Jornada</Link>
            <Link className={styles.secondaryButton} href={`/panel/multimedia?entity=${id}`}>Multimedia</Link>
            <Link className={styles.primaryButton} href={`/panel/fuentes?entity=${id}`}>Fuentes</Link>
          </div>
        </section>
      </div>
      {children}
    </>
  )
}
