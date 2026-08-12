'use client'

import { useEffect } from 'react'
import styles from '@/app/panel/panel.module.css'

export default function PanelError({ error, reset }) {
  useEffect(() => {
    console.error('[Hilo Cofrade] Error en el panel', error)
  }, [error])

  return (
    <div className={styles.pageWrap}>
      <section className={styles.errorCard}>
        <span className={styles.eyebrow}>No se han guardado los cambios</span>
        <h1>Algo no ha salido como esperábamos.</h1>
        <p>{error?.message || 'Revisa los datos e inténtalo de nuevo.'}</p>
        <button className={styles.primaryButton} type="button" onClick={reset}>Volver a intentarlo</button>
      </section>
    </div>
  )
}
