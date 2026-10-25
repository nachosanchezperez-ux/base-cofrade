'use client'

import { useEffect, useState } from 'react'
import { hasPanelSessionCookie } from '@/lib/panel-session-cookie'
import styles from './PanelEditLink.module.css'

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4ZM13.5 6.5l4 4" />
    </svg>
  )
}

// «Editar ficha»: solo aparece a quien tiene abierta la sesión del Panel. Las
// fichas se sirven desde caché, así que se decide en el navegador y no en el
// servidor; para el público no se pinta nada. Es un <a> normal (no <Link>)
// para no precargar el Panel.
export default function PanelEditLink({ href, label = 'Editar ficha' }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(hasPanelSessionCookie(document.cookie))
  }, [])

  if (!visible || !href) return null

  return (
    <a className={styles.link} href={href} rel="nofollow" data-analytics-skip-entity="true">
      <PencilIcon />
      <span>{label}</span>
    </a>
  )
}
