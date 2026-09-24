'use client'

import Link from 'next/link'
import styles from './agenda-status.module.css'

export default function AgendaError({ retry }) {
  return (
    <section className={`shell ${styles.status}`} aria-labelledby="agenda-error-title">
      <h1 id="agenda-error-title">No hemos podido cargar la agenda</h1>
      <p>Hay un problema temporal al consultar los actos. Esto no significa que no haya convocatorias.</p>
      <div className={styles.actions}>
        <button type="button" onClick={() => retry()}>Volver a intentar</button>
        <Link href="/">Ir al inicio</Link>
      </div>
    </section>
  )
}
