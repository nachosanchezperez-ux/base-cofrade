import OfflineSavedPages from '@/components/OfflineSavedPages'

// Página que muestra el service worker cuando no hay red y la página pedida
// no está guardada en el móvil (24/11/2026).
export const metadata = {
  title: 'Sin conexión',
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return (
    <section className="section page-top">
      <div className="shell" style={{ maxWidth: 640 }}>
        <p className="eyebrow">Sin conexión</p>
        <h1>Esta página no está guardada en tu móvil</h1>
        <p>
          Ahora mismo no hay cobertura. Hilo Cofrade guarda las páginas que vas abriendo y, si lo
          pides, el programa de mano completo de la Semana Santa 2027.
        </p>
        <OfflineSavedPages />
        <p><a href="/semana-santa-sevilla-2027">Abrir el programa de mano 2027 →</a></p>
      </div>
    </section>
  )
}
