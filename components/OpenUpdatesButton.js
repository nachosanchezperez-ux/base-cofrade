'use client'

export default function OpenUpdatesButton({ className }) {
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      aria-controls="hilo-updates-dialog"
      onClick={() => window.dispatchEvent(new CustomEvent('hilo:open-updates'))}
      data-hilo-updates-open
    >
      Ver todas las novedades <span aria-hidden="true">→</span>
    </button>
  )
}
