import Link from 'next/link'
import styles from '@/app/panel/panel.module.css'

export default async function BandEditorLayout({ children, params }) {
  const { id } = await params

  return (
    <>
      <div
        style={{
          width: 'min(1180px, calc(100% - 56px))',
          margin: '18px auto -18px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          flexWrap: 'wrap',
        }}
        aria-label="Edición de la banda"
      >
        <Link className={styles.secondaryButton} href={`/panel/bandas/${id}`}>
          Ficha de banda
        </Link>
        <Link className={styles.secondaryButton} href={`/panel/bandas/${id}/multimedia`}>
          Multimedia
        </Link>
        <Link className={styles.primaryButton} href={`/panel/bandas/${id}/discografia`}>
          Editar discografía
        </Link>
      </div>
      {children}
    </>
  )
}
