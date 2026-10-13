'use client'

import { useState } from 'react'

// Botón para compartir un dato de la ficha (Tarea 09). Usa el menú nativo del
// móvil cuando existe y, si no, copia el texto con el enlace de la ficha.
export default function ShareFact({ text, title, className = '' }) {
  const [state, setState] = useState('idle')

  async function share() {
    const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''
    const message = `${text} · Hilo Cofrade`
    try {
      if (navigator.share) {
        await navigator.share({ title, text: message, url })
        setState('done')
        return
      }
      await navigator.clipboard.writeText(`${message} ${url}`.trim())
      setState('copied')
    } catch (error) {
      if (error?.name !== 'AbortError') setState('idle')
    }
  }

  return (
    <button type="button" className={className} onClick={share} data-state={state}>
      {state === 'copied' ? 'Copiado' : 'Compartir'}
    </button>
  )
}
