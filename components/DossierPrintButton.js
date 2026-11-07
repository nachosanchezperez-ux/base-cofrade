'use client'

import styles from './BrotherhoodDossier.module.css'

// Imprimir o guardar en PDF el dosier (para tenerlo a mano en la cabina).
export default function DossierPrintButton() {
  return <button type="button" className={styles.print} onClick={() => window.print()}>Imprimir o guardar en PDF</button>
}
