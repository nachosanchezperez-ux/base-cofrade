'use client'

import { useEffect } from 'react'
import styles from '@/app/panel/panel.module.css'

export default function PanelError({ error, reset }) {
  const message = error?.message || 'No se ha podido completar la operación. Revisa los datos e inténtalo de nuevo.'

  useEffect(() => {
    console.error('[Hilo Cofrade] Error en el panel', error)
    window.dispatchEvent(new CustomEvent('panel-action-error', { detail: { message } }))
  }, [error, message])

  return (
    <div className={styles.pageWrap}>
      <section className={styles.errorCard} data-panel-error-recovery>
        <span className={styles.eyebrow}>No se han guardado los cambios</span>
        <h1>Revisa este cambio antes de continuar.</h1>
        <p>{message}</p>
        <small className="panelErrorRecoveryNote">
          Hemos conservado los campos de texto, selectores y casillas del formulario. Al volver, se recuperarán automáticamente. Si estabas subiendo un archivo, tendrás que seleccionarlo de nuevo por seguridad del navegador.
        </small>
        <div className="panelErrorRecoveryActions">
          <button className={styles.primaryButton} type="button" onClick={reset}>Volver al formulario</button>
          <button className={styles.secondaryButton} type="button" onClick={() => window.location.assign('/panel')}>Ir al resumen del Panel</button>
        </div>
      </section>
    </div>
  )
}
